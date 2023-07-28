<script setup>
  import UniqueID from '@/utils/uniqueID'

  defineProps({
    options: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    error: {
      type: String,
      required: false,
      default: ''
    },
    selectClass: {
      type: String,
      required: false,
      default: ''
    },
    optionClass: {
      type: String,
      required: false,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  })

  defineEmits([ 'update:modelValue' ])

  const uuid = UniqueID().getID()
</script>

<template>
  <select
    v-bind="{
      ...$attrs,
      onChange: ($event) => { $emit('update:modelValue', $event.target.value) }
    }"
    :id="uuid"
    class="appearance-none bg-backgroundGradient rounded-xl py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
    :class="selectClass"
    :value="modelValue"
    :aria-describedby="error ? `${uuid}-error` : null"
    :aria-invalid="!!error"
  >
    <option
      v-for="option in options"
      :key="option"
      :value="option.value"
      :selected="option === modelValue"
      :class="optionClass"
    >
      {{ option.name }}
    </option>
  </select>
</template>
