<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { ref, onMounted } from 'vue'
import { fabGoogle } from '@quasar/extras/fontawesome-v6'
import { LocationQuery, useRoute } from 'vue-router'
import type { UtmData } from 'src/stores/auth-store-state-types'

const authStore = useAuthStore()

const $q = useQuasar()

const route = useRoute()

const query = ref(route.query)

function extractUtmParams(params: LocationQuery) {
  const utmData: UtmData = {}
  const validKeys = ['utm_campaign', 'utm_medium', 'utm_source']
  for (const [key, value] of Object.entries(params)) {
    const validKey = String(key)
    const validValue = String(value)
    if (validKeys.includes(validKey)) {
      utmData[validKey] = validValue
    }
  }
  authStore.utmData = utmData
}

const verifyCredentials = () => {
  const email: string = authStore.email
  const password = String(authStore.password)
  const confirmPassword = String(authStore.confirmPassword)
  if (email === '') {
    return false
  } else if (!password || password === '') {
    return false
  } else if (!confirmPassword || confirmPassword === '') {
    return false
  }
  return true
}

const loading = ref(false)

function onSubmit () {
  loading.value = true
  try {
    if (verifyCredentials()) {
      authStore.registerWithEmail()
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
const isPwd = ref(true)

onMounted(() => extractUtmParams(query.value))
</script>

<template>
  <q-form
    autocomplete="off"
    class="q-gutter-y-md signup-form"
    @reset="onReset"
    @submit="onSubmit"
  >
    <q-input
      id="email"
      v-model="authStore.email"
      autocomplete="off"
      color="orange"
      lazy-rules="ondemand"
      name="email"
      no-error-icon
      outlined
      placeholder="Enter Your Email Address ..."
      :rules="[
        val => !!val || '*Email is required',
        val => val.includes('@') && val.includes('.') || '*Please Provide a valid email address'
      ]"
      type="email"
    />
    <q-input
      id="password"
      v-model="authStore.password"
      autocomplete="off"
      color="orange"
      lazy-rules="ondemand"
      name="password"
      no-error-icon
      outlined
      placeholder="Create Your Password"
      :rules="[
        val => !!val || '*Password is required'
      ]"
      :type="isPwd ? 'password' : 'text'"
    >
      <template #append>
        <q-icon
          class="cursor-pointer"
          color="grey-5"
          :name="isPwd ? 'visibility_off' : 'visibility'"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      v-model="authStore.confirmPassword"
      color="orange"
      lazy-rules="ondemand"
      name="confirmPassword"
      no-error-icon
      outlined
      placeholder="Confirm Your Password"
      :rules="[
        val => !!val || '*Field is required',
        val => val === authStore.password || '*Passwords don\'t match'
      ]"
      :type="isPwd ? 'password' : 'text'"
    >
      <template #append>
        <q-icon
          class="cursor-pointer"
          color="grey-5"
          :name="isPwd ? 'visibility_off' : 'visibility'"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <div class="row justify-center">
      <div class="col-12 col-sm-8">
        <q-btn
          class="full-width full-height text-16"
          color="orange"
          label="Upload your 1st episode!"
          :loading="loading"
          no-caps
          padding="10px 25px"
          rounded
          text-color="grey-9"
          type="submit"
          unelevated
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
      <div class="col-12 col-sm-8 row justify-center">
        <q-btn
          class="full-width full-height text-16 robot-medium"
          color="white"
          no-caps
          outline
          padding="10px 25px"
          rounded
          text-color="grey-9"
          unelevated
          @click="signUpWithGoogle"
        >
          <q-icon
            class="q-mr-lg"
            left
            size="24px"
          >
            <q-img src="~assets/icons/google.png" />
          </q-icon>
          <div>Sign up with Google</div>
        </q-btn>
        <q-btn
          class="hidden full-width full-height google-btn text-20"
          no-caps
          padding="10px 25px"
          rounded
          text-color="white"
          @click="signUpWithGoogle"
        >
          <q-icon
            left
            :name="fabGoogle" />
          <div>Sign Up with Google</div>
        </q-btn>
      </div>
    </div>
  </q-form>
</template>

<style lang="scss" scoped>
.signup-form {
  max-height: 500px;
}

//input.form-input:focus,
//input.form-input:active {
//  border-color: #42B0E2;
//}

.google-btn {
  background-color: rgb(1, 116, 199);
}
</style>
