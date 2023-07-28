<template>
  <q-dialog v-model="authStore.showUpdatePasswordDialog">
    <AppCard title="Update Password">
      <template #body>
        <q-form
          autocomplete="off"
          class="q-gutter-y-md"
          @submit.prevent="onPasswordFormSubmit"
        >
          <div>
            <label for="oldPassword">Old Password</label>
            <q-input
              id="oldPassword"
              v-model="passwordForm.oldPassword"
              autocomplete="new-password"
              dense
              lazy-rules
              outlined
              placeholder="**********"
              :rules="[val => !!val || '*Old Password is required']"
              type="password"
            />
          </div>
          <div>
            <label for="newPassword">New Password</label>
            <q-input
              id="newPassword"
              v-model="passwordForm.newPassword"
              dense
              lazy-rules
              outlined
              placeholder="**********"
              :rules="[val => !!val || '*New Password is required']"
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
          <div>
            <label for="confirmPassword">Confirm New Password</label>
            <q-input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              dense
              lazy-rules
              outlined
              placeholder="**********"
              :rules="[val => !!val || '*Confirm Password is required', val => val === passwordForm.newPassword || '*Oops! The passwords you’ve typed in don’t match!']"
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
              label="Update Password"
              :loading="passwordResetting"
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
import AppCard from 'components/base/AppCard.vue'
import { reactive, ref } from 'vue'
import { useNotification } from 'src/composables/useNotification'
import { useAuthStore } from 'stores/auth-store'
import AppButton from 'components/base/AppButton.vue'

const authStore = useAuthStore()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const isPasswordFormValid = () => {
  const { oldPassword, newPassword, confirmPassword } = passwordForm
  if (!oldPassword || !newPassword || !confirmPassword) {
    return false
  } else if (newPassword !== confirmPassword) {
    return false
  }
  return true
}
const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.confirmPassword = ''
  isPwd.value = true
}
const passwordResetting = ref(false)
function onPasswordFormSubmit () {
  const { triggerWarning } = useNotification()
  passwordResetting.value = true
  const { oldPassword, newPassword } = passwordForm
  try {
    if (isPasswordFormValid()) {
      const credentials = {
        email: authStore.auth.email,
        oldPassword,
        newPassword
      }
      authStore.updatePassword(credentials)
    } else {
      triggerWarning('Please fill all required fields')
    }
  } catch (e) {
    if (e instanceof Error) {
      triggerWarning(e.message)
    }
  } finally {
    passwordResetting.value = false
    resetPasswordForm()
    authStore.toggleUpdatePasswordDialogState()
  }
}
const isPwd = ref(true)
</script>
