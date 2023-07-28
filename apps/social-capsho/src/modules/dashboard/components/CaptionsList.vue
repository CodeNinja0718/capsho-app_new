<script setup>
  defineProps({
    templates: {
      type: Array,
      required: true
    }
  })
</script>

<template>
  <div
    v-for="(space, i) in templates"
    :key="i"
    class="w-1/3 h-auto px-2 py-2"
  >
    <div
      class="flex flex-col bg-gradient-to-br from-primaryLight to-backgroundGradient px-4 py-4 rounded-2xl h-full border border-primaryLight"
    >
      <span class="capitalize font-bold font-body text-xl">{{ space.creative }}</span>
      <span
        v-if="space.text"
        style="white-space: pre-wrap"
        class="font-body"
      >
        {{ space.text }}
      </span>
      <span v-else>No caption yet keep using other story telling tools to fill this space!</span>
    </div>
  </div>
</template>
