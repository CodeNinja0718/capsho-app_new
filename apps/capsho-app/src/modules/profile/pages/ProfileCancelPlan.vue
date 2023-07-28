<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSubscriptionOneTime } from 'src/services/firebase/stripe'
import { openURL } from 'quasar'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()

const processing = ref(false)

function onCancel() {
  openURL(
    'https://direct.lc.chat/14490672/1',
    undefined,
    {
      menubar: true,
      noopener: true,
      noreferrer: true,
      toolbar: true
    }
  )
  authStore.router.push({ name: 'UploadPodcast' })
}

type CopyData = {
  action: string;
  body: string;
  heading: string;
  highlight?: string;
  list?: string[];
  afterList?: string;
}

type DownSell = {
  [key: string]: CopyData;
}

const downSellCopy: DownSell = {
  pro: {
    heading: 'Was Capsho Pro a bit too much for you?',
    body: 'Switch to Capsho Starter for $29 / month.\n' +
      'You get 4 episode credits with:\n',
    highlight: ' Just $7.25 an episode.',
    action: 'Switch to Starter',
    list: [
      'Episode Titles',
      'Descriptions',
      'Show Notes',
      'Transcripts'
    ],
    afterList: 'Everything you need. Nothing you don\'t.'
  },
  collective: {
    heading: 'Was Capsho Collective too much commitment?',
    body: 'We get it. Switch to a monthly Capsho plan so we can take it a month at a time.\n' +
      'Take your pick from our Starter, Growth or Pro Plans.',
    action: 'Pick a monthly plan'
  },
  collectiveNew: {
    heading: 'Was Capsho Collective too much commitment?',
    body: 'We get it. Switch to a monthly Capsho plan so we can take it a month at a time.\n' +
      'Take your pick from our Starter, Growth or Pro Plans.',
    action: 'Pick a monthly plan'
  },
  growth: {
    heading: 'Was Capsho Growth a bit too much for you?',
    body: 'Switch to Capsho Starter for $29 / month.\n' +
      'You get 4 episode credits with:\n',
    highlight: ' Just $7.25 an episode.',
    action: 'Switch to Starter',
    list: [
      'Episode Titles',
      'Descriptions',
      'Show Notes',
      'Transcripts'
    ],
    afterList: 'Everything you need. Nothing you don\'t.'
  }
}

const copyData = ref<CopyData>({
  heading: 'Was Capsho Growth a bit too much for you?',
  body: 'Switch to Capsho Starter for $29 / month.\n' +
    'You get 4 episode credits with:\n',
  highlight: ' Just $7.25 an episode.',
  action: 'Switch to Starter',
  list: [
    'Episode Titles',
    'Descriptions',
    'Show Notes',
    'Transcripts'
  ],
  afterList: 'Everything you need. Nothing you don\'t.'
})

const subscriptionProductName = ref('')
const loading = ref(false)

function mapCopyData() {
  loading.value = true
  getSubscriptionOneTime()
    .then((subData) => {
      if (subData) {
        console.log(subData)
        activeSub.value = subData
        subscriptionProductName.value = subData.role
        if (subscriptionProductName.value === 'starter') {
          onCancel()
        } else {
          copyData.value = downSellCopy[subscriptionProductName.value]
        }
      }
    })
    .finally(() => {
      const timer = setTimeout(() => {
        loading.value = false
        clearTimeout(timer)
      }, 1000)
    })
}
const activeSub = ref({})

onMounted(() => mapCopyData())
</script>

<template>
  <div class="flex flex-center poppins-regular q-pt-xl">
    <div v-if="loading">
      Loading...
    </div>
    <q-card
      v-else
      class="cancel-card q-pa-md text-18 text-darkish"
    >
      <q-card-section>
        <h1 class="poppins-semibold">{{ copyData.heading }}</h1>
      </q-card-section>
      <q-card-section>
        <div>
          {{ copyData.body }}
        </div>
        <ul v-if="copyData.list">
          <li
            v-for="(item, idx) in copyData.list"
            :key="idx"
          >
            {{ item }}
          </li>
        </ul>
        <div v-if="copyData.afterList">
          {{ copyData.afterList }}
        </div>
        <div v-if="copyData.highlight">
          <b>{{ copyData.highlight }}</b>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          class="poppins-semibold"
          flat
          :label="copyData.action"
          no-caps
          rounded
          text-color="accent"
          :to="{ name: 'PickAPlan' }"
        />
        <q-btn
          class=""
          :class="{ 'disabled': processing }"
          flat
          label="No I want to cancel my plan"
          :loading="processing"
          no-caps
          rounded
          text-color="grey"
          @click="onCancel"
        >
          <template #loading>
            Processing...
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.cancel-card {
  width: 100%;
  max-width: 680px;
  border-radius: 16px;
  background-color: #F8F8F8;
}

h1 {
  font-size: 28px;
  line-height: 1em;
  letter-spacing: -1px;
  font-weight: 700;
}
</style>
