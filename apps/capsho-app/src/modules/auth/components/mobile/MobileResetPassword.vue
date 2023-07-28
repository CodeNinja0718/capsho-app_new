<script setup lang="ts">
import { ref } from 'vue'

import { useAuthStore } from 'stores/auth-store'
import { useNotification } from 'src/composables/useNotification'

import MobileAuthCard from 'src/modules/auth/components/mobile/MobileAuthCard.vue'

const email = ref('')
const loading = ref(false)
const authStore = useAuthStore()

function isValidEmail (email: string): boolean {
  const validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  return Boolean(email.match(validEmailRegex))
}

function onSubmit () {
  const { triggerWarning } = useNotification()
  if (isValidEmail(email.value)) {
    loading.value = true
    try {
      authStore.sendResetPasswordLink(email.value)
    } finally {
      loading.value = false
    }
  } else {
    triggerWarning('Please fill all required fields')
  }
}

</script>

<template>
  <MobileAuthCard title="Reset Password">
    <template #body>
      <q-form @submit.prevent="onSubmit">
        <div class="q-gutter-y-xs">
          <div>
            <label
              class="text-subtitle2 text-darkish"
              for="email">Email address</label>
            <q-input
              id="email"
              v-model="email"
              class="input q-mt-sm"
              lazy-rules="ondemand"
              outlined
              placeholder="Enter email address"
              :rules="[val => !!val || '* Email is required']"
              standout
              type="email"
            />
          </div>
          <div class="row justify-center">
            <div class="col-12">
              <q-btn
                class="button-shape full-width q-py-md text-weight-bold shadow"
                :class="{ 'disabled': loading }"
                color="accent"
                label="Send reset link"
                :loading="loading"
                no-caps
                type="submit"
                unelevated
              >
                <template #loading>
                  Sending...
                </template>
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </template>
  </MobileAuthCard>
</template>
