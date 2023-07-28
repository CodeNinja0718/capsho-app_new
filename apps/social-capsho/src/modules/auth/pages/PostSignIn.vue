<script setup>
  import { logOut } from '../services/authService'

  function signOutUser() {
    logOut()
  }
</script>

<template>
  <div class="pt-10">
    <button @click="signOutUser">
      Log Out
    </button>
  </div>
</template>
