<script setup lang="ts">
import { QFile } from 'quasar'
import AppCard from 'components/base/AppCard.vue'
import { outlinedFileUpload } from '@quasar/extras/material-icons-outlined'
import { useAuthStore } from 'stores/auth-store'
import { computed, ref } from 'vue'
import { ImageFile, UploadableImage } from 'src/models/uploadableFile'
import AppButton from 'components/base/AppButton.vue'
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
async function onSubmit () {
  const { triggerNegative } = useNotification()
  try {
    await authStore.uploadBrandLogo()
  } catch (e) {
    if (e instanceof Error) {
      triggerNegative(e.message)
    }
  } finally {
    authStore.toggleUploadLogoDialogState()
  }
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
  <q-dialog v-model="authStore.showUploadLogoDialog">
    <AppCard>
      <template #body>
        <div
          v-if="!authStore.businessLogo.id"
          class="row justify-center">
          <div class="column items-center q-gutter-y-sm">
            <div class="text-subtitle1">Upload new photo</div>
            <q-avatar
              class="cursor-pointer"
              color="grey-2"
              size="6rem"
              @click="pickFile"
            >
              <q-icon
                color="grey-7"
                :name="outlinedFileUpload"
                size="2.3rem" />
            </q-avatar>
          </div>
        </div>
        <q-space />
        <q-form
          enctype="multipart/form-data"
          @submit.prevent="onSubmit">
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
            <q-avatar size="8rem">
              <q-img :src="authStore.businessLogoURL" />
            </q-avatar>
            <q-chip
              color="grey-1"
              removable
              size="1.3rem"
              text-color="black"
              @remove="authStore.businessLogo = {}"
            >
              <span class="ellipsis">
                {{ authStore.businessLogo?.name }}
              </span>
            </q-chip>
          </div>
          <div class="row q-py-sm justify-center">
            <AppButton
              color="accent"
              :disabled="!authStore.businessLogo.id"
              hover-color="transparent"
              label="Upload"
              padding="7px 44px"
              rounded
              type="submit"
              unelevated
            />
          </div>
        </q-form>
      </template>
    </AppCard>
  </q-dialog>
</template>
