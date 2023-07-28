<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { ref, onMounted } from 'vue'
import { LocationQuery, useRoute } from 'vue-router'
import type { UtmData } from 'src/stores/auth-store-state-types'

const props = defineProps({
  isGuest: {
    type: Boolean,
    required: false,
    default: false
  }
})

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
      authStore.userType = props.isGuest ? 'guest' : 'host'
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
  authStore.userType = props.isGuest ? 'guest' : 'host'
  authStore.loginWithGoogleProvider({ isSignUp: true })
}
const isPwd = ref(true)

onMounted(() => extractUtmParams(query.value))
</script>

<template>
  <q-form
    autocomplete="off"
    class="py-6 w-full"
    @reset="onReset"
    @submit="onSubmit"
  >
    <div>
      <label
        class="block text-left text-white ml-7 lexend-regular"
        for="email"
      >Email</label>
      <q-input
        id="email"
        v-model="authStore.email"
        autocomplete="off"
        color="accent"
        dark
        lazy-rules="ondemand"
        name="email"
        no-error-icon
        outlined
        :rules="[
          val => !!val || '*Email is required',
          val => val.includes('@') && val.includes('.') || '*Please Provide a valid email address'
        ]"
        text-color="white"
        type="email"
      >
        <template #append>
          <div class="flex items-center gap-2">
            <span class="text-xs text-white lexend-regular">Sign up with</span>
            <q-btn
              class="text-16 robot-medium google-btn"
              color="white"
              no-caps
              outline
              rounded
              text-color="grey-9"
              unelevated
              @click="signUpWithGoogle"
            >
              <q-icon
                class="q-mx-sm"
                left
                size="24px"
              >
                <q-img src="~assets/icons/google.png" />
              </q-icon>
            </q-btn>
          </div>
        </template>
      </q-input>
    </div>
    <div>
      <label
        class="block text-left text-white ml-7 lexend-regular"
        for="email"
      >Create your password</label>
      <q-input
        id="password"
        v-model="authStore.password"
        autocomplete="off"
        color="accent"
        dark
        lazy-rules="ondemand"
        name="password"
        no-error-icon
        outlined
        :rules="[
          val => !!val || '*Password is required'
        ]"
        text-color="white"
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
    </div>
    <div>
      <label
        class="block text-left text-white ml-7 lexend-regular"
        for="email"
      >Confirm Password</label>
      <q-input
        v-model="authStore.confirmPassword"
        color="accent"
        dark
        lazy-rules="ondemand"
        name="confirmPassword"
        no-error-icon
        outlined
        :rules="[
          val => !!val || '*Field is required',
          val => val === authStore.password || '*Passwords don\'t match'
        ]"
        text-color="white"
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
    </div>
    <div class="grid grid-cols-12 justify-center items-center gap-6">
      <div class="col-span-5">
        <q-btn
          class="full-width text-xs"
          color="accent"
          dense
          label="Create your free account now"
          :loading="loading"
          no-caps
          rounded
          text-color="white"
          type="submit"
          unelevated
        />
      </div>
      <div class="col-span-7">
        <div class="text-sm text-left py-2 text-hint lexend-regular">
          <span>
            Already a Capsho user?
            <span
              class="cursor-pointer text-white"
              @click="$router.push({ name: 'AuthPage' })">
              <span class="text-underline">Sign in here</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </q-form>
</template>
<style lang="scss">
</style>
