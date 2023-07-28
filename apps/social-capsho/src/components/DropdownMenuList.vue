<script setup>
  import DropdownMenuListItem from './DropdownMenuListItem.vue'
  import { logOut } from '@/modules/auth/services/authService'

  const options = [
    {
      option: 'Dashboard', route: 'Dashboard'
    },
    {
      option: 'Edit Profile', route: 'Profile'
    },
    {
      option: 'Podcasts', route: 'Podcasts'
    }
  ]

  function logOutFunction() {
    if (window.Intercom) {
      window.Intercom('shutdown')
    }
    logOut()
  }
</script>

<template>
  <ul
    class="py-1"
  >
    <DropdownMenuListItem
      v-for="(option, idx) in options"
      :key="idx"
      v-bind="option"
    />

    <li class="py-1">
      <a
        class="cursor-pointer block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
        @click="logOutFunction"
      >
        Sign out
      </a>
    </li>
  </ul>
</template>
