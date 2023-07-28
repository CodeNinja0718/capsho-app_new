<script setup>
  import PodcastFeed from '../components/PodcastFeed'
  import SavedPodcasts from '../components/SavedPodcasts'
  import PodcastTabs from '../components/PodcastTabs'
  import { useTogglePodcastMenu } from '../composables/useTogglePodcastMenu'
  import UploadPodcast from '@/modules/podcast/components/UploadPodcast'
  import GetTranscription from '@/modules/podcast/components/GetTranscription'

  const { tabIndex } = useTogglePodcastMenu()
</script>

<template>
  <div class="">
    <PodcastTabs />
    <div
      v-if="tabIndex === 0"
    >
      <PodcastFeed />
    </div>
    <div
      v-if="tabIndex === 1"
    >
      <UploadPodcast />
    </div>
    <div
      v-if="tabIndex === 2"
    >
      <SavedPodcasts />
    </div>
    <div
      v-if="tabIndex === 3"
    >
      <GetTranscription />
    </div>
  </div>
</template>
