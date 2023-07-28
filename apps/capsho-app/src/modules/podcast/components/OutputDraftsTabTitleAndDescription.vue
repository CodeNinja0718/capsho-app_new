<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import RefreshButton from 'src/modules/podcast/components/RefreshButton.vue'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { htmlSanitizer } from 'src/utils'
import OnboardTour from 'src/components/OnboardTour.vue'
import { useAuthStore } from 'src/stores/auth-store'
import { debounce } from 'quasar'

const store = useUploadPodcastStore()
const auth = useAuthStore()

const updateTitleAndDescription = debounce(() => {
  const getTitle = () => {
    if (store.title.value) {
      return String(store.title.value)
    } else {
      return ''
    }
  }
  const getDescription = () => {
    if (store.description.value) {
      return htmlSanitizer(store.description.value)
    } else {
      return ''
    }
  }
  const title = getTitle()
  const description = getDescription()
  const data = {
    title,
    description,
    drafts: {
      title,
      description
    }
  }
  if (title && description) {
    store.selectedEpisode.title = title
    store.selectedEpisode.description = description
    return Promise.resolve(store.updatePodcastEpisode(data))
  } else {
    return null
  }
}, 500)

async function moveToNextTab() {
  await updateTitleAndDescription()
}

const getShowNotesTemplates = () => {
  store.updateShowNotesTemplates()
  return null
}

onBeforeUnmount(() => {
  Promise.allSettled([getShowNotesTemplates(), updateTitleAndDescription()])
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
const stepThree = ref(
  {
    name: 'step-three',
    description: "Don't love the draft you just got? Or want to see another option? Click this Refresh button to get a new draft (You get 3 extra refreshes &#128524;)",
    id: 3,
    tooltipPosition: 'top-right-12',
    width: '320px'
  }
)
const stepFour = ref(
  {
    name: 'step-four',
    description: 'Want to go back to previous drafts created for you? We got you! Just click this back button.',
    id: 4,
    isLast: true,
    tooltipPosition: 'top-right-40',
    width: '320px'
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
</script>

<template>
  <div class="q-gutter-y-md">
    <div>
      <div class="row justify-between q-pb-xs">
        <div class="col-10">
          <label
            v-if="store.showTitleSkeleton"
            class="custom-label"
            for="title"
          >
            <span>
              Episode title is generating - Please wait
            </span>
            <q-spinner-dots
              color="grey-7"
              size="1.2em"
            />
          </label>
          <label
            v-else
            class="custom-label"
            for="title"
          >
            Episode title
          </label>
        </div>
      </div>
      <div class="row items-center">
        <div class="col-11">
          <q-skeleton
            v-if="store.showTitleSkeleton"
            class="border-radius-6"
            height="40px"
            square
            type="QInput"
          />
          <q-input
            v-else
            id="title"
            v-model="store.title.value"
            color="grey-3"
            dense
            input-class="readable-text"
            input-style="padding: 0 30px;"
            outlined
            @update:modelValue="moveToNextTab"
          />
        </div>
        <div class="relative-position">
          <OnboardTour
            v-if="!hasSeenOnBoardingTutorial && store.showStepFour"
            right="0"
            :step="stepFour"
            width="320px"
            @next="nextStep"
            @previous="previousStep"
          />
          <RefreshButton
            id="step-4"
            aria-label="Previous"
            class="flip-horizontal"
            dense
            icon="las la-share"
            round
            :tooltip="true"
            @click="store.title.getPrevValue()"
          >
            <template #tooltip>
              Clicking this will take you to the previous option for your episode title.<br>
              (For the times you hit 'Refresh' too fast &#128524;)
            </template>
          </RefreshButton>
          <OnboardTour
            v-if="!hasSeenOnBoardingTutorial && store.showStepThree"
            right="0"
            :step="stepThree"
            width="320px"
            @next="nextStep"
            @previous="previousStep"
          />
          <RefreshButton
            id="step-3"
            aria-label="Refresh"
            :class="{ 'disabled': !store.title.isRefreshAllowed }"
            dense
            icon="las la-redo-alt"
            round
            :tooltip="true"
            unelevated
            @click="store.refreshTitle"
          >
            <template #tooltip>
              Clicking this will generate a new option for your episode title.
            </template>
          </RefreshButton>
        </div>
      </div>
    </div>
    <div>
      <div class="row justify-between q-pb-xs">
        <div class="col-10">
          <label
            v-if="store.showDescriptionSkeleton"
            class="custom-label"
            for="description"
          >
            <span>
              Episode description is generating - Please wait
            </span>
            <q-spinner-dots
              color="grey-7"
              size="1.2em"
            />
          </label>
          <label
            v-else
            class="custom-label"
            for="description"
          >
            Episode description
          </label>
        </div>
      </div>

      <div
        id="step-2"
        class="row relative-position">
        <OnboardTour
          v-if="!hasSeenOnBoardingTutorial && store.showStepTwo"
          :step="stepTwo"
          @next="nextStep"
          @previous="previousStep"
        />
        <div class="col-11">
          <q-skeleton
            v-if="store.showDescriptionSkeleton"
            class="border-radius-6"
            height="58vh"
            square
            type="QInput"
          />
          <EditableContent
            v-else
            id="description"
            v-model="store.description.value"
            editorSize="xl"
            size="xl"
            @update:modelValue="moveToNextTab"
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
            @click="store.getPrevDescriptionValue"
          >
            <template #tooltip>
              Clicking this will take you to the previous option for your episode description.<br>
              (Just in case you hit 'Refresh' too fast &#128524;)
            </template>
          </RefreshButton>
          <RefreshButton
            aria-label="Refresh"
            :class="{ 'disabled': !store.description.isRefreshAllowed }"
            dense
            icon="las la-redo-alt"
            round
            tooltip
            unelevated
            @click="store.refreshDescription"
          >
            <template #tooltip>
              Clicking this will generate a new option for your episode description.
            </template>
          </RefreshButton>
        </div>
      </div>
    </div>
  </div>
</template>
