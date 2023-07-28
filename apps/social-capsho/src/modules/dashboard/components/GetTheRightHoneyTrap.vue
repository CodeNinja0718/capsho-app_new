<script setup>
  import HoneyTrapCard from '@/modules/dashboard/components/HoneyTrapCard'
  const options = {
    'Guest': {
      title: 'Guest',
      route: {
        name: 'HoneyTrapTools',
        query: 'guest'
      },
      description: 'Yes, I want to promote a podcast episode featuring a special podcast-guest',
      isEnabled: false
    },
    'No Guest': {
      title: 'No Guest',
      route: {
        name: 'HoneyTrapTools',
        query: 'no-podcast-guest'
      },
      description: 'No, I want to promote a podcast episode that doesn’t have a special podcast-guest',
      isEnabled: false
    }
  }
</script>

<template>
  <div class="flex flex-row justify-center items-center mt-20">
    <div class="flex items-center justify-center flex-col w-full">
      <h1 class="font-bold text-3xl font-bodyLexend banner">
        Does the podcast episode you’re promoting feature a special guest?
      </h1>
      <div class="w-3/4 mt-12">
        <div
          class="flex flex-row flex-wrap justify-center w-full"
        >
          <HoneyTrapCard
            v-for="(item, i) in options"
            :key="i"
            v-bind="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
