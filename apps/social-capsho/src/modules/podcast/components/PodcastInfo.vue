<script setup>
  import { makePodcast } from '../../../entities/podcast'
  import { useAuth } from '../../../composables/useAuth'
  import { addPodcastToCollection } from '../services/podcast'
  import { useStore } from 'vuex'
  import { computed } from 'vue'
  import { useNotification } from '../../../composables/useNotification'
  import { v4 as uuidv4 } from 'uuid'

  const $store = useStore()
  const props = defineProps({
    podcast: {
      type: Object,
      required: true
    }
  })

  const isInUserPodcasts = computed(() => $store.getters['podcast/getPodcastByRssUrl'](props.podcast.rss_url))
  const { alertWarning } = useNotification()
  function addPodcast() {
    if (isInUserPodcasts.value) {
      alertWarning('You already have this podcast in your list!')
      return null
    }
    try {
      const { authUser } = useAuth()
      const Podcast = makePodcast({
        user_id: authUser.value.uid,
        podcast_id: uuidv4(),
        ...props.podcast
      })
      addPodcastToCollection({
        user_id: Podcast.getUserId(),
        podcast_id: Podcast.getPodcastId(),
        title: Podcast.getTitle(),
        image_url: Podcast.getImageUrl(),
        description: Podcast.getDescription(),
        rss_url: Podcast.getRssUrl()
      }).then(() => {
        $store.commit('podcast/addPodcast', {
          user_id: Podcast.getUserId(),
          podcast_id: Podcast.getPodcastId(),
          title: Podcast.getTitle(),
          image_url: Podcast.getImageUrl(),
          description: Podcast.getDescription(),
          rss_url: Podcast.getRssUrl()
        })
      })
    } catch (e) {
      alertWarning(e)
    }
  }
</script>

<template>
  <div
    class="mt-10 flex flex-row min-w-md w-9/12"
  >
    <div class="p-4">
      <img
        :src="podcast.image_url"
        class="h-auto w-64"
        :alt="podcast.title"
      >
    </div>
    <div class="w-full flex flex-col text-left p-5">
      <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ podcast.title }}
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {{ podcast.description }}
      </p>
      <div>
        <div
          v-if="isInUserPodcasts"
        >
          In Your Podcasts
        </div>
        <button
          v-else
          class="underline"
          @click="addPodcast"
        >
          Save Podcast
        </button>
      </div>
    </div>
  </div>
</template>

