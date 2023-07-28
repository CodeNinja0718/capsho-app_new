<script setup>
  import PricingRates from '@/components/PricingRates'

</script>

<template>
  <div class="flex flex-col justify-center">
    <span class="font-heading text-2xl py-6 text-center">We’ve verified your email and now it’s time to pick your Capsho Plan. Remember you get a free 14-day trial for both plans</span>
    <div class="flex flex-col lg:flex-row items-center">
      <img
        src="../../../assets/paywall.png"
        class="w-1/2 lg:w-1/3 lg:h-1/3"
        alt="paywall icon"
      >
      <PricingRates
        btn-text-platinum="Get started"
        btn-text-diamond="Get started"
        link-platinum="http://capshoplans.com/"
        link-diamond="http://capshoplans.com/"
        class="lg:w-2/3"
      />
    </div>
  </div>
</template>