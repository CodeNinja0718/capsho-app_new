<template>
  <DesktopAuthCard title="Verify your phone number">
    <template #body>
      <DesktopSignUpPhoneForm />
    </template>
  </DesktopAuthCard>
</template>
<script setup lang="ts">
import DesktopAuthCard from 'src/modules/auth/components/desktop/DesktopAuthCard.vue'
import DesktopSignUpPhoneForm from 'src/modules/auth/components/desktop/DesktopSignUpPhoneForm.vue'</script>
