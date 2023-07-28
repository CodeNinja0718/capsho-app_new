<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import EditableContent from 'src/modules/podcast/components/EditableContent.vue'
import { useQuasar, throttle } from 'quasar'
import { useAuthStore } from 'stores/auth-store'

const $q = useQuasar()
const store = useUploadPodcastStore()

const inviteForm = reactive({
  ccHost: false,
  guestName: store.guestName || '[Guest Name]',
  emailAddress: '',
  emailBody: ''
})

const checkingEmail = ref(false)
const guestHasEpisodes = ref(false)

const inviteSignUpLink = window.location.origin + '/auth/guest/sign-up?userType=guest'
const signUpLink = `<a href="${inviteSignUpLink}" target="_blank" style="color: #00b0ff; text-decoration: underline">Click here</a>`

const inviteSignInLink = window.location.origin + '/auth/guest/sign-in?userType=guest'
const signInLink = `<a href="${inviteSignInLink}" target="_blank" style="color: #00b0ff; text-decoration: underline">Click here</a>`

const podcastName = computed(() => {
  return store.podcastName ?? ''
})

const emails = {
  guestNew: `Hey ${inviteForm.guestName},<br />
        I loved having you on as a guest on ${podcastName.value}!
        I know our audience is going to get a TON of value from what you shared.<br />
        And they won’t have to wait too long because the great news is… your episode is going live on<br />
        [insert go-live date of episode]!<br />
        I'll be sharing your incredible story and helpful tips with my audience and
        I'd love for you to do the same with yours.
        To help you with that, I have created your Guest Media Kit with social media captions, email copy, and creative assets!<br />
        <span id="signUp">link</span> <br />
        This link will ask you to create a free Guest account with Capsho who I used to create this for you
        (they're awesome and come highly recommended &#128521;!)<br />
        <b>Important note:</b><br />
        <ul style="list-style: square;" role="list">
          <li>Capsho Guest is in Beta so there might be some glitches and bugs. Capsho has great Live Chat support so just message the team there if you have any issues.</li>
          <li>Please make sure you create your Capsho Gust account with this email address. If you use a different email address, you won’t be able to see the Guest Media Kit I created for you.</li>
        </ul><br />
        Thanks again and look forward to chatting soon<br />
        [Your sign off]`,
  guestExists: `Hey ${inviteForm.guestName},<br />
        I loved having you on as a guest on ${podcastName.value}!
        I know our audience is going to get a TON of value from what you shared.
        And they won’t have to wait too long because the great news is… your episode is going live on<br />
        [insert go-live date of episode]!<br />
        I'll be sharing your incredible story and helpful tips with my audience and
        I'd love for you to do the same with yours.
        To help you with that, I have created some social media captions, email copy, and creative assets!<br />
        <span id="signIn">link</span> <br />
        Just log into your Capsho Guest account and click on our episode to download them.<br />
        Thanks again and look forward to chatting soon<br />
        [Your sign off]`
}

const emailContent = computed({
  get() {
    if (inviteForm.emailBody) {
      return inviteForm.emailBody
    } else {
      return guestHasEpisodes.value ? emails.guestExists : emails.guestNew
    }
  },
  set(val: string) {
    inviteForm.emailBody = val
  }
})

const disable = computed(() => {
  return !inviteForm.emailAddress
})

const isGuestHasAccount = throttle(() => {
  $q.loading.show()
  checkingEmail.value = true
  return store
    .$fbServices
    .getGuestEpisodesLength({ email: inviteForm.emailAddress })
    .then((resp: boolean) => {
      if (resp) {
        emailContent.value = emails.guestExists
      } else {
        emailContent.value = emails.guestNew
      }
      guestHasEpisodes.value = resp
      return resp
    })
    .finally(() => {
      checkingEmail.value = false
      $q.loading.hide()
    })
}, 500)

function onEmailAddressChange(evt: Event) {
  const target = evt.target as HTMLInputElement
  const updatedEmailAddress = target.value
  if (!updatedEmailAddress) {
    return false
  }
  return isGuestHasAccount()
}

const authStore = useAuthStore()
function sendInvitation() {
  $q.loading.show()
  const getHostFullName = () => {
    let first = ''
    let last = ''
    if (authStore.user) {
      if (authStore.user.firstName) {
        first = authStore.user.firstName
      }
      if (authStore.user.lastName) {
        last = authStore.user.lastName
      }
    }
    return first + ' ' + last
  }
  const normalContent = normalizeContent()
  store
    .$guestCloudFunctions
    .saveGuestDraftsAndInvite({
      emailBody: normalContent,
      from: (authStore.user && authStore.user.email) || '',
      guestName: inviteForm.guestName,
      hostName: getHostFullName(),
      podcastId: store.podcastId,
      podcastName: store.podcastName || '',
      recipient: inviteForm.emailAddress,
      sendCopyToHost: inviteForm.ccHost,
      transcriptId: store.transcriptId
    })
    .then(() => {
      store.router.push({ name: 'PodcastFolders' })
    })
    .finally(() => {
      $q.loading.hide()
    })

  function normalizeContent() {
    return emailContent.value
  }
}
</script>

<template>
  <section class="q-gutter-y-sm text-grey-3">
    <h1>Ready to send your guest their promotional assets?</h1>
    <q-form>
      <div class="row no-wrap q-col-gutter-x-sm">
        <div class="col-6">
          <label
            class="custom-label"
            for="name"
          >
            Guest's Full Name
          </label>
          <input
            id="name"
            v-model="inviteForm.guestName"
            class="rounded-lg flex items-center h-10 bg-darkish bg-opacity-25 text-grey-3 px-10 w-full ring-2 ring-transparent hover:ring-purple-500 focus:ring-purple-500 outline-none"
            name="name"
            placeholder="John Doe"
            type="text"
          />
        </div>
        <div class="col-6">
          <label
            class="custom-label"
            for="email"
          >
            Email
          </label>
          <input
            id="email"
            v-model="inviteForm.emailAddress"
            class="rounded-lg flex items-center h-10 bg-darkish bg-opacity-25 text-grey-3 px-10 w-full ring-2 ring-transparent hover:ring-purple-500 focus:ring-purple-500 outline-none"
            name="email"
            placeholder="sample@email.com"
            type="email"
            @change="onEmailAddressChange"
          />
        </div>
      </div>
    </q-form>
    <div>
      <label
        class="custom-label"
        for="emailBody"
      >
        Email Content
      </label>
      <app-skeleton
        v-if="checkingEmail"
        height="53vh"
        type="QInput"
        width="100%"
      />
      <editable-content
        v-else
        id="emailBody"
        v-model="emailContent"
        :mode="checkingEmail || disable ? 'blur' : 'read'"
        size="lg"
      />
    </div>
    <div class="row justify-between">
      <q-toggle
        v-model="inviteForm.ccHost"
        dense
        label="Send a copy to me"
        left-label
      />
      <app-button
        color="secondary"
        :disable="disable"
        hover-color="transparent"
        label="Send"
        no-caps
        padding="4px 13px"
        rounded
        text-color="darkish"
        unelevated
        @click="sendInvitation"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 100%;
  max-width: 1000px;
}
h1 {
  font-size: 2rem;
}
</style>
