<script setup lang="ts">
import { computed, onBeforeUnmount, ref, onMounted, VNode } from 'vue'
import AppButton from 'components/base/AppButton.vue'
import DropZone from 'src/components/DropZone.vue'
import { laFacebook, laInstagram, laLinkedin, laLinkSolid, laTwitterSquare, laYoutube } from '@quasar/extras/line-awesome'
import { useFileList } from 'src/composables/fileList'
import { QFile } from 'quasar'
import { ImageFile, UploadableImage } from 'src/models/uploadableFile'
import { useFolderStore } from 'src/stores/folder-store'
import { saveImageForFolder } from 'src/services/firebase/storageService'
import Motivational from 'src/assets/voicetones/motivational.svg'
import MotivationalWhite from 'src/assets/voicetones/motivational-white.svg'
import Informative1 from 'src/assets/voicetones/informative1.svg'
import Informative1White from 'src/assets/voicetones/informative1-white.svg'
import Caring1 from 'src/assets/voicetones/caring1.svg'
import Caring1White from 'src/assets/voicetones/caring1-white.svg'
import Professional from 'src/assets/voicetones/professional.svg'
import ProfessionalWhite from 'src/assets/voicetones/professional-white.svg'
import Joyful from 'src/assets/voicetones/joyful.svg'
import JoyfulWhite from 'src/assets/voicetones/joyful-white.svg'
import Informative2 from 'src/assets/voicetones/informative2.svg'
import Informative2White from 'src/assets/voicetones/informative2-white.svg'
import Caring2 from 'src/assets/voicetones/caring2.svg'
import Caring2White from 'src/assets/voicetones/caring2-white.svg'
import Quirky from 'src/assets/voicetones/quirky.svg'
import QuirkyWhite from 'src/assets/voicetones/quirky-white.svg'
import facebookWhite from 'src/assets/social-icons/facebook-white.svg'
import twitterWhite from 'src/assets/social-icons/twitter-white.svg'
import instagramWhite from 'src/assets/social-icons/instagram-white.svg'
import youtubeWhite from 'src/assets/social-icons/youtube-white.svg'
import linkedinWhite from 'src/assets/social-icons/linkedin-white.svg'
import websiteWhite from 'src/assets/social-icons/website-white.svg'

const emit = defineEmits(['onCreated'])
const { addImages, filterImageType, onRejected } = useFileList()
const store = useFolderStore()
const folderImageUploader = ref<QFile | null>(null)
const step = ref<'createfolder' | 'voicetone' | 'socials' | ''>('')
const loading = ref(false)

const voiceToneOptions = ref<Array<{ title: string, icon: VNode, activeIcon: VNode, words: string[] }>>([
  { title: 'Motivational', icon: Motivational, activeIcon: MotivationalWhite, words: ['encouroging', 'reassuring', 'passionate', 'inspiring', 'emotive'] },
  { title: 'Informative', icon: Informative1, activeIcon: Informative1White, words: ['matter-of-fact', 'straightforward', 'frank', 'focused on knowledge'] },
  { title: 'Caring', icon: Caring1, activeIcon: Caring1White, words: ['intimate', 'soft', 'empathetic', 'gentle'] },
  { title: 'Professional', icon: Professional, activeIcon: ProfessionalWhite, words: ['clear', 'thorough', 'respectful(no slang)'] },
  { title: 'Joyful', icon: Joyful, activeIcon: JoyfulWhite, words: ['exuberant', 'positive', 'ethusiastic'] },
  { title: 'Informative', icon: Informative2, activeIcon: Informative2White, words: ['friendly', 'laid-back', 'casual', 'informal', 'personable'] },
  { title: 'Caring', icon: Caring2, activeIcon: Caring2White, words: ['cool', 'chill', 'experimental'] },
  { title: 'Quirky', icon: Quirky, activeIcon: QuirkyWhite, words: ['playful', 'eccentric', 'out-of-the-box'] }
])
const activeVoiceToneIndex = ref<number>(0)

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

onMounted(() => {
  step.value = 'createfolder'
})
onBeforeUnmount(() => store.partialStoreReset())
</script>

<template>
  <div
    v-if="step === 'createfolder'"
    class="w-full md:w-[476px] lg:w-[640px] xl:w-[850px] max-w-none"
  >
    <div class="rounded-[50px] w-full p-4 md:p-6 lg:p-10 xl:p-14 bg-dialog-dark border-accent border-4 border-solid">
      <h3 class="lexend-regular">Create  folder</h3>
      <q-form class="w-full grid grid-cols-12">
        <div class="col-span-8">
          <div>
            <div class="flex flex-col items-start">
              <label
                class="label ml-6 lexend-regular"
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
                class="label ml-6 lexend-regular"
                for="hostName"
              >Host name</label>
              <span class="text-hint ml-6 lexend-regular">If you have multiple hosts, please separate them with a comma.</span>
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
                class="label ml-6 lexend-regular"
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
                  <div class="text-center w-52 border-accent border-4 border-solid rounded-full">
                    <q-avatar
                      v-if="!store.folderFileUrl"
                      color="dark"
                      size="200px"
                    >
                      <div
                        class="flex flex-col justify-center items-center gap-3"
                        @click="pickFile"
                      >
                        <q-img
                          class="inline-block w-16 opacity-50"
                          src="~src/assets/icons/plus.svg"
                        />
                        <span class="text-xs text-hint lexend-regular">Add cover</span>
                      </div>
                    </q-avatar>
                    <q-img
                      v-else
                      alt=""
                      height="200px"
                      :src="store.folderFileUrl"
                      style="cursor:pointer;border-radius:50%"
                      width="200px"
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
            @click="step = 'voicetone'"
          />
        </div>
      </q-form>
    </div>
  </div>
  <div
    v-if="step === 'voicetone'"
    class="w-full md:w-[476px] lg:w-[640px] xl:w-[850px] max-w-none"
  >
    <div class="rounded-[50px] w-full p-4 md:p-6 lg:p-10 xl:p-14 bg-dialog-dark border-accent border-4 border-solid">
      <h5 class="font-semibold text-3xl lexend-regular">Select the tone of voice for this show.</h5>
      <p class="lexend-regular mb-10">While Capsho can't write exactly like you(still working on the mind reading) choosing your tone of voice will be a really helpful direction for us. </p>
      <q-form class="w-full grid grid-cols-12 gap-y-6">
        <div
          v-for="(voiceTone, id) in voiceToneOptions"
          :key="id"
          class="col-span-3 flex flex-col"
        >
          <div
            class="w-20 h-20 flex justify-center items-center border-accent border-5 border-solid rounded-[25px] cursor-pointer"
            :class="activeVoiceToneIndex === id ? 'bg-accent' : ''"
            @click="activeVoiceToneIndex = id"
          >
            <q-img
              alt="icon"
              class="w-12"
              :src="activeVoiceToneIndex === id ? voiceTone.activeIcon : voiceTone.icon"
            />
          </div>
          <span class="text-sm font-semibold lexend-regular">{{ voiceTone.title }}</span>
          <div class="flex items-center lexend-regular">
            <span
              v-for="(word, jd) in voiceTone.words"
              :key="id * jd"
              class="text-hint text-xs"
              :class="jd === 0 ? 'capitalize' : ''"
            >{{ jd === voiceTone.words.length - 1 ? `and ${word}.` : jd === 0 ? word : `, ${word}` }}</span>
          </div>
        </div>
        <div class="col-span-12 w-full flex justify-between">
          <AppButton
            color="dark"
            hoverColor="white"
            label="Back"
            no-caps
            padding="4px 32px"
            rounded
            @click="step = 'createfolder'"
          />
          <AppButton
            color="accent-custom"
            hoverColor="white"
            label="Next"
            no-caps
            padding="4px 32px"
            rounded
            @click="step = 'socials'"
          />
        </div>
      </q-form>
    </div>
  </div>
  <div
    v-if="step === 'socials'"
    class="w-full md:w-[476px] lg:w-[640px] xl:w-[850px] max-w-none"
  >
    <div class="rounded-[50px] w-full p-4 md:p-6 lg:p-10 xl:p-14 bg-darkish border-accent border-4 border-solid">
      <h5 class="lexend-regular font-semibold text-3xl">Now let’s grab social media and Website links for This Podcast.</h5>
      <p class="lexend-regular mb-10">We will prepopulate these for you on your description and podcast website content.</p>
      <q-form class="w-full grid grid-cols-2 gap-x-10 gap-y-6">
        <div class="w-full flex items-center gap-2">
          <div class="w-14 h-14 rounded-full flex justify-center items-center bg-accent">
            <q-img
              alt="icon"
              class="w-9"
              :src="facebookWhite"
            />
          </div>
          <div class="shrink grow">
            <div class="">
              <q-input
                id="facebooklink"
                v-model="store.facebookLink"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="facebooklink"
                no-error-icon
                outlined
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="w-full flex items-center gap-2">
          <div class="w-14 h-14 rounded-full flex justify-center items-center bg-accent">
            <q-img
              alt="icon"
              class="w-9"
              :src="twitterWhite"
            />
          </div>
          <div class="shrink grow">
            <div class="">
              <q-input
                id="twitterlink"
                v-model="store.twitterLink"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="twitterlink"
                no-error-icon
                outlined
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="w-full flex items-center gap-2">
          <div class="w-14 h-14 rounded-full flex justify-center items-center bg-accent">
            <q-img
              alt="icon"
              class="w-9"
              :src="instagramWhite"
            />
          </div>
          <div class="shrink grow">
            <div class="">
              <q-input
                id="instagramlink"
                v-model="store.instagramLink"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="instagramlink"
                no-error-icon
                outlined
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="w-full flex items-center gap-2">
          <div class="w-14 h-14 rounded-full flex justify-center items-center bg-accent">
            <q-img
              alt="icon"
              class="w-9"
              :src="youtubeWhite"
            />
          </div>
          <div class="shrink grow">
            <div class="">
              <q-input
                id="youtubelink"
                v-model="store.youtubeLink"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="youtubelink"
                no-error-icon
                outlined
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="w-full flex items-center gap-2">
          <div class="w-14 h-14 rounded-full flex justify-center items-center bg-accent">
            <q-img
              alt="icon"
              class="w-9"
              :src="linkedinWhite"
            />
          </div>
          <div class="shrink grow">
            <div class="">
              <q-input
                id="linkedin"
                v-model="store.linkedinLink"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="linkedin"
                no-error-icon
                outlined
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="w-full flex items-center gap-2">
          <div class="w-14 h-14 rounded-full flex justify-center items-center bg-accent">
            <q-img
              alt="icon"
              class="w-9"
              :src="websiteWhite"
            />
          </div>
          <div class="shrink grow">
            <div class="">
              <q-input
                id="websitelink"
                v-model="store.websiteLink"
                autocomplete="off"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="websitelink"
                no-error-icon
                outlined
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="col-span-2 w-full flex items-center gap-4">
          <span class="text-2xl font-semibold">
            Your standard Call to Action
            <span class="text-sm">
              (?)
              <q-tooltip
                anchor="bottom end"
                class="bg-dark rounded-lg border-accent border-2 border-solid"
                max-width="200px"
                self="top left"
              >
                <div>We will include this standard Call-To-Action wording in the description and podcast website content Capsho creates for you.</div>
              </q-tooltip>
            </span>
          </span>
          <div class="shrink grow">
            <div class="">
              <q-input
                id="standcall-to-action"
                v-model="store.comments"
                autocomplete="off"
                class="pb-0"
                color="accent"
                dark
                lazy-rules="ondemand"
                name="standcall-to-action"
                no-error-icon
                outlined
                text-color="white"
                type="text"
              />
            </div>
          </div>
        </div>
      </q-form>
      <div class="w-full flex justify-between items-center mt-6">
        <AppButton
          color="dark"
          hoverColor="white"
          label="Back"
          :loading="store.saving"
          no-caps
          padding="4px 36px"
          rounded
          @click="step = 'voicetone'"
        />
        <AppButton
          color="accent-custom"
          hoverColor="white"
          label="Create"
          :loading="store.saving"
          no-caps
          padding="4px 36px"
          rounded
          @click="createDocument"
        />
      </div>
    </div>
  </div>
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
