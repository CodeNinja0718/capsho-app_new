<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { debounce } from 'quasar'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import RefreshButton from 'src/modules/podcast/components/RefreshButton.vue'
import { htmlSanitizer } from 'src/utils'

const store = useUploadPodcastStore()

type TemplateKey = 'story' | 'summary'

const templateKey = ref<TemplateKey>(
  store.isGuest ? 'story' : 'summary'
)

function getNextKey() {
  store.showNotesSkeleton = true
  const keys = Object.keys(store.allShowNotes)
  const currKey = templateKey.value
  const currKeyIndex = keys.findIndex((val: string) => val === currKey)
  if (currKeyIndex === -1) {
    templateKey.value = keys[0] as TemplateKey
  }
  if (currKeyIndex === keys.length - 1) {
    templateKey.value = keys[0] as TemplateKey
  } else {
    templateKey.value = keys[currKeyIndex + 1] as TemplateKey
  }
  const timer = setTimeout(() => {
    store.showNotesSkeleton = false
    clearTimeout(timer)
  }, 500)
}

function getPrevKey() {
  store.showNotesSkeleton = true
  const keys = Object.keys(store.allShowNotes)
  const currKey = templateKey.value
  const currKeyIndex = keys.findIndex((val: string) => val === currKey)
  if (currKeyIndex === -1) {
    templateKey.value = keys[0] as TemplateKey
  }
  if (currKeyIndex === 0) {
    templateKey.value = keys[keys.length - 1] as TemplateKey
  } else {
    templateKey.value = keys[currKeyIndex - 1] as TemplateKey
  }
  const timer = setTimeout(() => {
    store.showNotesSkeleton = false
    clearTimeout(timer)
  }, 500)
}

function getDefaultKey() {
  if (store.allShowNotes && Object.keys(store.allShowNotes).length) {
    if (store.isGuest) {
      templateKey.value = 'story'
    } else {
      templateKey.value = 'summary'
    }
  }
}

function setTemplateKey() {
  if (store.allShowNotes && Object.keys(store.allShowNotes).length) {
    if (templateKey.value) {
      getNextKey()
    } else {
      getDefaultKey()
    }
  }
}

const showNotes = computed({
  get() {
    const currentKey = templateKey.value
    if (store.allShowNotes) {
      return store.allShowNotes[currentKey]
    }
    return ''
  },
  set(value: string) {
    const currentKey = templateKey.value
    store.allShowNotes[currentKey] = value
    store.showNote = value
  }
})

const updateShowNotes = debounce(() => {
  const key = templateKey.value
  const data = {
    allShowNotes: {
      [key]: htmlSanitizer(showNotes.value)
    },
    showNote: htmlSanitizer(showNotes.value)
  }
  if (showNotes.value) {
    store.selectedEpisode.allShowNotes[key] = showNotes.value
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 500)

async function moveToTheNext () {
  store.showNote = showNotes.value
  store.selectedEpisode.showNote = showNotes.value
  await updateShowNotes()
}

watch(showNotes, (updatedShowNotes) => {
  if (updatedShowNotes) {
    moveToTheNext()
  }
}, { immediate: true })

onBeforeUnmount(() => {
  Promise.resolve(moveToTheNext())
})
</script>

<template>
  <div>
    <div class="row justify-between q-pb-xs">
      <div class="col-10">
        <label
          v-if="store.showNotesSkeleton"
          class="custom-label"
          for="showNotes"
        >
          <span>
            Show Notes is generating - Please wait
          </span>
          <q-spinner-dots
            color="grey-7"
            size="1.2em"
          />
        </label>
        <label
          v-else
          class="custom-label"
          for="showNotes"
        >
          Show Notes
        </label>
      </div>
    </div>

    <div class="row">
      <div class="col-11">
        <q-skeleton
          v-if="store.showNotesSkeleton"
          class="border-radius-6"
          height="70vh"
          square
          type="QInput"
        />
        <EditableContent
          v-else
          id="showNotes"
          v-model="showNotes"
          size="xxl"
          @update:modelValue="moveToTheNext"
        />
      </div>
      <div class="col-1">
        <RefreshButton
          aria-label="Previous"
          class="flip-horizontal"
          dense
          icon="las la-share"
          round
          tooltip
          @click="getPrevKey"
        >
          <template #tooltip>
            Clicking this will take you to the previous option<br>
            (Just in case you hit Refresh too quickly &#128522;)
          </template>
        </RefreshButton>
        <RefreshButton
          aria-label="Refresh"
          dense
          icon="las la-redo-alt"
          round
          tooltip
          unelevated
          @click="setTemplateKey"
        >
          <template #tooltip>
            Clicking this will generate a new version.
          </template>
        </RefreshButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.apply-border {
  border: 1px solid rgba(20, 20, 43, 0.3);
  border-radius: 20px;
}
</style>
