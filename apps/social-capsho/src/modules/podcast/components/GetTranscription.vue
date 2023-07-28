<script setup>
import {
  submitFileForTranscription,
  listenForTranscriptCollectionUpdates, fetchTranscriptions,
} from '@/modules/podcast/services/transcription'
import { ref, computed, watch, reactive } from 'vue'
import { useStore } from 'vuex'
// import { generateTitle } from '@/config/cloudFunctions'
import {
  generateCuriosityHookFromKeywords,
  getKeywordsForTopic,
  getTopicFromAI,
    createTitle
} from '@/modules/podcast/services/openai'
import { extractKeywords } from '@/config/cloudFunctions'

const $store = useStore()

const url = ref('')
const result = ref(null)
// const transcripts = computed(() => $store.state.podcast.transcripts)
// const transcript = computed(() => $store.state.podcast.transcript)
// const first15 = computed(() => transcript.value.words['first15'].text)
// const last15 = computed(() => transcript.value.words['last15'].text)
const allButLast15 = ref('')

const responseFromAI = reactive({
  topic: '',
  keywords: undefined,
  extractedKeywords: undefined,
  hook: '',
  title: ''
})
const transcriptionData = computed(() => $store.state.podcast.transcript)
// const transcriptChunks = ref(null)
const loading = ref(false)
async function submitForTranscription () {
  loading.value = true
  try {
    result.value = await submitFileForTranscription({ url: url.value })
    await getTranscriptionResults(result.value.data.data.id)
  } catch (e) {
    console.error(e.message)
  }
}

watch(transcriptionData, (newData) => {
  if (newData) {
    loading.value = false
    allButLast15.value = newData.words['allButLast15'].text
    if (newData === 'beck') {
      fetchTopics()
    }
  }
})
const getTranscriptionResults = (transcriptId) => {
  listenForTranscriptCollectionUpdates(transcriptId)
}

async function fetchTopics () {
  const topicResponse = await getTopicFromAI(allButLast15.value)
  responseFromAI.topic = topicResponse.data.data.choices[0].text
  const keywordsResponse = await getKeywordsForTopic(responseFromAI.topic)
  responseFromAI.keywords = keywordsResponse.data.data.choices[0].text.split(/\d+./)
  const hookResponse = await generateCuriosityHookFromKeywords(responseFromAI.keywords)
  responseFromAI.hook = hookResponse.data.data.choices[0].text
}
// const sanitizeText = (str) => {
//   return str.replaceAll(/\n/gm, '')
// }
fetchTranscriptions().then(async () => {
  const topicResponse = await getTopicFromAI(allButLast15.value)
  responseFromAI.topic = topicResponse.data.data.choices[0].text
  const keywordsResponse = await getKeywordsForTopic(responseFromAI.topic)
  responseFromAI.keywords = keywordsResponse.data.data.choices[0].text.split(/\d+./)
  const extractedKeywords = await extractKeywords({ text: allButLast15.value })
  responseFromAI.extractedKeywords = extractedKeywords.data.data.choices[0].text
  const hookResponse = await generateCuriosityHookFromKeywords(responseFromAI.keywords)
  responseFromAI.hook = hookResponse.data.data.choices[0].text
  const title = await createTitle(allButLast15.value)
  responseFromAI.title = title.data.data.choices[0].text
}).catch((e) => console.error(e.message))
</script>

<template>
  <div class="q-mx-lg">
    <div class="row justify-center">
      <div class="col-7 row border">
        <base-input
          v-model="url"
          type="url"
          placeholder="Enter url here"
          input-class="full-width py-3 px-4 text-md placeholder-gray-400 border-0 rounded-l-lg focus:outline-none focus:shadow-lg focus:shadow-slate-200 duration-100 shadow-gray-100"
        />
      </div>
      <q-btn
        label="Transcribe"
        unelevated
        color="primary"
        @click="submitForTranscription"
      />
    </div>
    <div
      v-if="loading"
      class="fullscreen column items-center justify-center"
    >
      <q-spinner-bars
        color="primary"
        size="2em"
      />
      <q-banner>Processing your request</q-banner>
    </div>
    <div
      v-else
      class="q-pa-lg row justify-center q-gutter-y-lg"
    >
      <div>
        <q-card>
          <q-card-section>
            <div class="row q-gutter-x-sm text-subtitle1">
              <span class="text-weight-bold">Topic:</span>
              <span>{{ responseFromAI.topic }}</span>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-gutter-x-sm text-subtitle1">
              <span class="text-weight-bold">Keywords:</span>
              <span
                v-for="(key, idx) in responseFromAI.keywords"
                :key="idx"
              >
                {{ key }}
              </span>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-gutter-x-sm text-subtitle1">
              <span class="text-weight-bold">Extracted Keywords:</span>
              <span
                v-for="(key, idx) in responseFromAI.extractedKeywords"
                :key="idx"
              >
                {{ key }}
              </span>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-gutter-x-sm text-subtitle1">
              <span class="text-weight-bold">Curiosity hook:</span>
              <span>{{ responseFromAI.hook }}</span>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-gutter-x-sm text-subtitle1">
              <span class="text-weight-bold">Title:</span>
              <span>{{ responseFromAI.title }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
