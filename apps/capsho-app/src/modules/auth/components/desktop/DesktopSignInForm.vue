<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'

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
  <q-form @submit.prevent="onSubmit">
    <div class="q-gutter-y-sm">
      <!--                Email address input-->
      <div>
        <label
          class="inter-regular text-grey-6"
          for="email"
        >Email address</label>
        <q-input
          id="email"
          v-model="authStore.email"
          color="accent"
          dense
          lazy-rules
          outlined
          :rules="[val => !!val || '*Email is required']"
          type="email"
        />
      </div>
      <!--                Password input-->
      <div>
        <label
          class="inter-regular text-grey-6"
          for="password"
        >Password</label>
        <q-input
          id="password"
          v-model="authStore.password"
          class="border-radius-10"
          color="accent"
          dense
          hide-bottom-space
          lazy-rules
          outlined
          :rules="[val => !!val || '*Password is required']"
          type="password"
        />
        <div class="row justify-end">
          <span
            class="cursor-pointer"
            @click="$router.push({ name: 'AuthResetPassword' })">
            <span class="text-caption text-grey-5">Forgot password?</span>
          </span>
        </div>
      </div>
      <!--                Submit button-->
      <div class="row justify-center">
        <div class="col-8">
          <q-btn
            class="full-width full-height"
            :class="{ 'disabled': loading }"
            color="accent"
            label="Sign In"
            :loading="loading"
            no-caps
            push
            rounded
            type="submit"
          >
            <template #loading>
              Signing in...
            </template>
          </q-btn>
        </div>
        <!--                or section-->
        <div class="col-7 q-py-md row justify-center items-center no-wrap q-gutter-x-sm">
          <div class="col-6 separator">
            <q-separator/>
          </div>
          <span class="col-auto text-center">or</span>
          <div class="col-6 separator">
            <q-separator/>
          </div>
        </div>
        <!--                Sign in with google-->
        <div class="col-8 row justify-center">
          <q-btn
            class="full-width full-height"
            no-caps
            rounded
            style="color: gray"
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
      <div class="row justify-center items-center q-gutter-x-sm">
        <p>
          Don't have an account?
          <span
            class="cursor-pointer"
            @click="$router.push({ name: 'AuthSignUp' })">
            <span class="text-weight-bold">Register</span>
          </span>
        </p>
      </div>
    </div>
  </q-form>
</template>
