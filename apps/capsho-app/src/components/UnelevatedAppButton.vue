<template>
  <q-btn
    :color="(hovering ? 'accent' : 'white')"
    rounded
    :text-color="(!hovering ? 'accent' : 'white')"
    unelevated
    v-bind="$attrs"
    @mouseout="hovering = false"
    @mouseover="hovering = true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hovering = ref(false)
</script>

<style scoped>

</style>
