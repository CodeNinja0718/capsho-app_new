<template>
  <div>
    <q-tabs
      active-color="darkish"
      class="rounded-borders"
      content-class="text-grey-secondary poppins-medium"
      narrow-indicator
    >
      <q-route-tab
        v-for="(tab) in profileTabs"
        :key="tab.routeName"
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
              class="text-weight-bold"
              :name="tab.icon"
              size="1.5rem" />
            <div class="text-subtitle1 text-weight-bold">{{ tab.label }}</div>
          </div>
        </template>
      </q-route-tab>
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { laCreditCard, laUser } from '@quasar/extras/line-awesome'

const profileTabs = [
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
    show: true
  }
].filter((tab) => tab.show)
</script>
