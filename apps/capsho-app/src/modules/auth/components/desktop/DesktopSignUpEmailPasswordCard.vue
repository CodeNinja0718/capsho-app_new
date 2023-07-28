<script setup lang="ts">
import DesktopSignUpEmailPasswordForm from 'src/modules/auth/components/desktop/DesktopSignUpEmailPasswordForm.vue'</script>

<template>
  <div
    class="outer q-pa-lg flex flex-center text-white"
    style="max-height: 80vh; width: 40vw;"
  >
    <q-card
      class="auth-card row items-center inter-regular full-width"
      flat
    >
      <q-card-section class="col-12">
        <div class="q-px-md auth-card__actions">
          <slot name="actions"></slot>
        </div>
        <div class="q-pb-lg">
          <h1 class="text-h5 text-weight-bold text-center">Create your account</h1>
        </div>
        <div
          class="inner"
          style="max-width:417px">
          <DesktopSignUpEmailPasswordForm/>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  background: hsla(238, 54%, 65%, 1);

  background: radial-gradient(circle, hsla(238, 54%, 65%, 1) 38%, hsla(238, 62%, 62%, 1) 100%);

  background: -moz-radial-gradient(circle, hsla(238, 54%, 65%, 1) 38%, hsla(238, 62%, 62%, 1) 100%);

  background: -webkit-radial-gradient(circle, hsla(238, 54%, 65%, 1) 38%, hsla(238, 62%, 62%, 1) 100%);

  border-radius: 50px;
  width: 100%;
  margin: 0 auto;
  max-height: 758px;
  height: 100%;
}

.inner {
  margin: 0 auto;
}

.auth-card {
  background-color: inherit;
  border: 3px solid #FBDFB3;
  border-radius: 34px;
  margin: 0 auto;
  height: 100%;
  max-height: 65vh;
  &__actions {
    position: absolute;
    left: 0;
    top: -136px;
  }
}
</style>
