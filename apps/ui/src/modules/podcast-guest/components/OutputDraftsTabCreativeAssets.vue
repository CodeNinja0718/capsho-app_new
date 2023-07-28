<script setup lang="ts">
import type { CreativeAsset } from 'src/models/uploadableFile'
import { computed, ref, watchEffect } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { exportFile, useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const store = useUploadPodcastStore()

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
    }
  }
})

function downloadFile(media: CreativeAsset) {
  if (!media.src) {
    return
  }
  $q.loading.show()
  axios({
    method: 'get',
    url: media.src,
    responseType: 'arraybuffer'
  })
    .then((response) => {
      const type = media.type ? media.type.split('/')[1] : 'png'
      const fileName = 'image.' + type
      const status = exportFile(fileName, response.data)
      if (status !== true) {
        console.log('Error: ' + status)
      }
    })
    .finally(() => {
      $q.loading.hide()
    })
}
</script>

<template>
  <div class="q-py-lg q-pl-sm text-grey-3">
    <h1>Creative Assets</h1>
    <div class="row q-gutter-md">
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
                  name="download"
                  size="sm"
                  @click="downloadFile(media)"
                >
                  <q-tooltip>
                    Download
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
          <video
            v-else
            class="border-radius-6"
            controls
            controlslist="noplaybackrate"
            disablePictureInPicture
            oncontextmenu="return false;"
            width="250"
          >
            <source :src="media.src">
            <p>
              Your browser doesn't support HTML video. Here is a
              <a :href="media.src">link to the video</a> instead.
            </p>
          </video>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.2rem;
}
</style>
