<script setup lang="ts">
import { laQuestionCircle } from '@quasar/extras/line-awesome'
import BrandLogo from 'components/BrandLogo.vue'
import { useAuthStore } from 'stores/auth-store'
import DropdownMenu from 'components/DropdownMenu.vue'
import AppButton from 'components/AppButton.vue'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import DownloadFIle from 'src/components/DownloadFIle.vue'

const store = useUploadPodcastStore()
const authStore = useAuthStore()
const route = useRoute()
const dialog = ref(false)
function routeToUpload () {
  store.processStep = 'uploadPodcast'
  authStore.router.push({ name: 'PodcastFolders' })
}
const isLoggedIn = ref(authStore.user.isLoggedIn)
watchEffect(() => {
  isLoggedIn.value = authStore.user.isLoggedIn
})
const pages = [
  {
    label: 'About',
    value: 'AboutPage'
  },
  {
    label: 'Contact',
    value: 'ContactPage'
  },
  {
    label: 'Pricing',
    value: 'PricingPage'
  }
]

</script>

<template>
  <q-header
    class="bg-transparent text-primary q-py-lg"
    reveal
    :reveal-offset="5"
    style="padding-inline: 5px;"
  >
    <q-toolbar
      v-if="isLoggedIn"
      class="justify-between q-px-xl">
      <div
        v-if="route.name !== 'OutputEpisodeDrafts'"
        class="col bg-transparent">
        <BrandLogo />
      </div>
      <q-space />
      <div
        v-if="route.name==='OutputEpisodeDrafts'"
        class="col-auto q-mr-md q-gutter-x-md">
        <q-btn
          class="text-16 poppins-medium"
          label="My Shows"
          no-caps
          outline
          padding="8px 25px"
          rounded
          text-color="accent"
          unelevated
          @click="routeToUpload"
        />
        <AppButton
          class="text-16 poppins-medium"
          color="accent"
          label="Download"
          no-caps
          padding="8px 25px"
          rounded
          unelevated
          @click="dialog=true"
        />
      </div>
      <div
        v-if="route.name==='OutputEpisodeDrafts'"
        class="col-auto q-pr-md">
        <q-icon size="50px">
          <q-img
            v-if="store.savingPodcast"
            height="60px"
            src="~assets/saving.png"
            transition-hide="fade"
            transition-show="fade"
            width="60px"
          >
            <template #loading>
            </template>
          </q-img>
          <q-img
            v-else
            height="60px"
            src="~assets/saved.png"
            transition-hide="fade"
            transition-show="fade"
            width="60px"
          >
            <template #loading>
            </template>
          </q-img>
        </q-icon>
      </div>
      <div class="col-auto">
        <div class="q-gutter-x-sm">
          <DropdownMenu />
        </div>
      </div>
    </q-toolbar>
    <q-toolbar
      v-else-if="!route.meta.hideMainLayout"
      class="justify-between q-px-xl">
      <div class="col-auto q-gutter-x-sm">
        <q-btn
          v-for="(page) in pages"
          :key="page.value"
          flat
          :label="page.label"
          no-caps
          text-color="black"
          :to="{ name: page.value }"
        />
      </div>
      <q-space />
      <div class="col text-center">
        <BrandLogo />
      </div>
      <q-space />
      <div class="col-auto">
        <div class="q-gutter-x-md">
          <AppButton
            label="Sign In"
            no-caps
            outline
            padding="5px 24px"
            rounded
            text-color="accent"
            @click="authStore.router.push({ name: 'AuthPage', replace: true })"
          />
          <AppButton
            color="accent"
            label="Sign Up"
            no-caps
            padding="5px 24px"
            rounded
            unelevated
            @click="authStore.router.push({ name: 'AuthSignUp' })"
          />
          <q-btn
            color="accent"
            flat
            :icon-right="laQuestionCircle"
            label="Help"
            no-caps
            padding="4px"
            :to="{ name: 'HelpPage' }"
          />
        </div>
      </div>
    </q-toolbar>
  </q-header>
  <q-dialog
    v-model="dialog"
    position="top"
    seamless>
    <DownloadFIle/>
  </q-dialog>
</template>
