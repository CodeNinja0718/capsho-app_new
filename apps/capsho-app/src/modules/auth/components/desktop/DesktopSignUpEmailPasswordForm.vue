<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { ref } from 'vue'

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
  } catch (err) {
    alert(err)
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
  <q-form
    autocomplete="off"
    class="text-white"
    @reset="onReset"
    @submit="onSubmit"
  >
    <div>
      <label
        class="inter-regular"
        for="email"
      >Email address</label>
      <q-input
        id="email"
        v-model="authStore.email"
        bg-color="white"
        class="rounded-borders"
        dense
        lazy-rules
        outlined
        placeholder="user@sample.com"
        :rules="[val => !!val || '*Email is required']"
        type="email"
      />
    </div>
    <div>
      <label
        class="inter-regular"
        for="password"
      >Password</label>
      <q-input
        id="password"
        v-model="authStore.password"
        bg-color="white"
        class="border-radius-10"
        dense
        lazy-rules
        outlined
        :rules="[val => !!val || '*Password is required']"
        type="password"
      />
    </div>
    <div class="row justify-center">
      <div class="col-8">
        <q-btn
          class="full-width full-height"
          color="orange"
          label="Continue"
          :loading="loading"
          no-caps
          rounded
          text-color="grey-9"
          type="submit"
        />
      </div>
      <div class="col-7 q-py-md row justify-center items-center">
        <div class="col-5 separator">
          <q-separator />
        </div>
        <span class="col-1 text-center">or</span>
        <div class="col-5 separator">
          <q-separator />
        </div>
      </div>
      <div class="col-8 row justify-center">
        <q-btn
          class="full-width full-height"
          color="white"
          no-caps
          rounded
          text-color="grey-9"
          @click="signUpWithGoogle"
        >
          <q-icon left>
            <q-img src="~assets/icons/google.png" />
          </q-icon>
          <div>Sign up with Google</div>
        </q-btn>
      </div>
    </div>
    <div class="text-center q-pt-lg inter-regular">
      <p>
        Already have an account?
        <span
          class="cursor-pointer"
          @click="$router.push({ name: 'AuthPage' })">
          <span class="text-weight-bold">Login</span>
        </span>
      </p>
    </div>
  </q-form>
</template>

<style lang="sass" scoped>
.q-field--outlined .q-field__control
  padding: 0 !important
</style>
