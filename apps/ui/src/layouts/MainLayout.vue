<script setup lang="ts">
import AppHeader from 'layouts/AppHeader.vue'
import { useMeta } from 'quasar'
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { usePricing } from '../composables/usePricing'
import { getAgencyProductPriceIds } from 'src/services/firebase/stripe-products'
import { useAuthStore } from 'stores/auth-store'

const getLayoutView = (mode: string) => {
  return mode === 'default' ? 'lHh lpr lFf' : 'hHh lpR fFf'
}

const route = useRoute()

const pageTitle = ref('Capsho - Dashboard')
const capitalLetterRegex = /(?=[A-Z])/

watch(route, (newRoute) => {
  if (newRoute.name) {
    let routeName = String(newRoute.name)
    routeName = routeName.split(capitalLetterRegex).join(' - ')
    pageTitle.value = 'Capsho - ' + routeName
  }
})

useMeta(() => {
  return {
    title: pageTitle.value
  }
})
const { startSubscriptionSession, showAgencyPlan } = usePricing()

const agencyPlanPriceIds = getAgencyProductPriceIds()

const authStore = useAuthStore()
const isCacheRefreshed = computed(() => (authStore.user.isLoggedIn && !authStore.user.isCacheRefreshed))
function updateCacheField() {
  authStore.updateUser({
    isCacheRefreshed: true
  })
    .then(() => {
      authStore.user.isCacheRefreshed = true
    })
}
</script>

<template>
  <q-layout
    :class="{ 'bg-background': !route.name.includes('Auth') && !route.name.includes('Draggable') }"
    :view="getLayoutView('default')"
  >
    <AppHeader v-if="!$route.meta.hideHeader"/>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog
      v-model="showAgencyPlan"
      persistent
    >
      <AppCard>
        <template #body>
          <div class="text-center lexend-regular letter-spacing-1 q-gutter-y-md">
            <div class="text-h4">Capsho Agency</div>
            <div class="inter-regular">Time to start adding more value to your clients without increasing headcount &#128526;</div>
            <q-space />
            <q-btn
              v-close-popup
              class="border-radius-10 lexend-medium"
              color="accent"
              label="Sign up for Agency"
              no-caps
              text-color="white"
              unelevated
              @click="startSubscriptionSession(agencyPlanPriceIds.monthly)"
            />
          </div>
        </template>
      </AppCard>
    </q-dialog>
    <q-dialog
      v-model="isCacheRefreshed"
      persistent
      position="bottom"
    >
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">Notice!</div>
            <div class="text-grey">
              We've implemented a few changes since you last logged in!
              To make sure you see the latest version of everything,
              please clear your cache for Capsho-specific cookies.
              If you need a quick how-to, click
              <a
                href="https://www.loom.com/share/43916a15dc934e9086ce0649a06dd35f"
                target="_blank"
              >here</a>
              for a video tutorial.
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Dismiss"
            no-caps
            unelevated
            @click="updateCacheField"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>
