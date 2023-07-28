<script lang="ts">
import { RouteLocation } from 'vue-router'
// import { getEpisodeById } from '../../../services/firebase/usersData'

export default {
  preFetch ({ currentRoute }: { currentRoute: RouteLocation }) {
    const id = currentRoute.query.episode
    if (id) {
      // getEpisodeById(String(id))
    }
  }
}
</script>

<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'

import type { OutputEpisodeDraftsTabs } from 'stores/upload-podcast-state-types'

import titleTab from 'src/modules/podcast/components/OutputDraftsTabTitleAndDescription.vue'
import showNotesTab from 'src/modules/podcast/components/OutputDraftsTabShowNotes.vue'
import emailTab from 'src/modules/podcast/components/OutputDraftsTabEmail.vue'
import transcriptTab from 'src/modules/podcast/components/OutputDraftsTabTranscript.vue'
import blogPostTab from 'src/modules/podcast/components/OutputDraftsTabBlogPost.vue'
import youtubeTab from 'src/modules/podcast/components/OutputDraftsTabYouTubeDescription.vue'
import linkedinArticleTab from 'src/modules/podcast/components/OutputDraftsTabLinkedInArticle.vue'
import captionSocialTab from 'src/modules/podcast/components/OutputDraftsTabCaptionSocial.vue'
import captionLinkedinTab from 'src/modules/podcast/components/OutputDraftsTabCaptionLinkedIn.vue'
import captionTiktokTab from 'src/modules/podcast/components/OutputDraftsTabCaptionTikTok.vue'
import captionTwitterTab from 'src/modules/podcast/components/OutputDraftsTabCaptionTwitter.vue'
import potentQuotablesTab from 'src/modules/podcast/components/OutputDraftsTabPotentQuotables.vue'
import OutputEpisodeDraftsDrawer from 'src/modules/podcast/components/OutputEpisodeDraftsDrawer.vue'

const store = useUploadPodcastStore()

const currentTab = ref(markRaw(titleTab))

function changeTab (tab: string) {
  function lookUpTabs (tab: string) {
    switch (tab) {
    case 'title':
      return markRaw(titleTab)
    case 'showNotes':
      return markRaw(showNotesTab)
    case 'email':
      return markRaw(emailTab)
    case 'transcript':
      return markRaw(transcriptTab)
    case 'blogPost':
      return markRaw(blogPostTab)
    case 'youtube':
      return markRaw(youtubeTab)
    case 'linkedin_article':
      return markRaw(linkedinArticleTab)
    case 'potent_quotables':
      return markRaw(potentQuotablesTab)
    case 'social':
      return markRaw(captionSocialTab)
    case 'linkedin':
      return markRaw(captionLinkedinTab)
    case 'tiktok':
      return markRaw(captionTiktokTab)
    case 'twitter':
      return markRaw(captionTwitterTab)
    default:
      return markRaw(titleTab)
    }
  }
  store.outputEpisodeTab = tab as OutputEpisodeDraftsTabs
  currentTab.value = lookUpTabs(tab)
}
</script>

<template>
  <div class="q-px-lg">
    <OutputEpisodeDraftsDrawer @switch-tab="changeTab" />
    <div class="q-px-xl pt-58">
      <component :is="currentTab" />
    </div>
  </div>
</template>
