<template>
  <DesktopAuthCard title="Tell us about you">
    <template #body>
      <DesktopSignUpUserDetailsForm/>
    </template>
  </DesktopAuthCard>
</template>
<script setup lang="ts">
import DesktopAuthCard from 'src/modules/auth/components/desktop/DesktopAuthCard.vue'
import DesktopSignUpUserDetailsForm from 'src/modules/auth/components/desktop/DesktopSignUpUserDetailsForm.vue'</script>
