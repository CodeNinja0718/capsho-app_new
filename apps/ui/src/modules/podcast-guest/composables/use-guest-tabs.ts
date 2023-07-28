import { computed } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'

export function useGuestTabs() {
  const store = useUploadPodcastStore()
  const disableEngEduCaptions = computed(() => {
    if (store.allCaptionsGuest.facebook) {
      if (
        store.allCaptionsGuest.facebook.engagement &&
        store.allCaptionsGuest.facebook.educational
      ) {
        return false
      }
    }
    return true
  })
  const hideActionButton = computed(() => {
    return store.linkedinTemplate &&
      (store.potentQuotables && Object.values(store.potentQuotables).length)
  })
  const guestTabs = computed(() => {
    return [
      {
        disable: false,
        title: 'Captions',
        name: 'captions',
        isGrowth: false,
        content: [
          {
            title: 'Facebook/Instagram',
            name: 'social'
          },
          {
            title: 'LinkedIn',
            name: 'linkedin'
          },
          {
            title: 'TikTok',
            name: 'tiktok'
          },
          {
            title: 'Twitter',
            name: 'twitter'
          }
        ]
      },
      {
        title: 'Email',
        name: 'email',
        isGrowth: false,
        content: ''
      },
      {
        disable: false,
        title: 'Creative Assets',
        name: 'assets',
        isGrowth: false,
        content: ''
      },
      {
        disable: disableEngEduCaptions.value,
        title: 'Potent Quotables',
        name: 'quotables',
        isGrowth: false,
        content: ''
      },
      {
        disable: disableEngEduCaptions.value,
        title: 'LinkedIn Article',
        name: 'laArticle',
        isGrowth: false,
        content: ''
      }
    ]
  })
  const options = computed(() => {
    return [
      {
        default: true,
        disable: false,
        label: 'Promotion',
        tooltip: 'A selection of quotes that will motivate your audience',
        value: 'promotion'
      },
      {
        default: false,
        disable: disableEngEduCaptions.value,
        isBeta: true,
        label: 'Engagement',
        tooltip: 'A selection of quotes from the story you or your podcast-guest shared in the episode',
        value: 'engagement'
      },
      {
        default: false,
        disable: disableEngEduCaptions.value,
        isBeta: true,
        label: 'Educational',
        tooltip: 'A selection of quotes from the story you or your podcast-guest shared in the episode',
        value: 'educational'
      }
    ]
  })
  const emailOptions = computed(() => {
    return [
      {
        default: true,
        disable: false,
        label: 'Promotion',
        tooltip: 'A selection of quotes that will motivate your audience',
        value: 'promotion'
      },
      {
        default: false,
        disable: disableEngEduCaptions.value,
        isBeta: true,
        label: 'Engagement',
        tooltip: 'A selection of quotes from the story you or your podcast-guest shared in the episode',
        value: 'engagement'
      }
    ]
  })
  return {
    guestTabs,
    disableEngEduCaptions,
    hideActionButton,
    options,
    emailOptions
  }
}
