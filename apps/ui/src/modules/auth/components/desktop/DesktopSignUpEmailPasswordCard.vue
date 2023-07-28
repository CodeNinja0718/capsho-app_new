<script setup lang="ts">
import DesktopSignUpEmailPasswordForm
  from 'src/modules/auth/components/desktop/DesktopSignUpEmailPasswordForm.vue'
</script>

<template>
  <div class="q-pa-none flex flex-start text-white poppins-regular px-4 py-6">
    <span class="poppins-semibold text-white text-4xl mb-1 lexend-regular">
      Experience the Capsho <span style="color: #02b7e4">magic.</span>
    </span>
    <p class="lexend-regular">Start your free trial now! No credit card required.</p>
    <DesktopSignUpEmailPasswordForm/>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  width: 100%;
  margin: 0 auto;
  max-width: 550px;
}

.auth-card {
  border-radius: 0;
  width: 100%;
  background-color: $secondary-dark;
}

h1 {
  font-size: 28px;
  line-height: 1em;
  letter-spacing: -1px;
  font-weight: 700;
}

h2 {
  font-size: 22px;
  font-size: clamp(19px, 2vw, 22px);
  line-height: 1em;
  margin-top: 15px;
  font-weight: 700;
}
</style>

<style lang="scss">

.testimonial-avatar{
  .q-avatar__content{
    border: 4px solid #02b7e4;
  }
}
</style>
