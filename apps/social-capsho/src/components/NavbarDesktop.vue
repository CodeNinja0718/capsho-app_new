<script setup>
  import AppLogo from './AppLogo.vue'
  import { useAppRouter } from '@/composables/useAppRouter'

  const { routerPush } = useAppRouter()

  const infoButtons = [
    {
      name: 'Contact', route: 'ContactUs'
    },
    {
      name: 'Pricing', route: 'Pricing'
    }
  ]

  const accountButtons = [
    {
      name: 'Sign In', route: 'SignIn', bg: 'transparent', text: 'primaryDark'
    },
    {
      name: 'Sign Up', route: 'Register', bg: 'primaryDark', text: 'white'
    }
  ]
</script>

<template>
  <div class="container">
    <nav class="sm:flex flex-row items-center hidden">
      <!-- Info buttons -->
      <div class="flex flex-1 flex-row flex-wrap justify-start">
        <div>
          <button
            v-for="(infoButton, idx) in infoButtons"
            :key="idx"
            class="font-navbar hover:bg-offWhite rounded-full py-2 px-4"
            @click="routerPush(infoButton.route)"
          >
            {{ infoButton.name }}
          </button>
        </div>
      </div>
      <!-- Logo -->
      <div class="row justify-center">
        <AppLogo />
      </div>
      <!-- Sign in / Sign up -->
      <div
        v-if="!$store.getters['app/isLoggedIn']"
        class="row items-center justify-end py-2"
      >
        <div>
          <button
            v-for="(accountButton, idx) in accountButtons"
            :key="idx"
            class="font-body font-bold py-2 px-4 mx-2 border-2 border-primaryDark rounded-full"
            :class="`bg-${accountButton.bg} text-${accountButton.text}`"
            @click="routerPush(accountButton.route)"
          >
            {{ accountButton.name }}
          </button>
        </div>
      </div>
      <div
        v-else
        class="flex flex-1 flex-row flex-wrap items-center justify-end py-2"
      >
        <button
          class="font-body font-bold bg-primaryDark text-white py-2 px-4 mx-2 border-2 border-primaryDark rounded-full"
          @click="routerPush('Dashboard')"
        >
          Dashboard
        </button>
      </div>
    </nav>
  </div>
</template>
