<template>
  <div>
    {{ authEmail }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'

const authStore = useAuthStore()
const authEmail = computed(() => authStore.email)
</script>

<style lang="sass" scoped>

</style>
