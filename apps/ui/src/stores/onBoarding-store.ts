import { defineStore } from 'pinia'

export const useOnBoardingStore = defineStore('onBoarding', {
  state: () => ({
    progressValues: {
      title: 0.2,
      showNotes: 0.4,
      social: 0.6,
      email: 0.8,
      transcript: 1.0
    },
    progressValue: 0.2
  })
})
