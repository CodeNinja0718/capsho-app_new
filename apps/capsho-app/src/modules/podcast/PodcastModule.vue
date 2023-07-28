<script setup>
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { onMounted } from 'vue'

const store = useUploadPodcastStore()

function fetchUserData () {
  store.fetchPodcastEpisodes()
    .finally(() => {
      store.resetProcessStep()
    })
}

onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <div class="q-mt-md">
    <q-tabs
      v-show="!['OutputEpisodeDrafts', 'PodcastEpisodes'].includes($route.name)"
      active-color="darkish"
      class="rounded-borders"
      content-class="text-grey-secondary poppins-medium"
      narrow-indicator
    >
      <q-route-tab
        no-caps
        replace
        :ripple="false"
        style="width: 239px"
        :to="{ name: 'UploadPodcast' }"
      >
        <template #default>
          <div class="row items-center q-gutter-x-sm">
            <q-icon
              class="text-weight-bold"
              name="add"
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
        :to="{ name: 'PodcastFolders' }"
      >
        <template #default>
          <div class="row items-center q-gutter-x-sm">
            <q-icon
              class="text-weight-bold"
              name="mic"
              size="1.5rem" />
            <div class="text-subtitle1 text-weight-bold">My Shows</div>
          </div>
        </template>
      </q-route-tab>
    </q-tabs>
    <router-view />
  </div>
</template>
