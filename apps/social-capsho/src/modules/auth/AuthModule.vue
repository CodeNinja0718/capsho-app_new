<template>
  <div class="flex items-center min-h-screen py-8 bg-gradient-to-r from-backgroundGradient to-white">
    <div class="container">
      <div class="flex flex-col bg-white shadow rounded-2xl w-full lg:w-2/3 py-10 px-10 mx-auto">
        <div class="pb-10">
          <AppLogo />
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppLogo from '@/components/AppLogo.vue'
</script>
