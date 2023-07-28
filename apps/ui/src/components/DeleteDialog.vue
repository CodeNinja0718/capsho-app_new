<script setup lang="ts">
import AppCard from 'components/base/AppCard.vue'
import AppButton from 'components/base/AppButton.vue'

defineProps({
  text: {
    default: 'Are you sure you want to delete this episode?</br>(No back-sies!)'
  }
})
</script>

<template>
  <AppCard
    inner-size="lg"
    minHeight="20vh"
    size="md">
    <template #body>
      <div
        class="text text-text"
        v-html="text">
      </div>
      <div style="display: flex;justify-content: center;gap: 32px;margin-top: 40px;">
        <AppButton
          v-close-popup
          color="background-any-box-popup"
          label="Yes"
          no-caps
          padding="4px 23px"
          rounded
          style="font-size: 12px;"
          text-color="text"
          @click="$emit('confirmDelete')"
        />
        <AppButton
          v-close-popup
          color="accent-custom"
          hover-color="white"
          label="No"
          no-caps
          padding="4px 28px"
          rounded
          style="font-size: 12px;"
        />
      </div>
    </template>
  </AppCard>
</template>

<style lang="scss" scoped>
.text{
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  font-feature-settings: 'salt' on, 'liga' off;
}
</style>
