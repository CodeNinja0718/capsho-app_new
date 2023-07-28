<script setup lang="ts">
import { QFile } from 'quasar'
import AppCard from 'components/AppCard.vue'
import { computed, ref } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { useAuthStore } from 'stores/auth-store'
import AppButton from 'components/AppButton.vue'
import AppTooltip from 'components/AppTooltip.vue'
import DropZone from 'src/modules/podcast/components/DropZone.vue'
import { useFileList } from 'src/composables/fileList'
import { AudioFile, DropboxFile, GoogleDriveFile, UploadableFile } from 'src/models/uploadableFile'
import { laCloudUploadAltSolid, laFileAudio } from '@quasar/extras/line-awesome'
import { chargeOneTimePayment } from 'src/services/firebase/stripe'
import { useNotification } from 'src/composables/useNotification'
import { useCredits } from 'src/composables/useCredits'
import { usePricing } from 'src/composables/usePricing'
import { useSubscription } from 'src/composables/useSubscription'
import ImportDropbox from './ImportDropbox.vue'
import ImportGoogle from './ImportGoogle.vue'

const { addFiles, filterFileType, onRejected, allowedMediaMimeTypes } = useFileList()

const allowedMimeTypes = allowedMediaMimeTypes.join(',')
const { totalCredits } = useCredits()
const { isSubscribed } = useSubscription()
const {
  showSubscriptionPopup,
  subscribe,
  addEpisodes
} = usePricing()
const store = useUploadPodcastStore()
const authStore = useAuthStore()
const authUser = computed(() => {
  return {
    displayName: authStore.user.firstName + ' ' + authStore.user.lastName,
    firstName: authStore.user.firstName || '',
    isBeta: authStore.user.role ? authStore.user.role.beta : false,
    disableUpload: false,
    userClaims: authStore.userCustomClaims
  }
})
const podcastUploader = ref<QFile | null>(null)
const podcastFile = computed<File>({
  get () {
    return null as unknown as File
  },
  set (value: File) {
    store.podcastFile = new UploadableFile(value)
  }
})
function pickFile () {
  store.podcastFile = {} as AudioFile
  podcastUploader.value?.pickFiles()
}
function onSubmit () {
  const { triggerWarning } = useNotification()
  if (totalCredits.value <= 0) {
    showSubscriptionPopup()
    triggerWarning('No credits! Subscribe first')
  } else {
    store.processStep = 'askQuestion'
  }
}
const loading = ref(false)
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
  store.isDropboxLink = true
  store.dropboxFile = file
}

async function onGoogleDrivePicked (file: GoogleDriveFile) {
  store.isGoogleDriveLink = true
  store.googleDriveFile = file
}
const validPodcastId = computed(() => {
  return store.isDropboxLink ? store.dropboxFile.title
    : store.isGoogleDriveLink ? store.googleDriveFile.name
      : store.podcastFile.id
})
const validFile = computed(() => {
  return store.isDropboxLink ? store.dropboxFile
    : store.isGoogleDriveLink ? store.googleDriveFile
      : store.podcastFile
})
function removeFile () {
  if (store.isDropboxLink) {
    store.dropboxFile = {} as DropboxFile
    store.isDropboxLink = false
  } else if (store.isGoogleDriveLink) {
    store.googleDriveFile = {} as GoogleDriveFile
    store.isGoogleDriveLink = false
  } else {
    store.podcastFile = {} as AudioFile
  }
}

const isNotActiveSub = computed(() => {
  const notValidStatus = ['trialing', 'unpaid', 'past_due']
  const status = authStore.currentSubscription.status
  return notValidStatus.includes(status)
})
</script>

<template>
  <div
    v-if="isNotActiveSub || loading"
    class="q-pb-xl"
  >
    <AppCard
      class="poppins-regular"
      inner-size="lg"
      size="md"
    >
      <template #body>
        <div v-if="loading">
          <q-inner-loading
            label-class="text-teal"
            label-style="font-size: 1.1em"
            :showing="loading"
          >
            <template #default>
              <div class="column items-center q-gutter-y-sm">
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
          <div class="text-20 text-center">We checked our records and they tell us your account is overdue 😅</div>
          <q-img
            class="border-radius-6"
            :ratio="16/9"
            src="https://media.giphy.com/media/XCLBNof6ICAEM/giphy.gif"
            width="530px"
          />
          <div class="text-center">
            Please get in touch with us at <a href="mailto:support@capsho.com&subject=Unpaid Invoice">support@capsho.com</a> so we can get you back on track.
          </div>
        </div>
      </template>
    </AppCard>
  </div>
  <div
    v-else
    class="q-pb-xl"
  >
    <DropZone
      v-show="!authUser.disableUpload"
      @files-dropped="addFiles"
    >
      <template #default="{ dropZoneActive }">
        <AppCard
          class="poppins-regular"
          inner-size="lg"
          size="md"
          title="Upload your podcast episode"
        >
          <template #body>
            <div
              class="column items-center q-gutter-y-lg"
              :class="{ 'light-dimmed': dropZoneActive }"
            >
              <div class="text-center">
                <div
                  v-if="dropZoneActive"
                  class="q-gutter-y-sm"
                >
                  <q-icon
                    :name="laCloudUploadAltSolid"
                    size="5rem"
                  />
                  <div class="text-black text-weight-medium inter-bold"
                  >
                    Drop them here
                  </div>
                  <div>(MP3, WAV or M4A)</div>
                </div>
                <div
                  v-else
                  class="q-gutter-y-sm"
                >
                  <q-icon
                    :name="laCloudUploadAltSolid"
                    size="5rem"
                  />
                  <div class="text-black text-weight-medium inter-bold"
                  >
                    Drag & Drop
                  </div>
                  <div>(MP3, WAV or M4A)</div>
                </div>
              </div>
              <div
                v-if="!validPodcastId"
                class="column q-gutter-y-sm"
              >
                <ImportDropbox @picked="onDropboxPicked" />
                <ImportGoogle @picked="onGoogleDrivePicked" />
                <AppButton
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
        </AppCard>
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
