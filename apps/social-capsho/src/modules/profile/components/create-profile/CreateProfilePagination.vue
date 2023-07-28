<script setup>
  import { useSteps } from '../../composables/useSteps'
  import { useCreateProfile } from '../../composables/useCreateProfile'

  const { saveProfile } = useCreateProfile()
  const { increaseStepBy, decreaseStepBy, step, isFinalStep } = useSteps()
</script>

<template>
  <div class="flex w-full justify-between">
    <div class="py-4">
      <BaseButton
        v-if="step > 1"
        class="font-body font-bold text-primaryDark rounded-full hover:bg-offWhite py-4 px-4"
        @click="decreaseStepBy(1)"
      >
        Back
      </BaseButton>
    </div>
    <div class="py-4">
      <BaseButton
        v-if="isFinalStep"
        class="font-body font-bold text-white rounded-full bg-primaryDark py-4 px-4"
        @click="saveProfile"
      >
        Let's begin
      </BaseButton>
      <BaseButton
        v-else
        class="font-body font-bold text-white rounded-full bg-primaryDark py-4 px-4"
        @click="increaseStepBy(1)"
      >
        Continue
      </BaseButton>
    </div>
  </div>
</template>
