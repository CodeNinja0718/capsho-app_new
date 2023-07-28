<script setup lang="ts">
import BrandLogo from 'components/BrandLogo.vue'

// Desktop component
import DesktopVerifyEmailPasswordCard from 'src/modules/auth/components/desktop/DesktopVerifyEmailPasswordCard.vue'

// Mobile component
import MobileVerifyEmail from 'src/modules/auth/components/mobile/MobileVerifyEmail.vue'

import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
</script>

<template>
  <q-page-container>
    <q-page class="full-height flex flex-col justify-center items-center px-4 py-8 lexend-regular">
      <brand-logo size="xl" />
      <DesktopVerifyEmailPasswordCard
        v-if="$q.screen.gt.xs"
        :email="authStore.email" />
      <MobileVerifyEmail
        v-else
        :email="authStore.email" />
    </q-page>
  </q-page-container>
</template>

<style scoped lang="scss">
.outer {
  width: 100%;
  margin: 0 auto;
}

.auth-card {
  border-radius: 0;
  width: 100%;
  background-color: $secondary-dark;
}

.bg-verification {
  background-image: url(/src/assets/auth-background.jpg);
  background-size: 117% 106%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: $dark;

  @media screen and (min-width: 1000px) {
    background-size: 107% 88%;
  }
  @media screen and (min-width: 1400px) {
    background-size: 102% 83%;
  }
  @media screen and (min-width: 1700px) {
    background-size: 85% 89%;
  }
}
</style>
