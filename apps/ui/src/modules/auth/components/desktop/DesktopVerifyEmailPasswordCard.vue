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
  <div class="q-pa-lg flex flex-center poppins-regular q-gutter-y-md lexend-regular">
    <div class="text-center bg-dialog-dark rounded-[40px] px-12 md:px-24 lg:px-32 py-8 md:py-12 lg:py-16">
      <q-card-section class="q-py-none">
        <h1 class="poppins-semibold">
          Please verify your email address
        </h1>
      </q-card-section>
      <q-card-section class="q-pt-lg q-pb-none q-gutter-y-lg">
        <div
          class="progress bg-darkish"
          style="height: 28px; border-radius: 100px;"
        >
          <div
            class="progress__bar"
            style="width: 80%; height: 28px;"></div>
        </div>
        <div>Create your account: <span class="text-accent font-bold">Step 2 of 2</span></div>
        <p class="text-center py-6">
          Please check your inbox (and Promotions / Spam folder)
          <br>for an email from us
        </p>
        <p class="text-xl">
          Click the link inside to get started!
        </p>
        <div>
          <q-btn
            class="underline"
            color="accent"
            flat
            label="Resend email"
            :loading="loading"
            no-caps
            @click="resendVerification"
          />
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  width: 100%;
  margin: 0 auto;
}

.auth-card {
  border-radius: 24px;
  border-color: rgb(234, 232, 255);
  margin: 0 auto;
  box-shadow: 0 10px 50px rgb(0 0 0 / 15%);
  background-color: $secondary-dark;
  padding: 48px;
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
