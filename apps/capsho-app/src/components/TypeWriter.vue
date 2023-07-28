<template>
  <VueWriter
    :array="words"
    :caret="'underscore'"
    :eraseSpeed="150"
    :typeSpeed="200" />
</template>

<script setup>
import VueWriter from 'vue-writer'

defineProps({
  words: {
    type: Array,
    required: false,
    default: () => [
      'title',
      'description',
      'show notes',
      'social media captions',
      'promotional email',
      'full transcript'
    ]
  }
})
</script>

<style scoped>

</style>
