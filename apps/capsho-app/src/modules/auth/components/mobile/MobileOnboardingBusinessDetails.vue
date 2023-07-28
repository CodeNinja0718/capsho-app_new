<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useNotification } from 'src/composables/useNotification'

import MobileAuthCard from 'src/modules/auth/components/mobile/MobileAuthCard.vue'
import MobileUploadBusinessLogo from 'src/modules/auth/components/mobile/MobileUploadBusinessLogo.vue'

const options = ref([
  'To create assets for my own podcast',
  'For my VA or team member to create assets for my podcast',
  'To create assets for my clients\' podcasts',
  'To share as a useful tool with my clients / community'
])

const authStore = useAuthStore()
const isValid = computed(() => authStore.primaryPurpose.length > 0)
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
  <MobileAuthCard
    centered
    title="Let's Get this Capsho-W On The Road">
    <template #body>
      <q-form @submit.prevent="onSubmit">
        <div class="q-gutter-y-xs">
          <div>
            <label
              class="text-subtitle2 text-center"
              for="businessName">Your business name</label>
            <q-input
              id="businessName"
              v-model="authStore.businessName"
              class="input q-mt-sm"
              lazy-rules="ondemand"
              outlined
              placeholder="Enter business name"
              :rules="[val => !!val || '*First name is required']"
              standout
              type="text"
            />
          </div>
          <MobileUploadBusinessLogo />
          <div class="q-pb-lg">
            <label
              class="text-subtitle2 text-center"
              for="primaryPurpose"> What will you be using Capsho for, primarily?</label>
            <q-select
              id="primaryPurpose"
              v-model="authStore.primaryPurpose"
              class="input q-mt-sm"
              emit-value
              label="Select one"
              lazy-rules="ondemand"
              :options="options"
              outlined
              standout
            />
          </div>
          <!--Submit button-->
          <div class="row justify-center">
            <div class="col-12">
              <q-btn
                class="button-shape full-width q-py-md text-weight-bold shadow"
                color="accent"
                label="Continue"
                no-caps
                type="submit"
                unelevated
              >
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </template>
  </MobileAuthCard>
</template>
