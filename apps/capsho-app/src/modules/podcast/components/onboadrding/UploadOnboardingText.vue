<template>
  <q-dialog position="right">
    <q-card style="width: 350px">
      <!--      <q-linear-progress :value="onBoardingStore.progressValue" color="pink" />-->

      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold q-pb-sm">The Walker</div>
          <div class="text-grey">
            <slot name="message"></slot>
          </div>
        </div>
      </q-card-section>
      <q-card-actions
        align="right"
        class="bg-white text-accent">
        <q-btn
          v-close-popup
          flat
          label="OK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// import { useOnBoardingStore } from 'stores/onBoarding-store'
// const onBoardingStore = useOnBoardingStore()
defineProps({
  position: {
    type: String,
    required: false,
    defaults: 'right',
    validator (value: string) {
      return [
        'right',
        'left',
        'top',
        'bottom'
      ].includes(value)
    }
  }
})
</script>

<style scoped>

</style>
