<script setup lang="ts">
import { mdiAccountCircle } from '@quasar/extras/mdi-v6'
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

<template>
  <q-avatar :size="size">
    <q-img
      v-if="businessLogoURL"
      alt="User's business avatar"
      :src="businessLogoURL"
    />
    <q-icon
      v-else
      color="grey-3"
      :name="mdiAccountCircle"
    />
  </q-avatar>
</template>
