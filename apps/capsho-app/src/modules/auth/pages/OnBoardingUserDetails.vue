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
  <q-page
    class="q-py-sm-sm"
    :class="{'bg-primary-light-blue': $q.screen.lt.sm }">
    <div class="curtain lt-sm fixed full-width fixed-top-right bg-accent"></div>
    <div class="q-pb-lg q-py-sm-sm column justify-center full-width q-gutter-y-lg">
      <div class="text-center q-mt-sm-xl col-4">
        <BrandLogo
          v-if="authStore.onBoarding !== 'businessLinks'"
          :color="$q.screen.lt.sm ? 'white': 'purple'"
          size="lg"/>
      </div>
      <div class="col-8">
        <div v-if="authStore.onBoarding === 'userDetails'">
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
      </div>
    </div>
  </q-page>
</template>
