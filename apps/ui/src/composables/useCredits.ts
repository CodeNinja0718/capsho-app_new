import { computed, readonly, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'

export function useCredits () {
  const authStore = useAuthStore()
  const isTrialCredit = ref(false)
  const totalCredits = computed(() => {
    let credits = 0
    if (authStore.user.role) {
      const now = Math.floor(Date.now() / 1000)
      if (authStore.user.role?.monthlyCreditsSet) {
        for (const [key, val] of Object.entries(authStore.user.role?.monthlyCreditsSet)) {
          if (Number(key) > now && val > 0) {
            credits += val
          }
        }
      }
      if (authStore.user.role?.monthlyCredits) {
        credits += authStore.user.role.monthlyCredits
      }
      if (authStore.user.role?.additionalCredits) {
        credits += authStore.user.role.additionalCredits
      }
      if (authStore.user.role.limitCount > 0) {
        credits += authStore.user.role.limitCount
      }
      if (authStore.user.role.trialCredits) {
        if (authStore.user.role.trialCredits > 0) {
          isTrialCredit.value = true
          credits += authStore.user.role.trialCredits
        }
      }
    }
    return credits
  })
  const additionalCredits = computed(() => {
    let credits = 0
    if (authStore.user.role?.additionalCredits) {
      credits = authStore.user.role.additionalCredits
    }
    return credits
  })
  const betaCredits = computed(() => {
    let credits = 0
    if (authStore.user.role?.limitCount) {
      credits += authStore.user.role.limitCount
    }
    return credits
  })
  const trialCredits = computed(() => {
    let credits = 0
    if (authStore.user.role?.trialCredits) {
      credits += authStore.user.role.trialCredits
    }
    return credits
  })
  const isCancelAtPeriodEnd = computed(() => authStore.user.role?.cancelAtPeriodEnd)
  return {
    totalCredits,
    isCancelAtPeriodEnd,
    additionalCredits,
    betaCredits,
    trialCredits,
    isTrialCredit: readonly(isTrialCredit)
  }
}
