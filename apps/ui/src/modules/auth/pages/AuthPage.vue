<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import BrandLogo from 'src/components/BrandLogo.vue'

const authTab = ref('signin')

const tabs = Object.freeze([
  {
    label: 'Sign in',
    value: 'signin',
    route: 'AuthSignIn',
    default: true
  },
  {
    label: 'Sign up',
    value: 'signup',
    route: 'AuthSignUp',
    default: false
  }
])

interface Slide {
  slideName: string,
  imgSrc: string,
  quote: string,
  quoteAuthor: string
}
const slide = ref<string>('slide1')
const slideArray = ref<Slide[]>([
  {
    slideName: 'slide1',
    imgSrc: '../src/assets/testimonial/testimonial1.jpeg',
    quote: "I'm averaging a 66% open rate on the emails Capsho helps me write. My social media engagement has increased by 20-30%. And my downloads have gone from 300 to 1,800 in the space of 2 episodes.",
    quoteAuthor: '- Adam Lamb, Host of Chef Life Radio'
  },
  {
    slideName: 'slide2',
    imgSrc: '../src/assets/testimonial/testimonial2.jpeg',
    quote: "Capsho changed my life. I've gone from being the plumber with leaky pipes with my podcast marketing to being consistent on Instagram, LinkedIn and Email. And my downloads are increasing consistently.",
    quoteAuthor: '- Bec Chappell, Host of Marketing Espresso'
  },
  {
    slideName: 'slide3',
    imgSrc: '../src/assets/testimonial/testimonial3.jpeg',
    quote: "In 15 minutes Capsho does what used to take me over 2 - 3 hours to come up with. Now, I'm no mathematician, but that's a LOT of time saved for me. Although I have to edit my drafts, 90% of my work is done for me. And I appreciate that!",
    quoteAuthor: '- Host of Motivate Grind Succeed, the Podcast'
  }
])
</script>

<template>
  <q-page-container>
    <q-page class="full-height flex flex-col justify-center items-center px-0 md:px-4 py-8 lexend-regular">
      <brand-logo size="xl" />
      <div class="w-full grid grid-cols-12 py-2">
        <div class="col-span-1 md:col-span-2 lg:col-span-3"/>
        <div class="col-span-10 md:col-span-6 lg:col-span-3 px-16">
          <q-tabs
            active-bg-color="accent"
            active-color="white"
            align="justify"
            class="text-white poppins-regular tabs z-50"
            dense
            indicator-color="transparent"
            narrow-indicator
          >
            <q-route-tab
              v-for="(tab, index) in tabs"
              :key="index"
              class="tab"
              :default="tab.value === 'login'"
              :label="tab.label"
              :name="tab.value"
              no-caps
              replace
              :to="{ name: tab.route }"
            />
          </q-tabs>
        </div>
      </div>
      <div class="w-full grid grid-cols-11 px-6">
        <div :class="$route.meta.hideQuate ? 'col-span-1 lg:col-span-3' : 'col-span-1 lg:col-span-2'"/>
        <div
          class="grid grid-cols-11 rounded-[40px] overflow-hidden bg-dialog-dark"
          :class="$route.meta.hideQuate ? 'col-span-9 lg:col-span-5' : 'col-span-10 lg:col-span-7'"
        >
          <div
            class="relative"
            :class="$route.meta.hideQuate ? 'col-span-11' : 'col-span-11 lg:col-span-7'"
          >
            <q-tab-panels
              v-model="authTab"
              animated
              class="bg-dialog-dark z-50">
              <q-tab-panel name="signin">
                <router-view/>
              </q-tab-panel>

              <q-tab-panel name="signup">
                <router-view/>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div
            v-if="!$route.meta.hideQuate"
            class="col-span-11 lg:col-span-4 flex items-center"
          >
            <q-carousel
              v-model="slide"
              animated
              :autoplay="true"
              class="bg-transparent h-fit"
              control-color="white"
              infinite
              padding
              swipeable
              transition-next="slide-left"
              transition-prev="slide-right"
            >
              <q-carousel-slide
                v-for="(slide, index) in slideArray"
                :key="index"
                class="h-full"
                :name="slide.slideName">
                <div class="row justify-center items-center q-gutter-sm">
                  <div class="col-12 col-sm-4 col-md-12 text-center">
                    <q-avatar class="w-[240px] h-[240px] testimonial-avatar">
                      <q-img
                        :alt="slide.quoteAuthor"
                        :src="slide.imgSrc"
                      />
                    </q-avatar>
                  </div>
                  <div class="col-12 col-sm-7 col-md-11 lg:pt-4 text-13 lg:text-[16px]">
                    <p class="text-center text-sm lexend-regular">
                      <q>
                        {{ slide.quote }}
                      </q>
                    </p>
                    <p class="mt-1 text-hint text-center text-xs lexend-regular">
                      <b>{{ slide.quoteAuthor }}</b>
                    </p>
                  </div>
                </div>
              </q-carousel-slide>
              <template v-slot:control></template>
            </q-carousel>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<style lang="scss" scoped>
.tabs {
  border-radius: 20px;
  padding: 4px;
  background-color: $secondary-dark;
  .tab {
    border-radius: 20px;
    padding: 0px 32px;
  }
}
</style>
