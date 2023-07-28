<script setup>
  import iPhone from './iPhone.vue'
  import Email from './Email.vue'
  import { ref } from 'vue'

  const optionType = ref('Caption')

  const options = [
    { name: 'Caption', color: 'secondaryDark', text: 'white', isEnabled: true },
    { name: 'Email', color: 'transparent', text: 'gray-400', isEnabled: false }
  ]

  function selectOption(selectedOption) {
    if (!selectedOption.isEnabled) {
      options.forEach((option) => {
        if (selectedOption.name === option.name) {
          optionType.value = option.name
          option.isEnabled = true
          option.text = 'white'
          option.color = 'secondaryDark'
        } else {
          option.isEnabled = false
          option.text = 'gray-400'
          option.color = 'transparent'
        }
      })
    }
  }
</script>

<template>
  <div class="flex flex-col w-4/5 justify-start items-center">
    <div class="py-8">
      <button
        v-for="(option, i) in options"
        :key="i"
        :class="`bg-${option.color} text-${option.text} py-2 mx-2 w-40 rounded-full font-bold`"
        @click="selectOption(option)"
      >
        {{ option.name }}
      </button>
    </div>
    <iPhone v-if="optionType === 'Caption'" />
    <Email v-if="optionType === 'Email'" />
  </div>
</template>
