<script setup lang="ts">
import DesktopAuthCard from 'src/modules/auth/components/desktop/DesktopAuthCard.vue'
import DesktopVerifyPhoneForm from 'src/modules/auth/components/desktop/DesktopVerifyPhoneForm.vue'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
</script>

<template>
  <DesktopAuthCard title="Enter Code">
    <template #actions>
      <q-btn
        color="primary"
        flat
        label="Go back"
        no-caps
        @click="authStore.onBoarding = 'userPhone'" />
    </template>
    <template #body>
      <DesktopVerifyPhoneForm />
    </template>
  </DesktopAuthCard>
</template>
