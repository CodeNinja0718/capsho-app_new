<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useQuasar } from 'quasar'
const authStore = useAuthStore()
const $q = useQuasar()
onMounted(() => {
  $q.dark.set(authStore.darkMode)
})
</script>
