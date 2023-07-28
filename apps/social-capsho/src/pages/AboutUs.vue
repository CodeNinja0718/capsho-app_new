<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col bg-gradient-to-r from-backgroundGradient to-white py-10">
      <div class="container">
        <span class="font-heading text-5xl">About Us</span>
        <div class="flex flex-row flex-wrap items-center justify-evenly py-8">
          <div class="w-full md:w-1/3 py-8 px-8">
            <img src="../assets/img.png">
          </div>
          <div class="w-full md:w-1/3 py-8 px-4">
            <p class="text-left font-formText ml-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ultricies nunc tincidunt ornare sit diam est gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ultricies nunc tincidunt ornare sit diam est gravida.
            </p>
          </div>
        </div>
        <div class="flex flex-row flex-wrap items-center justify-evenly py-8">
          <div class="w-full md:w-1/3 py-8 px-4">
            <p class="text-left font-formText ml-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ultricies nunc tincidunt ornare sit diam est gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ultricies nunc tincidunt ornare sit diam est gravida.
            </p>
          </div>
          <div class="w-full md:w-1/3 py-8 px-8">
            <img src="../assets/img.png">
          </div>
        </div>
      </div>
    </div>
    <!-- Better -->
    <div class="bg-gradient-to-r from-yellowBackgroundStart to-yellowBackgroundEnd py-10">
      <div class="w-80 mx-auto">
        <span class="font-heading leading-normal text-4xl">Better copy for busy entrepreneurs</span>
      </div>
    </div>
    <!-- Mission -->
    <div class="container flex flex-col sm:flex-row items-center justify-between py-10">
      <div class="flex flex-col w-full sm:w-1/2 py-8">
        <span class="font-heading text-5xl text-left pb-6">Our mission</span>
        <p class="font-body text-left">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ultricies nunc tincidunt ornare sit diam est gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ultricies nunc tincidunt ornare sit diam est gravida.
        </p>
      </div>
      <div class="w-full sm:w-1/3 py-4">
        <img src="../assets/img.png">
      </div>
    </div>
    <!-- Founders -->
    <div class="bg-gradient-to-r from-white to-backgroundGradient py-10">
      <div class="container flex flex-col">
        <span class="font-heading text-5xl">Meet the founders</span>
        <div class="flex flex-col lg:flex-row sm:flex-wrap lg:flex-nowrap justify-center pt-8 px-8">
          <div class="flex flex-col w-full sm:w-1/2 lg:w-1/5 bg-white rounded-xl py-6 px-6 shadow my-3 lg:my-0 sm:mx-auto lg:mx-3">
            <span class="font-body font-bold text-left pb-6">Why we do what we do:</span>
            <span class="font-body text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate ultricies nunc tincidunt ornare sit diam est gravida.</span>
          </div>
          <div class="flex flex-col w-full sm:w-1/2 lg:w-1/5 bg-secondaryDark rounded-xl pt-6 px-6 my-3 lg:my-0 sm:mx-auto lg:mx-3">
            <span class="font-bodyLexend text-left">Name Last Name</span>
            <img
              src="../assets/founder.png"
              class="max-h-80"
            >
          </div>
          <div class="flex flex-col w-full sm:w-1/2 lg:w-1/5 bg-secondaryDark rounded-xl pt-6 px-6 my-3 lg:my-0 sm:mx-auto lg:mx-3">
            <span class="font-bodyLexend text-left">Name Last Name</span>
            <img
              src="../assets/founder.png"
              class="max-h-80"
            >
          </div>
        </div>
      </div>
    </div>
    <!-- Work -->
    <div class="py-10 bg-primaryLight">
      <div class="container">
        <div class="flex flex-col lg:flex-row lg:justify-between bg-white w-full xl:h-64 rounded-xl mx-auto">
          <!-- Text + buttons -->
          <div class="flex flex-col lg:text-left lg:w-2/3 py-10 px-10">
            <span class="font-heading text-4xl">Want to work with us?</span>
            <div class="pt-8">
              <button class="rounded-full bg-primaryDark text-white py-4 px-8">
                <span class="font-body font-bold">Email us!</span>
              </button>
            </div>
          </div>
          <!-- Photo -->
          <div class="hidden lg:flex justify-end w-1/3">
            <img
              src="../assets/work.png"
              class="rounded-xl h-auto"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs'
}
</script>
