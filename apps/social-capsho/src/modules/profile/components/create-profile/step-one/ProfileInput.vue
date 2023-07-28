<script setup>
  defineProps({
    placeholder: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  })

  defineEmits([ 'update:modelValue' ])
</script>

<template>
  <div class="py-2">
    <label
      class="block text-left text-formLabel font-formText pb-2"
    >
      {{ label }}
    </label>
    <input
      v-bind="{
        ...$attrs,
        onChange: ($event) => { $emit('update:modelValue', $event.target.value) }
      }"
      type="text"
      class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
      :placeholder="placeholder"
    >
  </div>
</template>
