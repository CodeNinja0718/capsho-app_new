<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { computed } from 'vue'
import DesktopUploadBusinessLogo from 'src/modules/auth/components/desktop/DesktopUploadBusinessLogo.vue'

const authStore = useAuthStore()
const $q = useQuasar()

const options = Object.freeze(
  [
    'To create assets for my own podcast',
    'For my VA or team member to create assets for my podcast',
    'To create assets for my clients\' podcasts',
    'To share as a useful tool with my clients / community'
  ]
)
const fullName = computed({
  get() {
    return authStore.firstName + (authStore.lastName ? ' ' + authStore.lastName : '')
  },
  set(val: string) {
    if (val) {
      const names = val.split(' ')
      authStore.firstName = names[0]
      authStore.lastName = names?.[1] || ''
    } else {
      authStore.firstName = ''
      authStore.lastName = ''
    }
  }
})
const isValid = computed(() => {
  if (fullName.value.trim() === '') {
    return false
  } else if (authStore.userType === 'guest') {
    return authStore.businessName
  } else {
    return authStore.primaryPurpose.length > 0
  }
})
async function onSubmit () {
  if (isValid.value) {
    await authStore.uploadBrandLogo()
    await authStore.saveUser()
    authStore.onBoarding = 'businessLinks'
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
  <q-form
    class="col-span-12"
    @reset="onReset"
    @submit="onSubmit"
  >
    <div class="row q-col-gutter-x-md no-wrap">
      <div class="col-8">
        <label
          class="inter-regular text-white px-6 lexend-regular text-[15px] font-medium"
          for="fullName"
        >First and last name</label>
        <q-input
          id="fullName"
          v-model="fullName"
          autocomplete="off"
          color="accent"
          dark
          lazy-rules="ondemand"
          no-error-icon
          outlined
          placeholder="John Doe"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          text-color="white"
        />
        <label
          class="inter-regular text-white px-6 lexend-regular text-[15px] font-medium"
          for="businessName"
        >Business name</label>
        <q-input
          id="businessName"
          v-model="authStore.businessName"
          color="accent"
          lazy-rules
          outlined
          placeholder="Please enter the brand name you do business as"
          :rules="[ val => val && val.length > 0 || '*Business name is required']"
          type="text"
        />
        <label
          class="inter-regular text-white px-6 lexend-regular text-[15px] font-medium"
          for="businessName"
        >What will you be using Capsho primarly for?</label>
        <q-select
          id="primaryPurpose"
          v-model="authStore.primaryPurpose"
          class="mb-6"
          emit-value
          label="Select one"
          :options="options"
          outlined
        />
      </div>
      <div class="col-4 flex justify-center items-start pt-4">
        <DesktopUploadBusinessLogo />
      </div>
    </div>
    <div class="flex items-center gap-2 mt-1">
      <q-btn
        color="accent"
        :disable="!isValid"
        label="Continue"
        no-caps
        padding="2px 16px"
        rounded
        type="submit"
      />
      <span class="text-xs lexend-regular">
        By creating an account you are agreeing to our
        <a
          class="underline cursor-pointer text-white"
          href="https://www.capsho.com/terms"
          target="_blank"
        >Terms of Service</a>
      </span>
    </div>
  </q-form>
</template>

<style lang="scss" scoped>
.separator {
  border: $info;
}

.border-radius-24 {
  border-radius: 24px;
}
.q-field {
  &__control {
    border-radius: 7.15596px;
  }
}
</style>
