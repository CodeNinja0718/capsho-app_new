<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useNotification } from 'src/composables/useNotification'
import { useFolderStore } from 'src/stores/folder-store'
import CreateFolder from './FolderCreate.vue'
// import OnboardTour from 'src/components/OnboardTour.vue'
// import { useAuthStore } from 'src/stores/auth-store'

const store = useUploadPodcastStore()
// const auth = useAuthStore()
const isGuest = ref(true)
const guestNameRef = ref(null)
const guestName = computed({
  get () {
    return store.guestName
  },
  set (val: string) {
    store.guestName = val.split(',').join(',')
  }
})
const folder = ref(null)
const folderStore = useFolderStore()
const createDialog = ref(false)
async function moveToTheNext() {
  const { triggerNegative } = useNotification()
  try {
    store.isGuest = Boolean(isGuest.value)
    store.guestName = guestName.value
    store.processStep = 'submitFiles'
    store.uploadPodcastToStorage()
  } catch (e) {
    if (e instanceof Error) {
      triggerNegative(e.message)
    }
  }
}
onMounted(() => {
  folderStore.getAllDocuments()
})
function findFolderById(id: string) {
  const folders = folderStore.documents
  return folders.find((folder) => folder.id === id)
}
function selectFolder({ id }: { id: string }) {
  store.folder = id
  const selectedFolder = findFolderById(id)
  if (selectedFolder) {
    store.selectedFolder = selectedFolder
    store.podcastName = selectedFolder.podcastName
  }
}
function createFolder() {
  createDialog.value = false
  folderStore.$reset()
  folderStore.getAllDocuments()
}
function createDialogFunc() {
  createDialog.value = true
}
// tour
// const hasSeenOnBoardingTutorial = computed(() => auth.user.hasSeenOnboardingTutorial)
// const stepOne = ref(
//   {
//     name: 'step-one',
//     description: 'Click Yes if you’re interviewing a special podcast-guest (or guests).<strong> This doesn\'t include your Co-Host </strong> if you have one (as special as they are 😉)',
//     isFirst: true,
//     id: 1,
//     tooltipPosition: 'top-right-150'
//   }
// )
// const stepTwo = ref(
//   {
//     name: 'step-two',
//     description: 'Add your Guest\'s full name here.<strong> Got more than 1 Guest?</strong> Add all of their names with a comma between each name (this is important &#128072;)!',
//     id: 2,
//     tooltipPosition: 'top-left-42'
//   }
// )
// const stepThree = ref(
//   {
//     name: 'step-three',
//     description: 'Choose what folder you would like to save this episode to. You can also create a new folder if you don\'t have any folders yet.',
//     id: 3,
//     tooltipPosition: 'top-left-42'
//   }
// )
//
// const stepFour = ref(
//   {
//     name: 'step-four',
//     description: 'Click here to start processing your episode! <strong>Quick reminder:</strong> this will deduct 1 episode credit',
//     id: 4,
//     isLast: true,
//     tooltipPosition: 'top-right-180'
//   }
// )

// const showStepOne = ref(true)
// const showStepTwo = ref(false)
// const showStepThree = ref(false)
// const showStepFour = ref(false)

// function previousStep(step: { id: number }) {
//   if (step.id === 2) {
//     showStepOne.value = true
//     showStepTwo.value = false
//   } else if (step.id === 3) {
//     showStepThree.value = false
//     if (isGuest.value) {
//       showStepTwo.value = true
//     } else {
//       showStepOne.value = true
//     }
//   } else if (step.id === 4) {
//     showStepThree.value = true
//     showStepFour.value = false
//   }
// }

// function nextStep(step: { id: number }) {
//   if (step.id === 1) {
//     showStepOne.value = false
//     if (isGuest.value) {
//       showStepTwo.value = true
//     } else {
//       showStepThree.value = true
//     }
//   } else if (step.id === 2) {
//     showStepTwo.value = false
//     showStepThree.value = true
//   } else if (step.id === 3) {
//     showStepThree.value = false
//     showStepFour.value = true
//   } else {
//     showStepFour.value = false
//   }
// }

</script>

<template>
  <div class="q-pa-md">
    <q-card class="topic-chooser-card q-pa-md">
      <q-card-section>
        <!--Guest toggle-->
        <q-item tag="label">

          <q-item-section>
            <q-item-label>Did this episode have a guest?</q-item-label>
            <q-item-label caption>
              Tick, if you're interviewing a special
              guest (or guests)
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row no-wrap">
              <q-toggle
                v-model="isGuest"
                checked-icon="check"
                class="text-12"
                color="accent"
                size="md"
                unchecked-icon="clear"
              />
              <q-badge
                align="top"
                class="cursor-pointer"
                color="white"
                rounded
                text-color="accent"
              >
                (?)
                <AppTooltip
                  anchor="top middle"
                  class="tooltip-text rounded-borders"
                  max-width="20vw"
                  self="bottom middle"
                >
                  <template #body>
                    Click Yes if you're interviewing a special
                    guest (or guests).
                    <strong>This doesn't include your Co-Host</strong> if
                    you have one (as special as they are 😉)
                  </template>
                </AppTooltip>
              </q-badge>
            </div>
          </q-item-section>
        </q-item>
        <!--        Guest name input-->
        <q-item
          :disable="!isGuest"
          tag="label"
        >

          <q-item-section>
            <q-item-label>Guest Full Name/s</q-item-label>
            <q-item-label caption>
              Add all of your guest names with a comma
              between each name (this is important &#128072;)!
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-input
              ref="guestNameRef"
              v-model="guestName"
              class="border-radius-10"
              dense
              :disable="!isGuest"
              hint="Example: John Doe, Jane Doe, Joanne Rowling,"
              input-class="text-capitalize"
              label="Guest Full Name/s"
              outlined
              :rules="[val => val && val.length > 0 || 'Guest name must not be empty, not using comma as separator']"
              type="text"
            />
          </q-item-section>
        </q-item>
        <!--        Select Folder-->
        <q-item>
          <q-item-section>
            <q-item-label>Save to folder</q-item-label>
            <q-item-label caption>
              Choose a folder to save your episode.
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="folder"
              class="border-radius-10 q-mb-sm"
              dense
              label="Select"
              name="podcastName"
              option-label="podcastName"
              option-value="id"
              :options="folderStore.documents"
              outlined
              @update:modelValue="selectFolder"
            >
              <template #no-option>
                <div
                  class="text-bold cursor-pointer"
                  @click="createDialogFunc"
                >
                  <q-item>
                    Create folder
                  </q-item>
                </div>
              </template>
              <template #before-options>
                <div
                  class="text-bold cursor-pointer"
                  @click="createDialogFunc"
                >
                  <q-item>
                    Create folder
                  </q-item>
                </div>
              </template>
              <q-dialog
                v-model="createDialog"
                :persistent="false"
              >
                <CreateFolder @submit="createFolder" />
              </q-dialog>
            </q-select>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-item-label header>Optional</q-item-label>
        <!--        Chapter toggle-->
        <q-item tag="label">

          <q-item-section>
            <q-item-label>Do you want Chapter Summaries for this episode?</q-item-label>
            <q-item-label caption>
              This will be added to the end of your show notes.
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row no-wrap">
              <q-toggle
                v-model="store.withChapterSummaries"
                checked-icon="check"
                class="text-12"
                color="accent"
                size="md"
                unchecked-icon="clear"
              />
              <q-badge
                align="top"
                class="cursor-pointer"
                color="white"
                rounded
                text-color="accent"
              >
                (?)
                <AppTooltip
                  anchor="top middle"
                  class="tooltip-text rounded-borders"
                  max-width="20vw"
                  self="bottom middle"
                >
                  <template #body>
                    Chapter Summaries summarize your episode into short timestamped paragraphs.
                  </template>
                </AppTooltip>
              </q-badge>
            </div>
          </q-item-section>
        </q-item>
        <!--        Trim transcript toggle-->
        <q-item tag="label">

          <q-item-section>
            <q-item-label>Do you want to exclude the start of your episode for the drafts Capsho creates for you?</q-item-label>
            <q-item-label caption>
              You will still get a full transcript for your episode.
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            style="padding-left: 0 !important;"
          >
            <div class="row no-wrap">
              <q-toggle
                v-model="store.excludeIntro"
                checked-icon="check"
                class="text-12"
                color="accent"
                size="md"
                unchecked-icon="clear"
              />
              <q-badge
                align="top"
                class="cursor-pointer"
                color="white"
                rounded
                text-color="accent"
              >
                (?)
                <AppTooltip
                  anchor="top middle"
                  class="tooltip-text poppins-regular rounded-borders"
                  max-width="20vw"
                  self="bottom middle"
                >
                  <template #body>
                    We suggest excluding generic parts like your overall podcast intro,
                    pre-roll ads and any content not related to your episode topic.
                    This will mean Capsho only uses the  on-topic part of the episode
                    (the meat-and-potatoes and not the "fluff") to do our thing!
                  </template>
                </AppTooltip>
              </q-badge>
            </div>
          </q-item-section>
        </q-item>
        <!--        Min & sec inputs-->
        <q-item
          class="full-width"
          :disable="!store.excludeIntro"
          tag="label"
        >
          <q-item-section>
            <q-item-label>Please enter the approximate timestamp you want us to exclude</q-item-label>
            <q-item-label
              caption
              class="row no-wrap q-col-gutter-x-sm">
              <div class="col row no-wrap q-gutter-x-sm">
                <div class="text-caption q-item__label--caption">From: </div>
                <q-input
                  class="border-radius-10"
                  dense
                  :disable="!store.excludeIntro"
                  label="0 min"
                  outlined
                  readonly
                  type="text"
                />
                <q-input
                  class="border-radius-10"
                  dense
                  :disable="!store.excludeIntro"
                  label="0 sec"
                  outlined
                  readonly
                  type="text"
                />
              </div>
              <div class="col row no-wrap q-gutter-x-sm">
                <div class="text-caption q-item__label--caption">To: </div>
                <q-input
                  v-model="store.excludeInMin"
                  class="border-radius-10"
                  dense
                  :disable="!store.excludeIntro"
                  label="min"
                  mask="##########"
                  outlined
                  type="text"
                />
                <q-input
                  v-model="store.excludeInSec"
                  class="border-radius-10"
                  dense
                  :disable="!store.excludeIntro"
                  label="sec"
                  mask="##########"
                  outlined
                  type="text"
                />
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge
              align="top"
              class="cursor-pointer"
              color="white"
              rounded
              text-color="accent"
            >
              (?)
              <AppTooltip
                anchor="top middle"
                class="tooltip-text rounded-borders"
                max-width="20vw"
                self="bottom middle"
              >
                <template #body>
                  For example, if you want Capsho to ignore the first 5min and 32 seconds
                  of your episode audio, please enter 5 in the min field and 32 in the sec field
                </template>
              </AppTooltip>
            </q-badge>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          class="btn-grey border-radius-6"
          color="accent"
          :disabled="(isGuest && (!guestName || !folder)) || (!isGuest && (!folder))"
          no-caps
          rounded
          text-color="white"
          @click="moveToTheNext"
        >
          Let's go
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.topic-chooser-card,
.topic-chooser-container {
  width: 100%;
  max-width: 725px;
  margin: 0 auto;
}
</style>
