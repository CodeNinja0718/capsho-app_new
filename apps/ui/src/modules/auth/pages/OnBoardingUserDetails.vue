<script setup lang="ts">
import BrandLogo from 'components/BrandLogo.vue'
import { useAuthStore } from 'stores/auth-store'
import { onBeforeMount } from 'vue'

// Desktop components
import DesktopSignUpUserDetailsCard from 'src/modules/auth/components/desktop/DesktopSignUpUserDetailsCard.vue'
import DesktopSignUpBusinessDetailsCard from 'src/modules/auth/components/desktop/DesktopSignUpBusinessDetailsCard.vue'
import DesktopSignUpBusinessLinksCard from 'src/modules/auth/components/desktop/DesktopSignUpBusinessLinksCard.vue'

// New mobile components
import MobileOnboardingUserDetails from 'src/modules/auth/components/mobile/MobileOnboardingUserDetails.vue'
import MobileOnboardingBusinessDetails from 'src/modules/auth/components/mobile/MobileOnboardingBusinessDetails.vue'
import MobileOnboardingBusinessLinks from 'src/modules/auth/components/mobile/MobileOnboardingBusinessLinks.vue'

const authStore = useAuthStore()
onBeforeMount(() => {
  if (authStore.user.isLoggedIn) {
    authStore.authRouter('UploadPodcast')
  }
})
</script>

<template>
  <q-page-container>
    <q-page class="full-height q-py-sm-sm flex flex-col justify-center items-center">
      <brand-logo size="xl"/>
      <div
        v-if="authStore.onBoarding === 'userDetails'"
        class="w-full grid grid-cols-1 md:grid-cols-12"
      >
        <DesktopSignUpUserDetailsCard v-if="$q.screen.gt.xs"/>
        <MobileOnboardingUserDetails v-else/>
      </div>
      <div v-else-if="authStore.onBoarding === 'businessDetails'">
        <DesktopSignUpBusinessDetailsCard v-if="$q.screen.gt.xs" />
        <MobileOnboardingBusinessDetails v-else/>
      </div>
      <div v-else-if="authStore.onBoarding === 'businessLinks'">
        <DesktopSignUpBusinessLinksCard v-if="$q.screen.gt.xs"/>
        <MobileOnboardingBusinessLinks v-else/>
      </div>
    </q-page>
  </q-page-container>
</template>
