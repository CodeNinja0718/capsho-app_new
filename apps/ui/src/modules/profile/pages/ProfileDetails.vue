<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import AppButton from 'components/base/AppButton.vue'
import { useNotification } from 'src/composables/useNotification'
import UpdatePasswordDialog from 'src/modules/profile/components/UpdatePasswordDialog.vue'
import UploadLogoDialog from 'src/modules/profile/components/UploadLogoDialog.vue'
import UpdateEmailDialog from 'src/modules/profile/components/UpdateEmailDialog.vue'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const userInfo = reactive({
  fullName: authStore.user ? authStore.user.firstName + ' ' + authStore.user.lastName : '',
  email: authStore.auth.email || '',
  businessName: authStore.user.businessName || '',
  podcastName: authStore.user.podcastName || '',
  instagramLink: authStore.user.instagramLink || '',
  facebookLink: authStore.user.facebookLink || '',
  youtubeLink: authStore.user.youtubeLink || '',
  twitterLink: authStore.user.twitterLink || '',
  linkedinLink: authStore.user.linkedinLink || '',
  websiteLink: authStore.user.websiteLink || '',
  podcastLink: authStore.user.podcastLink || ''
})
const businessLogoURL = computed<string | null>(() => authStore.user?.businessLogoURL ?? '')
const updating = ref(false)
async function updateBusinessDetails () {
  updating.value = true
  const { triggerNegative, triggerPositive } = useNotification()
  const {
    fullName,
    businessName
  } = userInfo
  try {
    const userName = fullName.split(' ')
    const data = {
      firstName: userName[0] ?? '',
      lastName: userName[1] ?? '',
      businessName
    }
    await authStore.updateUser(data)
    triggerPositive('Successfully updated!')
  } catch (e) {
    if (e instanceof Error) {
      triggerNegative(e.message)
    }
  } finally {
    updating.value = false
  }
}
const businessDetails = ref(true)
// handle password updating
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
const isPwd = ref(true)
const passwordResetting = ref(false)
function updatePassword () {
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
// handle updating email
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
const updatingEmail = ref(false)
const isEmailFormValid = () => {
  const { email, newEmail, password } = emailForm
  if (!email || !newEmail || !password) {
    return false
  } else if (email === newEmail) {
    return false
  }
  return true
}
async function updateEmail () {
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

const $q = useQuasar()
const darkMode = computed({
  get() {
    return authStore.darkMode
  },
  set(val) {
    $q.dark.set(val)
    authStore.changeDarkMode(val)
  }
})
</script>

<template>
  <div class="q-pa-xl q-mt-md flex flex-center text-text">
    <q-form class="profile-form">
      <div class="grid grid-cols-1 md:grid-cols-8 justify-center no-wrap gap-12">
        <div class="col-span-1 md:col-span-3 flex flex-col items-center gap-8">
          <q-avatar size="200px">
            <q-img
              v-if="businessLogoURL"
              alt="User's business avatar"
              :src="businessLogoURL"
            />
          </q-avatar>
          <div
            class="text-center cursor-pointer"
            @click="authStore.toggleUploadLogoDialogState"
          >
            <div>Update logo</div>
          </div>
        </div>
        <div class="col-span-1 md:col-span-5">
          <!--            Full name & email-->
          <q-expansion-item
            v-model="businessDetails"
            group="profile"
            label="Update business details"
          >
            <fieldset class="q-gutter-y-sm">
              <div>
                <q-input
                  id="fullName"
                  v-model="userInfo.fullName"
                  dense
                  label="Full Name"
                  standout="bg-input-box-inside-box-popups text-text"
                  type="text"
                />
              </div>
              <div>
                <q-input
                  id="businessName"
                  v-model="userInfo.businessName"
                  dense
                  label="Business Name"
                  standout="bg-input-box-inside-box-popups text-text"
                />
              </div>
              <!--            Save changes-->
              <div class="q-my-lg">
                <AppButton
                  class="full-width border-radius-6 text-text"
                  color="accent"
                  label="Save Changes"
                  :loading="updating"
                  no-caps
                  unelevated
                  @click="updateBusinessDetails"
                >
                  <template #loading>
                    Updating...
                  </template>
                </AppButton>
              </div>
            </fieldset>
          </q-expansion-item>

          <q-expansion-item
            group="profile"
            label="Update password"
          >
            <fieldset>
              <div>
                <q-input
                  id="oldPassword"
                  v-model="passwordForm.oldPassword"
                  autocomplete="new-password"
                  dense
                  label="Old Password"
                  lazy-rules
                  placeholder="**********"
                  :rules="[val => !!val || '*Old Password is required']"
                  standout="bg-input-box-inside-box-popups text-text"
                  type="password"
                />
              </div>
              <div>
                <q-input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  dense
                  label="New Password"
                  lazy-rules
                  placeholder="**********"
                  :rules="[val => !!val || '*New Password is required']"
                  standout="bg-input-box-inside-box-popups text-text"
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
                <q-input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  dense
                  label="Confirm New Password"
                  lazy-rules
                  placeholder="**********"
                  :rules="[val => !!val || '*Confirm Password is required', val => val === passwordForm.newPassword || '*Oops! The passwords you’ve typed in don’t match!']"
                  standout="bg-input-box-inside-box-popups text-text"
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
                  class="full-width border-radius-6"
                  color="accent"
                  label="Update Password"
                  :loading="passwordResetting"
                  no-caps
                  rounded
                  @click="updatePassword"
                />
              </div>
            </fieldset>
          </q-expansion-item>
          <q-expansion-item
            group="profile"
            label="Update email address"
          >
            <fieldset>
              <div>
                <q-input
                  id="currentEmail"
                  v-model="emailForm.email"
                  dense
                  label="Current Email"
                  lazy-rules
                  :placeholder="emailForm.email"
                  :rules="[val => !!val || 'Current email is required']"
                  standout="bg-input-box-inside-box-popups text-text"
                />
              </div>
              <div>
                <q-input
                  id="newEmail"
                  v-model="emailForm.newEmail"
                  dense
                  label="New Email"
                  lazy-rules
                  placeholder="example@email.com"
                  :rules="[val => !!val || '*New email is required', val => val !== emailForm.email || '*Your emails match. Update your emails!']"
                  standout="bg-input-box-inside-box-popups text-text"
                />
              </div>
              <div>
                <q-input
                  id="password"
                  v-model="emailForm.password"
                  autocomplete="new-password"
                  dense
                  label="Your Password"
                  lazy-rules
                  placeholder="**********"
                  :rules="[val => !!val || '*Password is required']"
                  standout="bg-input-box-inside-box-popups text-text"
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
                  class="full-width border-radius-6"
                  color="accent"
                  label="Update Email"
                  :loading="updatingEmail"
                  no-caps
                  rounded
                  @click="updateEmail"
                />
              </div>
            </fieldset>
          </q-expansion-item>
          <q-expansion-item
            group="profile"
            label="Update theme"
          >
            <fieldset>
              <div>
                <q-toggle
                  v-model="darkMode"
                  class="w-full justify-between px-6 text-primary"
                  :label="darkMode ? 'Dark Theme' : 'Light Theme'"
                  left-label
                  size="64px"
                />
              </div>
            </fieldset>
          </q-expansion-item>
          <!--            Reset password or email-->
          <div
            v-if="false"
            class="column justify-start q-gutter-x-sm">
            <!--            Updates password-->
            <q-btn
              class="inter-bold text-body2"
              dense
              label="Update password"
              no-caps
              text-color="accent"
              unelevated
              @click="authStore.toggleUpdatePasswordDialogState"
            />
            <q-btn
              class="inter-bold text-body2"
              dense
              label="Update email address"
              no-caps
              text-color="accent"
              unelevated
              @click="authStore.toggleUpdateEmailDialogState"
            />
            <q-btn
              class="inter-bold text-body2"
              dense
              label="Update profile photo"
              no-caps
              text-color="accent"
              unelevated
              @click="authStore.toggleUploadLogoDialogState"
            />
          </div>
        </div>
      </div>
    </q-form>
  </div>
  <UpdatePasswordDialog />
  <UploadLogoDialog />
  <UpdateEmailDialog />
</template>

<style lang="sass" scoped>
.profile-form
  max-width: 600px
  width: 1000%
.q-field
  &--dense
    .q-field__control, .q-field__marginal
      height: 30px !important
.profile-logo
  width: 300px
  height: 100%
  min-height: 390px
  max-height: 532px

fieldset
  border: 0
</style>
