<script setup>
  import { ref } from 'vue'
  import UserIcon from '@/components/UserIcon.vue'
  import { useToggleMenu } from '../../composables/useToggleMenu'

  const { changeMenu, menu } = useToggleMenu()
  const activeClass = ref('font-bold text-primaryDark')
  const defaultClass = ref('font-normal text-gray-800')
</script>

<template>
  <div class="flex flex-col w-1/4">
    <div class="pt-4">
      <UserIcon class="w-16 h-16" />
    </div>
    <span class="font-heading text-2xl text-left py-8">Settings</span>
    <div class="flex flex-col">
      <button
        v-for="(option, i) in menu"
        :key="i"
        class="text-left py-2 w-1/2"
        :class="[ option.isSelected ? activeClass : defaultClass ]"
        @click="changeMenu(option)"
      >
        {{ option.name }}
      </button>
    </div>
  </div>
</template>
