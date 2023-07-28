<template>
  <div class="bg-gradient-to-r from-backgroundGradient to-white text-left min-h-screen">
    <!--    <div-->
    <!--      v-if="!paid"-->
    <!--      class="container"-->
    <!--    >-->
    <!--      <div class="flex flex-col justify-center">-->
    <!--        <span class="font-heading text-2xl py-6 text-center">We’ve verified your email and now it’s time to pick your Capsho Plan. Remember you get a free 14-day trial for both plans</span>-->
    <!--        <div class="flex flex-col lg:flex-row items-center">-->
    <!--          <img-->
    <!--            src="../../../assets/paywall.png"-->
    <!--            class="w-1/2 lg:w-1/3 lg:h-1/3"-->
    <!--          >-->
    <!--          <PricingRates-->
    <!--            btn-text-platinum="Get started"-->
    <!--            btn-text-diamond="Get started"-->
    <!--            link-platinum="http://capshoplans.com/"-->
    <!--            link-diamond="http://capshoplans.com/"-->
    <!--            class="lg:w-2/3"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div
      class="container"
    >
      <div class="row q-col-gutter-x-md">
        <div class="col-2 column">
          <span class="font-heading text-3xl py-8">Choose your storytelling tool</span>
          <div
            v-for="(item, i) in menu"
            :key="i"
            class="flex flex-row relative"
          >
            <button
              class="font-body hover:font-bold hover:text-primaryDark border-l-4 border-transparent focus:border-primaryDark focus:font-bold focus:text-primaryDark py-4 px-4 text-left"
              @mouseenter="item.isEnabled = true"
              @mouseleave="item.isEnabled = false"
              @click="$router.push({ name: item.route.name, params: { tool: item.route.params } })"
            >
              {{ item.name }}
            </button>
            <span
              v-if="item.isEnabled"
              class="font-body rounded-2xl shadow-lg p-4 bg-primaryLight absolute bottom-14 z-50"
            >{{ item.description }}</span>
          </div>
        </div>
        <div class="col-10 column justify-start items-center">
          <div
            v-if="false"
            class="py-8"
          >
            <button
              v-for="(option, i) in options"
              :key="i"
              :class="`bg-${option.color} text-${option.text} py-2 mx-2 w-40 rounded-full font-bold`"
              @click="selectOption(option)"
            >
              {{ option.name }}
            </button>
          </div>
          <q-space />
          <iPhone v-if="optionType === 'Caption' && false" />
          <Email v-if="optionType === 'Email'" />
          <div class="col-11 full-width">
            <Outputs />
          </div>
        </div>
      </div>
      <div
        v-if="onboarding1"
        class="overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none flex"
      >
        <div class="relative inset-x-1/4 inset-y-1/4 ml-8 w-80">
          <div class="flex flex-col bg-backgroundGradient relative w-full rounded-2xl px-4 py-4 font-body">
            <span
              v-if="tooltipStep === 0"
              class="pb-4"
            ><span class="font-bold">Now for the fun part! </span>Here are all the Storytelling Tools you have access to with Capsho!</span>
            <template v-if="tooltipStep > 0">
              <span class="text-2xl font-bold">{{ menu[tooltipStep-1].name }}</span>
              <span class="py-8">{{ menu[tooltipStep-1].description }}</span>
            </template>
            <div class="flex flex-row justify-between">
              <button
                class="text-gray-400 font-bold"
                @click="finishOnboarding()"
              >
                Skip
              </button>
              <button
                v-if="tooltipStep > 0"
                class="text-gray-600 font-bold"
                @click="tooltipStep--"
              >
                Previous
              </button>
              <button
                v-if="tooltipStep < menu.length"
                class="text-primaryDark font-bold"
                @click="tooltipStep++"
              >
                Next
              </button>
              <button
                v-else
                class="text-primaryDark font-bold"
                @click="nextOnboarding()"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="onboarding2"
        class="overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none flex"
      >
        <div class="relative inset-x-10 inset-y-1/3 ml-8 w-80">
          <div class="flex flex-col bg-backgroundGradient relative w-full rounded-2xl px-4 py-4 font-body">
            <span
              v-if="tooltipStep === 0"
              class="pb-8"
            >Then start populating your captions by selecting a storytelling tool</span>
            <span
              v-if="tooltipStep === 1"
              class="pb-8"
            >Choose between captions and emails</span>
            <span
              v-if="tooltipStep === 2"
              class="pb-8"
            >We recommend you begin with the <span class="font-bold">About Me</span> section, but feel free to explore all of our great tools!</span>
            <div class="flex flex-row justify-between">
              <button
                v-if="tooltipStep === 0"
                class="text-gray-400 font-bold"
                @click="finishOnboarding()"
              >
                Skip
              </button>
              <button
                v-if="tooltipStep === 1 || tooltipStep === 2"
                class="text-gray-600 font-bold"
                @click="tooltipStep--"
              >
                Previous
              </button>
              <button
                v-if="tooltipStep === 0 || tooltipStep === 1"
                class="text-primaryDark font-bold"
                @click="tooltipStep++"
              >
                Next
              </button>
              <button
                v-if="tooltipStep === 2"
                class="text-primaryDark font-bold"
                @click="finishOnboarding()"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="onboarding1"
        class="opacity-75 fixed inset-y-0 right-0 bg-black w-3/4"
      />
      <div
        v-if="onboarding2"
        class="opacity-75 fixed inset-y-0 left-0 bg-black w-1/4"
      />
    </div>
  </div>
</template>

<script>
import iPhone from '@/modules/dashboard/components/iPhone'
import Email from '../components/Email.vue'
// import PricingRates from '@/components/PricingRates.vue'
import { db } from '@/config/dbConfig'
import { mapGetters } from 'vuex'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Outputs from '@/modules/dashboard/components/Outputs'

export default {
  name: 'Dashboard',
  components: {
    Outputs,
    iPhone,
    Email
  },
  data: () => ({
    paid: true,
    showModal: false,
    onboarding1: false,
    onboarding2: false,
    options: [
      { name: 'Caption', color: 'secondaryDark', text: 'white', isEnabled: true },
      { name: 'Email', color: 'transparent', text: 'gray-400', isEnabled: false }
    ],
    optionType: 'Caption',
    tooltipStep: 0,
    menu: [
      {
        name: 'About me',
        route: {
          name: 'Questions',
          params: 'about-me'
        },
        description: 'Introduce yourself to your audience in a fun, unique and personal way',
        isEnabled: false
      },
      {
        name: 'Promised Land',
        route: {
          name: 'Questions',
          params: 'promised-land'
        },
        description: 'Inspire your audience with how you reached an aspiration they have',
        isEnabled: false
      },
      {
        name: 'How-to',
        route: {
          name: 'Questions',
          params: 'how-to'
        },
        description: 'Educate your audience on something they want to know how to do ',
        isEnabled: false
      },
      {
        name: 'Product spotlight',
        route: {
          name: 'Questions',
          params: 'product-spotlight'
        },
        description: "Excite your audience about a hero product or collection that's available to buy",
        isEnabled: false
      },
      {
        name: 'Content Honey Trap',
        route: {
          name: 'GetTheRightHoneyTrap',
          params: 'get-the-right-honey-trap'
        },
        description: 'Create insatiable curiosity in your audience and compel them to listen to your latest podcast episode',
        isEnabled: false
      }
      //{ name: 'Running a promotion', route: '/running-a-promotion', description: "Compel your customers to buy from your newest promotion", isEnabled: false },
      //{ name: 'Launching a product', route: '/launching-a-new-product', description: "Prime your customers to buy a new product or collection you're launching", isEnabled: false },
      //{ name: 'Viralocity Contest', route: '/viralocity-contest', description: "Excite your audience about your Viralocity Contest", isEnabled: false },
      //{ name: 'Holidays', route: '/holidays', description: "Recognize and celebrate the social media holidays your customers care about", isEnabled: false },
    ]
  }),
  computed: {
    ...mapGetters('app', ['userData', 'user']),
  },
  watch: {
    userData(newVal) {
      if (newVal) {
        this.hasDoneOnboarding(newVal.id)
        // if (this.user.subscription === 'platinum' || this.user.subscription === 'diamond') {
        //   this.paid = true
        //   this.intercom(newVal.id, newVal.name, newVal.email)
        // }
      }
    }
  },
  mounted() {
    if (this.userData) {
      this.hasDoneOnboarding(this.userData.id)
    }
    if (this.user) {
      if (this.user.subscription === 'platinum' || this.user.subscription === 'diamond') {
        this.paid = true
        if (this.userData) {
          this.intercom(this.userData.id, this.userData.name, this.userData.email)
        }
      }
    }
  },
  methods: {
    nextOnboarding() {
      this.tooltipStep = 0
      this.onboarding1 = false
      this.onboarding2 = true
    },
    async finishOnboarding() {
      let id = this.userData.id

      this.tooltipStep = 0
      this.onboarding1 = false
      this.onboarding2 = false

      const userRef = doc(db, 'users', id)
      await updateDoc(userRef, {
        first_login: true
      })
    },
    toggleModal() {
      this.showModal ? this.showModal = false : this.showModal = true
    },
    selectOption(option) {
      if (option.isEnabled) {
        return
      } else {
        this.options.forEach((otherOption) => {
          if (option.name === otherOption.name) {
            this.optionType = otherOption.name
            otherOption.isEnabled = true
            otherOption.text = 'white'
            otherOption.color = 'secondaryDark'
          } else {
            otherOption.isEnabled = false
            otherOption.text = 'gray-400'
            otherOption.color = 'transparent'
          }
        })
      }
    },
    hasDoneOnboarding() {
      getDoc(doc(db, 'users', this.userData.id))
        .then((userSnap) => {
          this.onboarding1 = !userSnap.data().first_login
        })
    },
    intercom(id, name, email) {
      window.intercomSettings = {
        app_id: process.env.VUE_APP_INTERCOM_ID,
        name: name,
        email: email,
        user_id: id,
      };
      (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + process.env.VUE_APP_INTERCOM_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()
    }
  }
}
</script>
