<template>
  <div>
    <div class="flex bg-primaryLight flex flex-col py-10">
      <span class="font-heading text-5xl pb-4">Capsho Pricing</span>
      <span class="font-number">Get a higher quality & lower maintenance (most also say better looking) copywriter in your pocket, for a fraction of the cost </span>
      <div class="flex justify-center pt-8">
        <Popup
          button-text="Watch demo"
          video="https://player.vimeo.com/video/619020440?h=c8e49a47c0&badge=0&autopause=0&player_id=0&app_id=58479"
        />
      </div>
    </div>
    <PricingRates
      title="Choose your plan"
      btn-text-platinum="Create your account and get started"
      btn-text-diamond="Create your account and get started"
      link-diamond="sign-in"
      link-platinum="sign-in"
      class="bg-gradient-to-r from-white to-backgroundGradient"
    />
    <!-- Core features -->
    <div class="container">
      <div class="flex flex-col py-10">
        <span class="font-heading text-4xl pb-6">Capsho’s best features</span>
        <span class="font-number">We don’t like to brag but... you’re here checking us out so we’re going to shoot our shot!</span>
        <div class="flex flex-row flex-wrap pt-6 justify-between">
          <div
            v-for="(item, i) in coreFeatures"
            :key="i"
            class="flex flex-col w-full sm:w-1/2 md:w-1/5 py-6"
          >
            <div class="flex-none bg-secondaryLight rounded-2xl py-6 px-6 mx-auto">
              <img
                :src="require('../assets/icons/' + item.icon)"
                class="w-20 h-20"
              >
            </div>
            <span class="text-left font-body font-bold text-lg py-4">{{ item.title }}</span>
            <p class="text-left font-body">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <SignUpButton />
  </div>
</template>

<script setup>
import PricingRates from '@/components/PricingRates.vue'
import Popup from '@/components/Popup.vue'
import SignUpButton from '@/components/SignUpButton.vue'

const coreFeatures = [
  {
    title: 'Live Chat Support',
    text: 'Our in-house copywriter (a real life person) is available to you via Live Chat! Whether you need inspo to get started or have questions ABOUT our questions, she\'ll help you get unstuck. She doesn\'t get out of bed (and into your pocket) for less than $47/month (diva alert!) but she\'s worth every dollar',
    icon: 'message.svg'
  },
  {
    title: 'Storytelling supercharged by logic',
    text: 'Our storytelling tools extract your stories out of your head and multiply them into a bank of unique captions and emails. (Bonus: we won’t mansplain AI to you)',
    icon: 'tools.svg'
  },
  {
    title: 'Visualization of your captions and emails',
    text: 'We know words can’t captivate on their own. So we’ll also recommend the visual layout for your captions & emails (i.e. we don’t just make your dinner we’ll suggest wine pairings too)',
    icon: 'lightbulb.svg'
  },
  {
    title: 'Private Facebook community',
    text: 'Get access to helpful tips & tricks and collaborate & network with other business owners recovering from blank-page syndrome using Capsho',
    icon: 'people.svg'
  }
]
</script>
