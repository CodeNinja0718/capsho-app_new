<script setup>
import { ref } from 'vue'
import { saveImage } from 'src/services/firebase/storageService'

const imgData = ref(null)
const logotype = ref(null)

function previewImage (event) {
  imgData.value = event.target.files[0]
  saveImage(imgData.value)
}

function selectImage () {
  logotype.value.click()
}
</script>

<template>
  <div class="flex flex-row items-center">
    <button
      class="text-left font-body font-bold text-primaryDark"
      @click="selectImage"
    >
      Upload brand logo
    </button>
    <span
      v-if="imgData"
      class="ml-4"
    >{{ imgData.name }}</span>
    <input
      ref="logotype"
      accept="image/*"
      class="hidden"
      type="file"
      @change="previewImage"
    >
  </div>
</template>
