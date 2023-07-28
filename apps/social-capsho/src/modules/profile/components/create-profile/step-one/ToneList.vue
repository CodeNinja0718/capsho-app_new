<script setup>
  import { useTones } from '../../../composables/useTones'

  const { tones, selectTone, loading, activeClass, defaultClass } = useTones()
</script>

<template>
  <div>
    <span>Choose your tone of voice</span>
    <div
      v-if="loading"
      class="animate-pulse py-4"
    >
      Loading...
    </div>
    <div
      v-else
      class="flex flex-row flex-wrap py-4"
    >
      <button
        v-for="(tone, i) in tones"
        :key="i"
        class="rounded-full border border-primaryDark font-number py-2 px-4 mx-2"
        :class="[ tone.isEnabled ? activeClass : defaultClass ]"
        @click="selectTone(tone)"
      >
        {{ tone.name }}
      </button>
    </div>
  </div>
</template>
