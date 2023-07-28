<script setup lang="ts">
import { QFile } from 'quasar'
import { UploadableImage } from 'src/models/uploadableFile'
import { ref, computed } from 'vue'
import { saveImageBlock } from 'src/services/firebase/storageService'
import { useNotification } from 'src/composables/useNotification'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { biChevronLeft, biPlus } from '@quasar/extras/bootstrap-icons'
import { useRoute } from 'vue-router'

const route = useRoute()
const uploadPodcastStore = useUploadPodcastStore()

const imageUploader = ref<QFile | null>(null)
const imageTab = ref('upload-image')
const uploadingImage = ref<UploadableImage | null>(null)
const imagePreview = ref<string>('')
const notReadyAlert = ref<boolean>(false)

const contentList = computed(() => {
  return uploadPodcastStore.contentList
})
const image = computed({
  get () {
    return null as unknown as File
  },
  set (value: File) {
    const reader = new FileReader()
    reader.onload = e => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(value)
    uploadingImage.value = new UploadableImage(value)
  }
})
const uploadedImages = computed(() => uploadPodcastStore.image?.choices)

function choosePicture() {
  imageUploader.value?.pickFiles()
}
function uploadImage() {
  if (uploadingImage.value) {
    saveImageBlock(uploadingImage.value).then((url) => {
      if (url) {
        uploadPodcastStore.addImageToBlock(url, route.query.episode as string)
      }
    })
  }
}
function onRejected () {
  const { triggerWarning } = useNotification()
  const errorMessage = {
    message: 'Oops! You’ve uploaded a file that isn’t an image.',
    caption: 'Please upload an image file for your logo.'
  }
  triggerWarning(errorMessage.message, true, errorMessage.caption)
}
function onDragStart(event: DragEvent, snippet: string) {
  event?.dataTransfer?.setData('text/html', snippet)
}
</script>

<template>
  <div class="full-width">
    <div class="flex items-center gap-2 cursor-pointer text-hint mb-4">
      <q-icon :name="biChevronLeft" />
      <span class="font-semibold">Back</span>
    </div>
    <q-file
      ref="imageUploader"
      v-model="image"
      accept=".jpg, image/*"
      class="hidden"
      max-files="1"
      @rejected="onRejected"
    />
    <template
      v-for="(category, index) in contentList"
      :key="index"
    >
      <q-expansion-item v-if="category.label === 'Image'"
      >
        <template #header>
          <span class="w-full flex items-center text-lg font-semibold">{{ category.label }}</span>
        </template>
        <div class="image-panel">
          <div class="shows-search">
            <q-icon
              name="search"
              size="md"></q-icon>
            <input
              class="search-input"
              type="text">
          </div>
          <q-card class="image-panel-card">
            <q-tabs
              v-model="imageTab"
              active-color="primary"
              align="justify"
              class="tab-tab text-white"
              dense
              indicator-color="transparent"
            >
              <q-tab
                label="Upload"
                name="upload-image"
                style="width: 50%;" />
            </q-tabs>

            <q-tab-panels
              v-model="imageTab"
              animated
              class="tab-panel text-white"
            >
              <q-tab-panel name="upload-image">
                <div class="grid grid-cols-3 gap-4">
                  <div
                    v-for="(uploadImage, id) in uploadedImages"
                    :key="id"
                    class="rounded-xl flex justify-center items-center img-img"
                  >
                    <q-img
                      class="overflow-hidden my-2"
                      :src="uploadImage"
                      style="cursor: pointer;"
                    />
                  </div>
                  <div
                    class="rounded-xl flex justify-center items-center img-img"
                    @click="choosePicture"
                  >
                    <span
                      v-if="!imagePreview"
                      class="placeholder cursor-pointer"
                    >Add Image</span>
                    <q-img
                      v-else
                      class="overflow-hidden my-2"
                      :src="imagePreview"
                      style="cursor: pointer;"
                    />
                  </div>
                </div>
                <q-btn
                  class="block mx-auto mt-[25px]"
                  color="accent"
                  :disable="!imagePreview"
                  @click="uploadImage">Upload</q-btn>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </q-expansion-item>
      <q-expansion-item
        v-else
        @click="(category.label === 'Blog Listicle Title' || category.label === 'Blog Conclusion') ? notReadyAlert = true : () => {}"
      >
        <template #header>
          <span class="w-full flex items-center text-lg font-semibold">{{ category.label }}</span>
        </template>
        <q-item
          v-for="(item, subId) in category.choices"
          v-bind:key="subId"
          v-ripple
          class=""
          dense
          draggable="true"
          @dragstart="onDragStart($event, item)"
        >
          <q-item-section v-if="item">
            <div class="w-full">
              <div class="w-11/12 flex items-center justify-between bg-light-darkish text-white mb-2 px-3 py-2 rounded-md cursor-pointer relative">
                <span
                  class="line-clamp-1"
                  v-html="item"
                />
                <q-icon name="las la-equals">
                  <q-tooltip
                    anchor="bottom middle"
                    class="q-ma-md"
                    max-width="60%"
                    self="top middle"
                    transition-hide="scale"
                    transition-show="scale"
                  >
                    <p
                      class="text-lg q-pa-md"
                      v-html="item" />
                  </q-tooltip>
                </q-icon>
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </template>
    <q-dialog v-model="notReadyAlert">
      <div>
        <div class="w-[350px] lg:w-[470px] xl:w-[576px] max-h-full px-8 lg:px-16 py-10 lg:py-8 bg-dark flex flex-col justify-center items-center gap-8 rounded-3xl border-accent border-2 border-solid relative">
          <q-icon
            class="absolute right-5 top-5 cursor-pointer"
            color="white"
            :name="biPlus"
            size="36px"
            style="rotate: 45deg"
            @click="notReadyAlert = false"
          />
          <h4 class="w-full text-2xl font-bold">Your Blog Title and Blog Conclusion drafts aren’t ready yet. Here’s why 👇</h4>
          <p class="w-full text-2xl">We want to make sure your title and conclusion reflect the body of your blog post. So once you’re done editing, click the ‘Generate Title & Conclusion’ button to view your options!</p>
          <p class="w-full text-2xl font-bold my-8 text-accent">Finished with all your blog post edits?</p>
          <p class="w-full text-2xl text-accent">We only generate blog titles and conclusion drafts once for each blog post so if you’re ready, click the button below to see them!</p>
          <div class="w-full flex justify-center">
            <q-btn
              color="accent"
              label="Yep I’m ready for my Title & Conclusion"
              no-caps
              rounded
              size="md"
              @click="notReadyAlert = false"
            />
          </div>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<style lang="scss">
.image-panel{
  .q-dialog__inner{
    flex-direction: column;
  }
  .q-dialog__backdrop{
    background: transparent !important;
  }
  .fixed-left, .absolute-left{
    top: 250px;
    left: 100px;
  }
  .tab-tab{
    .q-tab--active{
      background: #6a6a6a;
      color: white !important;
    }
  }
}
</style>
<style scoped lang="scss">
@import "src/css/quasar.variables.scss";
.image-panel{
  .shows-search{
    font-size: 15px;
    width: 85%;
    margin: auto;
    .search-input{
      margin-left: 10px;
      margin-bottom: 8px;
      border-radius: 30px;
      width: calc(100% - 42px);
      font-family: 'Lexend', serif;
      outline: none;
      padding: 4px 10px;
      color: white;
      background-color: $secondary-dark;
      border: 3px solid transparent;
      transition: 0.2s;
      &:focus{
        border: 3px solid $accent;
      }
    }
  }
  .image-panel-card{
    width: 85%;
    margin: auto;
    padding: 0;
    font-family: 'Lexend', serif;
    min-height: 300px;
    border-radius: 30px;
    // box-shadow: none;
    background-color: $secondary-dark;
    color: white;
    .tab-tab{
      min-height: 50px;
      color: white;
    }
    .tab-panel{
      background: $secondary-dark;
      .img-img{
        border-radius: 16px;
      }
    }
  }
}

.snippet:active {
  cursor: grabbing;
}
</style>
