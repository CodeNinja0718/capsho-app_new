<script setup lang="ts">
import ContentSnippetsDraggable from 'src/modules/podcast/components/content-snippets/ContentSnippetsDraggable.vue'
import OutputEpisodeDraftsDrawer from 'src/modules/podcast/components/OutputEpisodeDraftsDrawer.vue'
import ShareTemplateDialog from 'src/modules/podcast/components/ShareTemplateDialog.vue'
import blogPostTab from 'src/modules/podcast/components/OutputDraftsTabBlogPost.vue'
import captionLinkedinTab from 'src/modules/podcast/components/OutputDraftsTabCaptionLinkedIn.vue'
import captionSocialTab from 'src/modules/podcast/components/OutputDraftsTabCaptionSocial.vue'
import captionTiktokTab from 'src/modules/podcast/components/OutputDraftsTabCaptionTikTok.vue'
import captionTwitterTab from 'src/modules/podcast/components/OutputDraftsTabCaptionTwitter.vue'
import emailTab from 'src/modules/podcast/components/OutputDraftsTabEmail.vue'
import guestAssets from 'src/modules/podcast/components/OutputDraftsTabGuestAssets.vue'
import linkedinArticleTab from 'src/modules/podcast/components/OutputDraftsTabLinkedInArticle.vue'
import potentQuotablesTab from 'src/modules/podcast/components/OutputDraftsTabPotentQuotables.vue'
import showNotesTab from 'src/modules/podcast/components/OutputDraftsTabShowNotes.vue'
import titleTab from 'src/modules/podcast/components/OutputDraftsTabTitleAndDescription.vue'
import transcriptTab from 'src/modules/podcast/components/OutputDraftsTabTranscript.vue'
import youtubeTab from 'src/modules/podcast/components/OutputDraftsTabYouTubeDescription.vue'
import DownloadFile from '../components/DownloadHostAssets.vue'

import { markRaw, ref, onMounted, computed, Raw } from 'vue'
import { mdiCloudCheckOutline, mdiCloudSyncOutline } from '@quasar/extras/mdi-v6'

import { useContentFiller } from 'src/composables/useContentFiller'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { OutputEpisodeDraftsTabs } from 'src/stores/upload-podcast-state-types'
import { biPlus } from '@quasar/extras/bootstrap-icons'
import { QFile } from 'quasar'
import { ImageFile, UploadableImage } from 'src/models/uploadableFile'
import { saveImageForTemplate, uploadFileToStorage } from 'src/services/firebase/storageService'

const uploadPodcastStore = useUploadPodcastStore()
const templatesStore = useTemplatesStore()
const { setContentChooser } = useContentFiller()

const currentTab = ref<
  Raw<typeof titleTab | typeof showNotesTab | typeof emailTab | typeof transcriptTab | typeof blogPostTab | typeof youtubeTab | typeof linkedinArticleTab | typeof potentQuotablesTab | typeof captionSocialTab | typeof captionLinkedinTab | typeof captionTiktokTab | typeof captionTwitterTab | typeof guestAssets>
>(markRaw(titleTab))
const shareTemplatePrompt = ref<boolean>(false)
const shareList = ref<Array<{ title: string, click:() => void }>>([
  {
    title: 'Download',
    click: () => {
      console.log('--')
    }
  },
  {
    title: 'Save layout as template',
    click: openSaveLayoutPropmpt
  },
  {
    title: 'Share template',
    click: () => {
      shareTemplatePrompt.value = true
    }
  }
])
const saveLayoutPrompt = ref<boolean>(false)
const confirmSaveLayout = ref<boolean>(false)
const templateName = ref<string>()
const openedDropdown = ref<boolean>(false)
const coverImage = ref<ImageFile>()
const coverImageUploader = ref<QFile>()
const coverImagePreview = ref<string>('')

const showContentSnippets = computed(() => uploadPodcastStore.showContentSnippets)
const savingIcon = computed(() => {
  return uploadPodcastStore.savingPodcast ? mdiCloudSyncOutline : mdiCloudCheckOutline
})
const coverImageModel = computed<File>({
  get() {
    return coverImage.value as unknown as File
  },
  set(val: File) {
    const reader = new FileReader()
    reader.onload = e => {
      coverImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(val)
    coverImage.value = new UploadableImage(val)
  }
})

const showDownloadDialog = ref(false)

function changeTab (tab: OutputEpisodeDraftsTabs) {
  if (currentTab.value === lookUpTabs(tab)) return
  uploadPodcastStore.changingTab = true
  if (
    [
      'Title & Description',
      'Podcast Website Content',
      'Email',
      'Blog Post(Listicle)',
      'Blog Post(How-to)',
      'Blog Post(Q & A)',
      'YouTube Description',
      'LinkedIn Article'
    ].includes(tab)
  ) {
    setContentChooser(tab)
  } else {
    setContentChooser('')
  }
  function lookUpTabs (_tab: OutputEpisodeDraftsTabs) {
    switch (_tab) {
    case 'Title & Description':
      return markRaw(titleTab)
    case 'Podcast Website Content':
      return markRaw(showNotesTab)
    case 'Email':
      return markRaw(emailTab)
    case 'Transcript':
      return markRaw(transcriptTab)
    case 'Blog Post(Listicle)':
    case 'Blog Post(How-to)':
    case 'Blog Post(Q & A)':
      return markRaw(blogPostTab)
    case 'YouTube Description':
      return markRaw(youtubeTab)
    case 'LinkedIn Article':
      return markRaw(linkedinArticleTab)
    case 'Potent Quotables':
      return markRaw(potentQuotablesTab)
    case 'Facebook/Instagram':
      return markRaw(captionSocialTab)
    case 'LinkedIn':
      return markRaw(captionLinkedinTab)
    case 'TikTok':
      return markRaw(captionTiktokTab)
    case 'Twitter':
      return markRaw(captionTwitterTab)
    case 'guestAssets':
      return markRaw(guestAssets)
    default:
      return markRaw(titleTab)
    }
  }
  uploadPodcastStore.outputEpisodeTab = tab
  currentTab.value = lookUpTabs(tab)
  uploadPodcastStore.changingTab = false
}
function openSaveLayoutPropmpt() {
  saveLayoutPrompt.value = true
}
async function saveLayout() {
  let coverImageUrl = ''
  console.log(coverImage.value)
  if (coverImage.value) {
    coverImageUrl = (await saveImageForTemplate(coverImage.value as ImageFile) || '')
  }
  const layout = uploadPodcastStore.currentTemplateLayout
  const normalTab = normalizeTab(uploadPodcastStore.outputEpisodeTab)
  // uploadPodcastStore.$fbServices.saveCapshoTemplate({
  //   guestLayout: layout,
  //   title: 'Capsho Long Form Description',
  //   type: normalTab
  // }, 'Rxdc2RZ30CiTYPQ0Mdqx')
  templatesStore.addTemplate({
    layout: layout as {
      content: {
        attrs: {
            label: string;
            type: 'draggableBlock' | string;
        };
      }[];
      type: 'doc';
    },
    guestLayout: layout,
    coverImage: coverImageUrl,
    type: normalTab,
    title: templateName.value || ''
  }).then(() => {
  console.log('Then')
    templatesStore.fetchAllTemplates()
  })

  function normalizeTab(tab = uploadPodcastStore.outputEpisodeTab) {
    let layoutName = 'default'
    if (!tab) {
      return `${layoutName}Layout` as `${'description' | 'showNotes' | 'email' | 'Blog Post(Listicle)' | 'Blog Post(How-to)' | 'Blog Post(Q & A)' | 'ytDescription' | 'laArticle' | 'default'}Layout`
    }
    if (tab === 'Title & Description') {
      layoutName = 'description'
    } else if (tab === 'Podcast Website Content') {
      layoutName = 'showNotes'
    } else if (tab === 'Email') {
      layoutName = 'email'
    } else if (tab === 'Blog Post(Listicle)') {
      layoutName = 'Blog Post(Listicle)'
    } else if (tab === 'Blog Post(How-to)') {
      layoutName = 'Blog Post(How-to)'
    } else if (tab === 'Blog Post(Q & A)') {
      layoutName = 'Blog Post(Q & A)'
    } else if (tab === 'LinkedIn Article') {
      layoutName = 'laArticle'
    } else if (tab === 'YouTube Description') {
      layoutName = 'ytDescription'
    }
    return `${layoutName}Layout` as `${'description' | 'showNotes' | 'email' | 'Blog Post(Listicle)' | 'Blog Post(How-to)' | 'Blog Post(Q & A)' | 'ytDescription' | 'laArticle' | 'default'}Layout`
  }
}
function pickFile () {
  coverImage.value = {} as ImageFile
  coverImageUploader.value?.pickFiles()
}

onMounted(() => {
  uploadPodcastStore.$fbServices.isHostInTheList()
  setContentChooser('Title & Description')
  templatesStore.fetchAllTemplates()
})
</script>

<template>
  <q-layout class="flex">
    <OutputEpisodeDraftsDrawer @switchTab="changeTab"/>
    <div class="ml-16 window-height grow shrink pt-20 overflow-auto">
      <div class="grid grid-cols-12 items-start">
        <div
          v-if="!uploadPodcastStore.changingTab && showContentSnippets"
          class="col-span-1"
        />
        <div
          v-if="!uploadPodcastStore.changingTab && showContentSnippets"
          class="col-span-3"
        >
          <ContentSnippetsDraggable />
        </div>
        <div :class="(!uploadPodcastStore.changingTab && showContentSnippets) ? 'col-span-7' : 'col-span-12'">
          <div
            v-if="showContentSnippets"
            class="flex justify-between items-center mb-10 px-10"
          >
            <h3 class="text-3xl mb-0">{{ uploadPodcastStore.blogPostCht }} {{ uploadPodcastStore.outputEpisodeTab }}</h3>
            <q-space />
            <div
              v-if="uploadPodcastStore.contentList.length > 0"
              class="row no-wrap q-gutter-x-sm">
              <div>
                <transition
                  mode="out-in"
                  name="fade"
                >
                  <q-icon
                    :name="savingIcon"
                    size="md"
                    style="color: #525252;"
                  />
                </transition>
              </div>
              <div class="rounded-3xl relative">
                <q-btn
                  color="accent w-[130px] z-20"
                  dense
                  label="Share"
                  no-caps
                  padding="4px 0"
                  rounded
                  @click="openedDropdown = !openedDropdown"
                />
                <div
                  v-if="openedDropdown"
                  class="absolute top-0 left-0 w-full z-10 rounded-3xl overflow-hidden border-2 border-accent border-solid"
                >
                  <div
                    class="flex justify-center items-center w-full break-words text-center leading-none py-2 bg-black"
                    style="height: 30px"
                  />
                  <div
                    v-for="(share, idx) in shareList"
                    :key="idx"
                    class="flex justify-center items-center w-full min-h-[24px] break-words text-center leading-none py-2"
                    :class="idx % 2 === 0 ? 'bg-darkish' : 'bg-black'"
                    @click="share.click"
                  >
                    <span>{{ share.title }}</span>
                  </div>
                </div>
              </div>
              <!-- <q-btn
                class="menu-button"
                color="accent"
                dense
                label="Share"
                no-caps
                padding="4px 20px"
              >
                <q-menu class="menu">
                  <q-list
                    class="menu-list"
                    dense
                    style="max-width: 118px"
                  >
                    <q-item
                      v-close-popup
                      clickable
                      @click="showDownloadDialog = true">
                      <q-item-section>Download</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      class="menu-item"
                      clickable
                      @click="saveLayout"
                    >
                      <q-item-section class="menu-item-section">Save layout as template</q-item-section>
                    </q-item>
                    <q-item
                      v-close-popup
                      class="menu-item"
                      clickable
                      @click="shareTemplatePropmt = true"
                    >
                      <q-item-section class="menu-item-section">Share template</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn> -->
              <q-dialog
                v-model="saveLayoutPrompt"
                @hide="coverImagePreview = ''"
              >
                <div>
                  <div class="w-[240px] md:w-[360px] lg:w-[540px] xl:w-[640px] rounded-3xl border-accent border-2 border-solid px-8 py-6 flex flex-col bg-dark relative">
                    <!-- <q-icon
                      class="absolute right-5 top-5 cursor-pointer"
                      color="white"
                      :name="biPlus"
                      size="36px"
                      style="rotate: 45deg"
                      @click="saveLayoutPrompt = false"
                    /> -->
                    <div class="grid grid-cols-12 items-center mb-6">
                      <div class="col-span-4">Template name</div>
                      <q-input
                        v-model="templateName"
                        autocomplete="off"
                        class="col-span-8 child-bg-darkish"
                        lazy-rules="ondemand"
                        no-error-icon
                        outlined
                        text-color="white"
                      />
                    </div>
                    <div class="grid grid-cols-12 items-start">
                      <div class="col-span-4">Cover Image</div>
                      <div
                        class="col-span-8 h-32 flex justify-center items-center bg-darkish rounded-[25px] overflow-hidden"
                        @click="pickFile"
                      >
                        <img
                          v-if="coverImagePreview"
                          alt=""
                          class="w-max-full"
                          :src="coverImagePreview"
                        />
                        <template v-else>
                          <q-icon
                            color="white"
                            :name="biPlus"
                            size="80px"
                          />
                          <span class="text-2xl">Add Image</span>
                        </template>
                      </div>
                      <q-file
                        ref="coverImageUploader"
                        v-model="coverImageModel"
                        accept=".jpg, image/*"
                        class="hidden"
                        max-files="1"
                      />
                    </div>
                    <div class="grid grid-cols-12 items-start">
                      <div class="col-span-4" />
                      <div class="col-span-8">
                        <q-checkbox v-model="confirmSaveLayout"/>
                        <span>Save as your default template for this element.</span>
                      </div>
                    </div>
                    <div class="flex justify-end">
                      <q-btn
                        color="accent"
                        :disable="!confirmSaveLayout"
                        label="Save"
                        no-caps
                        rounded
                        @click="saveLayout()"
                      />
                    </div>
                  </div>
                </div>
              </q-dialog>
            </div>
          </div>
          <component
            :is="currentTab"
            @switchTab="changeTab"
          />
          <q-dialog v-model="shareTemplatePrompt">
            <ShareTemplateDialog />
          </q-dialog>
          <q-dialog
            v-model="showDownloadDialog"
            position="top"
            seamless>
            <download-file />
          </q-dialog>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<!-- <style lang="scss">
.menu-button {
  margin-left: 20px;
  border-radius: 20px;
  z-index: 50;
  min-width: 120px !important;
  font-family: "Lexend";
}
.menu{
  border-radius: 15px;
  z-index: 10;
  top: 105px !important;
  border: 2px solid $accent;
  background-color: $secondary-dark;
  .menu-list{
    margin-top: 24px;
    margin-bottom: 4px;
    .menu-item{
      &:hover{
        background-color: $dark;
      }
      .menu-item-section{
        font-family: 'Lexend' !important;
        font-size: 11px;
        padding: 3px 0;
      }
    }
  }
}
</style> -->
