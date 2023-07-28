<script setup>
  import { useStore } from 'vuex'
  import { computed, ref } from 'vue'
  import { verifyEmail, logOut } from '../services/authService'
  import { useAppRouter } from '@/composables/useAppRouter'
  import { useNotification } from '@/composables/useNotification'
  import BaseButton from '../../../components/_Global/BaseButton'

  const $store = useStore()
  const verifyEmailError = computed(() => $store.getters['app/verifyEmailError'])
  const loading = ref(false)
  async function verifyUserEmail () {
    const { alertDanger } = useNotification()
    loading.value = true
    try {
      const { routerPush } = useAppRouter()
      verifyEmail()
      .then(() => {
        logOut()
        loading.value = false
        routerPush('SignIn')
      })
    } catch (err) {
      alertDanger(err.message)
    }
  }
</script>

<template>
  <div>
    <div class="flex flex-col">
      <span class="font-heading text-5xl text-primaryDark">Please verify your email before continuing</span>
      <span class="font-heading text-5xl text-primaryDark pt-8">{{ verifyEmailError }}</span>
    </div>
    <div class="flex flex-row justify-center items-center pt-10">
      <div>
        <base-button
          class="font-body font-bold text-primaryDark py-1.5 px-4 mx-2 rounded-full"
          @click="$router.push({ name: 'SignIn' })"
        >
          Sign In
        </base-button>
      </div>
      <div>
        <button
          v-if="loading"
          type="button"
          class="bg-primaryDark text-white flex justify-center items-center py-1.5 pr-3 rounded-full modal-default-button"
          disabled
        >
          <div
            class="spinner-border animate-spin inline-block w-5 h-5 mx-3 border-3 rounded-full"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          Sending...
        </button>
        <button
          v-else
          class="font-body font-bold bg-primaryDark text-white py-1.5 px-4 mx-2 rounded-full"
          @click="verifyUserEmail"
        >
          Resend email
        </button>
      </div>
      <!--      <div class="pt-4">-->
      <!--        <button @click="signOutUser">-->
      <!--          Log Out-->
      <!--        </button>-->
      <!--      </div>-->
    </div>
  </div>
</template>
