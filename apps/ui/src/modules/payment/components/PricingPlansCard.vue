<template>
  <q-card
    :bordered="false"
    class="pricing-card q-pa-md shadow-2"
  >
    <q-card-section class="column items-center">
      <span class="text-center lexend-bold letter-spacing-1 text-body2 text-uppercase text-plan-grey">{{ plan.role }}</span>
      <span class="text-accent text-caption text-uppercase inter-bold">Bill monthly</span>
    </q-card-section>
    <q-card-section class="text-center">
      <div class="row items-center justify-center q-gutter-x-xs no-wrap">
        <span class="text-h4 lexend-regular text-weight-medium">{{ plan.price.perEpisode + ' ' }}</span>
        <span class="text-subtitle2 inter-regular">/ credit</span>
      </div>
      <div class="row justify-center text-15 inter-light no-wrap q-gutter-x-xs">
        <span class="text-15">{{ 'billed monthly at ' + plan.price.displayPrice }}</span>
        <span class="">/ month</span>
      </div>
    </q-card-section>
    <q-separator inset />
    <q-card-section class="q-gutter-y-sm">
      <div
        v-for="(info, idx) in plan.price.desc"
        :key="idx"
        class="row no-wrap q-gutter-x-md items-start"
      >
        <q-icon
          class="col-1"
          color="green"
          name="check"
          size="18px" />
        <span
          class="col-10"
          v-html="info"></span>
      </div>
    </q-card-section>
    <q-card-section class="absolute-bottom">
      <q-card-actions class="">
        <q-btn
          class="full-width"
          :class="{ 'disabled': loading }"
          color="accent"
          label="Join Now"
          :loading="loading"
          no-caps
          padding="8px"
          rounded
          @click="subscribe(plan.price.id)"
        >
          <template v-slot:loading>
            Submitting...
          </template>
        </q-btn>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useNotification } from 'src/composables/useNotification'
import { chargeOneTimePayment } from 'src/services/firebase/stripe'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { firestore } from 'src/services/firebase/db'

defineProps({
  plan: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['checkOutLoading'])
const loading = ref(false)
watch(loading, () => {
  emit('checkOutLoading', loading.value)
})
async function startSubscriptionSession (priceId: string, redirectURL: string) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const colRef = collection(firestore(), 'users', user.uid, 'checkout_sessions')
  const docRef = await addDoc(colRef, {
    price: priceId,
    success_url: redirectURL,
    cancel_url: redirectURL
  })
  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(docRef, (snap) => {
    const data = snap.data()
    let error
    let url
    if (data) {
      error = data.error
      url = data.url
    }
    if (error) {
      loading.value = false
      // Show an error to your customer and
      // inspect your Cloud Function logs in the Firebase console.
      alert(`An error occurred: ${error.message}`)
    }
    if (url) {
      // We have a Stripe Checkout URL, let's redirect.
      window.location.assign(url)
    }
  })
}
async function subscribe (priceId: string) {
  loading.value = true
  const { triggerWarning } = useNotification()
  const redirectURL = window.location.origin + '/podcast/upload'
  if (priceId) {
    if (priceId === 'price_1LEAtNIxtUtbG5yKxBq0Usuq') {
      await chargeOneTimePayment(priceId, redirectURL)
    } else {
      await startSubscriptionSession(priceId, redirectURL)
    }
  } else {
    triggerWarning('Pick a plan first')
  }
}
</script>

<style lang="sass" scoped>
.pricing-card
  width: 100%
  max-width: 330px
  height: 563px
  border-radius: 12px

.bg-plan-grey
  background: #4E4B66 !important

.text-plan-grey
  color: #4E4B66 !important
</style>
