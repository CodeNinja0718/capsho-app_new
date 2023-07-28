<script setup>

  import { useOnboarding } from '@/modules/dashboard/composables/useOnboarding'
  import { useHoneyTrapTools } from '@/modules/dashboard/composables/useHoneyTrapTools'

  const { tooltipStep, finishOnboarding, increaseTooltipStepBy, decreaseTooltipStepBy, nextOnboarding } = useOnboarding()

  const { tools } = useHoneyTrapTools()
</script>

<template>
  <div class="relative inset-x-1/4 inset-y-1/4 ml-8 w-80">
    <div class="flex flex-col bg-backgroundGradient relative w-full rounded-2xl px-4 py-4 font-body">
      <span
        v-if="tooltipStep === 0"
        class="pb-4"
      ><span class="font-bold">Now for the fun part! </span>Here are all the Storytelling Tools you have access to with Capsho!</span>
      <template v-if="tooltipStep > 0">
        <span class="text-2xl font-bold">{{ tools[tooltipStep-1].name }}</span>
        <span class="py-8">{{ tools[tooltipStep-1].description }}</span>
      </template>
      <div class="flex flex-row justify-between">
        <button
          class="text-gray-400 font-bold"
          @click="finishOnboarding()"
        >
          Skip
        </button>
        <button
          v-if="tooltipStep > 0"
          class="text-gray-600 font-bold"
          @click="decreaseTooltipStepBy(1)"
        >
          Previous
        </button>
        <button
          v-if="tooltipStep < tools.length"
          class="text-primaryDark font-bold"
          @click="increaseTooltipStepBy(1)"
        >
          Next
        </button>
        <button
          v-else
          class="text-primaryDark font-bold"
          @click="nextOnboarding()"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>
