<script setup>
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { onMounted } from 'vue'

const uploadPodcastStore = useUploadPodcastStore()

function fetchUserData () {
  uploadPodcastStore.fetchPodcastEpisodes()
    .finally(() => {
      uploadPodcastStore.resetProcessStep()
    })
}

onMounted(() => {
  fetchUserData()
})
</script>

<template>
  <div class="pt-20">
    <router-view />
  </div>
</template>
