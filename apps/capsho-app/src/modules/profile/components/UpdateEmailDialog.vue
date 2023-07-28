<template>
  <q-dialog v-model="authStore.showUpdateEmailDialog">
    <AppCard title="Update Email">
      <template #body>
        <q-form
          autocomplete="off"
          class="q-gutter-y-md"
          @submit.prevent="onSubmit"
        >
          <div>
            <label for="currentEmail">Current Email</label>
            <q-input
              id="currentEmail"
              v-model="emailForm.email"
              dense
              lazy-rules
              outlined
              :placeholder="emailForm.email"
              :rules="[val => !!val || 'Current email is required']"
            />
          </div>
          <div>
            <label for="newEmail">New Email</label>
            <q-input
              id="newEmail"
              v-model="emailForm.newEmail"
              dense
              lazy-rules
              outlined
              placeholder="example@email.com"
              :rules="[val => !!val || '*New email is required', val => val !== emailForm.email || '*Your emails match. Update your emails!']"
            />
          </div>
          <div>
            <label for="password">Your Password</label>
            <q-input
              id="password"
              v-model="emailForm.password"
              autocomplete="new-password"
              dense
              lazy-rules
              outlined
              placeholder="**********"
              :rules="[val => !!val || '*Password is required']"
              :type="isPwd ? 'password' : 'text'"
            >
              <template #append>
                <q-icon
                  class="cursor-pointer"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <div class="row justify-center">
            <AppButton
              color="accent"
              label="Update Email"
              :loading="updatingEmail"
              no-caps
              rounded
              type="submit"
            />
          </div>
        </q-form>
      </template>
    </AppCard>
  </q-dialog>
</template>
<script setup lang="ts">
import AppCard from 'components/AppCard.vue'
import { reactive, ref } from 'vue'
import { useNotification } from 'src/composables/useNotification'
import { useAuthStore } from 'stores/auth-store'
import AppButton from 'components/AppButton.vue'

const authStore = useAuthStore()

const isEmailFormValid = () => {
  const { email, newEmail, password } = emailForm
  if (!email || !newEmail || !password) {
    return false
  } else if (email === newEmail) {
    return false
  }
  return true
}
const updatingEmail = ref(false)
const isPwd = ref(true)
const emailForm = reactive({
  email: authStore.auth.email || '',
  newEmail: '',
  password: ''
})
const resetEmailForm = () => {
  emailForm.newEmail = ''
  emailForm.password = ''
  isPwd.value = true
}
async function onSubmit () {
  const { triggerNegative, triggerWarning } = useNotification()
  const { email, newEmail, password } = emailForm
  if (isEmailFormValid()) {
    try {
      const credentials = {
        email,
        newEmail,
        password
      }
      await authStore.updateEmail(credentials)
    } catch (e) {
      if (e instanceof Error) {
        triggerNegative(e.message)
      }
    } finally {
      updatingEmail.value = false
      resetEmailForm()
      authStore.toggleUpdateEmailDialogState()
    }
  } else {
    triggerWarning('Please fill all required fields')
  }
}
</script>
