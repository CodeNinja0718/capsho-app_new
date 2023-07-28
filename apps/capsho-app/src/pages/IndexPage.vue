<template>
  <div class="column items-center q-mt-xl q-gutter-y-md">
    <h1 class="source-serif-pro-regular grayscale text-h2 text-center">
      From episode audio to
      <div class="q-pt-md text-accent">
        <TypeWriter />
      </div>
    </h1>
    <p class="inter-regular text-body2">The world's first podcast AI-Powered Podcast Copywriter</p>
    <q-btn
      class="text-body2"
      color="orange-brand"
      glossy
      label="Get started"
      no-caps
      padding="10px 22px"
      rounded
      :to="{ name: 'AuthSignUp' }"
      unelevated
    />
    <div class="q-pa-lg bg-white z-top">
      <q-video
        :ratio="16/9"
        src="https://player.vimeo.com/video/715741917?h=ac886a1c85&badge=0&autopause=0&player_id=0&app_id=58479"
        style="height: auto; width: 450px; margin: 0 auto;"
      />
    </div>
    <div
      class="absolute-bottom"
      style="">
      <q-img
        class="full-width"
        src="../assets/bg-yellow.png"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TypeWriter from 'components/TypeWriter.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()
onMounted(() => {
  $router.push({ name: 'AuthPage' })
})
</script>
