<script setup>
  import { useGtag } from 'vue-gtag-next'

  const { query } = useGtag()

  defineProps({
    title: {
      type: String,
      required: false,
      default: ''
    },
    linkDiamond: {
      type: String,
      required: true
    },
    linkPlatinum: {
      type: String,
      required: true
    },
    btnTextDiamond: {
      type: String,
      required: true
    },
    btnTextPlatinum: {
      type: String,
      required: true
    },
  })

  const platinumFeatures = [
    'Unlimited access to all our storytelling tools to generate captions you can schedule & post and emails you can schedule & send',
    'Live Chat support with our Copywriting Expert so you\'re never stuck',
    'Premium access to a private Facebook Group community'
  ]

  const diamondFeatures = [
    'All of the Platinum Plan benefits',
    'Premium monthly access to a Social Media Action Calendar',
    'Premium monthly access to a trending Instagram Reels Inspiration Drop, with specific instructions on how to create them',
    'Premium access to our Instagram Stories Strategy',
    'Premium access to our Social Media Graphics Swipe File',
    '1:1 Onboarding call'
  ]

  const sendPlatinumEvent = () => query('event', 'platinumClick', { method: 'Platinum' })
  const sendDiamondEvent = () => query('event', 'diamondClick', { method: 'Diamond' })
</script>

<template>
  <!-- Pricing -->
  <div class="py-10">
    <div class="container">
      <div class="px-4 flex">
        <span class="font-heading text-5xl">{{ title }}</span>
      </div>
      <div class="flex flex-col justify-center md:flex-row py-6">
        <!-- Platinum box -->
        <div class="flex flex-col w-full w-1/2 bg-white shadow rounded-2xl py-10 px-6 md:mr-4 mt-2 md:mt-0">
          <span class="font-bodyLexend flex pb-6">Platinum Plan</span>
          <div class="font-bodyLexend flex flex-row pb-6">
            <span class="text-4xl pr-4">$47</span>
            <span>/month</span>
          </div>
          <div class="border-t-2 pb-4">
            <!-- Line -->
          </div>
          <div
            v-for="(feature, i) in platinumFeatures"
            :key="i"
            class="flex flex-row"
          >
            <img
              src="../assets/icons/check.svg"
              width="20"
              height="20"
              alt="Check box icon"
            >
            <span class="text-left font-body px-4 py-2">{{ feature }}</span>
          </div>
          <div class="flex flex-col justify-end h-full">
            <a
              :href="linkPlatinum"
              target="_blank"
              class="w-full"
              @click="sendPlatinumEvent"
            >
              <button class="rounded-full bg-secondaryDark py-4 mt-6 w-full">
                <span class="font-body font-bold text-white font-body">{{ btnTextPlatinum }}</span>
              </button>
            </a>
          </div>
        </div>
        <!-- Diamond Box -->
        <div class="flex flex-col w-full w-1/2 bg-white shadow rounded-2xl py-10 px-6 md:ml-4 mt-2 md:mt-0">
          <span class="font-bodyLexend flex pb-6">Diamond Plan</span>
          <div class="font-bodyLexend flex flex-row pb-6">
            <span class="text-4xl pr-4">$97</span>
            <span>/month</span>
          </div>
          <div class="border-t-2 pb-4">
            <!-- Line -->
          </div>
          <div
            v-for="(feature, i) in diamondFeatures"
            :key="i"
            class="flex flex-row"
          >
            <img
              src="../assets/icons/check.svg"
              width="20"
              height="20"
              alt="Check box icon"
            >
            <span class="text-left font-body px-4 py-2">{{ feature }}</span>
          </div>
          <div class="flex flex-col justify-end h-full">
            <a
              :href="linkDiamond"
              target="_blank"
              class="w-full"
              @click="sendDiamondEvent"
            >
              <button class="rounded-full bg-secondaryDark py-4 mt-6 w-full">
                <span class="font-body font-bold text-white font-body">{{ btnTextDiamond }}</span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
