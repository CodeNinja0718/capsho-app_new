<script setup>

</script>

<template>
  <div
    v-if="arrQuestions.length > 0"
    class="flex flex-col text-left pb-4"
  >
    <span
      style="white-space: pre-wrap;"
      class="text-left text-primaryDark font-formText"
    >
      <span
        v-for="(line, idx) in arrQuestions[step].question.split('\\n\\n')"
        :key="idx"
        class="inline-block"
      >
        {{ line }}
      </span>
      <span class="block flex flex-row py-2 items-center">
        <span>Pro tip:</span>
        <Popup
          v-if="arrQuestions.length > 0"
          button-text="Watch this video"
          :video="arrQuestions[step].video"
        />
      </span>
      <label class="block text-left text-formLabel font-formText pb-2">{{ arrQuestions[step].narrative }}</label>
      <base-select
        v-if="arrQuestions[step].holidayDropdown"
        v-model="captionAnswers[step]"
        class="w-full"
        :options="holidays"
      />
      <base-input
        v-else-if="!arrQuestions[step].dropdown"
        v-model="captionAnswers[step]"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        :placeholder="placeholder"
      />
      <base-select
        v-else
        v-model="captionAnswers[step]"
        class="w-full"
        :options="emotions"
      />
    </span>
  </div>
</template>
<script>
export default {
  name: 'StoryTellingInput'
}
</script>
