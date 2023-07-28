<script setup lang="ts">
import AppButton from 'components/base/AppButton.vue'
import { ref } from 'vue'
import { useSubscription } from '../../../composables/useSubscription'
import downloadHelper from 'components/downloads'

const { allowCaptions, allowPromotionalEmail, allowBlogPost } = useSubscription()

type DownloadTypes = ''
  | 'title'
  | 'quotables'
  | 'youtube'
  | 'linkedInArticle'
  | 'blog'
  | 'showNotes'
  | 'email'
  | 'facebook'
  | 'linkedIn'
  | 'twitter'
  | 'tiktok'
  | 'transcript'
  | 'all'

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
    label: 'Title & Description',
    value: 'title',
    disable: false
  },
  {
    label: 'Show Notes',
    value: 'showNotes',
    disable: false
  },
  {
    label: 'Transcript',
    value: 'transcript',
    disable: false
  },
  {
    label: 'Facebook/Instagram Captions',
    value: 'facebook',
    disable: !allowCaptions.value
  },
  {
    label: 'LinkedIn Captions',
    value: 'linkedIn',
    disable: !allowCaptions.value
  },
  {
    label: 'Twitter Captions',
    value: 'twitter',
    disable: !allowCaptions.value
  },
  {
    label: 'TikTok Captions',
    value: 'tiktok',
    disable: !allowCaptions.value
  },
  {
    label: 'Email',
    value: 'email',
    disable: !allowPromotionalEmail.value
  },
  {
    label: 'Blog Post',
    value: 'blog',
    disable: !allowBlogPost.value
  },
  {
    label: 'LinkedIn Article',
    value: 'linkedInArticle',
    disable: !allowBlogPost.value
  },
  {
    label: 'YouTube Description',
    value: 'youtube',
    disable: !allowBlogPost.value
  },
  {
    label: 'Potent Quotables',
    value: 'quotables',
    disable: !allowBlogPost.value
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
    window.open(`${window.location.origin}/download?type=${downloadValue}`, '_blank')
    // switch (downloadValue) {
    // case 'title':
    //   window.open(`${window.location.origin}/download?type=title`, '_blank')
    //   // downloadHelper.description.downloadPDFTitleAndDescription()
    //   break
    // case 'quotables':
    //   downloadHelper.quotables.downloadPDFPotentQuotables()
    //   break
    // case 'youtube':
    //   downloadHelper.youtube.downloadPDFYoutubeTemplate()
    //   break
    // case 'linkedInArticle':
    //   downloadHelper.linkedin.downloadPDFLinkedInArticleTemplate()
    //   break
    // case 'blog':
    //   downloadHelper.blog.downloadPDFBlogPostTemplate()
    //   break
    // case 'showNotes':
    //   downloadHelper.showNotes.downloadPDFShowNotes()
    //   break
    // case 'email':
    //   downloadHelper.email.downloadPDFEmailTemplate()
    //   break
    // case 'facebook':
    //   downloadHelper.facebookCaptions.downloadPDFFacebookCaptions(allowBlogPost.value)
    //   break
    // case 'linkedIn':
    //   downloadHelper.linkedCaptions.downloadPDFLinkedInCaptions(allowBlogPost.value)
    //   break
    // case 'twitter':
    //   downloadHelper.twitterCaptions.downloadPDFTwitterCaptions(allowBlogPost.value)
    //   break
    // case 'tiktok':
    //   downloadHelper.tiktokCaptions.downloadPDFTikTokCaptions(allowBlogPost.value)
    //   break
    // case 'transcript':
    //   downloadHelper.transcript.downloadPDFTranscript()
    //   break
    // case 'all':
    //   window.open(`${window.location.origin}/download?type=all`, '_blank')
    //   // downloadHelper.all.downloadPDFAllAssets(
    //   //   allowPromotionalEmail.value,
    //   //   allowBlogPost.value
    //   // )
    //   break
    // }
  }
  if (downloadFormatType.value === 'Word Document') {
    switch (downloadValue) {
    case 'title':
      downloadHelper.description.downloadDocxTitleAndDescription()
      break
    case 'quotables':
      downloadHelper.quotables.downloadDocxPotentQuotables()
      break
    case 'youtube':
      downloadHelper.youtube.downloadDocxYoutubeTemplate()
      break
    case 'linkedInArticle':
      downloadHelper.linkedin.downloadDocxLinkedInArticleTemplate()
      break
    case 'blog':
      downloadHelper.blog.downloadDocxBlogPostTemplate()
      break
    case 'showNotes':
      downloadHelper.showNotes.downloadDocxShowNotes()
      break
    case 'email':
      downloadHelper.email.downloadDocxEmailTemplate()
      break
    case 'facebook':
      downloadHelper.facebookCaptions.downloadDocxFacebookCaptions(allowBlogPost.value)
      break
    case 'linkedIn':
      downloadHelper.linkedCaptions.downloadDocxLinkedInCaptions(allowBlogPost.value)
      break
    case 'twitter':
      downloadHelper.twitterCaptions.downloadDocxTwitterCaptions(allowBlogPost.value)
      break
    case 'tiktok':
      downloadHelper.tiktokCaptions.downloadDocxTikTokCaptions(allowBlogPost.value)
      break
    case 'transcript':
      downloadHelper.transcript.downloadDocxTranscript()
      break
    case 'all':
      downloadHelper.all.downloadDocxAllAssets(
        allowPromotionalEmail.value,
        allowBlogPost.value
      )
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
        text-color="text"
      />
      <AppButton
        v-close-popup
        class="text-16 poppins-medium"
        color="accent-custom"
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

  <div
    id="download-file"
    style="position: absolute; left: -100000px;display: none;">
    <div id="download-all">
      <div
        id="title-description"
        class="q-pa-md">
        <h4>Title</h4>
        <h4>Description</h4>
      </div>
      <div
        id="notes"
        class="q-pa-md">
        <h4>Show Notes</h4>
      </div>
      <div
        v-if="allowCaptions"
        id="social-media"
        class="q-pa-md"
      >
        <h4>Facebook/Instagram Captions</h4>
      </div>
      <div
        v-if="allowCaptions"
        id="linkedIn"
        class="q-pa-md"
      >
        <h4>LinkedIn Captions</h4>
      </div>
      <div
        v-if="allowCaptions"
        id="twitter"
        class="q-pa-md"
      >
        <h4>Twitter Captions</h4>
      </div>
      <div
        v-if="allowCaptions"
        id="tiktok"
        class="q-pa-md"
      >
        <h4>TikTok Captions</h4>
      </div>
      <div
        v-if="allowPromotionalEmail"
        id="email"
        class="q-pa-md"
      >
        <h4>Email Subject Line</h4>p>
        <h4>Email Body</h4>p>
      </div>
      <div
        v-if="allowBlogPost"
        id="blogPost"
        class="q-pa-md"
      >
        <h4>Blog Post</h4>
      </div>
      <div
        v-if="allowBlogPost"
        id="linkedIn"
        class="q-pa-md"
      >
        <h4>LinkedIn Article</h4>
      </div>
      <div
        v-if="allowBlogPost"
        id="youtube"
        class="q-pa-md"
      >
        <h4>YouTube Description</h4>
      </div>
      <div
        id="transcript"
        class="q-pa-md"
      >
        <h4>Transcript</h4>
      </div>
    </div>
  </div>
</template>
