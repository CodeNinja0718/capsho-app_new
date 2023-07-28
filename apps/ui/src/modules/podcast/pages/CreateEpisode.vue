<script setup lang="ts">
import AppCard from 'components/base/AppCard.vue'
import AskQuestion from 'src/modules/podcast/components/AskQuestion.vue'
import UploadPodcast from 'src/modules/podcast/components/UploadPodcast.vue'
import { computed, onMounted, ref } from 'vue'
import { getStripeProducts, getSubscription } from 'src/services/firebase/stripe'
import { useAuthStore } from 'stores/auth-store'
import { useUploadPodcastStore } from 'stores/upload-podcast'

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
  return getSubscription()
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
  await Promise.allSettled([
    lookUpDomain(),
    artificialLoading(),
    fetchProducts(),
    authStore.fetchUser()
  ])
})
</script>

<template>
  <div class="">
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
      class=""
    >
      <div v-if="processStep === 'uploadPodcast'">
        <UploadPodcast/>
      </div>
      <div v-else-if="processStep === 'askQuestion'">
        <AskQuestion />
      </div>
    </div>
  </div>
</template>
