<script setup lang="ts">
import UserIcon from 'components/UserIcon.vue'
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { useCredits } from 'src/composables/useCredits'
import { useSubscription } from '../composables/useSubscription'
import { useNotification } from 'src/composables/useNotification'
import { chargeOneTimePayment } from 'src/services/firebase/stripe'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const { maxMonthlyCredits, isSubscribed } = useSubscription()
const { totalCredits, additionalCredits } = useCredits()
const authStore = useAuthStore()

const fullNameOrEmail = computed(() => {
  let name = null
  if (authStore.user.firstName) name = authStore.user.firstName
  if (authStore.user.lastName) name += ' ' + authStore.user.lastName
  return name ?? authStore.auth.email
})
const userType = computed(() => {
  return authStore.userType
})
const options = computed(() => {
  return [
    {
      label: 'Profile',
      route: 'ProfileDetails',
      show: true
    },
    {
      label: userType.value === 'guest' ? 'My Stages' : 'My Shows',
      route: userType.value === 'guest' ? 'DefaultPodcastGuest' : 'PodcastFolders',
      show: true
    }
  ]
})

function navigateTo(routeName: string) {
  authStore.router.push({ name: routeName })
}
function createCheckoutSession () {
  const { triggerWarning } = useNotification()
  const priceId = authStore.user.role?.additionalEpisodePrice
  const redirectURL = window.location.origin + '/podcast/upload'
  if (priceId) {
    $q.loading.show({
      message: 'Process  is in progress. Hang on...'
    })
    chargeOneTimePayment(priceId, redirectURL)
      .finally(() => {
        const timer = setTimeout(() => {
          $q.loading.hide()
          clearTimeout(timer)
        }, 2500)
      })
  } else {
    triggerWarning('Additional episode price id is not set')
  }
}
</script>

<template>
  <q-btn
    round
    unelevated>
    <UserIcon />
    <q-menu
      class="poppins-regular bg-background-any-box-popup text-text shadow-lg"
      dark
      transition-hide="jump-up"
      transition-show="jump-down"
    >
      <div class="row no-wrap q-pa-md">
        <div
          class="column"
          style="min-width: 100px;">
          <div class="text-h6 q-mb-md">Settings</div>
          <q-space />
          <q-list dense>
            <q-item
              v-for="(option, idx) in options"
              :key="idx"
              v-close-popup
              class="q-px-none"
              clickable
              @click="navigateTo(option.route)"
            >
              <q-item-section>
                <q-item-label>{{ option.label }}</q-item-label>
              </q-item-section>
            </q-item>
            <div v-if="userType !== 'guest'">
              <q-item
                v-if="isSubscribed"
                v-close-popup
                class="q-px-none"
                clickable
                @click="createCheckoutSession"
              >
                <q-item-section>
                  <q-item-label>Buy Additional Credits</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-else
                v-close-popup
                class="q-px-none"
                clickable
                @click="navigateTo('PickAPlan')"
              >
                <q-item-section>
                  <q-item-label>Subscribe</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </div>
        <q-separator
          class="q-mx-lg"
          inset
          vertical />
        <div class="column items-center">
          <div class="column items-center">
            <q-circular-progress
              class="rounded-borders q-ma-md"
              color="purple"
              font-size="12px"
              :max="maxMonthlyCredits"
              :min="0"
              show-value
              size="80px"
              :thickness="0.20"
              track-color="grey-3"
              :value="totalCredits"
            >
              <div>{{ totalCredits + ' left' }}</div>
            </q-circular-progress>
            <div class="text-center text-10 inter-regular">
              <span class="">Additional credits: </span>
              <span class="">{{ additionalCredits }}</span>
            </div>
          </div>
          <div
            v-show="fullNameOrEmail"
            class="q-mt-md q-mb-xs">{{ fullNameOrEmail }}</div>
          <q-btn
            v-close-popup
            color="purple"
            label="Logout"
            push
            size="sm"
            @click="authStore.logOut"
          />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<style scoped>
.q-list--dense > .q-item {
  padding: 0 !important;
}
</style>
