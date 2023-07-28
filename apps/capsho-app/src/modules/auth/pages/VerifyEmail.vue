<script setup lang="ts">
import BrandLogo from 'components/BrandLogo.vue'

// Desktop component
import DesktopVerifyEmailPasswordCard from 'src/modules/auth/components/desktop/TestDesktopVerifyEmailPasswordCard.vue'

// Mobile component
import MobileVerifyEmail from 'src/modules/auth/components/mobile/MobileVerifyEmail.vue'

import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
</script>

<template>
  <q-page
    class="q-py-sm-sm flex flex-center"
    :class="{'bg-primary-light-blue': $q.screen.lt.sm }">
    <q-header
      v-if="$q.platform.is.desktop"
      class="bg-accent q-py-lg q-mb-lg text-center"
      reveal
    >
      <BrandLogo
        color="white"
        size="sm"
      />
    </q-header>
    <div class="curtain lt-sm fixed full-width fixed-top-right bg-accent"></div>
    <div class="q-pb-lg q-py-sm-sm column justify-center full-width q-gutter-y-lg">
      <div
        v-if="$q.screen.lt.sm"
        class="text-center col-4 q-mt-sm-xl">
        <BrandLogo
          :color="$q.screen.lt.sm ? 'white': 'purple'"
          size="lg"/>
      </div>
      <div class="col-8">
        <div class="outer">
          <DesktopVerifyEmailPasswordCard
            v-if="$q.screen.gt.xs"
            :email="authStore.email" />
          <MobileVerifyEmail
            v-else
            :email="authStore.email" />
        </div>
      </div>
    </div>
    <q-footer
      v-if="$q.screen.gt.xs"
      class="column q-py-lg justify-center items-center poppins-regular bg-accent text-white"
    >
      <div class="row q-gutter-x-md text-14">
        <p><b>Terms & Conditions</b></p>
        <p><b>Privacy Policy</b></p>
      </div>
      <p class="text-12">
        Copyright 2022 Capsho™. All rights reserved.
      </p>
    </q-footer>
  </q-page>
</template>

<style scoped lang="scss">
.outer {
  width: 100%;
  margin: 0 auto;
  max-width: 630px;
}
</style>
