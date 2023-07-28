<script setup lang="ts">
import { QFile } from 'quasar'
import { computed, ref, onMounted } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useAuthStore } from 'stores/auth-store'
import DropZone from 'src/components/DropZone.vue'
import { useFileList } from 'src/composables/fileList'
import { AudioFile, DropboxFile, GoogleDriveFile, UploadableFile } from 'src/models/uploadableFile'
import { laCloudUploadAltSolid, laFileAudio } from '@quasar/extras/line-awesome'
import { chargeOneTimePayment } from 'src/services/firebase/stripe'
import { useNotification } from 'src/composables/useNotification'
import { useCredits } from 'src/composables/useCredits'
import { usePricing } from 'src/composables/usePricing'
import { useSubscription } from 'src/composables/useSubscription'
import ImportDropbox from 'src/components/ImportDropbox.vue'
import ImportGoogle from 'src/components/ImportGoogle.vue'

const { addFiles, filterFileType, onRejected, allowedMediaMimeTypes } = useFileList()
const allowedMimeTypes = allowedMediaMimeTypes.join(',')
const { totalCredits } = useCredits()
const { isSubscribed } = useSubscription()
const {
  showSubscriptionPopup,
  subscribe,
  addEpisodes
} = usePricing()
const uploadPodcastStore = useUploadPodcastStore()
const authStore = useAuthStore()

const loading = ref(false)
const podcastUploader = ref<QFile | null>(null)

const authUser = computed(() => {
  return {
    displayName: authStore.user.firstName + ' ' + authStore.user.lastName,
    firstName: authStore.user.firstName || '',
    isBeta: authStore.user.role ? authStore.user.role.beta : false,
    disableUpload: false,
    userClaims: authStore.userCustomClaims
  }
})
const podcastFile = computed<File>({
  get () {
    return null as unknown as File
  },
  set (value: File) {
    uploadPodcastStore.podcastFile = new UploadableFile(value)
  }
})
const validPodcastId = computed(() => {
  return uploadPodcastStore.isDropboxLink ? uploadPodcastStore.dropboxFile.title
    : uploadPodcastStore.isGoogleDriveLink ? uploadPodcastStore.googleDriveFile.name
      : uploadPodcastStore.podcastFile.id
})
const validFile = computed(() => {
  return uploadPodcastStore.isDropboxLink ? uploadPodcastStore.dropboxFile
    : uploadPodcastStore.isGoogleDriveLink ? uploadPodcastStore.googleDriveFile
      : uploadPodcastStore.podcastFile
})
const isNotActiveSub = computed(() => {
  const notValidStatus = ['trialing', 'unpaid', 'past_due']
  const status = authStore.currentSubscription.status
  return notValidStatus.includes(status)
})

function pickFile () {
  uploadPodcastStore.podcastFile = {} as AudioFile
  podcastUploader.value?.pickFiles()
}
function onSubmit () {
  const { triggerWarning } = useNotification()
  if (totalCredits.value <= 0) {
    showSubscriptionPopup()
    triggerWarning('No credits! Subscribe first')
  } else {
    uploadPodcastStore.processStep = 'episodeClipper'
  }
}
async function createCheckoutSession () {
  loading.value = true
  const { triggerWarning } = useNotification()
  const priceId = authStore.user.role?.additionalEpisodePrice
  const redirectURL = window.location.origin + '/podcast/upload'
  if (priceId) {
    await chargeOneTimePayment(priceId, redirectURL)
  } else {
    triggerWarning('Additional episode price id is not set')
  }
}
function onDropboxPicked (file: DropboxFile) {
  uploadPodcastStore.isDropboxLink = true
  uploadPodcastStore.dropboxFile = file
}
async function onGoogleDrivePicked (file: GoogleDriveFile) {
  uploadPodcastStore.isGoogleDriveLink = true
  uploadPodcastStore.googleDriveFile = file
}
function removeFile () {
  if (uploadPodcastStore.isDropboxLink) {
    uploadPodcastStore.dropboxFile = {} as DropboxFile
    uploadPodcastStore.isDropboxLink = false
  } else if (uploadPodcastStore.isGoogleDriveLink) {
    uploadPodcastStore.googleDriveFile = {} as GoogleDriveFile
    uploadPodcastStore.isGoogleDriveLink = false
  } else {
    uploadPodcastStore.podcastFile = {} as AudioFile
  }
}

onMounted(() => {
  removeFile()
})
</script>

<template>
  <div v-if="isNotActiveSub || loading">
    <div v-if="loading">
      <q-inner-loading
        label-class="text-teal"
        label-style="font-size: 1.1em"
        :showing="loading"
      >
        <template #default>
          <div class="column items-center q-gutter-y-sm lexend-regular">
            <q-spinner
              color="accent"
              size="40px" />
            <div>
              Please wait...
            </div>
          </div>
        </template>
      </q-inner-loading>
    </div>
    <div
      v-else
      class="column items-center q-gutter-y-lg full-width"
    >
      <div class="text-20 text-center lexend-regular">We checked our records and they tell us your account is overdue 😅</div>
      <q-img
        class="border-radius-6"
        :ratio="16/9"
        src="https://media.giphy.com/media/XCLBNof6ICAEM/giphy.gif"
        width="530px"
      />
      <div class="text-center lexend-regular">
        Please get in touch with us at <a href="mailto:support@capsho.com&subject=Unpaid Invoice">support@capsho.com</a> so we can get you back on track.
      </div>
    </div>
  </div>
  <div v-else>
    <DropZone
      v-show="!authUser.disableUpload"
      @files-dropped="addFiles"
    >
      <template #default="{ dropZoneActive }">
        <div
          class="column items-center lexend-regular"
          :class="{ 'light-dimmed': dropZoneActive }"
        >
          <h3 class="font-semibold lexend-regular mb-6">Upload episode</h3>
          <div class="text-center lexend-regular mb-6">
            <div
              v-if="dropZoneActive"
              class="q-gutter-y-sm"
            >
              <q-icon
                :name="laCloudUploadAltSolid"
                size="5rem"
              />
              <div class="text-weight-medium inter-bold"
              >
                Drop them here
              </div>
              <div>(MP3, WAV, M4A, MP4, MOV or WMV)</div>
            </div>
            <div
              v-else
              class="q-gutter-y-sm"
            >
              <q-img
                class="w-20"
                src="~src/assets/icons/upload.svg"
              />
              <div class="text-weight-medium inter-bold"
              >
                Drag & Drop
              </div>
              <div>(MP3, WAV, M4A, MP4, MOV or WMV)</div>
            </div>
          </div>
          <div class="lexend-regular text-center mb-6 lexend-regular">
            <span class="text-accent font-bold">Uploading a video file?</span>
            Depending on your file size, it might a little bit longer to process.
          </div>
          <div
            v-if="!validPodcastId"
            class="flex flex-col gap-4 lexend-regular"
          >
            <ImportDropbox @picked="onDropboxPicked" />
            <ImportGoogle @picked="onGoogleDrivePicked" />
            <q-btn
              id="foo"
              color="accent"
              hover-color="transparent"
              label="Or choose a file"
              no-caps
              padding="7px 44px"
              rounded
              unelevated
              @click="pickFile"
            />
          </div>
          <q-form
            class="lexend-regular"
            enctype="multipart/form-data"
            @submit.prevent="onSubmit"
          >
            <q-file
              ref="podcastUploader"
              v-model="podcastFile"
              :accept="allowedMimeTypes"
              class="hidden"
              :filter="filterFileType"
              @rejected="onRejected"
            />
            <div
              v-if="validPodcastId"
              class="full-width q-py-sm"
            >
              <q-chip
                color="grey-1"
                :icon="laFileAudio"
                removable
                text-color="darkish"
                @remove="removeFile"
              >
                {{ validFile.name }}
                <AppTooltip
                  anchor="top middle"
                  class="text-subtitle1 text-accent"
                  self="bottom middle"
                >
                  <template #body>
                    Remove and choose another file
                  </template>
                </AppTooltip>
              </q-chip>
            </div>
            <div
              v-if="validPodcastId"
              class="row q-py-sm justify-center"
            >
              <AppButton
                color="accent"
                hover-color="transparent"
                label="Upload"
                no-caps
                padding="7px 44px"
                rounded
                type="submit"
                unelevated
              />
            </div>
          </q-form>
        </div>
      </template>
    </DropZone>
    <q-dialog
      v-if="isSubscribed"
      v-model="addEpisodes"
      class="border-radius-23"
      transition-hide="scale"
      transition-show="scale"
    >
      <AppCard>
        <template #body>
          <div class="column items-center q-gutter-y-md">
            <q-img
              class="border-radius-23"
              src="https://media.giphy.com/media/MVOvIa3JYKeCA/giphy.gif">
              <div class="absolute-full text-subtitle2 flex flex-center">
                <div class="q-px-md column q-gutter-y-sm items-center text-white">
                  <span>
                    Oops you've used up all of your<br/>
                    episode credits for this month!
                  </span>
                  <span>
                    But great news, we've got plenty of<br/>
                    fresh episodes for you to stock up on!
                  </span>
                </div>
              </div>
            </q-img>
            <q-btn
              class="inter-regular text-body1 text-weight-bold"
              :class="{ 'disabled': loading }"
              label="Add additional episode(s)"
              :loading="loading"
              no-caps
              rounded
              style="background-color: #EAE8FF;"
              text-color="grey-8"
              unelevated
              @click="createCheckoutSession"
            >
              <template v-slot:loading>
                Submitting...
              </template>
            </q-btn>
          </div>
        </template>
      </AppCard>
    </q-dialog>
    <q-dialog
      v-if="!isSubscribed"
      v-model="subscribe"
      class="border-radius-23"
      transition-hide="scale"
      transition-show="scale"
    >
      <AppCard>
        <template #body>
          <div class="column items-center q-gutter-y-md">
            <div class="text-center inter-regular text-weight-medium text-grey-8 text-body1">
              Oops looks like you’re at<br>
              the end of your free trial!<br><br>

              We’d like to take the next step<br>
              together (and make things official 😉)<br><br>

              Please choose a plan that suits you 🎉
            </div>
            <q-btn
              class="inter-regular text-body1 text-weight-bold"
              label="Check out our Plans"
              no-caps
              rounded
              style="background-color: #EAE8FF;"
              text-color="grey-8"
              unelevated
              @click="authStore.router.push({ name: 'PickAPlan' })"
            />
          </div>
        </template>
      </AppCard>
    </q-dialog>
  </div>
</template>

<style scoped>
</style>
