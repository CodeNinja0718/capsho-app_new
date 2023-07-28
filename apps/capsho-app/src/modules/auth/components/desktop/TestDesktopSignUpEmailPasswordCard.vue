<script setup lang="ts">
import DesktopSignUpEmailPasswordForm
  from 'src/modules/auth/components/desktop/TestDesktopSignUpEmailPasswordForm.vue'
</script>

<template>
  <div class="outer q-pa-none flex flex-center text-darkish poppins-regular">
    <q-card class="auth-card q-pa-sm-lg q-pa-md-lg text-center">
      <q-card-section class="q-py-none">
        <h1 class="poppins-semibold">
          Experience the Capsho magic
        </h1>
      </q-card-section>
      <q-card-section class="q-pt-xs q-pb-none q-gutter-y-md">
        <h2 class="text-capitalize q-my-none">Start your free trial now!</h2>
        <p class="text-16">No credit card required</p>
        <div class="progress">
          <div
            class="progress__bar progress__bar--animated"
            style="width: 50%;"></div>
        </div>
        <div>Create Your Account: Step 1 of 2</div>
      </q-card-section>
      <q-card-section>
        <DesktopSignUpEmailPasswordForm/>
      </q-card-section>
    </q-card>
  </div>
  <q-card
    class="testimonial-card q-pa-lg"
    flat>
    <q-card-section>
      <div class="row justify-center items-center q-gutter-sm">
        <div class="col-12 col-sm-4 text-center">
          <q-avatar size="140px">
            <q-img
              alt="Adam Lamb"
              src="~/assets/testimonial/testimonial0.jpg"
            />
          </q-avatar>
        </div>
        <div class="col-12 col-sm-7 text-13">
          <p>
            <q>
              I'm averaging a 66% open rate on the emails Capsho helps me write.
              My social media engagement has increased by 20-30%.
              And my downloads have gone from 300 to 1,800 in the space of 2 episodes.
            </q>
          </p>
          <p>
            <b>- Adam Lamb, Host of Chef Life Radio</b>
          </p>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="text-18 text-center">
      <p>
        Already have an account?
        <span
          class="cursor-pointer"
          @click="$router.push({ name: 'AuthPage' })">
          <span class="text-underline">Login</span>
        </span>
      </p>
    </q-card-section>
  </q-card>
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
  border-radius: 0;
  width: 100%;
}

.testimonial-card {
  width: 100%;
  padding-top: 10px;
  border-radius: 0;
  //margin: 27px auto;
}

.inner {
  margin: 0 auto;
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
