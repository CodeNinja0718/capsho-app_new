<script setup lang="ts">
import { biPlus } from '@quasar/extras/bootstrap-icons'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { computed, ref } from 'vue'

const emit = defineEmits(['close'])

const uploadPodcastStore = useUploadPodcastStore()

const choosenTopic = ref<string>('')
const transcriptShow = ref<boolean>(false)

const topic1List = computed(() => uploadPodcastStore.topic1List)
const transcript = computed(() => uploadPodcastStore.transcript)

function pickTopic (idx: number) {
  if (!Object.keys(topic1List.value).includes(String(idx))) {
    throw new Error('Index is missing!')
  }
  const topic = topic1List.value[idx]
  choosenTopic.value = topic.replace(/\d./, '').replace(/^-/, '').trim()
}
function applyHandler() {
  console.log('--')
}
</script>

<template>
  <div class="relative w-[496px] bg-secondary-dark px-6 md:px-9 py-4 md:py-7 rounded-[15px]">
    <q-icon
      v-if="!transcriptShow"
      class="absolute right-5 top-5 cursor-pointer z-10"
      color="accent"
      :name="biPlus"
      size="36px"
      style="rotate: 45deg"
      @click="emit('close')"
    />
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h4 class="text-2xl font-semibold mb-0">What is the topic for this episode?</h4>
        <span class="text-sm text-hint">Want a reminder of what this episode was about?</span>
        <span
          class="underline cursor-pointer"
          @click="transcriptShow = !transcriptShow"
        >Preview transcript</span>
      </div>
      <div class="px-4 py-2 rounded-lg bg-accent">Here are the topics Capsho picked up for this episode. Please choose which topic you would like us to focus on. (be careful, you can only choose one)</div>
      <q-input
        v-for="(topic, idx) in topic1List"
        :key="idx"
        autocomplete="off"
        color="accent"
        dark
        lazy-rules="ondemand"
        :model-value="topic"
        no-error-icon
        outlined
        readonly
        text-color="white"
        type="text"
      >
        <template #append>
          <q-btn
            class="text-underline"
            flat
            label="Select"
            no-caps
            @click="pickTopic(idx)"
          />
        </template>
      </q-input>
      <div class="px-4 py-2 rounded-lg bg-accent">Don’t like any of these? Enter your own topic you’d like Capsho to focus on here.</div>
      <q-input
        autocomplete="off"
        color="accent"
        dark
        lazy-rules="ondemand"
        :model-value="'How to build an engaged community'"
        no-error-icon
        outlined
        readonly
        text-color="white"
        type="text"
      >
        <template #append>
          <q-btn
            class="border-accent border-solid border-2"
            label="Apply"
            no-caps
            rounded
            @click="applyHandler"
          />
        </template>
      </q-input>
    </div>
  </div>
  <div
    v-show="transcriptShow"
    class="relative w-[496px] bg-secondary-dark px-6 md:px-9 py-4 md:py-7 rounded-[15px]"
  >
    <q-icon
      class="absolute right-5 top-5 cursor-pointer z-10"
      color="accent"
      :name="biPlus"
      size="36px"
      style="rotate: 45deg"
      @click="transcriptShow = false"
    />
    <div class="flex flex-col gap-4">
      <h4 class="text-2xl font-semibold mb-0">What is the topic for this episode?</h4>
      <p>Here’s a breakdown of what is covered:</p>
    </div>
  </div>
</template>
