<script setup>

</script>

<template>
  <div class="flex flex-col w-1/2 pr-8">
    <div class="flex flex-col border-2 max-h-80 rounded-2xl py-4 px-4 text-left overflow-y-auto">
      <span class="pb-4 font-bold">Storytelling results</span>
      <div class="flex flex-col">
        <div
          v-for="(question, i) in arrQuestions"
          :key="i"
        >
          <span
            v-if="question.holidayDropdown"
            class="pr-1"
          >
            {{ question.narrative }} <span class="font-bold">{{ captionAnswers[i].name }}</span>
          </span>
          <span
            v-else
            class="pr-1"
          >
            {{ question.narrative }} <span class="font-bold">{{ captionAnswers[i] }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>