<script setup lang="ts">
import UploadPodcast from 'src/modules/podcast-guest/components/UploadPodcast.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import AskQuestion from 'src/modules/podcast-guest/components/AskQuestion.vue'
import AppCard from 'components/base/AppCard.vue'
import ShowLoadingCard from 'src/modules/podcast-guest/components/ShowLoadingCard.vue'
import { getStripeProducts, getSubscription } from 'src/services/firebase/stripe'
import { useAuthStore } from 'stores/auth-store'
import { computed, onMounted, ref } from 'vue'

const store = useUploadPodcastStore()

const processStep = computed(() => store.processStep)

const authStore = useAuthStore()
async function fetchProducts () {
  if (!authStore.stripeProducts.length) {
    await getStripeProducts()
  }
}
const loading = ref(true)
const activeSub = ref<object | null>(null)

const isNotActiveSub = computed(() => {
  const notValidStatus = ['trialing', 'unpaid', 'past_due']
  const status = authStore.currentSubscription.status
  return notValidStatus.includes(status)
})

async function lookUpDomain() {
  const email = authStore.email
  const isDomainBanned = await authStore.$fbServices.lookUpDomain(String(email), false)
  if (isDomainBanned) {
    await authStore.logOut()
  }
}
function artificialLoading() {
  loading.value = true
  getSubscription()
    .then((subData) => {
      if (subData) {
        activeSub.value = subData
      }
    })
    .finally(() => {
      const timer = setTimeout(() => {
        loading.value = false
        clearTimeout(timer)
      }, 3000)
    })
}

onMounted(async () => {
  await lookUpDomain()
  artificialLoading()
  await fetchProducts()
  await authStore.fetchUser()
})
</script>

<template>
  <div class="q-px-lg">
    <div
      v-if="isNotActiveSub || loading"
      class="q-py-xl"
    >
      <AppCard
        class="poppins-regular"
        inner-size="lg"
        size="md"
      >
        <template #header>
          <div class="w-full flex justify-center">Please Wait</div>
        </template>
        <template #body>
          <div
            v-if="loading"
            class="h-64 flex justify-center items-center"
          >
            <q-circular-progress
              class="q-ma-md"
              color="grey-3"
              indeterminate
              size="50px"
            />
            <!-- <q-linear-progress
              class="q-mt-sm"
              color="secondary"
              dark
              indeterminate
              rounded
            /> -->
          </div>
          <div
            v-else
            class="column items-center q-gutter-y-lg full-width"
          >
            <div class="text-20 text-center">We checked our records and they tell us your account is overdue 😅</div>
            <q-img
              class="border-radius-6"
              :ratio="16/9"
              src="https://media.giphy.com/media/XCLBNof6ICAEM/giphy.gif"
              width="530px"
            />
            <div class="text-center">
              Please get in touch with us at <a href="mailto:support@capsho.com&subject=Unpaid Invoice">support@capsho.com</a> so we can get you back on track.
            </div>
          </div>
        </template>
      </AppCard>
    </div>
    <div
      v-else
      class="q-mt-xl"
    >
      <div v-if="processStep === 'uploadPodcast'">
        <UploadPodcast/>
      </div>
      <div v-else-if="processStep === 'askQuestion'">
        <AskQuestion />
      </div>
      <div v-else-if="processStep === 'submitFiles'">
        <ShowLoadingCard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auto-saving {
  position: absolute;
  width: 42px;
  height: 18px;
  left: 1237px;
  top: 220px;
  z-index: 100;
}
</style>
