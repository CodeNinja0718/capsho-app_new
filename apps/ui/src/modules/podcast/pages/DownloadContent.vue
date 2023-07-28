<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPDFTitleAndDescription } from 'src/components/downloads/title-and-description'
import { getPDFAllAssets } from 'src/components/downloads/all-assets'
import { getPDFShowNotes } from 'src/components/downloads/show-notes'
import { getPDFBlogPostTemplate } from 'src/components/downloads/blog-post'
import { getPDFEmailTemplate } from 'src/components/downloads/email'
import { getPDFFacebookCaptions } from 'src/components/downloads/captions-facebook'
import { getLinkedInCaptionsSource, getPDFLinkedInCaptions } from 'src/components/downloads/captions-linkedin'
import { getPDFTikTokCaptions, getTikTokCaptionsSource } from 'src/components/downloads/captions-tiktok'
import { getPDFTwitterCaptions } from 'src/components/downloads/captions-twitter'
import { getPDFLinkedInArticleTemplate } from 'src/components/downloads/linkedinarticle'
import { getPDFPotentQuotables } from 'src/components/downloads/potent-quotables'
import { getPDFTranscript } from 'src/components/downloads/transcript'
import { getPDFYoutubeTemplate } from 'src/components/downloads/youtube'
import { useSubscription } from 'src/composables/useSubscription'

const { allowPromotionalEmail, allowBlogPost } = useSubscription()

const route = useRoute()

const content = ref('')
const show = ref(true)

onMounted(() => {
  const type = route.query.type
  switch (type) {
  case 'title':
    content.value = getPDFTitleAndDescription()
    download()
    break
  case 'blog':
    content.value = getPDFBlogPostTemplate()
    download()
    break
  case 'email':
    content.value = getPDFEmailTemplate()
    download()
    break
  case 'quotables':
    content.value = getPDFPotentQuotables()
    download()
    break
  case 'youtube':
    content.value = getPDFYoutubeTemplate()
    download()
    break
  case 'linkedInArticle':
    content.value = getPDFLinkedInArticleTemplate()
    download()
    break
  case 'facebook':
    content.value = getPDFFacebookCaptions()
    download()
    break
  case 'linkedIn':
    content.value = getLinkedInCaptionsSource()
    download()
    break
  case 'twitter':
    content.value = getPDFTwitterCaptions()
    download()
    break
  case 'tiktok':
    content.value = getTikTokCaptionsSource()
    download()
    break
  case 'transcript':
    content.value = getPDFTranscript()
    download()
    break
  case 'showNotes':
    content.value = getPDFShowNotes()
    download()
    break
  case 'all':
    content.value = getPDFAllAssets(allowPromotionalEmail.value, allowBlogPost.value)
    download()
    break
  default:
    break
  }
})

const download = () => {
  show.value = false
  setTimeout(() => {
    window.print()
  }, 500)
}
</script>
<template>
  <button
    v-if="show"
    @click="download"
  >Download</button>
  <div>
    <div class="print_area">
      <div v-html="content"></div>
    </div>
  </div>
</template>
<style lang="scss">
  .print_area{
    width: 210mm;
    margin: auto;
    background-color: white;
    color: black !important;

    h2{
      font-size: 20px;
      padding: 30px 0;
    }
    h4{
      font-size: 20px;
      padding: 30px 0;
    }
  }
</style>
