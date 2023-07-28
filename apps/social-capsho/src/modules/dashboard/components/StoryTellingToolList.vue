<script setup>
  import StoryTellingOptionsList from './StoryTellingOptionsList'
  import { useHoneyTrapTools } from '@/modules/dashboard/composables/useHoneyTrapTools'

  const { tools, updateTool } = useHoneyTrapTools()
</script>

<template>
  <div class="flex flex-row">
    <div class="flex flex-col w-1/5">
      <span class="font-heading text-3xl py-8">Choose your storytelling tool</span>
      <div
        v-for="(item, i) in tools"
        :key="i"
        class="flex flex-row relative"
      >
        <button
          class="font-body hover:font-bold hover:text-primaryDark border-l-4 border-transparent focus:border-primaryDark focus:font-bold focus:text-primaryDark py-4 px-4 text-left"
          @mouseenter="updateTool(item)"
          @mouseleave="updateTool(item)"
          @click="$router.push({ name: item.route.name, params: { tool: item.route.params } })"
        >
          {{ item.name }}
        </button>
        <span
          v-if="item.isEnabled"
          class="font-body rounded-2xl shadow-lg p-4 bg-primaryLight absolute bottom-14 z-50"
        >{{ item.description }}</span>
      </div>
    </div>
    <StoryTellingOptionsList />
  </div>
</template>
