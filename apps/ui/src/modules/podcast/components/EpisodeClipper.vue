<script setup lang="ts">
import { useNotification } from 'src/composables/useNotification'
import { useFolderStore } from 'src/stores/folder-store'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { onMounted, computed } from 'vue'

const uploadPodcastStore = useUploadPodcastStore()
const folderStore = useFolderStore()

const fromMin = computed<number>(() => 0)
const fromSec = computed<number>(() => 0)
const toMin = computed({
  get() {
    return uploadPodcastStore.excludeInMin
  },
  set(val: number) {
    if (val < 0) {
      uploadPodcastStore.excludeInMin = 0
    } else {
      uploadPodcastStore.excludeInMin = val
    }
  }
})
const toSec = computed({
  get() {
    return uploadPodcastStore.excludeInSec
  },
  set(val: number) {
    if (val > 59) {
      uploadPodcastStore.excludeInSec = 59
    } else if (val < 0) {
      uploadPodcastStore.excludeInSec = 0
    } else {
      uploadPodcastStore.excludeInSec = val
    }
  }
})

async function moveToTheNext() {
  const { triggerNegative } = useNotification()
  try {
    uploadPodcastStore.processStep = 'episodeDetails'
    uploadPodcastStore.uploadPodcastToStorage()
  } catch (e) {
    if (e instanceof Error) {
      triggerNegative(e.message)
    }
  }
}

onMounted(() => {
  folderStore.getAllDocuments()
})
</script>

<template>
  <div class="flex flex-col items-center md:items-start gap-4">
    <h4 class="text-2xl font-semibold">Episode Clipper</h4>
    <div class="flex gap-6 items-start">
      <div>
        <h6 class="text-lg mb-0">Do you want to exclude the start of your episode for the drafts Capsho creates for you?</h6>
        <p class="text-base">You still get a full transcript for your episode.</p>
      </div>
      <div>
        <q-toggle
          v-model="uploadPodcastStore.excludeIntro"
          checked-icon="check"
          class="text-12"
          color="accent"
          size="md"
          unchecked-icon="clear"
        />
        <q-icon
          class="cursor-pointer"
          color="accent-custom"
          name="help"
          size="24px"
        >
          <AppTooltip
            anchor="top middle"
            class="tooltip-text poppins-regular rounded-borders w-40 md:w-40 lg:w-60 xl:w-80"
            self="bottom middle"
          >
            <template #body>
              We suggest excluding generic parts like your overall podcast intro,
              pre-roll ads and any content not related to your episode topic.
              This will mean Capsho only uses the  on-topic part of the episode
              (the meat-and-potatoes and not the "fluff") to do our thing!
            </template>
          </AppTooltip>
        </q-icon>
      </div>
    </div>

    <div class="w-full flex flex-col gap-4">
      <div class="text-base flex items-center gap-2">
        <span>Please enter the approximate timestamp you want us to exclude.</span>
        <span class="text-xs underline cursor-pointer">Preview transcript</span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4 w-full md:w-fit">
          <span class="text-base font-semibold shrink grow">From: </span>
          <q-input
            v-model="fromMin"
            class="w-28 shrink-0 grow-0"
            dense
            :disable="!uploadPodcastStore.excludeIntro"
            outlined
            readonly
            type="text"
          >
            <template v-slot:append>
              <span class="text-sm">min</span>
            </template>
          </q-input>
          <q-input
            v-model="fromSec"
            class="w-28 shrink-0 grow-0"
            dense
            :disable="!uploadPodcastStore.excludeIntro"
            outlined
            readonly
            type="text"
          >
            <template v-slot:append>
              <span class="text-sm">sec</span>
            </template>
          </q-input>
        </div>
        <div class="flex items-center gap-4 w-full md:w-fit">
          <span class="text-base font-semibold shrink grow">To: </span>
          <q-input
            v-model="toMin"
            class="w-28 shrink-0 grow-0"
            dense
            :disable="!uploadPodcastStore.excludeIntro"
            mask="##########"
            outlined
            type="number"
          >
            <template v-slot:append>
              <span class="text-sm">min</span>
            </template>
          </q-input>
          <q-input
            v-model="toSec"
            class="w-28 shrink-0 grow-0"
            dense
            :disable="!uploadPodcastStore.excludeIntro"
            mask="##########"
            outlined
            type="number"
          >
            <template v-slot:append>
              <span class="text-sm text-white">sec</span>
            </template>
          </q-input>
        </div>
        <q-btn
          class="ml-auto"
          color="accent"
          no-caps
          rounded
          text-color="white"
          @click="moveToTheNext"
        >
          Let's go
        </q-btn>
      </div>
    </div>
  </div>
</template>
