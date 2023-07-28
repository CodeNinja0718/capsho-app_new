<script setup>
  defineProps({
    id: {
      type: [String, Number],
      required: true
    }
  })
</script>

<template>
  <p
    :id="id"
    aria-live="assertive"
    class="errorMessage"
  >
    <slot />
  </p>
</template>