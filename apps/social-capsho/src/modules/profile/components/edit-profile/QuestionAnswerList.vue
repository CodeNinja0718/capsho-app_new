<script setup>
  import { useSets } from '@/modules/profile/composables/useSets'
  
  const { answers, cleanQuestions } = useSets()
</script>

<template>
  <div
    v-for="(answer, i) in answers"
    :key="i"
    class="py-2"
  >
    <base-input
      v-if="answer.month"
      v-model="answer.name"
      class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-gray-400 border-0 disabled:cursor-not-allowed"
      disabled
      placeholder="Answer"
      :label="cleanQuestions[i].display[0]"
      label-class="block text-left text-formLabel font-formText pb-2"
    />
    <base-input
      v-else
      v-model="answers[i]"
      class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-gray-400 border-0 disabled:cursor-not-allowed"
      disabled
      placeholder="Answer"
      :label="cleanQuestions[i].display[0]"
      label-class="block text-left text-formLabel font-formText pb-2"
    />
  </div>
</template>