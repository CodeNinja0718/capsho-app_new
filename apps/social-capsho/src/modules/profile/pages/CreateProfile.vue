<script setup>
  import { onUnmounted  } from 'vue'
  import { useUser } from '@/composables/useUser'
  import VerifyEmail from '@/modules/auth/components/VerifyEmail.vue'
  import CreateProfileCard from '../components/create-profile/CreateProfileCard.vue'
  import { useSteps } from '../composables/useSteps'

  const { userData } = useUser()

  const { resetSteps } = useSteps()

  onUnmounted(resetSteps)
</script>

<template>
  <div v-if="userData">
    <div
      v-if="!userData.emailVerified"
      class="bg-gradient-to-r from-backgroundGradient to-white py-10"
    >
      <VerifyEmail class="min-h-screen" />
    </div>
    <div
      v-if="userData.emailVerified"
      class="bg-gradient-to-r from-white via-yellowBackgroundStart to-yellowBackgroundEnd min-h-screen py-10"
    >
      <CreateProfileCard />
    </div>
  </div>
</template>
