<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import AppButton from 'components/base/AppButton.vue'
import AppCard from 'components/base/AppCard.vue'
import DropZone from 'src/components/DropZone.vue'
import { laFacebook, laInstagram, laLinkedin, laLinkSolid, laTwitterSquare, laYoutube } from '@quasar/extras/line-awesome'
import { useFileList } from 'src/composables/fileList'
import { QFile } from 'quasar'
import { ImageFile, UploadableImage } from 'src/models/uploadableFile'
import { useFolderStore } from 'src/stores/folder-store'
import { saveImageForFolder } from 'src/services/firebase/storageService'
import { biUpload } from '@quasar/extras/bootstrap-icons'

const emit = defineEmits(['onCreated'])
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
        store.folderFileUrl = downloadURl
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
  if (!store.hostName) {
    return false
  } else if (!store.podcastName) {
    return false
  }
  return true
})

async function createDocument() {
  store.saving = true
  store.addDocumentToFolder()
    .finally(() => {
      const timer = setTimeout(() => {
        store.saving = false
        emit('onCreated')
        clearTimeout(timer)
      }, 400)
    })
}

onBeforeUnmount(() => store.partialStoreReset())
</script>

<template>
  <div
    v-if="step === 'one'"
    class="w-full md:w-[476px] lg:w-[640px] xl:w-[850px] max-w-none"
  >
    <div class="rounded-[50px] w-full p-4 md:p-6 lg:p-10 xl:p-14 bg-darkish border-accent border-4 border-solid">
      <h3>Create  folder</h3>
      <q-form class="w-full grid grid-cols-12">
        <div class="col-span-8">
          <div>
            <div class="flex flex-col items-start">
              <label
                class="label ml-6"
                for="podcastName"
              >Podcast name</label>
            </div>
            <div class="">
              <q-input
                id="podcastName"
                v-model="store.podcastName"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="podcastName"
                no-error-icon
                outlined
                :rules="[
                  val => !!val || '*Podcast name is required'
                ]"
                text-color="white"
                type="text"
              />
            </div>
          </div>
          <div>
            <div class="flex flex-col items-start">
              <label
                class="label ml-6"
                for="hostName"
              >Host name</label>
              <span class="text-hint ml-6">If you have multiple hosts, please separate them with a comma.</span>
            </div>
            <div class="">
              <q-input
                id="hostName"
                v-model="store.hostName"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="hostName"
                no-error-icon
                outlined
                :rules="[
                  val => !!val || '*Host name is required'
                ]"
                text-color="white"
                type="text"
              />
            </div>
          </div>
          <div>
            <div class="flex flex-col items-start">
              <label
                class="label ml-6"
                for="businessName"
              >Business name</label>
            </div>
            <div class="">
              <q-input
                id="businessName"
                v-model="store.businessName"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="businessName"
                no-error-icon
                outlined
                :rules="[
                  val => !!val || '*Business name is required'
                ]"
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="col-span-4 flex flex-col justify-center items-center">
          <div id="podcastCover">
            <DropZone @files-dropped="addImages">
              <template #default="{ dropZoneActive }">
                <div
                  class="column items-center"
                  :class="{ 'light-dimmed': dropZoneActive }"
                >
                  <div class="text-center">
                    <q-avatar
                      v-if="!store.folderFileUrl"
                      color="dark"
                      size="150px"
                    >
                      <div class="flex flex-col justify-center items-center">
                        <q-icon
                          color="hint"
                          :name="biPlus"
                          size="100px"
                          @click="pickFile"
                        />
                        <span class="text-base text-hint">Add cover</span>
                      </div>
                    </q-avatar>
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
        <div class="col-span-12 justify-center">
          <AppButton
            color="accent-custom"
            :disabled="!isValid"
            hoverColor="white"
            label="Create folder "
            no-caps
            padding="4px 32px"
            rounded
            @click="step = 'two'"
          />
        </div>
      </q-form>
    </div>
  </div>
  <AppCard
    v-if="false && step === 'one'"
    :border="false"
    inner-size="xl"
    size="xl"
    style="min-width: 770px !important; width: 100%; max-height: 90vh !important;"
    title="Create New Folder"
  >
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
              v-model="store.podcastName"
              borderless
              class="rounded-borders q-px-md custom-input text-capitalize"
              dense
              input-class="text-grey"
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
              v-model="store.hostName"
              borderless
              class="rounded-borders q-px-md custom-input text-capitalize"
              dense
              input-class="text-grey"
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
              v-model="store.businessName"
              borderless
              class="rounded-borders q-px-md custom-input text-capitalize"
              dense
              input-class="text-grey"
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
                    <q-avatar
                      v-if="!store.folderFileUrl"
                      color="grey-10"
                      size="150px"
                    >
                      <q-icon
                        :name="biUpload"
                        size="76px"
                        @click="pickFile"
                      />
                    </q-avatar>
                    <q-img
                      v-else
                      alt=""
                      height="96px"
                      :src="store.folderFileUrl"
                      style="cursor:pointer;border-radius:50%"
                      width="96px"
                      @click="pickFile"
                    >
                      <q-inner-loading :showing="loading" />
                    </q-img>
                    <div
                      class="text-grey text-13 text-weight-medium inter-bold"
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
            color="purple"
            :disabled="!isValid"
            hoverColor="white"
            label="Next"
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
      <div class="poppins-semibold text-center text-20">
        Now let’s grab social media and Website links for This Podcast.
      </div>
    </template>
    <template #body>
      <div
        class="q-gutter-y-sm"
        style="width: 100%; max-width: 500px; margin: 0 auto;"
      >
        <div class="">
          <q-input
            v-model="store.instagramLink"
            borderless
            color="purple"
            dense
            input-class="text-grey-3"
            outlined
          >
            <template #before>
              <q-icon
                color="grey"
                :name="laInstagram"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14 text-grey">
                {{ store.socialLinksPrefix.instagram }}
              </span>
            </template>
          </q-input>
        </div>
        <div class="">
          <q-input
            v-model="store.facebookLink"
            borderless
            color="purple"
            dense
            input-class="text-grey-3"
            outlined
          >
            <template #before>
              <q-icon
                color="grey"
                :name="laFacebook"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14 text-grey">
                {{ store.socialLinksPrefix.facebook }}
              </span>
            </template>
          </q-input>
        </div>
        <div class="">
          <q-input
            v-model="store.youtubeLink"
            borderless
            color="purple"
            dense
            input-class="text-grey-3"
            outlined
          >
            <template #before>
              <q-icon
                color="grey"
                :name="laYoutube"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14 text-grey">
                {{ store.socialLinksPrefix.youtube }}
              </span>
            </template>
          </q-input>
        </div>
        <div class="">
          <q-input
            v-model="store.twitterLink"
            borderless
            color="purple"
            dense
            input-class="text-grey-3"
            outlined
          >
            <template #before>
              <q-icon
                color="grey"
                :name="laTwitterSquare"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14 text-grey">
                {{ store.socialLinksPrefix.twitter }}
              </span>
            </template>
          </q-input>
        </div>
        <div class="">
          <q-input
            v-model="store.linkedinLink"
            borderless
            color="purple"
            dense
            input-class="text-grey-3"
            outlined
          >
            <template #before>
              <q-icon
                color="grey"
                :name="laLinkedin"
                size="lg" />
            </template>
            <template #prepend>
              <span class="text-14 text-grey">
                {{ store.socialLinksPrefix.linkedin }}
              </span>
            </template>
          </q-input>
        </div>
        <div class="">
          <q-input
            v-model="store.websiteLink"
            borderless
            color="purple"
            dense
            input-class="text-grey-3"
            outlined
          >
            <template #before>
              <q-icon
                color="grey"
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
        <div class="text-center text-14 text-grey">
          Please type the standard wording below:
        </div>
        <div class="">
          <q-input
            v-model="store.comments"
            autogrow
            borderless
            color="purple"
            dense
            input-class="text-grey-3"
            outlined
          />
        </div>
      </div>
      <div class="row justify-end mt-8">
        <AppButton
          color="purple"
          hoverColor="white"
          label="Create"
          :loading="store.saving"
          no-caps
          padding="4px 72px"
          rounded
          @click="createDocument"
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
  color: $grey-3;

}

.custom-input {
  width: 380px;
  border: 1px solid $grey-14 !important;
  border-radius: 5px !important;
}

.q-placeholder {
  color: $grey;
}
</style>
