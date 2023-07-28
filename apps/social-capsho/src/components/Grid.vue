<script setup>
  defineProps({
    gridSpaces: {
      type: Array,
      required: true
    }
  })
</script>

<template>
  <div
    v-for="(space, i) in gridSpaces"
    :key="i"
  >
    {{ space }}
  </div>
</template>
