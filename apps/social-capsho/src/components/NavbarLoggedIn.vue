<script setup>
  import AppLogo from './AppLogo.vue'
  import DropdownMenu from './DropdownMenu.vue'
</script>

<template>
  <div class="container">
    <nav class="flex flex-row items-center">
      <!-- Logo -->
      <div class="flex flex-shrink-0 justify-center">
        <AppLogo />
      </div>
      <!-- Dropdown menu -->
      <DropdownMenu />
    </nav>
  </div>
</template>
