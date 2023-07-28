<script setup>
  import { useBrandLogo } from "../../../composables/useBrandLogo"

  const { selectImage, error, imgData, handleSelectedImage, logotype } = useBrandLogo()
</script>

<template>
  <div class="flex flex-row items-center py-4">
    <button
      class="text-left font-body font-bold text-primaryDark"
      @click="selectImage"
    >
      Upload brand logo
    </button>
    <span
      v-if="error"
      class="ml-4"
    >
      {{ error.message }}
    </span>
    <span
      v-if="imgData"
      class="ml-4"
    >
      {{ imgData.name }}
    </span>
    <input
      ref="logotype"
      type="file"
      accept="image/*"
      class="hidden"
      data-testid="brand-logo-file-input"
      @change="handleSelectedImage"
    >
  </div>
</template>
