<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'

import MobileAuthCard from 'src/modules/auth/components/mobile/MobileAuthCard.vue'

const authStore = useAuthStore()
const loading = ref(false)
function onSubmit () {
  loading.value = true
  try {
    authStore.loginWithEmail()
  } finally {
    loading.value = false
  }
}
async function signInWithGoogle () {
  await authStore.loginWithGoogleProvider({ isSignUp: false })
}

</script>

<template>
  <MobileAuthCard title="Sign In">
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
            <div class="row justify-end q-mt-sm q-mb-md">
              <span
                class="cursor-pointer"
                @click="$router.push({ name: 'AuthResetPassword' })">
                <span class="text-caption text-label">Forgot password?</span>
              </span>
            </div>
          </div>
          <!--                Submit button-->
          <div class="row justify-center">
            <div class="col-12">
              <q-btn
                class="button-shape full-width q-py-md text-weight-bold shadow"
                :class="{ 'disabled': loading }"
                color="accent"
                label="Sign In"
                :loading="loading"
                no-caps
                type="submit"
                unelevated
              >
                <template #loading>
                  Signing in...
                </template>
              </q-btn>
            </div>
            <!--                or section-->
            <div class="col-7 q-py-xl row justify-center items-center no-wrap q-gutter-x-sm">
              <div class="col-6 separator">
                <q-separator/>
              </div>
              <span class="col-auto text-center text-label text-weight-medium">Or Sign In With</span>
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
                @click="signInWithGoogle"
              >
                <q-icon left>
                  <q-img src="~assets/icons/google.png"/>
                </q-icon>
                <div>Sign in with Google</div>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="q-pt-lg text-grey-6 inter-regular">
          <div class="row items-center q-gutter-x-sm">
            <p class="text-label text-weight-medium">
              Don't have an account?
              <span
                class="cursor-pointer text-primary"
                @click="$router.push({ name: 'AuthSignUp' })">
                <span class="text-weight-bold">Register</span>
              </span>
            </p>
          </div>
        </div>
      </q-form>
    </template>
  </MobileAuthCard>
</template>
