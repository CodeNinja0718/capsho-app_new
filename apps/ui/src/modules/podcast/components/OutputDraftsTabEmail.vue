<script setup lang="ts">
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import TheEditor from 'src/modules/editor/TheEditor.vue'
import type { JSONContent } from '@tiptap/vue-3'
import { debounce } from 'quasar'
import { onBeforeUnmount, computed, ref } from 'vue'
import { useContentFiller } from 'src/composables/useContentFiller'
import { useSubscription } from 'src/composables/useSubscription'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const { allowPromotionalEmail, interval } = useSubscription()

const store = useUploadPodcastStore()

const templatesStore = useTemplatesStore()
const templates = computed(() => templatesStore.templates.filter((template) => template.type === 'emailLayout'))

const pickedTemplateIndex = ref(-2)
const { setContentChooser } = useContentFiller()

const isEmailLayoutPicked = computed(() => {
  if (store.selectedEpisode.layouts) {
    return store.selectedEpisode.layouts.isEmailPicked
  }
  return false
})

const emailContent = computed({
  get() {
    if (store.emailBodyPromotion) {
      return store.emailBodyPromotion
    }
    return ''
  },
  set(value) {
    store.emailBodyPromotion = value
  }
})

const emailSubjectLine = ref('')

const updateEmail = debounce(() => {
  const getEmailBody = () => {
    if (emailContent.value) {
      return emailContent.value
    } else {
      return ''
    }
  }
  const data = {
    email: {
      content: getEmailBody(),
      emailPromoSubject: {
        ...store.emailSubjectLine,
        value: emailSubjectLine.value
      }
    }
  }
  if (emailContent.value) {
    store.emailBodyPromotion = emailContent.value
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 300)

async function moveToTheNext() {
  await updateEmail()
}

onBeforeUnmount(() => {
  Promise.resolve(moveToTheNext())
})

const getStyleForAppCard = computed<string>(() => {
  const background = true
  const border = true
  const minHeight = '200px'
  let properties = background ? 'background: #FCFCFC;' : 'background: none;'
  properties = properties + (border ? 'border: 3px solid #FBDFB3;' : 'border: none;') + (minHeight ? `min-height:${minHeight}` : '')
  return properties
})

const sampleEmailBody = `
Hi [Name],<br>
<br>
How can trucking insurance companies use data to deliver profitability?<br>
<br>
When it comes to trucking insurance profitability., here's what you need to know...<br><br>
1. What are the top insurance agents doing to grow their book of business exponentially each month?<br>
2. How can data be used to deliver profitability in trucking insurance?<br>
3. What are the most surprising things that have been learned or encountered when working with trucking?<br>
<br>
I go into a lot more detail in my latest episode, How to Use Data to Deliver Profitability in Trucking Insurance<br>
<br>
Here's where you can listen: Here's where you can listen: [Insert Spotify/Apple/Google player links here]<br>
<br>
[Your Sign Off]`

const buildFromTemplate = (tempIndex: number) => {
  pickedTemplateIndex.value = tempIndex
  store.selectedEpisode.layouts.isEmailPicked = true
  store.updatePodcastEpisode({
    layouts: {
      isEmailPicked: true
    }
  })
  setContentChooser('Email')
}

const extractEmailSubject = (json: JSONContent) => {
  const emailSubjectBlock = json.content?.find((elem) => (elem.attrs && elem.attrs.label === 'Email Subject'))
  emailSubjectLine.value = getEmailSubject()

  function getEmailSubject() {
    if (
      emailSubjectBlock &&
      Array.isArray(emailSubjectBlock.content) &&
      emailSubjectBlock.content.length >= 0 &&
      emailSubjectBlock.content[0].content &&
      Array.isArray(emailSubjectBlock.content[0].content) &&
      emailSubjectBlock.content[0].content.length >= 0
    ) {
      return emailSubjectBlock.content[0].content[0].text || ''
    } else {
      return ''
    }
  }
}
</script>

<template>
  <div
    v-if="allowPromotionalEmail"
    class="q-gutter-y-md"
  >
    <div v-if="isEmailLayoutPicked">
      <div class="row">
        <div class="col-11">
          <app-skeleton
            v-if="store.showEmailBodySkeleton"
            class="rounded-xl"
            height="52.5vh"
            width="100%"
          />
          <the-editor
            v-model="emailContent"
            @get-json-output="extractEmailSubject"
            @update:modelValue="updateEmail"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex justify-center items-center full-height pb-24 overflow-y-auto"
    >
      <div class="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-24 gap-y-12 px-6 lg:px-12">
        <p class="col-span-3 text-white text-h4 font-black text-center">Choose a template or build your Email from scratch</p>
        <div
          class="col-span-1 flex flex-col items-center gap-4"
          @click="buildFromTemplate(-1)"
        >
          <q-card class="rounded-xl w-full h-44 bg-darkish cursor-pointer">
            <div class="w-full h-full flex justify-center items-center">
              <q-icon
                color="black"
                name="add"
                size="4rem"
              />
            </div>
          </q-card>
          <p class="text-white text-lg font-bold text-center">Build from scratch</p>
        </div>
        <div
          v-for="(blogTemplate, id) in templates"
          v-bind:key="id"
          class="col-span-1 flex flex-col items-center"
          @click="buildFromTemplate(id)"
        >
          <q-card
            class="rounded-xl w-full h-44 cursor-pointer"
            :class="blogTemplate.createdAt"
          />
          <p class="text-white text-lg font-bold mt-4 text-center">{{ blogTemplate.title }}</p>
          <p class="text-white text-sm text-center">Used by us, created by {{ blogTemplate.creator.name }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="row justify-between">
      <div class="col-10">
        <label
          class="custom-label"
          for="emailBody"
        >
          Email
        </label>
      </div>
    </div>
    <div class="upgrade-container row no-wrap">
      <div class="col-11">
        <editable-content
          id="emailBody"
          v-model="sampleEmailBody"
          mode="blur"
          readonly
          size="xxl"
        />
      </div>
      <div class="card-wrapper absolute-center bg-white q-pa-lg">
        <q-card
          class="upgrade-card row items-center inter-regular full-width"
          flat
          :style="getStyleForAppCard">
          <q-card-section class="col-12">
            <div class="column items-center q-gutter-y-md">
              <div class="text-center inter-medium text-weight-medium text-body1">
                Unlock Promotional Emails for future episodes by<br>
                upgrading to the Growth Plan, Pro Plan or Capsho Collective!
              </div>
              <q-btn
                v-if="interval === 'month'"
                class="text-accent lexend-bold"
                flat
                label="Upgrade Now"
                no-caps
                :to="{ name: 'PickAPlan' }"
              />
              <a
                v-else
                class="q-btn q-btn-item non-selectable q-btn--no-uppercase q-btn--flat no-outline cursor-pointer border-radius-10 text-accent lexend-bold"
                href="https://direct.lc.chat/14490672/"
                style="padding: 10px 38px; text-decoration: none;"
                target="_blank"
              >
                Chat With Us To Upgrade Now
              </a>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
