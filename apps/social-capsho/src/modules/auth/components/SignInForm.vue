<script setup>
  import { reactive } from 'vue'
  import { signInWithEmail, updateUserState } from '../services/authService'
  import { useAppRouter } from '@/composables/useAppRouter'
  import { useNotification } from '@/composables/useNotification'
  import { useStore } from 'vuex'
  import { useGtag } from 'vue-gtag-next'

  const { query } = useGtag()

  const $store = useStore()

  const loginForm = reactive({
    email: '',
    password: '',
    rememberMe: true
  })

  const clearLoginForm = () => {
    loginForm.email = ''
    loginForm.password = ''
    loginForm.rememberMe = true
  }

  const validateLoginForm = () => {
    const { email, password, rememberMe } = loginForm
    if (!email || typeof email !== 'string') {
      return false
    }
    if (!password || typeof password !== 'string') {
      return false
    }
    if (typeof rememberMe !== 'boolean') {
      return false
    }
    return true
  }

  async function logInEmail() {
    const { routerPush } = useAppRouter()
    const { alertSuccess } = useNotification()
    if (validateLoginForm()) {
      const { email, password, rememberMe } = loginForm
      const userCredential = await signInWithEmail({
        email,
        password,
        rememberMe
      })
      if (userCredential.user.emailVerified) {
        alertSuccess('Logged in')
        $store.commit('app/logIn', true)
        await updateUserState(userCredential)
      } else {
        await routerPush('VerifyEmail')
      }
      clearLoginForm()
      query('event', 'login', { method: 'Email' })
    }
  }
</script>

<template>
  <div>
    <div class="py-2">
      <base-input
        v-model="loginForm.email"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        type="email"
        placeholder="user@example.com"
        label="Email"
        label-class="block text-left text-formLabel font-formText pb-2"
        data-testid="login-email-input"
      />
    </div>
    <div class="py-2">
      <base-input
        v-model="loginForm.password"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        type="password"
        placeholder="*********"
        label="Password"
        label-class="block text-left text-formLabel font-formText pb-2"
        data-testid="login-password-input"
      />
    </div>
    <div class="flex justify-start py-2">
      <label class="block text-formLabel font-bold">
        <input
          v-model="loginForm.rememberMe"
          type="checkbox"
          class="rounded text-primaryDark border-primaryLight"
          data-testid="login-remember-input"
        >
        <span class="text-sm">
          Keep me signed in on this device
        </span>
      </label>
    </div>
    <div v-if="$store.getters.loginError">
      <span
        class="text-red-500 font-formText"
        data-testid="login-error"
      >
        {{ $store.getters.loginError }}
      </span>
    </div>
    <div class="pt-6">
      <button
        class="flex flex-row justify-center w-full bg-primaryDark text-white font-bold py-4 px-4 rounded-full"
        data-testid="login-submit-button"
        type="button"
        @click="logInEmail"
      >
        <span class="px-4">Log in</span>
      </button>
    </div>
  </div>
</template>
