<script setup lang="ts">
import { onMounted } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { biMicFill, biPlusLg } from '@quasar/extras/bootstrap-icons'

const store = useUploadPodcastStore()

onMounted(() => {
  store.fetchGuestStages()
})
</script>

<template>
  <q-tabs
    v-show="['UploadPodcastGuest', 'PodcastGuestStages'].includes($route.name)"
    active-color="grey-3"
    class="rounded-borders pt-24"
    content-class="text-grey-4 poppins-medium"
    narrow-indicator
  >
    <q-route-tab
      class="hidden"
      no-caps
      replace
      :ripple="false"
      style="width: 239px"
      :to="{ name: 'UploadPodcastGuest' }"
    >
      <template #default>
        <div class="row items-center q-gutter-x-sm">
          <q-icon
            class="text-weight-bold"
            :name="biPlusLg"
            size="1.5rem" />
          <div class="text-subtitle1 text-weight-bold">Create</div>
        </div>
      </template>
    </q-route-tab>
    <q-route-tab
      no-caps
      replace
      :ripple="false"
      style="width: 239px"
      :to="{ name: 'PodcastGuestStages' }"
    >
      <template #default>
        <div class="row items-center q-gutter-x-sm">
          <q-icon
            class="text-weight-bold"
            :name="biMicFill"
            size="1.5rem" />
          <div class="text-subtitle1 text-weight-bold">My Stages</div>
        </div>
      </template>
    </q-route-tab>
  </q-tabs>
  <div class="module-content">
    <router-view />
  </div>
</template>

<style lang="scss">
.module-content {
  width: 100%;
  max-width: 80vw;
  margin: 0 auto;
}
</style>
