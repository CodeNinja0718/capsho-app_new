<script setup>
  import { onUnmounted } from 'vue'
  import { useSets } from '../../composables/useSets'
  import QuestionAnswerList from '@/modules/profile/components/edit-profile/QuestionAnswerList'

  const { answers, selectedSet, resetSelectedSet } = useSets()

  onUnmounted(resetSelectedSet)
</script>

<template>
  <div
    v-if="selectedSet && answers.length > 0"
    class="flex flex-col h-1/2"
  >
    <div class="flex flex-col">
      <span class="capitalize text-left">{{ selectedSet.title }}</span>
      <span class="text-left">Created at: {{ selectedSet.createdAt }}</span>
    </div>
    <QuestionAnswerList />
  </div>
</template>
