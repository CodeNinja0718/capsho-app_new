<script setup lang="ts">
import { laCreditCard, laUser } from '@quasar/extras/line-awesome'
import { computed } from 'vue'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
const userType = computed(() => {
  return authStore.userType
})

const profileTabs = computed(() => {
  return [
    {
      label: 'Profile',
      icon: laUser,
      routeName: 'ProfileDetails',
      show: true
    },
    {
      label: 'Billing',
      icon: laCreditCard,
      routeName: 'ProfileBilling',
      show: userType.value !== 'guest'
    }
  ].filter((tab) => tab.show)
})
</script>

<template>
  <div class="pt-20">
    <q-tabs
      active-color="white"
      class="rounded-borders"
      content-class="poppins-medium"
      indicator-color=""
      narrow-indicator
    >
      <q-route-tab
        v-for="(tab) in profileTabs"
        :key="tab.routeName"
        class="text-teal"
        exact
        no-caps
        replace
        :ripple="false"
        style="width: 239px"
        :to="{ name: tab.routeName }"
      >
        <template #default>
          <div class="row items-center q-gutter-x-sm">
            <q-icon
              class="text-weight-bold text-text"
              :name="tab.icon"
              size="1.5rem" />
            <div class="text-subtitle1 text-weight-bold text-text">{{ tab.label }}</div>
          </div>
        </template>
      </q-route-tab>
    </q-tabs>
    <router-view />
  </div>
</template>
