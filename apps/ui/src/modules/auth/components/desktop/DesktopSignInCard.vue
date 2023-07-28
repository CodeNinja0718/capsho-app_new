<script setup lang="ts">
import DesktopSignInForm from 'src/modules/auth/components/desktop/DesktopSignInForm.vue'
</script>

<template>
  <div class="w-full flex flex-col flex-start poppins-regular px-10 xl:px-16 py-8 lexend-regular">
    <span class="poppins-semibold text-white text-4xl mb-1">
      Welcome back
    </span>
    <p class="w-full">
      Don't have an account? Register and
      <span
        class="cursor-pointer text-accent"
        @click="$router.push({ name: 'AuthSignUp' })"
      >
        try Capsho for free.
      </span>
    </p>
    <DesktopSignInForm />
    <p class="text-center md:text-left">
      Don't have a Capsho account? Create one for free
      <span
        class="cursor-pointer underline"
        @click="$router.push({ name: 'AuthSignUp' })"
      >
        here.
      </span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  width: 100%;
  margin: 0 auto;
  max-width: 550px;
  overflow: hidden;
  border-radius: 40px;
}

.auth-card {
  border-radius: 20px;
  box-shadow: 0 10px 50px rgb(0 0 0 / 15%);
  width: 100%;
  background-color: $secondary-dark;
  overflow: hidden;
}

.inner {
  margin: 0 auto;
}

.dots {
  background-image: url("~assets/bg-dots.png");
  /* Full height */
  height: 100%;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.dots-overlay {
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0, 0.2); /* Black w/opacity/see-through */
  border: 3px solid #f1f1f1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

h1 {
  font-size: 28px;
  font-size: clamp(23px, 2vw, 28px);
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
