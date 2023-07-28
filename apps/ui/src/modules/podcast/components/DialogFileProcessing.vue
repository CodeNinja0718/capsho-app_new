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
  store.outputEpisodeTab = 'Title & Description'
  store.podcastFile = {}
  store.router.push({ name: 'UploadPodcast' })
  onDialogOK()
}
</script>

<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide">
    <q-card class="file-processing-error-card q-pa-md lexend-deca-regular text-grey-3 text-16">
      <q-card-section class="q-py-sm">
        <p class="text-h6">Your file successfully uploaded! 🙌</p>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <p>
          We’re processing it now and will notify you when we’re ready for you
          to choose your episode topic! (It’ll take about 10 mins)
        </p>
        <p>
          Feel free to upload your next episode while you wait 😊
        </p>
      </q-card-section>
      <q-card-actions class="q-px-md">
        <q-btn
          class="btn-grey border-radius-6"
          color="accent"
          label="Upload next episode"
          no-caps
          text-color="white"
          @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
