<template>
  <div class="">
    <div>
      <q-form
        class="q-gutter-y-sm"
        @reset="onReset"
        @submit="onSubmit"
      >
        <div>
          <div class="row q-col-gutter-x-md no-wrap">
            <div class="col-6">
              <label
                class="inter-regular text-grey-7"
                for="firstName"
              >First name</label>
              <q-input
                id="firstName"
                v-model="authStore.firstName"
                class="border-radius-10"
                dense
                lazy-rules
                outlined
                placeholder="John"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                type="text"
              />
            </div>
            <div class="col-6">
              <label
                class="inter-regular text-grey-7"
                for="lastName"
              >Last name</label>
              <q-input
                id="lastName"
                v-model="authStore.lastName"
                class="border-radius-10"
                dense
                lazy-rules
                outlined
                placeholder="Doe"
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="q-my-lg row justify-center">
          <q-btn
            color="accent"
            :disable="!isValid"
            label="Continue"
            no-caps
            padding="8px 38px"
            rounded
            type="submit"
          />
        </div>
      </q-form>
    </div>
    <q-space />
    <div class="q-pt-xl text-center inter-regular text-grey-7">
      By creating an account you are agreeing to our
      <a
        class="q-btn q-btn-item non-selectable q-btn--no-uppercase q-btn--flat no-outline cursor-pointer border-radius-10 text-accent lexend-deca-bold"
        href="https://legal.capsho.com/"
        style="padding: 10px 38px; text-decoration: none;"
        target="_blank"
      >
        terms of service.
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { computed } from 'vue'

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

<style lang="scss" scoped>
.separator {
  border: $info;
}

.border-radius-10 {
  border-radius: 10px;
}
.q-field {
  &__control {
    border-radius: 7.15596px;
  }
}
</style>
