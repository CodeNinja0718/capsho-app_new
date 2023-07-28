<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { laUndoSolid } from '@quasar/extras/line-awesome'
import type { OutputEpisodeDraftsTabs } from 'stores/upload-podcast-state-types'

import captionSocialTab from 'src/modules/podcast/components/guest-drafts/GuestDraftsTabCaptionSocial.vue'
import captionLinkedinTab from 'src/modules/podcast/components/guest-drafts/GuestDraftsTabCaptionLinkedIn.vue'
import captionTiktokTab from 'src/modules/podcast/components/guest-drafts/GuestDraftsTabCaptionTikTok.vue'
import captionTwitterTab from 'src/modules/podcast/components/guest-drafts/GuestDraftsTabCaptionTwitter.vue'
import emailTab from 'src/modules/podcast/components/guest-drafts/GuestDraftsTabEmail.vue'
import creativeAssets from 'src/modules/podcast/components/guest-drafts/GuestDraftsTabCreativeAssets.vue'
import inviteForm from 'src/modules/podcast/components/guest-drafts/GuestDraftsTabInviteForm.vue'
import GuestDraftsDrawer from 'src/modules/podcast/components/guest-drafts/GuestDraftsDrawer.vue'

const store = useUploadPodcastStore()

const currentTab = ref(markRaw(captionSocialTab))

function changeTab (tab: string) {
  function lookUpTabs (tab: string) {
    switch (tab) {
    case 'email':
      return markRaw(emailTab)
    case 'social':
      return markRaw(captionSocialTab)
    case 'linkedin':
      return markRaw(captionLinkedinTab)
    case 'tiktok':
      return markRaw(captionTiktokTab)
    case 'twitter':
      return markRaw(captionTwitterTab)
    case 'assets':
      return markRaw(creativeAssets)
    case 'invite':
      return markRaw(inviteForm)
    default:
      return markRaw(captionSocialTab)
    }
  }
  store.outputEpisodeTab = tab as OutputEpisodeDraftsTabs
  currentTab.value = lookUpTabs(tab)
}
</script>

<template>
  <q-layout class="flex">
    <GuestDraftsDrawer @switch-tab="changeTab" />
    <q-page-container class="q-ml-xl screen-height grow shrink pt-24">
      <div class="q-pb-md">
        <q-breadcrumbs
          active-color="accent"
          class="text-13 text-grey-3"
          gutter="xs">
          <q-breadcrumbs-el
            class="cursor-pointer"
            :icon="laUndoSolid"
            label="Go Back"
            @click="store.router.back()"
          />
          <q-breadcrumbs-el
            class="ellipsis"
            :label="store.selectedEpisode.title"
          />
        </q-breadcrumbs>
      </div>
      <component :is="currentTab" />
    </q-page-container>
  </q-layout>
</template>
