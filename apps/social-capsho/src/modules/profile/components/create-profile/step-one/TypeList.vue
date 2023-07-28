<script setup>
  import { useTypes } from '../../../composables/useTypes'

  const { types, selectType, activeClass, defaultClass } = useTypes()
</script>

<template>
  <div>
    <span>Choose what you sell:</span>
    <div class="flex flex-row flex-wrap py-4">
      <button
        v-for="(type, i) in types"
        :key="i"
        :class="[ type.isEnabled ? activeClass : defaultClass ]"
        class="rounded-full border border-primaryDark font-number py-2 px-4 mx-2"
        @click="selectType(type)"
      >
        {{ type.name }}
      </button>
    </div>
  </div>
</template>
