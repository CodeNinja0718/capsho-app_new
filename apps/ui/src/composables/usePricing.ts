import { computed, onMounted, readonly, ref, watchEffect } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useCredits } from 'src/composables/useCredits'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '../services/firebase/db'
import { useNotification } from './useNotification'
import { Loading } from 'quasar'

export function usePricing () {
  const authStore = useAuthStore()
  const { triggerWarning } = useNotification()
  const { betaCredits, trialCredits, totalCredits } = useCredits()
  const hasSeenCapshoBetaOffer = computed(() => authStore.user.hasSeenCapshoBetaOffer)
  const subscribe = ref(
    !authStore.userCustomClaims.isSubscribed &&
    totalCredits.value <= 0
  )
  const addEpisodes = ref(
    authStore.userCustomClaims.isSubscribed &&
    totalCredits.value <= 0
  )
  const showOneTimeOffer = ref(false)
  const showAgencyPlan = ref(authStore.user.showAgencyPlan)
  const proPlanOffer = ref(false)
  const showProPlanOffer = computed({
    get () {
      return proPlanOffer.value
    },
    set (val: boolean) {
      proPlanOffer.value = val
    }
  })
  function isBetaAndTrialCreditsZero () {
    return betaCredits.value <= 0 && trialCredits.value <= 0
  }
  const processing = ref(false)
  async function openCustomerPortal () {
    processing.value = true
    Loading.show({
      delay: 400
    })
    try {
      const { data } = await authStore.$paymentFunctions.openCustomerPortal()
      const portalUrl = data.url
      if (portalUrl) {
        window.location.assign(portalUrl)
      }
      processing.value = false
    } catch (error) {
      if (error instanceof Error) {
        triggerWarning(`An error occurred: ${error.message}`)
      }
    }
  }
  async function createCheckoutSession (priceId: string, redirectURL: string) {
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
        Loading.hide()
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        triggerWarning(`An error occurred: ${error.message}`)
      }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url)
      }
    })
  }
  async function startSubscriptionSession (priceId: string) {
    Loading.show({
      delay: 400
    })
    const { triggerWarning } = useNotification()
    const redirectURL = window.location.origin + '/podcast/upload'
    if (priceId) {
      await createCheckoutSession(priceId, redirectURL)
    } else {
      triggerWarning('Pick a plan first')
    }
  }
  function showSubscriptionPopup () {
    showOneTimeOffer.value = !hasSeenCapshoBetaOffer.value && isBetaAndTrialCreditsZero()
    subscribe.value = !authStore.userCustomClaims.isSubscribed && totalCredits.value <= 0
    addEpisodes.value = authStore.userCustomClaims.isSubscribed && totalCredits.value <= 0 && authStore.user.role?.additionalEpisodePrice !== ''
  }
  watchEffect(() => {
    showProPlanOffer.value = authStore.user.proPlanOfferCountdown
      ? new Date().getTime() < authStore.user.proPlanOfferCountdown
      : false
    showAgencyPlan.value = authStore.user.showAgencyPlan && !authStore.userCustomClaims.isSubscribed
    showOneTimeOffer.value = !hasSeenCapshoBetaOffer.value && isBetaAndTrialCreditsZero()
    subscribe.value = !authStore.userCustomClaims.isSubscribed && totalCredits.value <= 0
    addEpisodes.value = authStore.userCustomClaims.isSubscribed && totalCredits.value <= 0 && authStore.user.role?.additionalEpisodePrice !== ''
  })
  onMounted(showSubscriptionPopup)
  return {
    startSubscriptionSession,
    showAgencyPlan,
    hasSeenCapshoBetaOffer,
    showOneTimeOffer,
    subscribe,
    addEpisodes,
    showSubscriptionPopup,
    openCustomerPortal,
    processing: readonly(processing),
    showProPlanOffer
  }
}
