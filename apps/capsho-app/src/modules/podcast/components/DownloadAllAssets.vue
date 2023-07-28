<template>
  <q-btn
    :color="(hovering ? 'accent' : 'white')"
    label="Download all assets"
    padding="7px 44px"
    rounded
    :text-color="(!hovering ? 'accent' : 'white')"
    unelevated
    @click="downloadEpisodeAssets"
    @mouseout="hovering = false"
    @mouseover="hovering = true"
  />
  <a
    download=""
    style="display: none;"></a>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { downloadZipFolder } from 'src/utils'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const hovering = ref(false)
const store = useUploadPodcastStore()
const selectedEpisode = computed(() => store.selectedEpisode)
function downloadEpisodeAssets () {
  downloadZipFolder(selectedEpisode.value, store.transcript.text)
}
</script>

<style scoped>

</style>
