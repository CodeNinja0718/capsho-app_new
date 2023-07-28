<script setup>
  import UniqueID from '@/utils/uniqueID'

  defineProps({
    type: {
      type: String,
      default: 'text',
      validator(value) {
        return [
          'email',
          'number',
          'password',
          'search',
          'tel',
          'text',
          'url',
        ].includes(value)
      }
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    labelClass: {
      type: String,
      required: false,
      default: ''
    },
    inputClass: {
      type: String,
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
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
  <label
    v-if="label"
    :for="uuid"
    :class="labelClass"
  >
    {{ label }}
  </label>
  <input
    v-bind="{
      ...$attrs,
      onInput: ($event) => { $emit('update:modelValue', $event.target.value) }
    }"
    :id="uuid"
    class="field"
    data-test="base-input-text"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :aria-describedby="error ? `${uuid}-error` : null"
    :aria-invalid="!!error"
    :class="inputClass"
  >
</template>
