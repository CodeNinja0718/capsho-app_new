<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import DesktopUploadBusinessLogo from 'src/modules/auth/components/desktop/DesktopUploadBusinessLogo.vue'
import { useNotification } from 'src/composables/useNotification'

const options = Object.freeze(
  [
    'To create assets for my own podcast',
    'For my VA or team member to create assets for my podcast',
    'To create assets for my clients\' podcasts',
    'To share as a useful tool with my clients / community'
  ]
)

const authStore = useAuthStore()
const isValid = computed(() => {
  if (authStore.userType === 'guest') {
    return authStore.businessName
  } else {
    return authStore.primaryPurpose.length > 0
  }
})
const { triggerWarning } = useNotification()
async function onSubmit () {
  if (isValid.value) {
    await authStore.uploadBrandLogo()
    await authStore.saveUser()
  } else {
    triggerWarning('Select purpose!')
  }
}
</script>

<template>
  <q-form @submit="onSubmit"
  >
    <div class="column items-center q-gutter-y-lg full-width">
      <div class="row no-wrap justify-center full-width q-col-gutter-x-sm">
        <div class="col-6 text-center q-gutter-y-xs">
          <label
            class="inter-regular text-subtitle1 text-grey-7 text-weight-medium"
            for="businessName">Your business name</label>
          <q-input
            id="businessName"
            v-model="authStore.businessName"
            color="accent"
            dense
            lazy-rules
            outlined
            placeholder="Please enter the brand name you do business as"
            :rules="[ val => val && val.length > 0 || '*Business name is required']"
            type="text"
          />
        </div>
      </div>
    </div>
    <DesktopUploadBusinessLogo />
    <div
      v-if="authStore.userType === 'host'"
      class="column items-center q-gutter-y-lg full-width"
      style="padding-top: 20px">
      <div class="row no-wrap justify-center full-width q-col-gutter-x-sm">
        <div class="col-6 text-center q-gutter-y-xs">
          <label
            class="inter-regular text-grey-7 text-subtitle1 text-weight-medium"
            for="primaryPurpose">
            What will you be using Capsho for, primarily?
          </label>
          <q-select
            id="primaryPurpose"
            v-model="authStore.primaryPurpose"
            dense
            emit-value
            label="Select one"
            :options="options"
            outlined
          />
        </div>
      </div>
    </div>
    <div class="row justify-center q-py-lg">
      <q-btn
        color="accent"
        :disable="!isValid"
        label="Continue"
        no-caps
        padding="8px 38px"
        rounded
        type="submit"
      />
    </div>
  </q-form>
</template>
