<template>
  <DesktopAuthCard
    inner-size="xl"
    size="lg"
    title="Now Let's Grab Your Social Media And Website Links">
    <template #body>
      <DesktopSignUpBusinessLinksForm />
    </template>
  </DesktopAuthCard>
</template>
<script setup lang="ts">
import DesktopAuthCard from 'src/modules/auth/components/desktop/DesktopAuthCard.vue'
import DesktopSignUpBusinessLinksForm from 'src/modules/auth/components/desktop/DesktopSignUpBusinessLinksForm.vue'</script>
