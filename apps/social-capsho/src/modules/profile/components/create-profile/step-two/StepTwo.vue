<script setup>
  import ThemeSectionsList from './ThemeSectionsList.vue'
  import SelectedThemesList from './SelectedThemesList.vue'
  import CreateProfilePagination from '../CreateProfilePagination.vue'
</script>

<template>
  <div class="bg-white rounded-2xl shadow px-10 py-10">
    <div class="flex flex-col">
      <ThemeSectionsList />
      <SelectedThemesList />
      <CreateProfilePagination />
    </div>
  </div>
</template>
