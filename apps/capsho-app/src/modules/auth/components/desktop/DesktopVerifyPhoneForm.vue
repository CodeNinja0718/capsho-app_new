<template>
  <q-form
    autofocus
    @submit="onSubmit"
  >
    <div class="column items-center q-gutter-y-sm full-width">
      <p class="inter-regular text-grey-7 text-weight-medium">
        Please enter the code we just send you to
        <span
          class="text-blue cursor-pointer"
          @click="authStore.onBoarding = 'userPhone'"
        >
          {{ authStore.phone }}
        </span>
      </p>
      <q-input
        id="pin"
        v-model="authStore.pin"
        class="full-width"
        dense
        input-class="text-center border-radius-10"
        lazy-rules
        mask="### ###"
        outlined
        placeholder="000 000"
        :rules="[ val => val && val.length > 0 || '*6 digit pin is required']"
        type="text"
        unmasked-value
      />
    </div>
    <div class="row justify-center">
      <q-btn
        color="accent"
        label="Continue"
        no-caps
        padding="8px 38px"
        rounded
        type="submit"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
async function onSubmit () {
  await authStore.checkVerificationToken()
}
</script>

<style scoped>

</style>
