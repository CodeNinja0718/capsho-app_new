<script setup>
  import { reactive, ref } from 'vue'
  import PodcastInfo from './PodcastInfo'
  import FeedRequestError from './FeedRequestError'
  import BaseInput from '../../../components/_Global/BaseInput'
  import { useNotification } from '@/composables/useNotification'

  const url = ref('')
  const podcast = ref({})
  const requestError = reactive({
    status: false,
    message: ''
  })

  const { alertWarning } = useNotification()

  function getRssFeed() {
    if (!url.value) {
      return alertWarning('No URL')
    }
    const feedUrl = url.value
    const headers = {}
    return (
      fetch(feedUrl, {
        method: 'GET',
        mode: 'cors',
        headers: headers
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.error)
          }
          return response.text()
        })
        .then((str) =>
          new window.DOMParser().parseFromString(str, 'text/xml')
        )
        .then((data) => {
          podcast.value.image_url = data
            .querySelector('image')
            .querySelector('url').innerHTML
          podcast.value.title = data.querySelector('title').textContent
          podcast.value.description = data.querySelector('description').textContent
          podcast.value.rss_url = feedUrl
        })
        .catch((err) => {
          requestError.status = true
          requestError.message = err
        })
    )
  }
</script>

<template>
  <div class="min-h-full flex flex-col items-center justify-center overflow-hidden sm:py-12">
    <div
      class="row rounded-lg border h-14 w-9/12"
    >
      <BaseInput
        v-model="url"
        type="url"
        name="url"
        placeholder="https://rss.your-org.org/feed/"
        aria-describedby="rss-url"
        input-class="py-3 px-4 col-8 text-md placeholder-gray-400 border-0 rounded-l-lg focus:outline-none focus:shadow-lg focus:shadow-slate-200 duration-100 shadow-gray-100"
      />
      <button
        type="button"
        class="col-4 flex items-center justify-center w-40 px-4 border-l text-primaryDark py-3 px-4 rounded-r-lg shadow font-formText hover:shadow-xl"
        @click="getRssFeed"
      >
        Get Feed
      </button>
    </div>
    <PodcastInfo
      v-if="podcast.title && !requestError.status"
      :podcast="podcast"
    />
    <FeedRequestError
      v-if="requestError.status"
      :rss-url="url"
    />
  </div>
</template>
