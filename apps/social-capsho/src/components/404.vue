<template>
  <div>
    <div class="flex flex-col justify-center py-10 px-10 bg-gradient-to-r from-backgroundGradient to-white h-screen">
      <span class="text-8xl font-heading text-primaryDark">404</span>
      <span class="text-4xl text-primaryDark font-heading">Page not found</span>
      <div
        v-if="$store.state.user.loggedIn"
        class="pt-10"
      >
        <button
          class="font-body font-bold bg-primaryDark text-white py-2 px-4 mx-2 rounded-full"
          @click="$router.push('/dashboard')"
        >
          Return
        </button>
      </div>
      <div
        v-else
        class="pt-10"
      >
        <button
          class="font-body font-bold bg-primaryDark text-white py-2 px-4 mx-2 rounded-full"
          @click="$router.push('/')"
        >
          Return
        </button>
      </div>
    </div>
    <!-- <div v-if="!$store.state.user.loggedIn">
      <Footer />
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>
