<script setup>
  import { onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { signInWithGoogle } from '../services/authService'
  import { useGtag } from 'vue-gtag-next'
  import SignInForm from '../components/SignInForm'

  const $store = useStore()
  const { query } = useGtag()
  onMounted(() => $store.commit('app/setVerifyEmailError', ''))

  function signInGoogle() {
    signInWithGoogle()
    query('event', 'login', { method: 'Google' })
  }
</script>

<template>
  <div>
    <span class="text-center sm:text-left font-heading text-3xl">Welcome back!</span>
    <div class="flex flex-col sm:flex-row py-4">
      <span class="text-center sm:text-left font-formText sm:pr-1">New here?</span>
      <button
        class="text-primaryDark font-formText"
        @click="$router.push({ name: 'Register' })"
      >
        Create a free account
      </button>
    </div>
    <button
      class="rounded-full w-full shadow my-4"
      @click="signInGoogle()"
    >
      <span class="block row justify-center items-center py-4">
        <q-img
          src="../../../assets/socials/google.png"
          width="24px"
          height="24px"
          alt="google icon"
        />
        <span class="font-number font-medium pl-4">Sign in with Google</span>
      </span>
    </button>
    <div class="flex flex-row justify-between py-4">
      <div class="border-t border-formLabel w-1/3 mt-3" />
      <span class="font-body">or</span>
      <div class="border-t border-formLabel w-1/3 mt-3" />
    </div>
    <SignInForm />
    <div class="pt-6">
      <button
        class="text-gray-400"
        data-testid="login-forgot-button"
        @click="$router.push({ name: 'ForgotPassword' })"
      >
        Forgot password
      </button>
    </div>
  </div>
</template>
