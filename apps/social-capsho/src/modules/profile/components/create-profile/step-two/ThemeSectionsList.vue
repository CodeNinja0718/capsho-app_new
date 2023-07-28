<script setup>
  import MultiImageSlides from './MultiImageSlides.vue'

  import { useThemes } from '../../../composables/useThemes'

  const { previousPage, nextPage } = useThemes()
</script>

<template>
  <div class="flex flex-row justify-start">
    <span class="font-heading text-2xl">Choose your content themes: (up to 5)</span>
  </div>
  <div class="flex flex-row justify-between items-center">
    <button
      class="rounded-full bg-primaryLight font-bold text-primaryDark py-2 px-2 h-10 w-12"
      @click="previousPage"
    >
      <img
        src="../../../assets/icons/chevron-left.png"
        class="w-full h-full"
      >
    </button>
    <MultiImageSlides />
    <button
      class="rounded-full bg-primaryLight font-bold text-primaryDark py-2 px-2 h-10 w-12"
      @click="nextPage()"
    >
      <img
        src="../../../assets/icons/chevron-right.png"
        class="w-full h-full"
      >
    </button>
  </div>
</template>
