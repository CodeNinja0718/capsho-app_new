<script setup>
  import { useTogglePodcastMenu } from '../composables/useTogglePodcastMenu'

  const { tabs, changeTabs, activeClass, defaultClass } = useTogglePodcastMenu()
</script>

<template>
  <div class="flex justify-center">
    <div
      class="mb-6"
    >
      <ul class="flex flex-wrap -mb-px">
        <li
          v-for="(tab, idx) in tabs"
          :key="idx"
          class="mr-2"
        >
          <button
            class="inline-block py-4 px-4 text-sm font-medium text-center rounded-t-lg border-b-2 border-transparent"
            :class="[ tab.isSelected ? activeClass : defaultClass ]"
            @click="changeTabs(tab)"
          >
            {{ tab.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>