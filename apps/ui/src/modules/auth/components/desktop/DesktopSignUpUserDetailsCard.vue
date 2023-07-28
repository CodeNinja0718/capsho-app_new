<script setup lang="ts">
import DesktopAuthCard from 'src/modules/auth/components/desktop/DesktopAuthCard.vue'
import DesktopSignUpUserDetailsForm from 'src/modules/auth/components/desktop/DesktopSignUpUserDetailsForm.vue'
</script>

<template>
  <div class="col-span-1 lg:col-span-2 xl:col-span-3" />
  <DesktopAuthCard
    class="col-span-10 lg:col-span-8 xl:col-span-6 lexend-regular"
    innerSize="xl"
    size="md"
    title="Tell us about you."
  >
    <template #body>
      <DesktopSignUpUserDetailsForm/>
    </template>
  </DesktopAuthCard>
  <div class="col-span-1" />
</template>
