<script setup lang="ts">
import AppButton from 'components/base/AppButton.vue'
import { ref } from 'vue'
import downloadHelper from 'src/components/downloads/index'

type DownloadTypes = ''
  | 'all'
  | 'email'
  | 'facebook'
  | 'linkedIn'
  | 'linkedInArticle'
  | 'quotables'
  | 'tiktok'
  | 'twitter'

type DownLoadFormat = {
  label: string;
  value: DownloadTypes;
  disable: boolean;
}
const downloadFormat = ref<DownLoadFormat | null>(null)
const downloadFormatType = ref('')

const downloadOptions = [
  {
    label: 'All assets',
    value: 'all',
    disable: false
  },
  {
    label: 'Facebook/Instagram Captions',
    value: 'facebook',
    disable: false
  },
  {
    label: 'LinkedIn Captions',
    value: 'linkedIn',
    disable: false
  },
  {
    label: 'Twitter Captions',
    value: 'twitter',
    disable: false
  },
  {
    label: 'TikTok Captions',
    value: 'tiktok',
    disable: false
  },
  {
    label: 'Email',
    value: 'email',
    disable: false
  },
  {
    label: 'LinkedIn Article',
    value: 'linkedInArticle',
    disable: false
  },
  {
    label: 'Potent Quotables',
    value: 'quotables',
    disable: false
  }
].sort((a, b) => {
  if (a.value < b.value) {
    return -1
  }
  if (a.value > b.value) {
    return 1
  }
  return 0
})

function download() {
  const downloadValue = downloadFormat.value?.value
  if (downloadFormatType.value === 'PDF Standard') {
    switch (downloadValue) {
    case 'quotables':
      downloadHelper.quotables.downloadPDFPotentQuotables()
      break
    case 'linkedInArticle':
      downloadHelper.linkedin.downloadPDFLinkedInArticleTemplate()
      break
    case 'email':
      downloadHelper.email.downloadPDFEmailTemplate(true)
      break
    case 'facebook':
      downloadHelper.facebookCaptions.downloadPDFFacebookCaptions(true, true)
      break
    case 'linkedIn':
      downloadHelper.linkedCaptions.downloadPDFLinkedInCaptions(true, true)
      break
    case 'twitter':
      downloadHelper.twitterCaptions.downloadPDFTwitterCaptions(true, true)
      break
    case 'tiktok':
      downloadHelper.tiktokCaptions.downloadPDFTikTokCaptions(true, true)
      break
    case 'all':
      downloadHelper.allGuest.downloadPDFAllAssets()
      break
    }
  }
  if (downloadFormatType.value === 'Word Document') {
    switch (downloadValue) {
    case 'quotables':
      downloadHelper.quotables.downloadDocxPotentQuotables()
      break
    case 'linkedInArticle':
      downloadHelper.linkedin.downloadDocxLinkedInArticleTemplate()
      break
    case 'email':
      downloadHelper.email.downloadDocxEmailTemplate(true)
      break
    case 'facebook':
      downloadHelper.facebookCaptions.downloadDocxFacebookCaptions(true, true)
      break
    case 'linkedIn':
      downloadHelper.linkedCaptions.downloadDocxLinkedInCaptions(true, true)
      break
    case 'twitter':
      downloadHelper.twitterCaptions.downloadDocxTwitterCaptions(true, true)
      break
    case 'tiktok':
      downloadHelper.tiktokCaptions.downloadDocxTikTokCaptions(true, true)
      break
    case 'all':
      downloadHelper.allGuest.downloadDocxAllAssets()
      break
    }
  }
}
</script>

<template>
  <q-card
    style="width: 350px ;
    position: absolute;
    right: 120px;
    top: 60px;">
    <q-card-section>
      <div class="row items-center">
        <q-select
          v-model="downloadFormat"
          label="What would you like to download?"
          :options="downloadOptions"
          outlined
          style="width: 100%"
        />
        <q-select
          v-model="downloadFormatType"
          label="In what format?"
          :options="['Word Document', 'PDF Standard']"
          outlined
          style="width: 100%; margin-top: 24px;"
        />
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        v-close-popup
        flat
        label="Cancel"
        no-caps
        text-color="darkish"
      />
      <AppButton
        v-close-popup
        class="text-16 poppins-medium"
        color="accent"
        :disabled="!downloadFormat || !downloadFormatType"
        hoverColor="white"
        label="Download"
        no-caps
        padding="5px 25px"
        rounded
        style="font-size: 12px;"
        @click="download"
      />
    </q-card-actions>
  </q-card>
</template>
