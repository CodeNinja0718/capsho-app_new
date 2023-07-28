<script setup lang="ts">
defineProps({
  label: String,
  modelValue: {
    type: Boolean,
    required: true
  }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <q-checkbox
    checked-icon="task_alt"
    :label="label"
    :model-value="modelValue"
    unchecked-icon="highlight_off"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>
