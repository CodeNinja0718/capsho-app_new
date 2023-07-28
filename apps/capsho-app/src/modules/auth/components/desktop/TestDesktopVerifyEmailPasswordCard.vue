<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store'
import { ref } from 'vue'

const authStore = useAuthStore()
defineProps({
  email: {
    type: String,
    required: true
  }
})
const loading = ref(false)
async function resendVerification () {
  loading.value = true
  await authStore.verifyEmailAddress()
  await authStore.router.push({ name: 'AuthPage' })
  loading.value = false
}
</script>

<template>
  <div class="outer q-pa-lg q-mt-md flex flex-center text-darkish poppins-regular q-gutter-y-md">
    <q-card class="auth-card q-pa-lg text-center">
      <q-card-section class="q-py-none">
        <h1 class="poppins-semibold text-capitalize">
          Please verify your email address
        </h1>
      </q-card-section>
      <q-card-section class="q-pt-xs q-pb-none q-gutter-y-md">
        <div class="progress">
          <div
            class="progress__bar progress__bar--animated"
            style="width: 100%;"></div>
        </div>
        <div>Create Your Account: Step 2 of 2</div>
        <p class="text-center">
          Please check your inbox (and Promotions / Spam folder)
          <br>for an email from us
        </p>
        <p>
          Click the link inside to get started!
        </p>
        <div>
          <q-btn
            color="accent"
            flat
            label="Resend email"
            :loading="loading"
            no-caps
            @click="resendVerification"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  width: 100%;
  margin: 0 auto;
  max-width: 630px;
}

.auth-card {
  border-radius: 15px;
  border-color: rgb(234, 232, 255);
  margin: 0 auto;
  box-shadow: 0 10px 50px rgb(0 0 0 / 15%);
}

.inner {
  margin: 0 auto;
}

h1 {
  font-size: clamp(27px, 2vw, 32px);
  line-height: 1em;
  letter-spacing: -1px;
  font-weight: 700;
}

h2 {
  font-size: 22px;
  line-height: 1em;
  margin-top: 15px;
  font-weight: 700;
}
</style>
