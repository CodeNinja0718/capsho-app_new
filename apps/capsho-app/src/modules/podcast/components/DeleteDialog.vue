<template>
  <AppCard
    inner-size="lg"
    minHeight="20vh"
    size="md">
    <template #body>
      <div
        class="text"
        v-html="text">
      </div>
      <div style="display: flex;justify-content: center;gap: 32px;margin-top: 40px;">
        <AppButton
          v-close-popup
          color="accent"
          hoverColor="white"
          label="Yes"
          padding="6px 36px"
          rounded
          style="font-size: 12px;"
          @click="$emit('confirmDelete')"
        />
        <AppButton
          v-close-popup
          color="accent"
          hoverColor="white"
          label="No"
          padding="6px 40px"
          rounded
          style="font-size: 12px;"
        />
      </div>
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from 'components/AppCard.vue'
import AppButton from 'src/components/AppButton.vue'

defineProps({
  text: {
    default: 'Are you sure you want to delete this episode?</br>(No back-sies!)'
  }
})
</script>
<style lang="scss" scoped>
.text{
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  text-align: center;
  font-feature-settings: 'salt' on, 'liga' off;
  color: #000000;
}
</style>
