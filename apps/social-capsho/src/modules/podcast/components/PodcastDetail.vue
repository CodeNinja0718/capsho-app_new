<script setup>
  import { useRoute } from 'vue-router'
  import { onMounted, ref, computed } from 'vue'
  import { getPodcastById } from '../services/podcast'
  import { useNotification } from '../../../composables/useNotification'
  import EpisodeList from './EpisodeList'
  import { useStore } from 'vuex'
  import { getTranscripts } from '../services/transcript'
  import store from '../../../store'

  const $store = useStore()
  const route = useRoute()
  const podcast = computed(() => $store.getters['podcast/getPodcastInfo'])
  const episodes = ref([])
  const podcastLoading = ref(false)
  const { alertWarning } = useNotification()

  async function getPodcastData() {
    podcastLoading.value = true
    const user = computed(() => store.getters['app/user'])
    try {
      const podcastInfo =  await getPodcastById({ user_id: user.value.data.id, podcast_id: route.params.id })
      if (podcastInfo) {
        $store.commit('podcast/setPodcastInfo', podcastInfo)
        getEpisodes(podcast.value.rss_url)
        await getTranscripts(podcast.value.podcast_id)
      }
    } catch (e) {
      alertWarning(e)
    } finally {
      podcastLoading.value = !podcastLoading.value
    }
  }

  function getEpisodes(url) {
    fetch(url)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((data) => {
        const items = data.querySelectorAll('item')
        items.forEach((item) => {
          let url

          try {
            url = item.querySelector('enclosure').getAttribute('url')
          } catch (e) {
            url = item.querySelector('link').innerHTML
          }

          episodes.value.push({
            title: item.querySelector('title').childNodes[0].textContent,
            link: url,
            url: url,
            duration: item.querySelector('duration').childNodes[0].textContent,
            description: item.querySelector('description').innerHTML,
            pubDate: item.querySelector('pubDate').innerHTML,
            guid: item.querySelector('guid').childNodes[0].textContent,
          })
        })
      })
      .catch(() => {
        alertWarning('Couldn\'t get episodes')
      })
  }

  onMounted(() => getPodcastData())
</script>

<template>
  <div class="container pt-10 text-left">
    <router-link
      :to="{ name: 'Podcasts' }"
      class="text-sm text-gray-400"
    >
      Go back
    </router-link>
    <div v-if="podcastLoading">
      Loading...
    </div>
    <div v-if="podcast">
      <h1 class="text-2xl font-bold mt-4 mb-8">
        {{ podcast.title }}
      </h1>
      <p>{{ podcast.description }}</p>
      <div
        class="flex flex-row"
      >
        <div class="py-4">
          <img
            :src="podcast.image_url"
            :alt="podcast.title"
            class="h-auto w-36"
          >
        </div>
        <EpisodeList :episodes="episodes" />
      </div>
    </div>
  </div>
</template>