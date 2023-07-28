<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'

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
</script>

<template>
  <q-form
    class="signin-form poppins-regular"
    @submit.prevent="onSubmit">
    <!--                Email address input-->
    <div>
      <label
        class="block text-left text-grey-6"
        for="email"
      >Email address</label>
      <q-input
        id="email"
        v-model="authStore.email"
        autocomplete="off"
        color="orange"
        lazy-rules="ondemand"
        name="email"
        no-error-icon
        outlined
        :rules="[
          val => !!val || '*Email is required',
          val => val.includes('@') && val.includes('.') || '*Please Provide a valid email address'
        ]"
        type="email"
      />
    </div>
    <!--                Password input-->
    <div>
      <label
        class="block text-left text-grey-6"
        for="password"
      >Password</label>
      <q-input
        id="password"
        v-model="authStore.password"
        autocomplete="off"
        color="orange"
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
        class="cursor-pointer"
        @click="authStore.router.push({ name: 'AuthResetPassword' })">
        <span class="text-accent">Forgot password?</span>
      </span>
    </div>
    <!--                Submit button-->
    <div class="row justify-center q-pt-lg">
      <div class="col-12 col-sm-8">
        <q-btn
          class="full-width full-height text-16"
          :class="{ 'disabled': loading }"
          color="orange"
          label="Sign In"
          :loading="loading"
          no-caps
          padding="10px 25px"
          rounded
          text-color="grey-9"
          type="submit"
          unelevated
        >
          <template #loading>
            Signing in...
          </template>
        </q-btn>
      </div>
      <!--                or section-->
      <div class="col-7 q-py-md row justify-center items-center no-wrap q-gutter-x-sm">
        <div class="col-6 separator">
          <q-separator/>
        </div>
        <span class="col-auto text-center">or</span>
        <div class="col-6 separator">
          <q-separator/>
        </div>
      </div>
      <!--                Sign in with google-->
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
          @click="signInWithGoogle"
        >
          <q-icon
            class="q-mr-lg"
            left
            size="24px"
          >
            <q-img src="~assets/icons/google.png" />
          </q-icon>
          <div>Sign in with Google</div>
        </q-btn>
      </div>
    </div>
  </q-form>
</template>

<style scoped lang="scss">
.signin-form {
  max-height: 500px;
}
.form-input {
  background: none !important;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 6px;
  font-size: 16px;
}
</style>
