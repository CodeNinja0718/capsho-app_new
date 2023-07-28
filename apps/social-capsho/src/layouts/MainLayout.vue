<script setup>
  import NavbarDesktop from '../components/NavbarDesktop.vue'
  import NavbarMobile from '../components/NavbarMobile.vue'
  import NavbarLoggedIn from '@/components/NavbarLoggedIn.vue'
  import Footer from '../components/Footer.vue'
  import { getUserInfo } from '@/services/authService'
  import { onMounted } from 'vue'
  import AppNotificationList from '@/components/AppNotificationList'
  onMounted(() => getUserInfo())
</script>

<template>
  <div>
    <div v-if="$store.state.app.user.loggedIn">
      <NavbarLoggedIn />
    </div>
    <div v-else-if="!$route.meta.hideNavBar">
      <NavbarDesktop />
      <NavbarMobile />
    </div>

    <main>
      <router-view />
      <AppNotificationList />
    </main>

    <Footer v-if="!$route.meta.hideFooter" />
  </div>
</template>
