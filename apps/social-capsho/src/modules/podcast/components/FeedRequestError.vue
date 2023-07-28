<script setup>
  defineProps({
    rssUrl: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div class="info-error">
    <h3 class="">
      Failure to retrieve an RSS feed from this URL: {{ rssUrl }}
    </h3>
    <p class="">
      Check your RSS feed URL and try again.
    </p>
  </div>
</template>