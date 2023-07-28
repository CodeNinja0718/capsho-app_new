<script setup lang="ts">
import DesktopSignInForm from 'src/modules/auth/components/desktop/TestDesktopSignInForm.vue'
</script>

<template>
  <div class="outer q-pa-none flex flex-center text-darkish poppins-regular">
    <q-card class="auth-card q-pa-sm-lg q-pa-md-lg text-center">
      <q-card-section class="q-py-none">
        <h1 class="poppins-semibold text-capitalize">
          Welcome Back!
        </h1>
      </q-card-section>
      <q-card-section>
        <DesktopSignInForm />
      </q-card-section>
      <q-card-section class="text-18 text-center">
        <p>
          Don't have an account?
          <span
            class="cursor-pointer"
            @click="$router.push({ name: 'AuthSignUp' })">
            <span class="text-underline">Try it for FREE today</span>
          </span>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  width: 100%;
  margin: 0 auto;
  max-width: 550px;
}

.auth-card {
  //border-radius: 15px;
  //border-color: rgb(234, 232, 255);
  //margin: 0 auto;
  //box-shadow: 0 10px 50px rgb(0 0 0 / 15%);
  width: 100%;
  border-radius: 0;
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
