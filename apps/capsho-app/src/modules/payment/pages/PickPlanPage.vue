<template>
  <q-page>
    <div class="column justify-center full-width q-gutter-y-lg">
      <div class="col-8">
        <PricingTable :mode="planMode" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PricingTable from 'src/modules/payment/components/PricingTable.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const $route = useRoute()
const planMode = ref($route.query.plan)
</script>

<style scoped>

</style>
