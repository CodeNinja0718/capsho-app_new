<script setup>
import { useDialogPluginComponent } from 'quasar'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const store = useUploadPodcastStore()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

function onOKClick () {
  store.processStep = 'uploadPodcast'
  store.outputEpisodeTab = 'title'
  store.podcastFile = {}
  store.router.push({ name: 'UploadPodcast' })
  onDialogOK()
}
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide">
    <q-card class="file-processing-error-card q-pa-md lexend-regular text-darkish text-16">
      <q-card-section class="q-py-sm">
        <p class="text-h6">Oops! We're having some trouble processing your file.</p>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <p>
          90% of the time, re-uploading it works a treat, so please try again
          (don't worry, this won't take up an episode credit)
        </p>
      </q-card-section>
      <q-card-actions class="q-px-md">
        <q-btn
          class="btn-grey border-radius-6"
          color="accent"
          label="Re-upload"
          no-caps
          text-color="white"
          @click="onOKClick" />
      </q-card-actions>
      <q-card-section>
        <p>
          <b>Already tried that with no luck?</b>
          Hit up us on Live Chat or email us at
          <a href="mailto:support@capsho.com?subject=File Uploading Error">support@capsho.com</a>
          and we'll take care of you!
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
