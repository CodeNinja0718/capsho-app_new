<script setup>

</script>

<template>
  <div class="flex flex-row justify-between py-8">
    <button
      v-if="step === 0"
      class="font-body font-bold text-primaryDark rounded-full hover:bg-offWhite py-4 px-4"
    >
      <!-- Need some inspiration? -->
    </button>
    <button
      v-else
      class="font-body font-bold text-primaryDark rounded-full border border-primaryDark py-4 px-4"
      @click="step--"
    >
      Previous
    </button>
    <button
      v-if="step === arrQuestions.length-1 && title === 'holidays'"
      class="font-body font-bold text-white rounded-full bg-green-500 py-4 px-4"
      @click="addHolidayAnswers(captionAnswers)"
    >
      Submit and view my holiday creation
    </button>
    <button
      v-else-if="step === arrQuestions.length-1"
      class="font-body font-bold text-white rounded-full bg-green-500 py-4 px-4"
      @click="addAnswers(captionAnswers)"
    >
      Submit and view my creation
    </button>
    <button
      v-else
      class="font-body font-bold text-white rounded-full bg-primaryDark py-4 px-4"
      @click="step++"
    >
      Continue
    </button>
  </div>
</template>