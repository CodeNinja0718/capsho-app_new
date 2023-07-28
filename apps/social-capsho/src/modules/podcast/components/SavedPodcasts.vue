<script setup>
  import { useStore } from 'vuex'
  import { computed, onMounted, ref } from 'vue'
  import PodcastFeedCard from './PodcastFeedCard'
  import { listAllPodcasts } from '@/services/storageService'

  const $store = useStore()
  const podcasts = computed(() => $store.getters['podcast/getPodcasts'])
  const myPodcasts = ref([])
  onMounted(async () => {
    myPodcasts.value = await listAllPodcasts()
  })
</script>

<template>
  <div
    v-if="podcasts.length"
    class="container"
  >
    <h1 class="text-lg font-bold">
      Your Podcast Feeds
    </h1>
    <q-list>
      <q-item
        v-for="(podcast, idx) in myPodcasts"
        :key="idx"
      >
        <q-item-section>{{ podcast }}</q-item-section>
      </q-item>
    </q-list>
    <ul
      class=""
    >
      <li
        v-for="pod in podcasts"
        :key="pod.podcast_id"
        class=""
      >
        <PodcastFeedCard :pod="pod" />
      </li>
    </ul>
  </div>
  <div
    v-else
    class="min-h-full flex flex-col items-center justify-center overflow-hidden sm:py-12"
  >
    <h1 class="text-gray-600 pt-5 text-lg">
      You don't have saved podcasts yet!
    </h1>
  </div>
</template>
