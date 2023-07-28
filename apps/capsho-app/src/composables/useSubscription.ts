import { computed, onMounted, readonly, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { getSubscription } from 'src/services/firebase/stripe'

export function useSubscription () {
  const authStore = useAuthStore()
  const isSubscribed = computed(() => authStore.userCustomClaims.isSubscribed)
  const subscribedPlan = computed(() => authStore.userCustomClaims.role)
  const interval = computed(() => authStore.userCustomClaims.interval)
  const activeSubscription = ref({})
  const currentSubscription = computed({
    get () {
      return activeSubscription.value
    },
    set (val: object) {
      activeSubscription.value = val
    }
  })
  const isSubscriptionStatusActive = ref(false)

  onMounted(() => {
    getSubscription()
      .then((activeSub) => {
        if (activeSub) {
          const notValidStatus = ['trialing', 'unpaid', 'past_due']
          const status = activeSub.status
          currentSubscription.value = activeSub
          isSubscriptionStatusActive.value = notValidStatus.includes(status)
        }
      })
  })

  const allowCaptions = computed(() => {
    return !['starter'].includes(String(subscribedPlan.value))
  })
  const allowPromotionalEmail = computed(() => {
    return !['starter'].includes(String(subscribedPlan.value))
  })
  const allowLinkedInArticle = computed(() => {
    return !['essentials', 'starter', 'growth'].includes(String(subscribedPlan.value))
  })
  const allowBlogPost = computed(() => {
    return !['essentials', 'starter', 'growth'].includes(String(subscribedPlan.value))
  })
  const allowYouTubeDescription = computed(() => {
    return !['essentials', 'starter', 'growth'].includes(String(subscribedPlan.value))
  })

  const allowPotentQuotables = computed(() => {
    return !['essentials', 'starter', 'growth'].includes(String(subscribedPlan.value))
  })

  const maxMonthlyCredits = computed(() => {
    let max = 0
    if (isSubscribed.value) {
      if (subscribedPlan.value === 'essentials') {
        max = 3
      } else if (subscribedPlan.value === 'starter') {
        max = 4
      } else if (subscribedPlan.value === 'growth' || subscribedPlan.value === 'collective') {
        max = 4
      } else if (subscribedPlan.value === 'pro') {
        max = 4
      } else if (subscribedPlan.value === 'agency') {
        max = 16
      }
    }
    return max
  })

  return Object.freeze({
    isSubscribed,
    isSubscriptionStatusActive: readonly(isSubscriptionStatusActive),
    currentSubscription: readonly(currentSubscription),
    subscribedPlan,
    maxMonthlyCredits,
    allowCaptions,
    allowPromotionalEmail,
    allowLinkedInArticle,
    allowBlogPost,
    allowYouTubeDescription,
    allowPotentQuotables,
    activeSubscription: readonly(activeSubscription),
    interval
  })
}
