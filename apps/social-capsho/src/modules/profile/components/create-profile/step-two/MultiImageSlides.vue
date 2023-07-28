<script setup>
  import { useThemes } from '../../../composables/useThemes'

  const { themes, themesPage, themeSections, selectTheme } = useThemes()
</script>

<template>
  <div class="grid grid-cols-3 gap-4 py-4 px-4">
    <div
      v-for="i in themeSections"
      :key="i"
    >
      <template v-if="(i + themesPage) - 1 < themes.length">
        <button
          class="flex flex-col justify-start items-center h-full rounded-2xl"
          @click="selectTheme(i)"
        >
          <span class="block flex rounded-2xl relative">
            <img
              :src="themes[(i + themesPage) - 1].img"
              class="object-cover mx-auto h-56 w-96 rounded-2xl"
              :alt="`${themes[(i + themesPage) - 1].name}`"
            >
            <span class="block absolute h-56 w-full opacity-30 bg-gradient-to-t from-primaryDark to-transparent rounded-2xl" />
          </span>
          <span class="block flex justify-start w-full">
            <span class="capitalize text-2xl text-white font-themes -mt-16 ml-5 z-50">
              {{ themes[(i + themesPage) - 1].name }}
            </span>
          </span>
        </button>
      </template>
    </div>
  </div>
</template>
