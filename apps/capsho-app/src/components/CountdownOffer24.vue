<script setup lang="ts">
import { useSubscription } from 'src/composables/useSubscription'
import { usePricing } from 'src/composables/usePricing'
import { useAuthStore } from 'stores/auth-store'
import { computed, onMounted, reactive } from 'vue'

defineProps({
  hideCountdown: {
    type: Boolean,
    required: false,
    default: false
  }
})

const { subscribedPlan, isSubscribed } = useSubscription()
const { showProPlanOffer } = usePricing()

const authStore = useAuthStore()

const isNewSignUp = computed(() => {
  const beforeDate = 1663531810416
  return authStore.user.createdAt > beforeDate
})

const showBanner = computed(() => {
  if (isSubscribed.value) {
    return subscribedPlan.value === 'trial' && showProPlanOffer.value && isNewSignUp.value
  } else {
    return showProPlanOffer.value && isNewSignUp.value
  }
})

const displayCountdown = reactive({
  seconds: '',
  minutes: '',
  hours: ''
})

const secondsDisp = computed({
  get () {
    return displayCountdown.seconds
  },
  set (val) {
    displayCountdown.seconds = val
  }
})
const minutesDisp = computed({
  get () {
    return displayCountdown.minutes
  },
  set (val) {
    displayCountdown.minutes = val
  }
})
const hoursDisp = computed({
  get () {
    return displayCountdown.hours
  },
  set (val) {
    displayCountdown.hours = val
  }
})
const formatNum = (num: number) => (num < 10 ? '0' + String(num) : String(num))
const end = computed(() => authStore.user.proPlanOfferCountdown ?? 0)
let timer: ReturnType<typeof setInterval>
function startCountdown () {
  timer = setInterval(() => {
    const now = new Date().getTime()
    const distance = end.value - now
    if (distance < 0) {
      showProPlanOffer.value = false
      clearInterval(timer)
      return null
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)
    secondsDisp.value = formatNum(seconds)
    minutesDisp.value = formatNum(minutes)
    hoursDisp.value = formatNum(hours)
  }, 1000)
}
onMounted(() => startCountdown())
</script>

<template>
  <q-banner
    v-if="showBanner"
    class="dm-sans-regular"
    inline-actions
    style="background: rgba(98,103,218,0.5);"
  >
    <div class="row items-center justify-between q-gutter-lg text-body1">
      <div class="">
        Exclusive welcome offer.
        Get 85% off your first month on the Pro Plan.
        <strong>$13.50</strong> for 24 hours only!
      </div>
      <div
        v-if="!hideCountdown"
        class="q-gutter-x-sm row justify-center items-center"
      >
        <div class="">
          <span class="text-body1">{{ hoursDisp }}</span>
          <span class="lexend-deca-light text-caption">h</span>
        </div>
        <div class="">
          <span class="text-body1">:</span>
        </div>
        <div class="">
          <span class="text-body1">{{ minutesDisp }}</span>
          <span class="lexend-deca-light text-caption">m</span>
        </div>
        <div class="">
          <span class="text-body1">:</span>
        </div>
        <div class="">
          <span class="text-body1">{{ secondsDisp }}</span>
          <span class="lexend-deca-light text-caption">s</span>
        </div>
      </div>
      <q-space />
      <q-btn
        class="border-radius-6"
        color="accent"
        :disable="!showProPlanOffer"
        label="Claim your 85% off now!"
        no-caps
        unelevated
        @click="$router.push({ name: 'PickAPlanProOffer' })"
      />
    </div>

    <template v-slot:action>
    </template>
  </q-banner>
</template>

<style scoped>
.fluid-font {
  font-size: 14px;
}
/* Fluid value from 568px to 768px viewport width */
@media screen and (min-width: 568px) {
  .fluid-font {
    font-size: calc(12px + 14 * ((100vw - 568px) / (768 - 568)));
  }
}

/* Fixed maximum value above the maximum breakpoint */
@media screen and (min-width: 768px) {
  .fluid-font {
    font-size: 16px;
  }
}
</style>
