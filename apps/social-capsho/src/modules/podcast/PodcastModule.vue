<script setup>
  import { getPodcasts } from './services/podcast'
  import { onMounted } from 'vue'

  onMounted(() => getPodcasts())
</script>

<template>
  <div>
    <router-view />
  </div>
</template>