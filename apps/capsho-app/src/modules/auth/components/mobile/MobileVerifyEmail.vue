<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store'
import MobileAuthCard from 'src/modules/auth/components/mobile/MobileAuthCard.vue'

const authStore = useAuthStore()

defineProps({
  email: {
    type: String,
    required: true
  }
})
</script>

<template>
  <MobileAuthCard>
    <template #body>
      <q-card-section class="col-12 flex column justify-center items-center q-mt-xl">
        <div class="icon flex items-center justify-center">
          <img
            alt="check icon"
            class="q-mx-auto"
            src="~assets/check-mail.svg">
        </div>
        <p class="text-h5 text-weight-bold text-darkish q-pt-xl q-pb-sm">Verify your email</p>
        <p class="text-center q-px-lg text-label text-weight-medium text-subtitle1">
          We sent an email to <span class="text-primary">{{email}}</span> click the link inside to get started.
        </p>
        <div class="q-py-xl">
          <q-btn
            class="q-py-md q-px-lg text-primary"
            label="Resend email"
            no-caps
            unelevated
            @click="authStore.verifyEmailAddress"
          />
        </div>
      </q-card-section>
    </template>
  </MobileAuthCard>
</template>

<style lang="scss" scoped>
:deep .icon {
  width: 136px;
  height: 136px;
  background: rgba(98, 102, 218, 0.1);
  border-radius: 50%;
  img {
    padding-left: 10px;
    padding-top: 15px;
  }
}

:deep .q-btn {
  background: rgba(98, 102, 218, 0.1);
  border-radius: 6px;
}
</style>
