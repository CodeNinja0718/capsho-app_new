<template>
  <q-page class="column items-center q-col-gutter-y-lg">
    <h1 class="inter-bold text-h5 text-uppercase">Plans And Pricing</h1>
    <div
      v-if="loading"
      style="max-width: 450px; width: 100%">
      <q-img
        class="loading-img"
        src="https://media.giphy.com/media/kA158Gup0eSpG/giphy.gif">
        <div class="absolute-full flex flex-center">
          <q-circular-progress
            class="q-ma-md"
            color="accent"
            indeterminate
            size="50px"
          />
        </div>
      </q-img>
      <div class="text-center q-px-xl loading-text q-pt-lg">
        Submitting...
      </div>
    </div>
    <div
      v-else-if="products"
      class="row items-center justify-center q-gutter-x-lg no-wrap">
      <PricingPlansCard
        v-for="(plan) in products"
        :key="plan.price.id"
        :plan="plan"
        @check-out-loading="handleLoading" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import PricingPlansCard from './PricingPlansCard.vue'
import { getStripeProducts, getSubscription } from 'src/services/firebase/stripe'

const authStore = useAuthStore()
async function fetchPaymentData () {
  const activeSub = await getSubscription()
  if (activeSub) {
    authStore.router.push({
      name: 'ProfileBilling'
    })
  }
  if (!authStore.stripeProducts.length) {
    await getStripeProducts()
  }
}
const loading = ref(false)
function handleLoading (val: boolean) {
  loading.value = val
}
onMounted(() => fetchPaymentData())
const products = computed(() => authStore.stripeProducts)
</script>

<style scoped>

</style>
