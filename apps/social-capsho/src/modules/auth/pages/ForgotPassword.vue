<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useStore } from 'vuex'
  import { resetPassword } from '../services/authService'

  const $store = useStore()

  const email = ref('')

  onMounted(() => $store.commit('app/setVerifyEmailError', ''))

  const emailValidation = computed(() => {
    return !(email.value)
  })

  function sendEmail() {
    resetPassword(email.value)
  }
</script>

<template>
  <div class="">
    <span class="text-left font-heading text-3xl py-4">Forgot password</span>
    <div>
      <div class="py-2">
        <base-input
          v-model="email"
          class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
          type="email"
          placeholder="user@example.com"
          label="Email"
          label-class="block text-left text-formLabel font-formText pb-2"
          data-testid="forgot-email-input"
        />
      </div>
      <div class="pt-6">
        <button
          :disabled="emailValidation"
          class="flex flex-row disabled:opacity-25 disabled:cursor-not-allowed justify-center w-full bg-primaryDark text-white font-bold py-4 px-4 rounded-full"
          data-testid="forgot-submit-button"
          @click="sendEmail"
        >
          <span class="px-4">Send recovery email</span>
        </button>
      </div>
    </div>
  </div>
</template>
