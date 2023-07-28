<script setup>
  import AppNotificationMessage from '@/components/AppNotificationMessage'
  import { useStore } from 'vuex'
  import { computed } from 'vue'
  
  const $store = useStore()
  const notifications = computed(() => $store.getters['notifications/getNotifications'])
</script>

<template>
  <div class="fixed inset-x-1/4 bottom-8">
    <AppNotificationMessage
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>