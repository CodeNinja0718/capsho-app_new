<script setup lang="ts">
import DesktopAuthCard from 'src/modules/auth/components/desktop/DesktopAuthCard.vue'
import DesktopSignUpBusinessDetailsForm
  from 'src/modules/auth/components/desktop/DesktopSignUpBusinessDetailsForm.vue'
</script>

<template>
  <DesktopAuthCard
    inner-size="lg"
    size="md"
    title="Let's Get this Capsho-W On The Road">
    <template #body>
      <DesktopSignUpBusinessDetailsForm />
    </template>
  </DesktopAuthCard>
</template>
