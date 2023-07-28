<script setup>
  import { useAuth } from '@/composables/useAuth'

  const { authUser } = useAuth()
</script>

<template>
  <div class="py-3 px-4 text-gray-900 dark:text-white border-b">
    <span class="block text-sm">{{ authUser?.displayName }}</span>
    <span class="block text-sm font-semibold truncate">{{ authUser?.email }}</span>
  </div>
</template>
