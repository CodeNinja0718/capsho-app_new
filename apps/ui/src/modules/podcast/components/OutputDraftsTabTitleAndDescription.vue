<script setup lang="ts">
import OnboardTour from 'src/components/OnboardTour.vue'
import TheEditor from 'src/modules/editor/TheEditor.vue'
import type { JSONContent } from '@tiptap/vue-3'
import { computed, onBeforeUnmount, ref } from 'vue'
import { debounce } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { useContentFiller } from 'src/composables/useContentFiller'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const store = useUploadPodcastStore()
const auth = useAuthStore()

const templatesStore = useTemplatesStore()
const templates = computed(() => templatesStore.templates.filter((template) => template.type === 'descriptionLayout'))

const pickedTemplateIndex = ref(-2)
const { setContentChooser } = useContentFiller()

const isDescriptionLayoutPicked = computed(() => {
  if (store.selectedEpisode.layouts) {
    return store.selectedEpisode.layouts.isDescriptionPicked
  }
  return false
})

const description = computed({
  get() {
    if (store.description) {
      return store.description
    }
    return ''
  },
  set(val) {
    store.description = val
  }
})

const episodeTitle = ref('')

const updateTitleAndDescription = debounce(() => {
  const getDescription = () => {
    if (store.description) {
      return store.description
    } else {
      return ''
    }
  }
  const description = getDescription()
  const data = {
    description,
    drafts: {
      description,
      title: {
        ...store.title,
        value: episodeTitle.value || store.selectedEpisode.title || store.podcastId
      }
    },
    title: store.selectedEpisode.title || store.podcastId
  }
  if (episodeTitle.value) {
    data.title = episodeTitle.value
  }
  if (description) {
    store.selectedEpisode.description = description
    return Promise.resolve(store.updatePodcastEpisode(data))
  } else {
    return null
  }
}, 500)

const extractTitle = (json: JSONContent) => {
  const episodeTitleBlock = json.content?.find((elem) => (elem.attrs && elem.attrs.label === 'Episode title'))
  episodeTitle.value = getEpisodeTitle()

  function getEpisodeTitle() {
    if (
      episodeTitleBlock &&
      Array.isArray(episodeTitleBlock.content) &&
      episodeTitleBlock.content.length >= 0 &&
      episodeTitleBlock.content[0].content &&
      Array.isArray(episodeTitleBlock.content[0].content) &&
      episodeTitleBlock.content[0].content.length >= 0
    ) {
      return episodeTitleBlock.content[0].content[0].text || ''
    } else {
      return ''
    }
  }
}

async function moveToNextTab() {
  await updateTitleAndDescription()
}

onBeforeUnmount(() => {
  Promise.allSettled([updateTitleAndDescription()])
})

const hasSeenOnBoardingTutorial = computed(() => auth.user.hasSeenOnboardingTutorial)

const stepTwo = ref(
  {
    name: 'step-two',
    description: "Click inside the box to edit. Add, delete & update to your heart's content. (No hard feelings!) And yep, all changes will autosave.",
    id: 2,
    tooltipPosition: 'top-left-42'
  }
)

function previousStep(step: { id: number }) {
  if (step.id === 2) {
    store.showStepTwo = false
    store.showStepOne = true
  } else if (step.id === 3) {
    store.showStepThree = false
    store.showStepTwo = true
  } else if (step.id === 4) {
    store.showStepFour = false
    store.showStepThree = true
  }
}
function nextStep(step: { id: number }) {
  if (step.id === 2) {
    store.showStepTwo = false
    store.showStepThree = true
  } else if (step.id === 3) {
    store.showStepThree = false
    store.showStepFour = true
  } else if (step.id === 4) {
    store.showStepFour = false
    auth.updateUser({ hasSeenOnboardingTutorial: true })
  }
}

const buildFromTemplate = (tempIndex: number) => {
  pickedTemplateIndex.value = tempIndex
  store.selectedEpisode = {
    ...store.selectedEpisode,
    layouts: {
      ...store.selectedEpisode.layouts,
      isDescriptionPicked: true
    }
  }
  store.updatePodcastEpisode({
    layouts: {
      isDescriptionPicked: true
    }
  })
  setContentChooser('Title & Description')
}
</script>

<template>
  <div v-if="isDescriptionLayoutPicked">
    <div class="flex flex-col justify-center gap-8">
      <div class="full-width">
        <div
          id="step-2"
          class="row relative-position">
          <onboard-tour
            v-if="!hasSeenOnBoardingTutorial && store.showStepTwo"
            :step="stepTwo"
            @next="nextStep"
            @previous="previousStep"
          />
          <div class="col-12">
            <app-skeleton
              v-if="store.showDescriptionSkeleton"
              class="rounded-xl"
              height="58vh"
              width="100%"
            />
            <the-editor
              v-model="description"
              @get-json-output="extractTitle"
              @update:modelValue="moveToNextTab"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex justify-center items-center full-height pb-24 overflow-y-auto">
      <div class="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-24 gap-y-12 px-6 lg:px-12">
        <p class="col-span-3 text-white text-h4 font-black text-center">Choose a template or build your Title & Description from scratch</p>
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
          v-for="(template, id) in templates"
          v-bind:key="id"
          class="col-span-1 flex flex-col items-center"
          @click="buildFromTemplate(id)"
        >
          <q-card
            class="rounded-xl w-full h-44 cursor-pointer"
            :class="template.createdAt"
          />
          <p class="text-white text-lg font-bold mt-4 text-center">{{ template.title }}</p>
          <p class="text-white text-sm text-center">Used by us, created by {{ template.creator.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
