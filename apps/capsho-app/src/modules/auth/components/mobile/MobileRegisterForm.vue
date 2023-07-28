<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { ref } from 'vue'

import { useNotification } from 'src/composables/useNotification'
import MobileAuthCard from 'src/modules/auth/components/mobile/MobileAuthCard.vue'

const authStore = useAuthStore()
const $q = useQuasar()
const verifyCredentials = () => {
  const email: string = authStore.email
  const password: string = authStore.password
  if (email === '') {
    return false
  } else if (password === '') {
    return false
  }
  return true
}
const loading = ref(false)
async function onSubmit () {
  const { triggerNegative } = useNotification()
  loading.value = true
  try {
    if (verifyCredentials()) {
      await authStore.registerWithEmail()
    } else {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'You need to provide your email and/or password first'
      })
    }
  } catch (e) {
    if (e instanceof Error) {
      triggerNegative(e.message)
    }
  } finally {
    loading.value = false
    onReset()
  }
}
function onReset () {
  authStore.email = ''
  authStore.password = ''
}
function signUpWithGoogle () {
  authStore.loginWithGoogleProvider({ isSignUp: true })
}
</script>

<template>
  <MobileAuthCard
    sub-title="Enter your information to create an account"
    title="Create your account">
    <template #body>
      <q-form @submit.prevent="onSubmit">
        <div class="q-gutter-y-xs">
          <div>
            <label
              class="text-subtitle2"
              for="email">Email address</label>
            <q-input
              id="email"
              v-model="authStore.email"
              class="input q-mt-sm"
              lazy-rules="ondemand"
              outlined
              placeholder="Enter email address"
              :rules="[val => !!val || '* Email is required']"
              standout
              type="email"
            />
          </div>
          <!--Password input-->
          <div>
            <label
              class="text-subtitle2"
              for="password">Password</label>
            <q-input
              id="password"
              v-model="authStore.password"
              class="input q-mt-sm"
              hide-bottom-space
              lazy-rules="ondemand"
              outlined
              placeholder="Enter password"
              :rules="[val => !!val || '* Password is required']"
              standout
              type="password"
            />
          </div>
          <!--Submit button-->
          <div class="row justify-center q-mt-md">
            <div class="col-12">
              <q-btn
                class="button-shape full-width q-py-md text-weight-bold shadow"
                :class="{ 'disabled': loading }"
                color="accent"
                label="Continue"
                :loading="loading"
                no-caps
                type="submit"
                unelevated
              >
                <template #loading>
                  Creating account...
                </template>
              </q-btn>
            </div>
            <!--                or section-->
            <div class="col-7 q-py-xl row justify-center items-center no-wrap q-gutter-x-sm">
              <div class="col-6 separator">
                <q-separator/>
              </div>
              <span class="col-auto text-center text-label text-weight-medium">Or Sign Up With</span>
              <div class="col-6 separator">
                <q-separator/>
              </div>
            </div>
            <!--                Sign in with google-->
            <div class="col-12 row justify-center">
              <q-btn
                class="button-shape full-width q-py-md text-weight-bold text-label"
                no-caps
                outline
                unelevated
                @click="signUpWithGoogle"
              >
                <q-icon left>
                  <q-img src="~assets/icons/google.png"/>
                </q-icon>
                <div>Sign up with Google</div>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="q-pt-lg text-grey-6 inter-regular">
          <div class="row items-center q-gutter-x-sm">
            <p class="text-label text-weight-medium">
              Already have an account?
              <span
                class="cursor-pointer text-primary"
                @click="$router.push({ name: 'AuthPage' })">
                <span class="text-weight-bold">Login</span>
              </span>
            </p>
          </div>
        </div>
      </q-form>
    </template>
  </MobileAuthCard>
</template>
