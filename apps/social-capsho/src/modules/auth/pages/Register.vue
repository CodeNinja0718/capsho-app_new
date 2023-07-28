<script setup>
  import { reactive, computed } from 'vue'
  import { registerWithEmail } from '../services/authService'
  import { useGtag } from 'vue-gtag-next'
  import { useNotification } from '@/composables/useNotification'

  const { query } = useGtag()
  const registerForm = reactive({
    email: '',
    password: ''
  })

  const registerFormValid = computed(() => {
    return !(registerForm.email && registerForm.password && registerForm.password.length > 6)
  })

  async function registerUser() {
    const { alertDanger } = useNotification()
    try {
      await registerWithEmail({ email: registerForm.email, password: registerForm.password })
      query('event', 'register', { method: 'Email' })
    } catch (err) {
      alertDanger(err.message)
    }
  }
</script>

<template>
  <div class="">
    <span class="text-left font-heading text-3xl py-4">Create your Capsho account</span>
    <div>
      <div class="py-2">
        <base-input
          v-model="registerForm.email"
          class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
          type="email"
          placeholder="user@example.com"
          label="Email"
          label-class="block text-left text-formLabel font-formText pb-2"
          data-testid="register-email-input"
        />
      </div>
      <div class="py-2">
        <base-input
          v-model="registerForm.password"
          class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
          type="password"
          minlength="6"
          required
          placeholder="*********"
          label="Password"
          label-class="block text-left text-formLabel font-formText pb-2"
          data-testid="register-password-input"
        />
      </div>
      <div class="pt-6">
        <button
          :disabled="registerFormValid"
          class="flex flex-row disabled:opacity-25 disabled:cursor-not-allowed justify-center w-full bg-primaryDark text-white font-bold py-4 px-4 rounded-full"
          data-testid="register-submit-button"
          @click="registerUser"
        >
          <span class="px-4">Create account</span>
        </button>
      </div>
    </div>
  </div>
</template>
