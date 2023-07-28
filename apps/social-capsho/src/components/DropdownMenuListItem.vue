<script setup>
  /**
   * List item for a dropdown menu
   * @component
   * @vue-prop {String} option - Option name for a dropdown menu
   * @vue-prop {String} route - Route name to navigate to
   */
  defineProps({
    option: {
      type: String,
      default: ''
    },
    route: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <li>
    <router-link
      :to="{ name: route }"
      class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
    >
      {{ option }}
    </router-link>
  </li>
</template>
