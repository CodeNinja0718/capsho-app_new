<script setup>
  import { useUser } from '@/composables/useUser'
  import { useAuth } from '@/composables/useAuth'
  import { computed } from 'vue'

  const { userData, updateUserName } = useUser()
  const { resetPassword } = useAuth()

  const userName = computed({
    get() {
      return userData.value?.displayName
    },
    set(value) {
      updateUserName(value)
    }
  })

  const userEmail = computed(() => userData.value?.email)
</script>

<template>
  <div
    v-if="useUser"
    class="flex flex-col pb-8"
  >
    <span class="font-heading text-3xl text-left pb-2">Creator's Name</span>
    <div class="flex flex-col py-4">
      <base-input
        v-model="userName"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        placeholder="First and last name"
        label="Full name"
        label-class="block text-left text-formLabel font-formText pb-2"
      />
    </div>
    <div class="flex flex-col py-4">
      <base-input
        v-model="userEmail"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-gray-400 border-0 focus:outline-none focus:shadow-outline disabled:cursor-not-allowed"
        disabled
        type="email"
        placeholder="Email"
        label="Email address"
        label-class="block text-left text-formLabel font-formText pb-2"
      />
    </div>
    <div class="flex flex-col py-4">
      <button
        class="text-left font-body font-bold text-primaryDark"
        @click="resetPassword"
      >
        Change password
      </button>
      <label class="block text-left text-formLabel font-formText pt-2">A recovery email will be sent and you will be logged out of Capsho</label>
    </div>
  </div>
</template>
