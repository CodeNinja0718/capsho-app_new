<template>
  <q-dialog
    v-model="messageClicked"
    position="bottom"
  >
    <q-card class="poppins-regular text-16 q-pa-sm">
      <q-card-section>
        Your Educational captions are looking a lil blank 😅
        because we first need you to click on ‘Blog Post’ <i>(on the left)</i>
        and confirm your blog post topic.
        Once your blog post is created, your captions will automatically follow.
      </q-card-section>
      <q-card-section>
        <b>Why?</b> Some of these captions reference your blog post
        so we want to make sure all your marketing is consistent
        (and singing from the same song sheet 🎶 😊)
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['notified'])

const messageClicked = ref(true)
</script>

<style scoped>

</style>
