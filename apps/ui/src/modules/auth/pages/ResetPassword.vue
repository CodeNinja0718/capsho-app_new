<script setup lang="ts">
import { ref } from 'vue'
import AppCard from 'components/base/AppCard.vue'
import AppButton from 'components/base/AppButton.vue'
import BrandLogo from 'components/BrandLogo.vue'

// Mobile components
import MobileResetPassword from 'src/modules/auth/components/mobile/MobileResetPassword.vue'

import { useAuthStore } from 'stores/auth-store'
import { useNotification } from 'src/composables/useNotification'

const email = ref('')
const authStore = useAuthStore()

function isValidEmail (email: string): boolean {
  const validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  return Boolean(email.match(validEmailRegex))
}

function onSubmit () {
  const { triggerWarning } = useNotification()
  if (isValidEmail(email.value)) {
    authStore.sendResetPasswordLink(email.value)
  } else {
    triggerWarning('Please fill all required fields')
  }
}
</script>

<template>
  <q-page
    class="q-py-sm-sm"
    :class="{'bg-primary-light-blue': $q.screen.lt.sm }">
    <div class="curtain lt-sm fixed full-width fixed-top-right bg-accent"></div>
    <div class="q-pb-lg q-py-sm-sm full-width q-gutter-y-lg h-screen flex flex-col">
      <div class="text-center q-mt-sm-xl col-4">
        <BrandLogo
          :color="$q.screen.lt.sm ? 'white' : 'purple'"
          size="lg"
        />
      </div>
      <div class="col-8 h-full flex justify-center items-center">
        <AppCard
          v-if="$q.screen.gt.xs"
          size="sm"
          title="Reset Password">
          <template #body>
            <q-form
              autocomplete="off"
              class="q-gutter-y-md"
              @submit.prevent="onSubmit">
              <div>
                <label
                  class="inter-regular text-grey-6"
                  for="email">
                  Email Address
                </label>
                <q-input
                  id="email"
                  v-model="email"
                  color="accent"
                  dense
                  lazy-rules
                  outlined
                  :rules="[val => !!val || '*Email is required']"
                  type="email"
                />
              </div>
              <div class="row justify-center">
                <AppButton
                  color="accent"
                  label="Send reset link"
                  no-caps
                  rounded
                  type="submit"
                />
              </div>
            </q-form>
          </template>
        </AppCard>
        <MobileResetPassword v-else/>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

</style>
