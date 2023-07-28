<script setup lang="ts">
import DesktopAuthCard from 'src/modules/auth/components/desktop/DesktopAuthCard.vue'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
defineProps({
  email: {
    type: String,
    required: true
  }
})
</script>

<template>
  <DesktopAuthCard title="Verify your email">
    <template #body>
      <div class="full-height column justify-center items-center inter-regular text-grey-7 q-gutter-y-sm">
        <div class="text-center">
          Please check your inbox (and Promotions / Spam folder)
          <br>for an email from us
        </div>
        <div>
          Click the link inside to get started
        </div>
        <div>
          <q-btn
            color="accent"
            flat
            label="Resend email"
            no-caps
            @click="authStore.verifyEmailAddress"
          />
        </div>
      </div>
    </template>
  </DesktopAuthCard>
</template>
