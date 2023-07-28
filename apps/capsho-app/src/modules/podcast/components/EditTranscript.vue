<script setup lang="ts">
import type { Transcript } from 'src/models/models'
import ContentGenerationCard from 'src/modules/podcast/components/EpisodeDraftsNavCard.vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { htmlSanitizer } from 'src/utils'
import { onUnmounted, reactive, watchEffect } from 'vue'
import { debounce } from 'quasar'

const store = useUploadPodcastStore()

const transcript = reactive({
  text: store.transcript?.labeledText
})
watchEffect(() => {
  if (Object.keys(store.transcript).length) {
    if (store.transcriptByTimestamp) {
      if (typeof store.transcript.labeledText === 'string' && store.transcript.labeledText.length) {
        transcript.text = store.transcript.labeledText.replace(/\n/gm, '<br>')
      } else {
        transcript.text = store.transcript.text.replace(/\n/gm, '<br>')
      }
    } else {
      transcript.text = store.transcript.speakerLabeledText.replace(/\n/gm, '<br>')
    }
  }
})
const updateTranscript = debounce(() => {
  if (!transcript.text) {
    return null
  }
  const data: Partial<Transcript> = {
    docId: store.transcriptId
  }
  if (store.transcriptByTimestamp) {
    data.labeledText = htmlSanitizer(transcript.text)
  } else {
    data.speakerLabeledText = htmlSanitizer(transcript.text)
  }
  return Promise.resolve(store.updateTranscript(data))
}, 1000)
onUnmounted(() => {
  Promise.resolve(updateTranscript())
})
</script>

<template>
  <ContentGenerationCard>
    <template #body>
      <div class="row items-center justify-between mt-58">
        <div class="col-3">
          <label class="custom-label">Transcript</label>
        </div>
        <q-space/>
        <div class="col">
          <div class="row items-center">
            <span
              class="custom-toggle-label"
              style="padding-left:32px">
              TRANSCRIPT BY SPEAKER
            </span>
            <q-toggle
              v-model="store.transcriptByTimestamp"
              color="orange"
              :disable="!store.isGuest"
              size="md"
            />
            <span class="custom-toggle-label">
              TRANSCRIPT BY TIME
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-11">
          <EditableContent
            v-if="store.transcriptByTimestamp"
            v-model="transcript.text"
            content-class="monserrat-regular text-body1"
            size="xxl"
            @update:modelValue="updateTranscript"
          />
          <EditableContent
            v-else
            v-model="transcript.text"
            content-class="monserrat-regular text-body1"
            size="xxl"
            @update:modelValue="updateTranscript"
          />
        </div>
      </div>
    </template>
  </ContentGenerationCard>
</template>
