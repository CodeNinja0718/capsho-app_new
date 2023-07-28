<script setup >
  import { useUser } from '@/composables/useUser'

  const { user } = useUser()
</script>

<template>
  <div class="flex flex-col py-8">
    <span class="font-heading text-3xl text-left pb-2">Account Info</span>
    <div class="flex flex-col py-4">
      <div class="flex justify-start">
        <a
          :href="`https://payments.stunning.co/payment_update/3438jgbacfixamwxmcqpdyzbi/${user.stripeId}`"
          target="_blank"
        >
          <button class="text-left font-body font-bold text-primaryDark">
            Manage billing info
          </button>
        </a>
      </div>
      <div class="flex justify-start">
        <a
          :href="`https://payments.stunning.co/manage_subscription/3438jgbacfixamwxmcqpdyzbi/${user.stripeId}`"
          target="_blank"
        >
          <button class="text-left font-body font-bold text-primaryDark pt-4">
            Manage plan
          </button>
        </a>
      </div>
    </div>
  </div>
</template>
