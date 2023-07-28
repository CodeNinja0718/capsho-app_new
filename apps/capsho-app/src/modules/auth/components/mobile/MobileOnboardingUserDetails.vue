<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { computed } from 'vue'

import MobileAuthCard from 'src/modules/auth/components/mobile/MobileAuthCard.vue'

const authStore = useAuthStore()
const $q = useQuasar()
const isValid = computed(() => {
  const firstName: string = authStore.firstName
  const lastName: string = authStore.lastName
  if (firstName === '') {
    return false
  } else if (lastName === '') {
    return false
  }
  return true
})
async function onSubmit () {
  if (isValid.value) {
    authStore.onBoarding = 'businessDetails'
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to provide your first name and last name'
    })
  }
}
function onReset () {
  authStore.email = ''
  authStore.password = ''
}
</script>

<template>
  <MobileAuthCard
    centered
    sub-title="Write your information bellow"
    title="Tell us about you">
    <template #body>
      <q-form
        @reset="onReset"
        @submit.prevent="onSubmit">
        <div class="q-gutter-y-xs">
          <div>
            <label
              class="text-subtitle2 "
              for="firstName">First name</label>
            <q-input
              id="firstName"
              v-model="authStore.firstName"
              class="input q-mt-sm"
              lazy-rules="ondemand"
              outlined
              placeholder="Enter first name"
              :rules="[val => !!val || '*First name is required']"
              standout
              type="text"
            />
          </div>
          <div>
            <label
              class="text-subtitle2"
              for="lastName">Last name</label>
            <q-input
              id="lastName"
              v-model="authStore.lastName"
              class="input q-mt-sm"
              lazy-rules="ondemand"
              outlined
              placeholder="Enter last name"
              :rules="[val => !!val || '*Last name is required']"
              standout
              type="text"
            />
          </div>
          <div class="q-pt-sm q-pb-xl text-center inter-regular text-label text-body2">
            By clicking continue, you agree to our
            <a
              class="text-primary"
              href="https://legal.capsho.com/"
              style="text-decoration: none;"
              target="_blank"
            >
              Terms
            </a> and confirm you're 18 years or older.
          </div>
          <!--Submit button-->
          <div class="row justify-center">
            <div class="col-12">
              <q-btn
                class="button-shape full-width q-py-md text-weight-bold shadow"
                color="accent"
                label="Continue"
                no-caps
                type="submit"
                unelevated
              >
              </q-btn>
            </div>
          </div>
        </div>
      </q-form>
    </template>
  </MobileAuthCard>
</template>
