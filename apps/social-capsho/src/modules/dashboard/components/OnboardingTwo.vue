<script setup>
  import { useOnboarding } from '@/modules/dashboard/composables/useOnboarding'

  const { tooltipStep, finishOnboarding, increaseTooltipStepBy, decreaseTooltipStepBy } = useOnboarding()
</script>

<template>
  <div class="relative inset-x-10 inset-y-1/3 ml-8 w-80">
    <div class="flex flex-col bg-backgroundGradient relative w-full rounded-2xl px-4 py-4 font-body">
      <span
        v-if="tooltipStep === 0"
        class="pb-8"
      >Then start populating your captions by selecting a storytelling tool</span>
      <span
        v-if="tooltipStep === 1"
        class="pb-8"
      >Choose between captions and emails</span>
      <span
        v-if="tooltipStep === 2"
        class="pb-8"
      >We recommend you begin with the <span class="font-bold">About Me</span> section, but feel free to explore all of our great tools!</span>
      <div class="flex flex-row justify-between">
        <button
          v-if="tooltipStep === 0"
          class="text-gray-400 font-bold"
          @click="finishOnboarding"
        >
          Skip
        </button>
        <button
          v-if="tooltipStep === 1 || tooltipStep === 2"
          class="text-gray-600 font-bold"
          @click="decreaseTooltipStepBy(1)"
        >
          Previous
        </button>
        <button
          v-if="tooltipStep === 0 || tooltipStep === 1"
          class="text-primaryDark font-bold"
          @click="increaseTooltipStepBy(1)"
        >
          Next
        </button>
        <button
          v-if="tooltipStep === 2"
          class="text-primaryDark font-bold"
          @click="finishOnboarding"
        >
          Got it!
        </button>
      </div>
    </div>
  </div>
</template>