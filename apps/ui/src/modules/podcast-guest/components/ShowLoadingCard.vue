<script setup lang="ts">
import { computed } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const preTopicWaitingMessage = `We're just processing your episode and will have a list of topics for
you to choose from soon! (And don't worry, you can add your own if you don't agree with what we've picked up)`

const postTopicWaitingMessage = `We're now creating your drafts for you. This should take less than a minute.
They’ll appear here when they’re ready so please don't close this tab or window or click anywhere else on the screen.`

const store = useUploadPodcastStore()
const progress = computed(() => store.episodeDraftsProgress)
const waitingMessage = computed(() => {
  return Number(progress.value) < 60
    ? preTopicWaitingMessage
    : postTopicWaitingMessage
})
</script>

<template>
  <div
    class="row justify-center"
    style="max-width: 700px; margin: 0 auto;">
    <q-img
      class="loading-img cappy-shadow"
      src="https://media.giphy.com/media/ryJHFdQsJEgxO/giphy-downsized-large.gif">
      <div class="absolute-full flex flex-center">
        <q-circular-progress
          class="q-ma-md"
          color="grey-3"
          indeterminate
          size="50px"
        />
      </div>
    </q-img>
    <div class="progress q-mt-xl q-py-xs">
      <div
        class="progress__bar progress__bar--animated border-radius-10"
        :style="{ 'width': progress + '%' }"></div>
    </div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <h1 class="text-center poppins-semibold text-grey-3 q-pt-lg">
        {{ waitingMessage }}
      </h1>
    </transition>
  </div>
</template>

<style scoped lang="scss">
h1 {
  line-height: 1.5;
  font-size: 17px;
  //transition: all .25s ease;
  //animation: fadeIn 5s;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.cappy-shadow {
  box-shadow: 0 8px 40px -5px rgb(0 0 0 / 9%);
}
.progress {
  border-radius: 17px;
  height: 13px;
}
</style>
