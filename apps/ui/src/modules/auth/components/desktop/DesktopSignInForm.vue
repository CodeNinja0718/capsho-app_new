<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, LocationQuery } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import type { AppUserType } from 'stores/auth-store-state-types'

const route = useRoute()

const query = ref(route.query)

function extractUserTypeParams(params: LocationQuery) {
  const validUserTypes = ['guest', 'host']
  let userType: AppUserType = 'host'
  for (const [key, value] of Object.entries(params)) {
    const validKey = String(key)
    const validValue = String(value)
    if (['userType'].includes(validKey) && validUserTypes.includes(validValue)) {
      userType = validValue as AppUserType
    }
  }
  authStore.userType = userType
}

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
const isPwd = ref(true)

onMounted(() => extractUserTypeParams(query.value))
</script>

<template>
  <q-form
    class="poppins-regular py-6"
    @submit.prevent="onSubmit"
  >
    <!--                Email address input-->
    <div>
      <label
        class="block text-left text-white"
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
      />
    </div>
    <!--                Password input-->
    <div>
      <label
        class="block text-left text-white"
        for="password"
      >Password</label>
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
    <div class="row justify-start">
      <span
        class="cursor-pointer underline"
        @click="authStore.router.push({ name: 'AuthResetPassword' })"
      >
        Forgot password?
      </span>
    </div>
    <!--Submit button-->
    <div class="grid grid-cols-12 q-pt-lg">
      <div class= "col-span-12 md:col-span-5 lg:col-span-4">
        <q-btn
          class="full-width full-height text-16"
          :class="{ 'disabled': loading }"
          color="accent"
          dense
          label="Sign In"
          :loading="loading"
          no-caps
          rounded
          text-color="white"
          type="submit"
          unelevated
        >
          <template #loading>
            Signing in...
          </template>
        </q-btn>
      </div>
      <div class="col-span-12 md:col-span-2 lg:col-span-1 flex justify-center items-center">Or</div>
      <div class="col-span-12 md:col-span-5 lg:col-span-2">
        <q-btn
          class="full-width text-16 robot-medium google-btn"
          color="white"
          no-caps
          outline
          rounded
          text-color="grey-9"
          unelevated
          @click="signInWithGoogle"
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
    </div>
  </q-form>
</template>

<style lang="scss">
.google-btn.q-btn--outline:before{
  background-color: white;
}
</style>
