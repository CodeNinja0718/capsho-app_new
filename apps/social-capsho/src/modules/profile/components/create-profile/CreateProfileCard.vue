<script setup>
  import StepOne from './step-one/StepOne.vue'
  import StepTwo from './step-two/StepTwo.vue'
  import StepThree from './step-three/StepThree.vue'
  import FinalStep from './step-final/FinalStep.vue'
  import { useSteps } from '../../composables/useSteps'

  const { step } = useSteps()
</script>

<template>
  <div class="">
    <div class="">
      <!-- STEP 1 -->
      <div
        v-if="step === 1"
        class="container"
      >
        <StepOne />
      </div>
      <!-- STEP 2 -->
      <div
        v-if="step === 2"
        class="container"
      >
        <StepTwo />
      </div>
      <!-- STEP 3 -->
      <div
        v-if="step === 3"
        class="container"
      >
        <StepThree />
      </div>
      <!-- FINAL STEP -->
      <div
        v-if="step === 4"
        class="container"
      >
        <FinalStep />
      </div>
    </div>
  </div>
</template>
