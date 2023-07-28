<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()
  const userPhotoURL = computed(() => store.state.app.user.data?.photoURL)
</script>

<template>
  <img
    v-if="userPhotoURL"
    :src="userPhotoURL"
    class="w-8 h-8 rounded-full"
    alt="User's business avatar"
  >
  <img
    v-else
    src="../assets/icons/user.png"
    alt="Person icon"
  >
</template>
