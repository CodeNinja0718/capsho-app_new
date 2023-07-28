<script setup lang="ts">
import type { CreativeAssetUploaded, CreativeAsset } from 'src/models/uploadableFile'
import useUploadFiles from 'src/composables/useUploadFiles'
import { ImageFile } from 'src/models/uploadableFile'
import { QFile } from 'quasar'
import { computed, ref, watchEffect, unref } from 'vue'
import { useFileList } from 'src/composables/fileList'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const { onRejected } = useFileList()

const store = useUploadPodcastStore()

const podcastUploader = ref<QFile | null>(null)

function pickFile () {
  store.podcastFile = {} as ImageFile
  podcastUploader.value?.pickFiles()
}

const getImageSrc = (mediaObj: CreativeAsset | File) => {
  if (Object.keys(mediaObj).length === 0) {
    return null
  }
  if (mediaObj instanceof File) {
    return URL.createObjectURL(mediaObj)
  }
  return mediaObj.isUploaded ? mediaObj.url : ''
}

const creativeAssets = computed(() => {
  return store.guestCreativeAssets
})

async function uploadAssets() {
  const { upload, uploadedFiles } = useUploadFiles()
  await upload(store.guestCreativeAssets)
  store.guestCreativeAssetsUploaded = uploadedFiles.value as unknown as CreativeAssetUploaded[]
}

async function beforeLeaving() {
  await uploadAssets()
  const timer = setTimeout(() => {
    const data = {
      guestCreativeAssets: unref(store.guestCreativeAssetsUploaded)
    }
    if (data.guestCreativeAssets && Array.isArray(data.guestCreativeAssets) && data.guestCreativeAssets.length) {
      store
        .updatePodcastEpisode(data)
    }
    clearTimeout(timer)
  }, 3500)
}

const placeholders = ref<CreativeAsset[]>([])
watchEffect(() => {
  placeholders.value = []
  for (let i = 0; i < 7; i++) {
    const media = creativeAssets.value[i]
    if (media) {
      if (media instanceof File) {
        placeholders.value.push({
          isImage: media.type.includes('image'),
          name: media.name,
          src: getImageSrc(media),
          type: media.type
        })
      } else {
        placeholders.value.push({
          isImage: media.isImage,
          name: media.name,
          src: getImageSrc(media),
          type: media.type
        })
      }
    } else {
      placeholders.value.push({
        isImage: true,
        placeholder: true,
        src: 'https://cdn.quasar.dev/img/image-src.png',
        type: 'image'
      })
    }
  }
})

const removeFile = (imageSrc: string) => {
  const image = placeholders.value.find((img) => img.src === imageSrc)
  const imgList = Array.from(store.guestCreativeAssets)
  let idx = null
  if (image) {
    idx = imgList.findIndex((file) => file.name === image.name)
  }
  if (idx !== null && idx > -1) {
    store.guestCreativeAssets.splice(idx, 1)
  }
}

const isValid = computed(() => {
  return placeholders.value.filter((img) => !img.placeholder).length >= 1
})
</script>

<template>
  <div class="q-mt-md">
    <div class="row q-gutter-md q-pl-sm">
      <div
        class="col-3"
        style="height: 135px; max-width: 240px"
      >
        <div
          class="upload-photo border-secondary text-grey-3 border-radius-6 cursor-pointer full-height full-width"
          @click="pickFile"
        >
          <div class="column justify-center full-height items-center">
            <q-icon
              name="photo_camera"
              size="md"
            />
            <div class="text-center full-width">
              Upload an image/video
            </div>
          </div>
          <q-file
            ref="podcastUploader"
            v-model="store.guestCreativeAssets"
            accept=".jpg, image/*, video/*"
            append
            class="hidden"
            item-aligned
            multiple
            @rejected="onRejected"
          />
        </div>
      </div>
      <div
        v-for="(media, idx) in placeholders"
        :key="idx"
        class="col-3"
        style="height: 135px; max-width: 240px"
      >
        <div
          v-if="media.placeholder"
          class="border-secondary border-radius-6 bg-darkish text-grey-3 full-height full-width"
        >
          <div class="column justify-center full-height items-center">
            <q-icon
              name="photo"
              size="3rem"
            />
          </div>
        </div>
        <template v-else>
          <q-img
            v-if="media.isImage"
            class="border-radius-6"
            :ratio="16/9"
            :src="media.src"
            style="max-height: 135px; max-width: 240px; width: 100%; height: auto;"
          >
            <div class="absolute absolute-bottom">
              <div class="absolute-right">
                <q-icon
                  class="all-pointer-events cursor-pointer"
                  color="white"
                  name="close"
                  size="sm"
                  @click="removeFile(media.src)"
                >
                  <q-tooltip>
                    Remove
                  </q-tooltip>
                </q-icon>
              </div>
            </div>
            <template #error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
          <q-video
            v-else
            class="border-radius-6"
            :ratio="16/9"
            :src="media.src"
          />
        </template>
      </div>
    </div>
    <div class="q-pt-lg q-pl-sm">
      <app-button
        class="text-13 poppins-medium"
        :disable="!isValid"
        label="Upload"
        no-caps
        outline
        padding="4px 25px"
        rounded
        text-color="grey-3"
        unelevated
        @click="beforeLeaving"
      />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2rem;
  text-align: center;
}
</style>
