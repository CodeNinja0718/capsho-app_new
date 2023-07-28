<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import BrandLogo from 'components/BrandLogo.vue'

const authTab = ref('signin')
const $q = useQuasar()

const tabs = Object.freeze([
  {
    label: 'Sign in',
    value: 'signin',
    route: 'AuthSignIn',
    default: true
  },
  {
    label: 'Sign up',
    value: 'signup',
    route: 'AuthSignUp',
    default: false
  }
])
</script>

<template>
  <q-page class="full-height">
    <header class="auth-header bg-accent q-py-sm-md q-mb-lg text-center">
      <BrandLogo
        color="white"
        size="sm"
      />
    </header>
    <div class="q-pa-sm-lg bg-white">
      <q-card
        class="auth-tab-card"
        :class="{ 'auth-tab-card-shadow': $q.screen.gt.xs }"
        flat
      >
        <q-tabs
          active-bg-color="white"
          active-color="grey-9"
          align="justify"
          class="text-grey-6 bg-grey-3 poppins-regular"
          :class="{ 'height-80': $q.screen.gt.xs }"
          indicator-color="transparent"
          narrow-indicator
        >
          <q-route-tab
            v-for="(tab) in tabs"
            :key="tab.id"
            :default="tab.value === 'login'"
            exact
            :label="tab.label"
            :name="tab.value"
            replace
            :to="{ name: tab.route }"
          />
        </q-tabs>

        <q-tab-panels
          v-model="authTab"
          animated>
          <q-tab-panel name="signin">
            <router-view/>
          </q-tab-panel>

          <q-tab-panel name="signup">
            <router-view/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <footer
      v-if="$q.screen.gt.xs"
      class="auth-footer column justify-center items-center q-pt-md poppins-regular bg-accent text-white"
    >
      <div class="row q-gutter-x-md text-14">
        <p><a
          class="footer-link"
          href="http://legal.capsho.com/"><b>Terms & Conditions</b></a></p>
        <p><a
          class="footer-link"
          href="http://legal.capsho.com/"><b>Privacy Policy</b></a></p>
      </div>
      <p class="text-12">
        Copyright 2022 Capsho™. All rights reserved.
      </p>
    </footer>
  </q-page>
</template>

<style lang="scss">
.auth-footer {
  margin-top: 30px;
}
.footer-link {
  color: white;
  text-decoration: none;
}
.height-80 {
  height: 80px;
}
.auth-tab-card {
  width: 100%;
  margin: 0 auto;
  max-width: 500px;
  border-radius: 10px;
}
.auth-tab-card-shadow {
  box-shadow: 0 10px 50px rgb(0 0 0 / 15%) !important;
}
.q-tab-panel {
  padding: 0;
}
.auth-tab-label {
  color: #3E3E3E;
}
div.q-tab__indicator {
  display: none !important;
  height: 0;
}
</style>
