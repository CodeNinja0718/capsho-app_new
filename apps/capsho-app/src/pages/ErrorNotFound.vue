<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <!--      <div style="font-size: 30vh">-->
      <!--        -->
      <!--      </div>-->

      <div
        class="text-h2"
        style="opacity:.4">
        Hmmm, we can’t seem to find this page
      </div>

      <div
        class="text-h6"
        style="max-width: 60vw; margin: 0 auto;">
        If you’re looking for a specific page, send us a message using the Chat icon
        on the bottom right of the screen so we can help you find what you’re looking for
        (at least as it relates to Capsho 😅)
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        label="Go Home"
        no-caps
        text-color="blue"
        to="/"
        unelevated
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
