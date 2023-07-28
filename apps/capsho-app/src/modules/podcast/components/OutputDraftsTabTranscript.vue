<script setup lang="ts">
import type { Alternative, Transcript } from 'src/models/models'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { htmlSanitizer } from 'src/utils'
import { onUnmounted, reactive, ref, watchEffect } from 'vue'
import { debounce } from 'quasar'

const store = useUploadPodcastStore()
const loading = ref(false)

const transcript = reactive({
  text: store.transcript?.labeledText,
  cleanText: '',
  keywords: [''],
  timeLabeled: [] as Alternative,
  htmlText: '',
  speakerLabeled: []
})

watchEffect(() => {
  if (Object.keys(store.transcript).length) {
    if (store.transcript.editedTranscript?.length) {
      transcript.text = store.transcript.editedTranscript
    } else if (store.transcript.labeledText?.length) {
      transcript.text = store.transcript.labeledText
    } else {
      transcript.text = store.transcript.text
    }
  }
})

type ReplaceableName = {
  [key: string]: string;
}

function getSpeakerNames() {
  return store.transcript.speakerLabels ? store.transcript.speakerLabels.reduce((acc: ReplaceableName, str: string) => {
    acc[str] = ''
    return acc
  }, {}) : {}
}

const options = ref<ReplaceableName>(getSpeakerNames())

const names: string[] = [store.selectedFolder.hostName, store.guestName]

const replaceableNames = ref(names)

function replaceNames(label: string, val: string) {
  loading.value = true
  const pattern = new RegExp(label, 'gm')
  transcript.text = transcript.text.replace(pattern, val)
  store.transcript.editedTranscript = transcript.text
  delete options.value[label]
  options.value[val] = val
  const timer = setTimeout(() => {
    loading.value = false
    clearTimeout(timer)
  }, 1000)
}

function createValue (val: string, done: (val: string, type: string) => void) {
  if (val.length > 0) {
    if (!names.includes(val)) {
      names.push(val)
    }
    done(val, 'toggle')
  }
}

function filterFn (val: string, update: (x: () => void) => void) {
  update(() => {
    if (val === '') {
      replaceableNames.value = names
    } else {
      const needle = val.toLowerCase()
      replaceableNames.value = names.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const updateTranscript = debounce(() => {
  if (!transcript.text) {
    return null
  }
  const data: Partial<Transcript> = {
    docId: store.transcriptId,
    editedTranscript: htmlSanitizer(transcript.text)
  }
  if (data.editedTranscript) {
    store.transcript.editedTranscript = data.editedTranscript
    return Promise.resolve(store.updateTranscript(data))
  }
}, 1000)

function restoreTranscript() {
  loading.value = true
  if (store.transcript.labeledText.length) {
    transcript.text = store.transcript.labeledText
  } else {
    transcript.text = store.transcript.text
  }
  options.value = getSpeakerNames()
  const data: Partial<Transcript> = {
    docId: store.transcriptId,
    editedTranscript: ''
  }
  store
    .updateTranscript(data)
    .finally(() => {
      loading.value = false
    })
}

onUnmounted(() => {
  Promise.resolve(updateTranscript())
})
</script>

<template>
  <div>
    <div class="row q-pb-xs">
      <div class="col-11">
        <div>
          <label
            class="custom-label"
            for="transcript"
          >
            Transcript
          </label>
        </div>
        <div class="full-width row no-wrap">
          <q-btn-dropdown
            align="left"
            class="col-11 app-button"
            no-caps
            outline
            text-color="grey-4"
          >
            <template v-slot:label>
              <div class="text-darkish">
                Replace Speaker Labels
              </div>
            </template>
            <q-list v-show="!loading">
              <q-item
                v-for="(label) in Object.keys(options)"
                :key="label"
              >
                <q-item-section>
                  {{ label }}
                </q-item-section>
                <q-item-section>
                  <q-select
                    v-model="options[label]"
                    clearable
                    color="accent"
                    dense
                    filled
                    input-debounce="300"
                    :options="replaceableNames"
                    use-input
                    @filter="filterFn"
                    @new-value="createValue"
                  >
                    <template v-slot:option="{ itemProps, opt }">
                      <q-item
                        v-bind="itemProps"
                        @click="replaceNames(label, opt)"
                      >
                        <q-item-section>
                          <q-item-label>{{ opt }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item-section>
              </q-item>
            </q-list>
            <div class=" q-px-md q-py-xs text-13 text-darkish">
              Picked the wrong name for your Speaker? No worries! Hit 'Restore' and then choose the right name.
            </div>
          </q-btn-dropdown>
          <q-btn
            class="col q-ml-sm app-button"
            no-caps
            outline
            text-color="grey-4"
            @click="restoreTranscript">
            <template #default>
              <div class="text-darkish">Restore</div>
            </template>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-11">
        <q-skeleton
          v-if="loading"
          class="border-radius-6"
          height="70vh"
          square
          type="QInput"
        />
        <EditableContent
          v-else
          id="transcript"
          v-model="transcript.text"
          size="xxl"
          @update:modelValue="updateTranscript"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timestamp {
  padding: 0 10px;
  display: block;
  color: #979797;
}
.highlight {
  padding: 0 4px;
  border-radius: 6px;
}
.green {
  background-color: #44aa99;
  color: #fff;
}
.green-menu {
  background-color: #44aa99;
}
.yellow {
  background-color: #ddcc77;
}
</style>
