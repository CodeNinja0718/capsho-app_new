<script setup lang="ts">
import { QFile } from 'quasar'
import { outlinedFileUpload } from '@quasar/extras/material-icons-outlined'
import { useAuthStore } from 'stores/auth-store'
import { computed, ref } from 'vue'
import { ImageFile, UploadableImage } from 'src/models/uploadableFile'
import { useNotification } from 'src/composables/useNotification'

const authStore = useAuthStore()
const businessLogoUploader = ref<QFile | null>(null)
const businessLogo = computed({
  get () {
    return null as unknown as File
  },
  set (value: File) {
    authStore.businessLogo = new UploadableImage(value)
  }
})
function pickFile () {
  authStore.businessLogo = {} as ImageFile
  businessLogoUploader.value?.pickFiles()
}
function onRejected () {
  const { triggerWarning } = useNotification()
  const errorMessage = {
    message: 'Oops! You’ve uploaded a file that isn’t an image.',
    caption: 'Please upload an image file for your logo.'
  }
  triggerWarning(errorMessage.message, true, errorMessage.caption)
}
</script>

<template>
  <div>
    <div v-if="!authStore.businessLogo.id">
      <div class="column items-center q-gutter-y-sm">
        <q-avatar
          class="cursor-pointer bg-dark"
          size="10rem"
          @click="pickFile"
        >
          <q-img
            alt=""
            class="w-16"
            src="~src/assets/icons/upload.svg"
          />
        </q-avatar>
        <q-btn
          class="inter-regular lexend-regular"
          flat
          label="Upload your logo"
          no-caps
          @click="pickFile"
        />
      </div>
    </div>
    <q-space />
    <q-file
      ref="businessLogoUploader"
      v-model="businessLogo"
      accept=".jpg, image/*"
      class="hidden"
      max-files="1"
      @rejected="onRejected"
    />
    <div
      v-if="authStore.businessLogo.id"
      class="full-width column items-center q-gutter-y-sm">
      <q-avatar size="6rem">
        <q-img :src="authStore.businessLogo.url" />
      </q-avatar>
      <q-chip
        color="grey-1"
        removable
        size="1rem"
        text-color="black"
        @remove="authStore.businessLogo = {}"
      >
        <span class="ellipsis">
          {{ authStore.businessLogo?.name }}
        </span>
      </q-chip>
    </div>
  </div>
</template>
