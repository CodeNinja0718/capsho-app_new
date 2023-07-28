<script setup lang="ts">
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useRoute } from 'vue-router'

const store = useUploadPodcastStore()

const route = useRoute()
const step = route.query?.step?.toString()

const assetList = [{
  icons: ['/src/assets/icons/instagram (3).png', '/src/assets/icons/facebook (3).png'],
  title: 'Captions for Facebook & Instagram'
}, {
  icons: ['/src/assets/icons/linkedin.png'],
  title: 'Posts for Linkedin'
}, {
  icons: ['/src/assets/icons/linkedin.png'],
  title: 'Tweets for Twiter'
}, {
  icons: ['/src/assets/icons/tik-tok (1).png'],
  title: 'Captions for TikTok'
}, {
  icons: ['/src/assets/icons/email (3).png'],
  title: 'Promotional Emails'
}]
</script>

<template>
  <div
    v-if="step !== '2'"
    class="full-height flex flex-col flex-center items-center"
  >
    <h1 class="text-white font-bold">You're officially a Pro Plus host.</h1>
    <div class="flex items-center gap-6 my-10">
      <span class="text-6xl underline decoration-purple-600 underline-offset-4 text-white font-mono">4</span>
      <span class="text-white text-lg">Guest credits available</span>
    </div>
    <p class="text-white text-4xl">Let's go your guest promotional assets created for this episode.</p>
    <q-btn
      class="text-white mt-6"
      clickable
      color="purple"
      label="Enter Guest Area"
      no-caps
      rounded
      @click="store.createGuestPromoDrafts" />
  </div>
  <div
    v-else
    class="full-height flex flex-col justify-center items-center"
  >
    <h1 class="text-white font-bold">Be the host with the most.</h1>
    <p class="text-purple-600 text-lg font-bold">Show your guest some love.</p>
    <p class="text-white text-2xl text-center">Upgrade to Capsho Pro Plus and unlock promotional assets to send to your guest. Make it a breeze for them to promote your episode to their audience.</p>
    <p class="text-white text-2xl text-center">When you upgrade, here are the promotional assets Capsho creates for your guest.</p>
    <div class="flex gap-10 items-center py-16">
      <div
        v-for="(asset, id) in assetList"
        :key="id"
      >
        <div class="flex justify-center items-center gap-4">
          <img
            v-for="(icon, iid) in asset.icons"
            :key="id * 1000 + iid"
            alt=""
            class="w-16 h-16"
            :src="icon"
          >
        </div>
        <p class="text-white text-xl text-center w-60">{{ asset.title }}</p>
      </div>
    </div>
    <p class="text-white text-2xl text-center">You’ll also be able to upload your social media creatives (images and videos) so it’s all in one place for your guest to promote their podcast easily.</p>
    <q-btn
      class="text-white mt-6"
      clickable
      color="purple"
      label="Upgrade to Pro Plus"
      no-caps
      rounded
      @click="store.createGuestPromoDrafts" />
    <span class="text-gray-600 text-lg text-center">Pro Plus is a monthly subscription that gives you 4 guest credits every month.</span>
  </div>
</template>

<style scoped>

</style>
