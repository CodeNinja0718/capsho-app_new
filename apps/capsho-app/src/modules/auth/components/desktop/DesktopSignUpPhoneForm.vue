<template>
  <q-form
    class="q-gutter-y-sm"
    @submit="onSubmit"
  >
    <div class="row q-col-gutter-x-md no-wrap">
      <div class="col-4">
        <q-select
          v-model="authStore.selectedCountry"
          dense
          input-debounce="50"
          option-value="flag"
          :options="authStore.countryCodes"
          outlined
        >
          <template v-slot:selected-item="scope">
            <q-img
              :src="scope.opt.flag"
              style="width: 1.5rem; height: auto;" />
          </template>
        </q-select>
      </div>
      <div class="col-8">
        <q-input
          id="phone"
          v-model="phone"
          class="border-radius-10"
          dense
          lazy-rules
          mask="(###) ### - ####"
          outlined
          placeholder="(415) 123-4567"
          :rules="[ val => val && val.length > 0 || '*Phone number is required']"
          type="tel"
          unmasked-value
        >
          <template #prepend>
            <div
              v-if="selectedCountry.phone_code"
              class="text-body2">
              {{ '+' + selectedCountry.phone_code }}
            </div>
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-my-lg row justify-center">
      <q-btn
        color="accent"
        label="Send code"
        no-caps
        padding="8px 38px"
        rounded
        type="submit"
      />
    </div>
    <div class="text-caption q-px-sm text-grey-7">
      By tapping Send code, an SMS may be sent.
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store'
import { CountryObject } from 'stores/auth-store-state-types'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const selectedCountry = computed((): CountryObject => {
  return authStore.selectedCountry
})
const phone = ref('')
function onSubmit () {
  authStore.phone = `+${authStore.selectedCountry.phone_code}${phone.value}`
  authStore.sendVerificationToken()
  authStore.onBoarding = 'inputPin'
}
</script>

<style scoped>

</style>
