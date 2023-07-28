<script setup>
  defineProps({
    pod: {
      type: Object,
      required: true
    }
  })
</script>

<template>
  <div
    class="mt-10 flex flex-row min-w-md w-full"
  >
    <div class="p-4">
      <img
        :src="pod.image_url"
        class="h-auto w-64"
        :alt="pod.title"
      >
    </div>
    <div class="w-full flex flex-col text-left p-5">
      <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ pod.title }}
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {{ pod.description }}
      </p>
      <div>
        <router-link
          class="underline"
          :to="{ name: 'PodcastDetail', params: { id: pod.podcast_id }}"
        >
          Play Episodes
        </router-link>
      </div>
    </div>
  </div>
</template>