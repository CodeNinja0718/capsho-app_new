<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'

const $q = useQuasar()
const store = useUploadPodcastStore()

const inviteForm = reactive({
  name: '[Guest Name]',
  email: '',
  body: ''
})

const podcastName = computed(() => {
  return store.podcastName ?? ''
})

const emailContent = computed({
  get() {
    if (inviteForm.body) {
      return inviteForm.body
    } else {
      return `Hey ${inviteForm.name},<br />
        I loved having you on as a guest on ${podcastName.value}! I know our audience is going to get a TON of
        value from what you shared.<br />
        And they won’t have to wait too long because the great news is… your episode is going live on
        [insert go-live date of episode]!<br />
        I'll be sharing your incredible story and helpful tips with my audience and I'd love for you to do the same with yours.
        To help you with that, I have created some social media captions, email copy, and creative assets!
        [insert link]<br />
        This link will ask you to create a free account with Capsho who I used to create this for you
        (they're awesome and come highly recommended :wink:!)<br />
        Thanks again and look forward to chatting soon<br />
        [Your sign off]`
    }
  },
  set(val: string) {
    inviteForm.body = val
  }
})

const authStore = useAuthStore()
function sendInvitation() {
  $q.loading.show()
  store
    .updatePodcastEpisode({
      guestCreativeAssets: store.guestCreativeAssetsUploaded
    })
  store
    .$guestCloudFunctions
    .saveGuestDraftsAndInvite({
      emailBody: inviteForm.body,
      from: authStore.email,
      guestName: inviteForm.name,
      hostName: authStore.firstName + authStore.lastName,
      podcastId: store.podcastId,
      podcastName: store.podcastName,
      recipient: inviteForm.email,
      transcriptId: store.transcriptId
    })
    .then(() => {
      store.router.push({ name: 'PodcastFolders' })
    })
    .finally(() => {
      $q.loading.hide()
    })
}
</script>

<template>
  <section class="q-gutter-y-sm">
    <h1>Ready to send your guest their promotional assets?</h1>
    <q-form>
      <div class="row no-wrap q-col-gutter-x-sm">
        <div class="col-6">
          <label
            class="block text-left text-grey-6"
            for="name"
          >
            Guest's Full Name
          </label>
          <q-input
            id="name"
            v-model:model-value="inviteForm.name"
            color="orange"
            dense
            hint="John Doe"
            lazy-rules="ondemand"
            name="email"
            no-error-icon
            outlined
            type="text"
          />
        </div>
        <div class="col-6">
          <label
            class="block text-left text-grey-6"
            for="email"
          >
            Email
          </label>
          <q-input
            id="email"
            v-model:model-value="inviteForm.email"
            color="orange"
            dense
            hint="sample@email.com"
            lazy-rules="ondemand"
            name="email"
            no-error-icon
            outlined
            type="email"
          />
        </div>
      </div>
    </q-form>
    <div>
      <label
        class="block text-left text-grey-6"
        for="body"
      >
        Email Content
      </label>
      <editable-content
        id="body"
        v-model="emailContent"
        size="lg"
      />
    </div>
    <div>
      <app-button
        color="accent"
        hover-color="transparent"
        label="Send"
        no-caps
        padding="7px 44px"
        rounded
        unelevated
        @click="sendInvitation"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
h1 {
  font-size: 2rem;
}
</style>
