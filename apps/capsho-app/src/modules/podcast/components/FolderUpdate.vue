<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import AppButton from 'components/AppButton.vue'
import AppCard from 'components/AppCard.vue'
import DropZone from 'src/modules/podcast/components/DropZone.vue'
import { laFacebook, laInstagram, laLinkedin, laLinkSolid, laTwitterSquare, laYoutube } from '@quasar/extras/line-awesome'
import { useFileList } from 'src/composables/fileList'
import { QFile } from 'quasar'
import { ImageFile, UploadableImage } from 'src/models/uploadableFile'
import { useFolderStore } from 'stores/folder-store'
import { saveImageForFolder } from 'src/services/firebase/storageService'
import { Folder } from 'src/models/folders'

const emit = defineEmits(['onUpdated'])
const { addImages, filterImageType, onRejected } = useFileList()
const store = useFolderStore()
const folderImageUploader = ref<QFile | null>(null)
const step = ref('one')
const loading = ref(false)

const folderFile = computed({
  get() {
    return null as unknown as File
  },
  set(value: File) {
    store.folderFile = new UploadableImage(value)
    loading.value = true
    saveImageForFolder(store.folderFile).then((downloadURl) => {
      if (downloadURl === null) return null
      if (typeof downloadURl !== 'undefined') {
        store.selectedFolder.folderFileUrl = downloadURl
      }
      loading.value = false
    })
  }
})

function pickFile() {
  store.folderFile = {} as ImageFile
  folderImageUploader.value?.pickFiles()
}

const isValid = computed(() => {
  if (!store.selectedFolder.hostName) {
    return false
  } else if (!store.selectedFolder.podcastName) {
    return false
  }
  return true
})

async function updateDocument() {
  store.saving = true
  store.editDocumentToFolder()
    .finally(() => {
      const timer = setTimeout(() => {
        store.editFolder = false
        store.saving = false
        emit('onUpdated')
        clearTimeout(timer)
      }, 400)
    })
}

function resetForm () {
  store.selectedFolder = {} as Folder
}

onBeforeUnmount(() => resetForm())
</script>

<template>
  <AppCard
    v-if="step === 'one'"
    :border="false"
    inner-size="xl"
    size="xl"
    style="min-width: 770px !important; width: 100%; max-height: 90vh !important;"
  >
    <template #header>
      <div class="row title">
        Update Folder
      </div>
    </template>
    <template #body>
      <q-form class="q-gutter-y-sm">
        <div>
          <label
            class="row label justify-center"
            for="podcastName">
            Podcast Name (required)
          </label>
          <div class="row justify-center">
            <q-input
              id="podcastName"
              v-model="store.selectedFolder.podcastName"
              borderless
              class="rounded-borders q-px-md custom-input text-capitalize"
              dense
              placeholder="Please enter the name of your podcast"
            />
          </div>
        </div>

        <div>
          <label
            class="row label justify-center"
            for="hostName">
            Host Name (required)
          </label>
          <div class="row justify-center">
            <q-input
              id="hostName"
              v-model="store.selectedFolder.hostName"
              borderless
              class="rounded-borders q-px-md custom-input text-capitalize"
              dense
              placeholder="Please enter the name of the podcast host(s)"
            />
          </div>
        </div>

        <div>
          <label
            class="row label justify-center"
            for="businessName">
            Business Name (optional)
          </label>
          <div class="row justify-center">
            <q-input
              id="businessName"
              v-model="store.selectedFolder.businessName"
              borderless
              class="rounded-borders q-px-md custom-input text-capitalize"
              dense
              placeholder="Please enter the name of the business linked to this podcast"
            />
          </div>
        </div>

        <div>
          <label
            class="row label justify-center"
            for="podcastCover">
            Podcast Cover
          </label>
          <div id="podcastCover">
            <DropZone @files-dropped="addImages">
              <template #default="{ dropZoneActive }">
                <div
                  class="column items-center q-gutter-y-lg"
                  :class="{ 'light-dimmed': dropZoneActive }"
                >
                  <div class="text-center">
                    <q-img
                      v-if="!store.selectedFolder.folderFileUrl"
                      alt=""
                      height="96px"
                      src="~assets/upload-btn.png"
                      style="cursor:pointer"
                      width="96px"
                      @click="pickFile"
                    />
                    <q-img
                      v-else
                      alt=""
                      height="96px"
                      :src="store.selectedFolder.folderFileUrl"
                      style="cursor:pointer;border-radius:50%"
                      width="96px"
                      @click="pickFile"
                    >
                      <q-inner-loading :showing="loading" />
                    </q-img>
                    <div
                      class="text-black text-13 text-weight-medium inter-bold"
                      @click="pickFile"
                    >
                      Upload Cover
                    </div>

                  </div>
                  <q-form enctype="multipart/form-data">
                    <q-file
                      ref="folderImageUploader"
                      v-model="folderFile"
                      accept=".jpg, .png, .jpeg, image/*"
                      class="hidden"
                      :filter="filterImageType"
                      @rejected="onRejected"
                    />
                  </q-form>
                </div>
              </template>
            </DropZone>
          </div>
        </div>

        <div class="row justify-center q-pt-none q-mt-none">
          <AppButton
            color="accent"
            :disabled="!isValid"
            hoverColor="white"
            label="NEXT"
            no-caps
            padding="4px 72px"
            rounded
            @click="step = 'two'"
          />
        </div>
      </q-form>
    </template>
  </AppCard>
  <AppCard
    v-if="step === 'two'"
    :border="false"
    inner-size="xl"
    size="xl"
    style="min-width: 970px !important; max-height: 100vh !important;"
  >
    <template #header>
      <div class="row title-two">
        Now let’s grab social media and Website links for This Podcast.
      </div>
    </template>
    <template #body>
      <div
        class="q-gutter-y-sm"
        style="width: 100%; max-width: 500px; margin: 0 auto;"
      >
        <div>
          <q-input
            v-model="store.selectedFolder.instagramLink"
            borderless
            dense
            outlined
          >
            <template #before>
              <q-icon
                :name="laInstagram"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14">
                {{ store.socialLinksPrefix.instagram }}
              </span>
            </template>
          </q-input>
        </div>
        <div>
          <q-input
            v-model="store.selectedFolder.facebookLink"
            borderless
            dense
            outlined
          >
            <template #before>
              <q-icon
                :name="laFacebook"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14">
                {{ store.socialLinksPrefix.facebook }}
              </span>
            </template>
          </q-input>
        </div>
        <div>
          <q-input
            v-model="store.selectedFolder.youtubeLink"
            borderless
            dense
            outlined
          >
            <template #before>
              <q-icon
                :name="laYoutube"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14">
                {{ store.socialLinksPrefix.youtube }}
              </span>
            </template>
          </q-input>
        </div>
        <div>
          <q-input
            v-model="store.selectedFolder.twitterLink"
            borderless
            dense
            outlined
          >
            <template #before>
              <q-icon
                :name="laTwitterSquare"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14">
                {{ store.socialLinksPrefix.twitter }}
              </span>
            </template>
          </q-input>
        </div>
        <div>
          <q-input
            v-model="store.selectedFolder.linkedinLink"
            borderless
            dense
            outlined
          >
            <template #before>
              <q-icon
                :name="laLinkedin"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14">
                {{ store.socialLinksPrefix.linkedin }}
              </span>
            </template>
          </q-input>
        </div>
        <div>
          <q-input
            v-model="store.selectedFolder.websiteLink"
            borderless
            dense
            outlined
          >
            <template #before>
              <q-icon
                :name="laLinkSolid"
                size="lg" />
            </template>
          </q-input>
        </div>
      </div>
      <div
        class="q-gutter-y-sm q-py-md"
        style="width: 100%; max-width: 500px; margin: 0 auto;"
      >
        <div class="text-center poppins-medium text-16">
          Would you Like Capsho To Include Any Standard CTA Wording On Your Show Notes?
        </div>
        <div class="text-center text-14 text-grey-secondary">
          Please type the standard wording below:
        </div>
        <div class="">
          <q-input
            v-model="store.selectedFolder.comments"
            autogrow
            borderless
            color="accent"
            dense
            outlined
          />
        </div>
      </div>
      <div class="row justify-end mt-8">
        <AppButton
          color="accent"
          hoverColor="white"
          label="Update"
          :loading="store.saving"
          no-caps
          padding="4px 72px"
          rounded
          @click="updateDocument"
        />
      </div>
    </template>
  </AppCard>
</template>
<style lang="scss" scoped >
.title {
  font-family: 'Inter',serif;
  font-style: normal;
  font-weight: 700;
  font-size: 25.977px;
  justify-content: center;
  text-transform: capitalize;
  color: #3E3E3E;

  &-two {
    font-family: 'Inter',serif;
    font-weight: 700;
    font-size: 20px;
    justify-content: center;
    color: #3E3E3E;
  }

  &-three {
    font-family: 'Inter',serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    justify-content: center;
    color: #727272;
  }
}

.label {
  font-family: 'Inter',serif;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 2;
  align-items: center;
  text-align: center;
  color: #727272;

}

.custom-input {
  width: 380px;
  border: 1px solid #B0B0B0 !important;
  border-radius: 5px !important;
}
</style>
