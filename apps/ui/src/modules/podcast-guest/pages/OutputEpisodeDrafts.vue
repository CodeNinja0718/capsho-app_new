<script setup lang="ts">
import { markRaw, ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'

import type { OutputEpisodeDraftsTabs } from 'stores/upload-podcast-state-types'

import captionSocialTab from 'src/modules/podcast-guest/components/OutputDraftsTabCaptionSocial.vue'
import captionLinkedinTab from 'src/modules/podcast-guest/components/OutputDraftsTabCaptionLinkedIn.vue'
import captionTiktokTab from 'src/modules/podcast-guest/components/OutputDraftsTabCaptionTikTok.vue'
import captionTwitterTab from 'src/modules/podcast-guest/components/OutputDraftsTabCaptionTwitter.vue'
import emailTab from 'src/modules/podcast-guest/components/OutputDraftsTabEmail.vue'
import creativeAssets from 'src/modules/podcast-guest/components/OutputDraftsTabCreativeAssets.vue'
import potentQuotables from 'src/modules/podcast-guest/components/OutputDraftsTabPotentQuotables.vue'
import laArticle from 'src/modules/podcast-guest/components/OutputDraftsTabLinkedInArticle.vue'
import OutputEpisodeDraftsDrawer from 'src/modules/podcast-guest/components/OutputEpisodeDraftsDrawer.vue'

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
    case 'quotables':
      return markRaw(potentQuotables)
    case 'laArticle':
      return markRaw(laArticle)
    default:
      return markRaw(captionSocialTab)
    }
  }
  store.outputEpisodeTab = tab as OutputEpisodeDraftsTabs
  currentTab.value = lookUpTabs(tab)
}

onBeforeMount(() => {
  store.outputEpisodeTab = 'social'
})

onBeforeUnmount(() => {
  store.outputEpisodeTab = 'social'
})
</script>

<template>
  <div class="bg-grey-10 q-px-lg">
    <output-episode-drafts-drawer @switch-tab="changeTab" />
    <div class="q-px-xl pt-24">
      <component :is="currentTab" />
    </div>
  </div>
</template>
