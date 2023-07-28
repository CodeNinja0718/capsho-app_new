<script setup lang="ts">
import { TemplateV2 } from 'src/models/template'
import { addAffiliateToProgram } from 'src/services/tapfiliate-service'
import { useAuthStore } from 'src/stores/auth-store'
import { useTemplatesStore } from 'src/stores/templates'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { ref, computed, onMounted } from 'vue'

const uploadPodcastStore = useUploadPodcastStore()
const templatesStore = useTemplatesStore()
const authStore = useAuthStore()

enum DialogSteps {
  'SelectTemplate',
  'ShareTemplateLink'
}
const step = ref<DialogSteps>(DialogSteps.SelectTemplate)
const referralLinkToShareTemplate = ref<string>('')
function onClickReferralLink() {
  if (referralLinkToShareTemplate.value) {
    navigator.clipboard.writeText(referralLinkToShareTemplate.value).then(() => alert('Successfully copied'))
  }
}
onMounted(() => {
  step.value = DialogSteps.SelectTemplate
})

const templates = computed(() => {
  let activeTemplateType :'descriptionLayout' | 'showNotesLayout' | 'emailLayout' | 'blogPostLayout' | 'ytDescriptionLayout' | 'laArticle' | '' = ''
  switch (uploadPodcastStore.outputEpisodeTab) {
  case 'Title & Description':
    activeTemplateType = 'descriptionLayout'
    break
  case 'showNotes':
  case 'Podcast Website Content':
    activeTemplateType = 'showNotesLayout'
    break
  case 'email':
    activeTemplateType = 'emailLayout'
    break
  case 'blogPost':
    activeTemplateType = 'blogPostLayout'
    break
  case 'youtube':
    activeTemplateType = 'ytDescriptionLayout'
    break
  case 'linkedin_article':
    activeTemplateType = 'laArticle'
    break
  default:
    activeTemplateType = ''
  }
  return templatesStore.templates.filter((template) => template.type === activeTemplateType)
})
const pickedTemplate = ref<TemplateV2>()
function goToGetAffiliateLinkStep() {
  step.value = DialogSteps.ShareTemplateLink
  if (authStore.referralLink) {
    addAffiliateToProgram({ affiliate: { id: 'authStore.referralLink' } }).then((shareLink) => {
      if (shareLink) {
        referralLinkToShareTemplate.value = `capsho.tapfilliate.com/${shareLink}?templateId=${pickedTemplate.value?.id}&userId=${authStore.uid}`
      }
    })
  }
}
</script>

<template>
  <div class="no-wrap q-pa-lg w-96 bg-darkish rounded-3xl">
    <template v-if="step === DialogSteps.SelectTemplate">
      <h5 class="w-full text-center">Select the template you would like share.</h5>
      <div class="px-3 py-2">
        <q-select
          v-model="pickedTemplate"
          label="Rounded outlined"
          :option-label="(item) => item.title"
          :options="templates"
          outlined
          rounded
        />
      </div>
      <div class="flex justify-center">
        <q-btn
          color="accent-custom"
          label="Next"
          @click="goToGetAffiliateLinkStep"
        />
      </div>
    </template>
    <template v-if="step === DialogSteps.ShareTemplateLink">
      <h5 class="w-full text-center">Here is your link to share this awesome template.</h5>
      <div class="px-3 py-2">
        <div class="w-full px-3 py-2 bg-accent-custom text-white rounded-full flex justify-between items-center">
          <div class="grow shrink w-60 overflow-hidden">
            <span>{{ referralLinkToShareTemplate || 'Loading' }}</span>
          </div>
          <q-btn
            class="grow-0 shrink-0"
            flat
            icon="content_copy"
            round
            @click="onClickReferralLink"
          />
        </div>
      </div>
    </template>
  </div>
</template>
