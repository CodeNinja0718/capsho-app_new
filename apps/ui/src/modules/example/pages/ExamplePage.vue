<template>
  <div>
    {{ authEmail }}
    {{ photos }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { getPhotosFromUnsplash } from 'src/services/media/unsplashService'
import { getPhotosFromPexels, getVideosFromPexels } from 'src/services/media/pexelsService'

const authStore = useAuthStore()
const authEmail = computed(() => authStore.email)

const photos = ref(null)
onMounted(() => {
  getPhotosFromUnsplash().then((images) => {
    // console.log(result)
    console.log(images)
  })
  getPhotosFromPexels().then((images) => {
    console.log(images)
  })
  getVideosFromPexels().then((videos) => {
    console.log(videos)
  })
})

</script>

<style lang="sass" scoped>

</style>
