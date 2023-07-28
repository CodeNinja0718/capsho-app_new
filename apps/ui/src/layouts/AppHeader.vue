<script setup lang="ts">
import { laQuestionCircle } from '@quasar/extras/line-awesome'
import BrandLogo from 'components/BrandLogo.vue'
import { useAuthStore } from 'stores/auth-store'
import DropdownMenu from 'components/DropdownMenu.vue'
import AppButton from 'components/base/AppButton.vue'
import { ref, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import HostDownload from 'src/modules/podcast/components/DownloadHostAssets.vue'
import GuestDownload from 'src/modules/podcast-guest/components/DownloadGuestAssets.vue'
import UploadPodcast from 'src/modules/podcast/components/UploadPodcast.vue'
import ShowLoadingCard from 'src/modules/podcast/components/ShowLoadingCard.vue'
import EpisodeClipper from 'src/modules/podcast/components/EpisodeClipper.vue'
import EpisodeDetails from 'src/modules/podcast/components/EpisodeDetails.vue'
import { biPlus } from '@quasar/extras/bootstrap-icons'
import EpisodeTopic from 'src/modules/podcast/components/EpisodeTopic.vue'

const uploadPodcastStore = useUploadPodcastStore()
const authStore = useAuthStore()
const route = useRoute()

const showDownload = ref<boolean>(false)
const openNewPodcastDialog = ref<boolean>(false)
const isLoggedIn = ref(authStore.user.isLoggedIn)
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

const isOutputDraftsPage = computed(() => {
  const routeName = route.name
  if (routeName) {
    return ['OutputEpisodeDrafts', 'PodcastGuestEpisodeDrafts', 'GuestEpisodeDrafts'].includes(String(routeName))
  }
  return false
})
const userType = computed(() => {
  return authStore.userType
})
const episode = computed(() => {
  return {
    label: userType.value === 'guest' ? 'My Stages' : 'My Shows',
    route: userType.value === 'guest' ? 'DefaultPodcastGuest' : 'PodcastFolders'
  }
})

function routeToUpload (routeName: 'DefaultPodcastGuest' | 'PodcastFolders') {
  if (routeName === 'PodcastFolders') {
    uploadPodcastStore.processStep = 'uploadPodcast'
  }
  authStore.router.push({ name: routeName })
}
function uploadNewPodcastBtnClickHandler() {
  // authStore.router.push({ name: 'UploadPodcast' })
  openNewPodcastDialog.value = true
  uploadPodcastStore.processStep = 'uploadPodcast'
}

watchEffect(() => {
  isLoggedIn.value = authStore.user.isLoggedIn
})
</script>

<template>
  <header
    class="absolute w-full h-20 flex bg-header"
    style="padding-inline: 5px; z-index: 1000;"
  >
    <q-toolbar
      v-if="isLoggedIn"
      class="justify-between q-px-xl"
    >
      <div class="col bg-transparent flex items-center">
        <BrandLogo
          label=""
          size="md"
        />
        <span
          class="pro-link"
          style="display: inline"
          @click="authStore.router.push({ name: 'PickAPlan' })">Upgrade to Pro today</span>
      </div>
      <q-space />
      <div class="col-auto q-mr-md q-gutter-x-md">
        <q-btn
          class="text-13 poppins-medium"
          color="accent"
          label="Upload new episode"
          no-caps
          padding="4px 25px"
          rounded
          text-color="white"
          unelevated
          @click="uploadNewPodcastBtnClickHandler"
        />
        <q-btn
          class="text-13 poppins-medium"
          color="grey-10"
          :label="episode.label"
          no-caps
          padding="4px 25px"
          rounded
          unelevated
          @click="routeToUpload(episode.route)"
        />
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
  </header>
  <q-dialog
    v-model="showDownload"
    position="top"
    seamless>
    <guest-download v-if="userType === 'guest'"/>
    <host-download v-else />
  </q-dialog>
  <q-dialog
    v-model="openNewPodcastDialog"
    persistent
  >
    <div v-if="uploadPodcastStore.processStep === 'uploadPodcast'">
      <div class="w-[460px] relative bg-secondary-dark px-4 md:px-9 py-4 md:py-9 rounded-[40px] border-accent border-4 border-solid">
        <!-- <q-icon
          class="absolute right-5 top-5 cursor-pointer"
          color="accent"
          :name="biPlus"
          size="36px"
          style="rotate: 45deg"
          @click="openNewPodcastDialog = false"
        /> -->
        <UploadPodcast />
      </div>
    </div>
    <div v-else-if="uploadPodcastStore.processStep === 'episodeClipper'">
      <!-- class="w-[375px] md:w-[576px] lg:w-[640px] xl:w-[850px]" -->
      <div class="relative bg-secondary-dark px-6 md:px-9 py-4 md:py-7 rounded-[15px]">
        <q-icon
          class="absolute right-5 top-5 cursor-pointer"
          color="accent"
          :name="biPlus"
          size="36px"
          style="rotate: 45deg"
          @click="openNewPodcastDialog = false"
        />
        <EpisodeClipper />
      </div>
    </div>
    <div v-else-if="uploadPodcastStore.processStep === 'episodeDetails'">
      <div class="relative bg-secondary-dark px-6 md:px-9 py-4 md:py-7 rounded-[15px]">
        <q-icon
          class="absolute right-5 top-5 cursor-pointer"
          color="accent"
          :name="biPlus"
          size="36px"
          style="rotate: 45deg"
          @click="openNewPodcastDialog = false"
        />
        <EpisodeDetails />
      </div>
    </div>
    <div v-else-if="uploadPodcastStore.processStep === 'submitFiles'">
      <div class="relative bg-secondary-dark px-6 md:px-9 py-4 md:py-7 rounded-[15px]">
        <ShowLoadingCard />
      </div>
    </div>
    <div
      v-else-if="true || uploadPodcastStore.processStep === 'episodeTopic'"
      class="flex gap-9"
    >
      <EpisodeTopic @close="openNewPodcastDialog = false" />
    </div>
  </q-dialog>
</template>

<style lang="scss">
header {
  background-color: $app-header;
}
.pro-link{
  font-family: 'Lexend';
  color: white;
  font-size: 12px;
  padding-left: 10px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
