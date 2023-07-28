<template>
  <div>
    <!-- Header -->
    <div class="relative flex pt-8 bg-gradient-to-r from-backgroundGradient to-white">
      <div class="absolute inset-x-0 bottom-0 w-full z-0">
        <img
          src="../assets/bg-yellow.png"
          class="w-full"
        >
      </div>
      <div class="container z-10">
        <div class="text-center py-6 mb-6 mx-auto flex flex-col relative">
          <span class="font-heading sm:leading-normal text-5xl pb-8">From blank page to</span>
          <div class="absolute bottom-0 inset-x-0">
            <span class="w1 opacity-0 font-heading text-5xl">captions</span>
          </div>
          <div class="absolute bottom-0 inset-x-0">
            <span class="w2 opacity-0 font-heading text-5xl">emails</span>
          </div>
        </div>
        <div class="text-center pb-6 mx-auto">
          <span class="font-number">Turn your stories into a bank of captions & emails that connect & convert</span>
        </div>
        <div class="pb-4">
          <button
            class="font-body font-bold bg-secondaryDark text-white py-2 px-4 mx-2 rounded-full"
            @click="$router.push('/sign-in')"
          >
            Get Started
          </button>
        </div>
        <div class="flex justify-center pt-10">
          <img
            src="../assets/iphone-x-2.png"
            class="rounded-t-3xl w-2/3 md:w-1/2 lg:w-1/5"
          >
        </div>
      </div>
    </div>
    <!-- How it Works -->
    <div class="py-4">
      <div class="text-center py-6 mx-auto">
        <h1 class="font-heading text-5xl">
          How it works
        </h1>
      </div>
      <div class="container">
        <div class="flex flex-col md:flex-row py-8 justify-between">
          <div class="flex flex-col w-full md:w-1/6">
            <span class="text-8xl font-number font-extrabold -mb-8 text-gray-100">1</span>
            <span class="text-xl font-number font-medium">Go from blank page to ideas</span>
            <span class="font-number w-40 pt-4 mx-auto">Get inspired with limitless story ideas - whether it's a memory, customer result or product launch</span>
          </div>
          <div class="flex w-full py-8 md:w-1/6">
            <img
              class="mx-auto"
              src="../assets/arrow.svg"
            >
          </div>
          <div class="flex flex-col w-full md:w-1/6">
            <span class="text-8xl font-number font-extrabold -mb-8 text-opacity-10 text-primaryDark">2</span>
            <span class="text-xl font-number text-primaryDark font-medium">Go from ideas to your story told</span>
            <span class="font-number w-40 pt-4 mx-auto">Get your stories out of your head and into a short narrative using our quick & intuitive storytelling process</span>
          </div>
          <div class="flex w-full py-8 md:w-1/6">
            <img
              class="mx-auto"
              src="../assets/arrow.svg"
            >
          </div>
          <div class="flex flex-col w-full md:w-1/6">
            <span class="text-8xl font-number font-extrabold -mb-8 text-gray-100">3</span>
            <span class="text-xl font-number font-medium">Go from story to captions and emails</span>
            <span class="font-number w-40 pt-4 mx-auto">Get your captions & emails that you can copy, download, add your flavor to and schedule. The best part? We've got hundreds stored for you to keep coming back to!</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Sign Up Webclass -->
    <SignUpButton />
    <!-- Discover -->
    <div class="py-4 bg-gradient-to-r from-yellowBackgroundStart to-yellowBackgroundEnd">
      <div class="text-center max-w-2xl py-6 mx-auto">
        <span class="text-5xl font-heading">Discover what you can create with Capsho</span>
      </div>
      <div class="full-width q-px-xl">
        <div class="row justify-center" :class="{ 'no-wrap': $q.screen.gt.sm }">
          <!-- Spotlights -->
          <div class="flex rounded-lg w-full md:w-1/3 bg-white py-6 px-6 md:mr-4 my-4">
            <div class="flex flex-col">
              <img
                src="../assets/icons/stars.svg"
                width="20"
                height="20"
              >
              <span class="text-left font-formText text-xl font-bold pt-10">Hundreds of compelling captions designed for viralocity</span>
              <span class="text-left font-bodyLexend pt-4 leading-loose">Finally get yourself seen on Instagram! Engage without feeling cringe-y and promote without feeling sales-y</span>
            </div>
          </div>
          <!-- Campaign -->
          <div class="flex rounded-lg w-full md:w-1/3 bg-white py-6 px-6 md:mx-2 my-4">
            <div class="flex flex-col">
              <img
                src="../assets/icons/bullets.svg"
                width="20"
                height="20"
              >
              <span class="text-left font-formText text-xl font-bold pt-10">Engaging emails people will actually read</span>
              <span class="text-left font-bodyLexend pt-4 leading-loose">Say Goodbye to blank page syndrome. Say Hello to a personalized bank of emails</span>
            </div>
          </div>
          <!-- Storytelling -->
          <div class="flex rounded-lg w-full md:w-1/3 bg-white py-6 px-6 md:ml-4 my-4">
            <div class="flex flex-col">
              <img
                src="../assets/icons/bullhorn.svg"
                width="20"
                height="20"
              >
              <span class="text-left font-formText text-xl font-bold pt-10">A dynamic 9-Grid for instagram with captions AND recommended visuals</span>
              <span class="text-left font-bodyLexend pt-4 leading-loose">View and copy captions (Peanut Butter) and get our recommended creatives (Jelly) for your Instagram feed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- As seen on -->
    <div class="py-10">
      <div class="container">
        <div class="flex flex-col">
          <span class="font-heading text-left text-4xl">As seen on</span>
          <div class="flex flex-wrap xl:flex-nowrap flex-row items-center justify-center 2xl:justify-between py-10">
            <img
              src="../assets/as-seen-on/nebraska.jpg"
              class="w-64 h-20 my-4 md:mx-4 xl:m-0 xl:w-1/4"
            >
            <img
              src="../assets/as-seen-on/2news2.png"
              class="w-64 h-20 my-4 md:mx-4 xl:m-0 xl:w-1/4"
            >
            <img
              src="../assets/as-seen-on/fox402.jpg"
              class="w-58 h-20 my-4 md:mx-4 xl:m-0 xl:w-1/4"
            >
            <img
              src="../assets/as-seen-on/newsnet1.jpg"
              class="w-62 h-20 my-4 md:mx-4 xl:m-0 xl:w-1/4"
            >
            <img
              src="../assets/as-seen-on/marketwatch2.jpg"
              class="w-64 h-20 my-4 md:mx-4 xl:m-0 xl:w-1/4"
            >
          </div>
        </div>
      </div>
    </div>
    <!-- Pricing
    <PricingRates title="Choose your plan" linkDiamond="sign-in" linkPlatinum="sign-in" class="bg-gradient-to-r from-white to-backgroundGradient" /> -->
    <!-- Ready to write -->
    <div class="py-10 bg-primaryLight">
      <div class="container">
        <div class="flex flex-col relative lg:flex-row justify-center lg:justify-start bg-white w-full lg:h-full rounded-xl mx-auto items-center">
          <!-- Text + buttons -->
          <div class="flex flex-col lg:text-left lg:w-1/3 h-full py-10 px-5 lg:pl-10">
            <span class="font-heading text-4xl">Ready to create your own bank of captions and emails?</span>
            <span class="font-body py-6">Join our free webclass to see Capsho in action!</span>
            <div class="pt-6">
              <a
                href="https://www.capshounlocked.com/webclass"
                target="_blank"
              >
                <button class="rounded-full bg-primaryDark font-body font-bold text-white py-4 px-4 -mt-3">
                  Sign up for our free Webclass
                </button>
              </a>
            </div>
          </div>
          <!-- Arrow -->
          <div class="flex hidden lg:block w-1/3">
            <img
              src="../assets/curvy-arrow.svg"
              class="mt-10"
              style="transform: rotate(-20deg) scaleX(-1)"
            >
          </div>
          <!-- Photo -->
          <div class="hidden absolute right-0 lg:flex justify-end h-full w-1/3">
            <img
              src="../assets/woman.jpg"
              class="rounded-r-xl h-full"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SignUpButton from '@/components/SignUpButton.vue'
</script>

<style scoped>
.w1 {
  animation: w1anim 10s infinite;
}

.w2 {
  animation: w2anim 10s infinite;
}

@keyframes w1anim {
  0%{
    opacity: 0;
  }
  25%{
    opacity: 1;
  }
  50% {
    opacity:0;
  }
}


@keyframes w2anim {
  50%{
    opacity: 0;
  }
  75%{
    opacity: 1;
  }
  100% {
    opacity:0;
  }
}
</style>
