<script setup>
  import { useThemes } from '../../../composables/useThemes'

  const { selectedThemes, themesPage, themeSections, unselectTheme } = useThemes()
</script>

<template>
  <div class="flex flex-col">
    <span class="font-body">{{ (themesPage/themeSections) + 1 }}/{{ themeSections }}</span>
    <span class="font-body text-lg text-left pb-4">Selected: (click to remove)</span>
    <div class="flex flex-row">
      <button
        v-for="(theme, i) in selectedThemes"
        :key="i"
        class="rounded-full border border-primaryDark font-number text-primaryDark py-2 px-4 mx-2 my-2 bg-white"
        @click="unselectTheme(i)"
      >
        <span class="mx-4 capitalize">{{ theme.name }}</span>
      </button>
    </div>
  </div>
</template>
