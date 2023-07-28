<template>
  <q-avatar :size="size">
    <q-img
      v-if="businessLogoURL"
      alt="User's business avatar"
      :src="businessLogoURL"
    />
    <q-icon
      v-else
      color="grey-9"
      :name="farCircleUser"
    />
  </q-avatar>
</template>

<script setup lang="ts">
import { farCircleUser } from '@quasar/extras/fontawesome-v6'
import { useAuthStore } from 'src/stores/auth-store'
import { computed } from 'vue'

const authStore = useAuthStore()
const businessLogoURL = computed<string | null>(() => authStore.user?.businessLogoURL ?? '')
defineProps({
  size: {
    type: String,
    required: false
  }
})
</script>

<style scoped>

</style>
