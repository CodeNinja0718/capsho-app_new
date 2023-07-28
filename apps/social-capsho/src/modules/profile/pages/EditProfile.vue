<script setup>
  import LeftPanel from '../components/edit-profile/LeftPanel'
  import PersonalInfo from '../components/edit-profile/PersonalInfo'
  import BusinessInfo from '../components/edit-profile/BusinessInfo'
  import BillingInfo from '../components/edit-profile/BillingInfo'
  import AnswerList from '../components/edit-profile/AnswerList'
  import SingleSetQuestionsAnswers from '../components/edit-profile/SingleSetQuestionsAnswers'
  import { useUser } from '@/composables/useUser'
  import { useToggleMenu } from '../composables/useToggleMenu'

  const { optionIndex } = useToggleMenu()
  const { updateUser } = useUser()
</script>

<template>
  <div class="bg-gradient-to-r from-backgroundGradient min-h-screen to-white">
    <div class="container flex flex-row">
      <LeftPanel />
      <div class="w-3/4 px-10 pb-10">
        <!-- Edit Profile -->
        <div
          v-if="optionIndex === 0"
          class="flex flex-col"
        >
          <!-- Personal data -->
          <PersonalInfo />
          <!-- Company data -->
          <BusinessInfo />
          <!-- Billing data -->
          <BillingInfo />
          <div class="flex justify-end">
            <button
              class="font-body text-white rounded-full bg-primaryDark py-4 px-4"
              @click="updateUser"
            >
              Save profile
            </button>
          </div>
        </div>
        <!-- Selected inputs -->
        <div
          v-if="optionIndex === 1"
          class="flex flex-col"
        >
          <AnswerList />
          <SingleSetQuestionsAnswers />
        </div>
      </div>
    </div>
  </div>
</template>
