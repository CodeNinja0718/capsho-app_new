<script setup lang="ts">
import TheEditor from 'src/modules/editor/TheEditor.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { debounce } from 'quasar'
import { useContentFiller } from 'src/composables/useContentFiller'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const store = useUploadPodcastStore()

const templatesStore = useTemplatesStore()
const templates = computed(() => templatesStore.templates.filter((template) => template.type === 'showNotesLayout'))

const pickedTemplateIndex = ref(-2)
const { setContentChooser } = useContentFiller()

const isPodcastWebsiteContentLayoutPicked = computed(() => {
  if (store.selectedEpisode.layouts) {
    return store.selectedEpisode.layouts.isPodcastWebsiteContentPicked
  }
  return false
})

const showNotes = computed({
  get() {
    if (store.showNote) {
      return store.showNote
    }
    return ''
  },
  set(val) {
    store.showNote = val
  }
})

const updateShowNotes = debounce(() => {
  const data = {
    showNote: showNotes.value
  }
  if (showNotes.value) {
    store.showNote = showNotes.value
    store.selectedEpisode.showNote = showNotes.value
    return Promise.resolve(store.updatePodcastEpisode(data))
  }
}, 500)

async function moveToTheNext () {
  await updateShowNotes()
}

onBeforeUnmount(() => {
  Promise.resolve(moveToTheNext())
})

const buildFromTemplate = (tempIndex: number) => {
  pickedTemplateIndex.value = tempIndex
  store.selectedEpisode.layouts.isPodcastWebsiteContentPicked = true
  store.updatePodcastEpisode({
    layouts: {
      isPodcastWebsiteContentPicked: true
    }
  })
  setContentChooser('Podcast Website Content')
}
</script>

<template>
  <div v-if="isPodcastWebsiteContentLayoutPicked">
    <div class="row">
      <div class="col-11">
        <app-skeleton
          v-if="store.showNotesSkeleton"
          class="rounded-xl"
          height="70vh"
          width="100%"
        />
        <the-editor
          v-model="showNotes"
          @update:modelValue="updateShowNotes"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <div
      v-if="pickedTemplateIndex === -2"
      class="flex justify-center items-center full-height pb-24 overflow-y-auto"
    >
      <div class="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-24 gap-y-12 px-6 lg:px-12">
        <p class="col-span-3 text-white text-h4 font-black text-center">Choose a template or build your Podcast Website Content from scratch</p>
        <div
          class="col-span-1 flex flex-col items-center gap-4"
          @click="buildFromTemplate(-1)"
        >
          <q-card class="rounded-xl w-full h-44 bg-darkish cursor-pointer">
            <div class="w-full h-full flex justify-center items-center">
              <q-icon
                color="black"
                name="add"
                size="4rem"
              />
            </div>
          </q-card>
          <p class="text-white text-lg font-bold text-center">Build from scratch</p>
        </div>
        <div
          v-for="(blogTemplate, id) in templates"
          v-bind:key="id"
          class="col-span-1 flex flex-col items-center"
          @click="buildFromTemplate(id)"
        >
          <q-card
            class="rounded-xl w-full h-44 cursor-pointer"
            :class="blogTemplate.createdAt"
          />
          <p class="text-white text-lg font-bold mt-4 text-center">{{ blogTemplate.title }}</p>
          <p class="text-white text-sm text-center">Used by us, created by {{ blogTemplate.creator.name }}</p>
        </div>
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
