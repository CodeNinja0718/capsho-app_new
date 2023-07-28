<script setup>
  import { reactive } from 'vue'
  import emailjs from '@emailjs/browser'
  import { useNotification } from '../composables/useNotification'
  import appConstants from '../config/appConstants'

  const emailInfo = reactive({
    from_name: '',
    from_email: '',
    message: ''
  })

  const { alertPrimary, alertWarning } = useNotification()
  const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } = appConstants
  function sendEmail() {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailInfo, EMAILJS_USER_ID)
      .then(() => {
        alertPrimary('Email sent')
      })
      .catch((err) => {
        alertWarning(err)
      })
  }
</script>

<template>
  <div>
    <div class="bg-backgroundGradient py-10 px-10">
      <div class="container">
        <!-- Body -->
        <div class="flex flex-col rounded-xl bg-white py-10 px-10">
          <span class="font-heading text-3xl text-left">Have a question or some feedback for us? Let’s talk!</span>
          <span class="font-number pt-6 text-left">Get in touch with us below. We’ll get back to you within 24 hours (we’d never leave you on read)</span>
          <div class="flex flex-col pt-6">
            <div class="py-4">
              <base-input
                v-model="emailInfo.from_name"
                class="appearance-none border-0 bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Please enter your First & Last Name"
                label="Your Full Name"
                label-class="block text-left text-formLabel font-formText pb-2"
              />
            </div>
            <div class="py-4">
              <base-input
                v-model="emailInfo.from_email"
                class="appearance-none border-0 bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark focus:outline-none focus:shadow-outline"
                type="email"
                placeholder="Please enter the email address you’d like us to reply to"
                label="Your Email Address"
                label-class="block text-left text-formLabel font-formText pb-2"
              />
            </div>
            <div class="py-4">
              <label
                class="block text-left text-formLabel font-formText pb-2"
                for="comment"
              >Your Question or Comment (or both!)</label>
              <textarea
                id="comment"
                v-model="emailInfo.message"
                class="appearance-none border-0 bg-backgroundGradient rounded-xl resize-none w-full py-4 px-4 text-primaryDark focus:outline-none focus:shadow-outline"
                rows="5"
                placeholder="Please be as specific as possible so we can be as helpful as possible. Looking forward to hearing from you!"
              />
            </div>
            <div class="flex pt-4 justify-end">
              <button
                class="font-body font-bold bg-primaryDark text-white py-4 px-4 rounded-full"
                @click="sendEmail"
              >
                <span class="text-white font-number font-medium">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
