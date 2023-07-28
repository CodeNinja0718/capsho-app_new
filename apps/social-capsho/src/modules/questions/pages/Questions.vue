<script setup>
  /* eslint-disable */
  import { saveAnswersSet, getToolByDocId, getEmotions, getUserByDocId } from '@/services/dbService'
  import { getUserData, updateUserData } from '@/services/usersData'
  import { getHolidayByDocId } from '@/services/holidays'
  import { backticksTemplate, evaluateExpressions } from '@/utils'
  import Popup from '@/components/Popup.vue'
  import BaseModal from '@/components/_Global/BaseModal.vue'
  import { ref, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'
  import { getDoc } from 'firebase/firestore'
  import { useAppRouter } from '@/composables/useAppRouter'
  import { useNotification } from '@/composables/useNotification'
  import { getUserInfo } from '@/services/authService'

  const $store = useStore()
  const { routerPush } = useAppRouter()
  const $route = useRoute()

  const title = ref('')
  const step = ref(0)
  const progressbar = ref('')
  const arrCaptions = ref([])
  const arrQuestions = ref([])
  const arrEmails = ref([])
  const arrSubjectLines = ref([])
  const emotions = ref([])
  const holidays = ref([])
  const captionAnswers = ref([])
  const showModal = ref(false)

  const userData = computed(() => $store.getters['app/userData'])
  const user = computed(() => $store.getters['app/user'])
  const placeholder = computed(() => arrQuestions.value[step.value].placeholder)
  const calculatePercentage = computed(
      () => {
        return 100 - Math.floor(((step.value)/(arrQuestions.value.length)) * 100)
      }
  )

  function addHolidayAnswers(Q) {
    const tool = $route.params.tool.replaceAll("-", "_")
    let questions = []
    let set = null

    arrQuestions.value.forEach(({question}) => {
      questions.push(question)
    })

    const holidayData = getHolidayByDocId(Q[0].month)

    const captionsPromise = getHolidayCaptions(Q, holidayData.days)
    const emailPromise = getHolidayEmails(Q, holidayData.days)
    const eslPromise = getHolidayEsl(Q, holidayData.days)
    const setPromise = saveAnswersSet({ answerSets: captionAnswers.value, questions, tool })

    setPromise
      .then((data) => {
        set = data

        return captionsPromise
      })
      .then(async (captions) => {
        // eslint-disable-next-line no-unused-vars
        for (const caption of captions) {
          let temp = captions[0]
          let tempText = null
          captions.shift()
          tempText = backticksTemplate(temp)
          captions.push(tempText)
          await updateUserData({ text: tempText, tool: 'holidays', set, key: 'captions' })
        }

        return emailPromise
      })
      .then(async (emails) => {
        // eslint-disable-next-line no-unused-vars
        for (const email of emails) {
          let temp = emails[0]
          let tempText = null
          emails.shift()
          tempText = backticksTemplate(temp)
          emails.push(tempText)
          await updateUserData({ text: tempText, tool: 'holidays', set, key: 'email' })
        }

        return eslPromise
      })
      .then(async (esls) => {
        if (Q[0].month) {
          Q[0] = Q[0].name
        }
        // eslint-disable-next-line no-unused-vars
        for (const esl of esls) {
          let temp = esls[0]
          let tempText = null
          esls.shift()
          tempText = backticksTemplate(temp)
          esls.push(tempText)
          await updateUserData({ text: tempText, tool: 'holidays', set, key: 'email_subject_lines' })
        }
      })
      .then(() => {
        routerPush('Dashboard')
      })
  }

  async function getHolidayEsl(Q, days) {
    const esls = []

    for (const day of days) {
      if (Q[0].name === day.day) {
        for (const eslRef of day.email_subject_lines) {
          const eslSnap = await getDoc(eslRef)
          if (eslSnap.exists()) {
            esls.push(eslSnap.data().text)
          }
        }
      }
    }

    return esls
  }

  async function getHolidayEmails(Q, days){
    const emails = []

    for (const day of days) {
      if (Q[0].name === day.day) {
        for (const emailRef of day.emails) {
          const emailSnap = await getDoc(emailRef)
          if (emailSnap.exists()) {
            emails.push(emailSnap.data().text)
          }
        }
      }
    }

    return emails
  }

  async function getHolidayCaptions(Q, days) {
    let captions = []

    for (const day of days) {
      if (Q[0].name === day.day) {
        for (const captionRef of day.captions) {
          const captionSnap = await getDoc(captionRef)
          if (captionSnap.exists()) {
            captions.push(captionSnap.data().text)
          }
        }
      }
    }

    return captions
  }

  const { alertPrimary } = useNotification()

  function addAnswers() {
    const Q = captionAnswers.value
    if (captionAnswers.value.includes('')) {
      alertPrimary('Please make sure to add all answers!')
    } else {
      try {
        let E = []
        const tool = $route.params.tool.replaceAll("-", "_")
        let questions = []

        arrQuestions.value.forEach(({question}) => {
          questions.push(question)
        })
        const honeyTrapToolNames = [
          'the_marvel_captions',
          'the_paradox_captions',
          'the_jawdropper_captions',
          'the_boxer_captions',
          'the_cliffhanger_captions',
          'the_big_reveal_captions',
          'the_sharer_captions',
          'the_marvel_guest_captions',
          'the_paradox_guest_captions',
          'the_jawdropper_guest_captions',
          'the_boxer_guest_captions',
          'the_cliffhanger_guest_captions',
          'the_big_reveal_guest_captions',
          'the_sharer_guest_captions'
        ]

        let toolType = ''
        if (honeyTrapToolNames.includes(tool)) {
          toolType = 'honeytrap'
        }

        const set = saveAnswersSet({ answerSets: captionAnswers.value, questions, tool, type: toolType })

        for (let i = 0; i < arrQuestions.value.length; i++) {
          let num = Math.floor(Math.random() * 3)
          if (arrQuestions.value[i].dropdown) {
            let pos = emotions.value.map(function(e) { return e.name }).indexOf(captionAnswers.value[i])
            E.push(emotions.value[pos].options[num])
          } else {
            E.push(captionAnswers.value[i])
          }
        }

        set.then((data) => {
          arrCaptions.value.forEach(() => {
            let temp = arrCaptions.value[0].text
            let tempText
            const type = arrCaptions.value[0].type
            arrCaptions.value.shift()
            tempText = evaluateExpressions({ str: temp, questions: Q })
            arrCaptions.value.push(tempText)
            updateUserData({ text: tempText, tool, set: data, type, key: 'captions' })
          })

          arrEmails.value.forEach(() => {
            let temp = arrEmails.value[0].text
            let tempText
            arrEmails.value.shift()
            tempText = evaluateExpressions({ str: temp, questions: Q })
            arrEmails.value.push(tempText)
            updateUserData({ text: tempText, tool, set: data, key:'emails' })
          })

          arrSubjectLines.value.forEach(() => {
            let temp = arrSubjectLines.value[0].text
            let tempText
            arrSubjectLines.value.shift()
            tempText = evaluateExpressions({ str: temp, questions: Q })
            arrSubjectLines.value.push(tempText)
            updateUserData({ text: tempText, tool, set: data, key: 'email_subject_lines' })
          })
        })
          .then(() => {
            getUserInfo()
            routerPush('Dashboard')
          })
      } catch (e) {
        console.error(e)
      }
    }
  }

  function getQuestions(toneOfVoice) {
    const tool = $route.params.tool.replaceAll("-", "_")
    const tone = toneOfVoice.replaceAll("-", "_")
    let globalData = null

    getToolByDocId(tool, tone)
      .then(async (data) => {
        globalData = data
        progressbar.value = data.progressbar

        for (const questionRef of globalData.questions) {
          const questionSnap = await getDoc(questionRef)
          if (questionSnap.exists()) {
            const {
              dropdown,
              question,
              order,
              lead_in,
              video
            } = questionSnap.data()
            const examples = questionSnap.data().examples || [questionSnap.data().example_1]
            const rand = Math.floor(Math.random() * examples.length)
            let isDropdown = !!dropdown
            const temp = backticksTemplate(question)
            arrQuestions.value.push({
              question: temp,
              order: order,
              dropdown: isDropdown,
              narrative: lead_in,
              placeholder: examples[rand],
              video: video
            })
            captionAnswers.value.push('')
          }
        }
      })
      .then(async () => {
        for (const captionRef of globalData.captions) {
          const captionSnap = await getDoc(captionRef)
          if (captionSnap.exists()) {
            arrCaptions.value.push(captionSnap.data())
          }
        }
      })
      .then(async () => {
        if (globalData.emails) {
          for (const emailRef of globalData.emails) {
            const emailSnap = await getDoc(emailRef)
            if (emailSnap.exists()) {
              arrEmails.value.push(emailSnap.data())
            }
          }
        } else {
          return null
        }
      })
      .then(async () => {
        if (globalData.email_subject_lines) {
          for (const eslRef of globalData.email_subject_lines) {
            const eslSnap = await getDoc(eslRef)
            if (eslSnap.exists()) {
              arrSubjectLines.value.push(eslSnap.data())
            }
          }
        }
      })
  }

  function fetchEmotions() {
    getEmotions()
      .then((querySnapshot) => {
        emotions.value = []
        querySnapshot.forEach((emotion) => {
          let temp = []
          emotion.data().options.forEach((option) => {
            temp.push(option)
          })
          emotions.value.push({
            name: emotion.id,
            options: temp
          })
        })
      })
  }

  async function getHolidayQuestions(uid) {
    const holidayData = getHolidayByDocId('April')

    for (const questionRef of holidayData.questions) {
      const questionSnap = await getDoc(questionRef)
      if (questionSnap.exists()) {
        const {
          examples,
          holiday_dropdown,
          question,
          lead_in,
          video
        } = question.data()
        let rand = Math.floor(Math.random() * examples.length)
        arrQuestions.value.push({
          question: question,
          holidayDropdown: holiday_dropdown,
          narrative: lead_in,
          placeholder: examples[rand],
          video: video
        })
        captionAnswers.value.push('')
      }
    }

    getUserByDocId(uid)
      .then((doc) => {
        doc.holidays.forEach((holiday) => {
          holidays.value.push(holiday)
        })
      })
  }

  watch(user, () => {
    if (title.value === 'holidays') {
      getHolidayQuestions(user.value.data.id)
    } else {
      getQuestions(user.value.toneOfVoice)
    }
  })

  onMounted(() => {
    fetchEmotions()
    title.value = $route.params.tool.replaceAll("-", " ")
    if (userData.value) {
      if (title.value === 'holidays') {
        getHolidayQuestions(userData.value.id)
      } else {
        getQuestions(user.value.toneOfVoice)
      }
    }
  })
</script>

<template>
  <div>
    <div class="container flex flex-col justify-center pt-4">
      <div class="flex flex-col py-4">
        <span class="font-heading text-2xl capitalize py-8">{{ title }}</span>
      </div>
      <div class="relative mx-auto w-2/3 py-10">
        <img
          v-if="progressbar"
          :src="progressbar"
          class="w-full"
          alt="progressbar"
        >
        <img v-else class="w-full" src="../../../assets/stories/regular.svg" alt="progressbar">
        <div
          :style="`width: ${calculatePercentage}%`"
          class="absolute inset-y-0 right-0 h-full opacity-90 bg-white"
        />
      </div>
      <div class="flex flex-row pt-10">
        <div class="flex flex-col w-1/2 pr-8">
          <div class="flex flex-col border-2 max-h-80 rounded-2xl py-4 px-4 text-left overflow-y-auto">
            <span class="pb-4 font-bold">Storytelling results</span>
            <div class="flex flex-col">
              <div
                v-for="(question, i) in arrQuestions"
                :key="i"
              >
                <span
                  v-if="question.holidayDropdown"
                  class="pr-1"
                >
                  {{ question.narrative }} <span class="font-bold">{{ captionAnswers[i].name }}</span>
                </span>
                <span
                  v-else
                  class="pr-1"
                >
                  {{ question.narrative }} <span class="font-bold">{{ captionAnswers[i] }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-1/2">
          <div
            v-if="arrQuestions.length > 0"
            class="flex flex-col text-left pb-4"
          >
            <span
              style="white-space: pre-wrap"
              class="text-left text-primaryDark font-formText"

              v-html="arrQuestions[step].question"
            />
            <div
              v-if="arrQuestions.length > 0 && arrQuestions[step].video"
              class="flex flex-row py-2 items-center"
            >
              <span>Pro tip:</span>
              <Popup
                button-text="Watch this video"
                :video="arrQuestions[step].video"
              />
            </div>
            <label class="block text-left text-formLabel font-formText pb-2">{{ arrQuestions[step].narrative }}</label>
            <base-select
              v-if="arrQuestions[step].holidayDropdown"
              v-model="captionAnswers[step]"
              class="w-full"
              :options="holidays"
            />
            <base-input
              v-else-if="!arrQuestions[step].dropdown"
              v-model="captionAnswers[step]"
              class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
              :placeholder="placeholder"
            />
            <base-select
              v-else
              v-model="captionAnswers[step]"
              class="w-full"
              :options="emotions"
            />
          </div>
          <div class="flex flex-row justify-between py-8">
            <button
              v-if="step === 0"
              class="font-body font-bold text-primaryDark rounded-full hover:bg-offWhite py-4 px-4"
            >
              <!-- Need some inspiration? -->
            </button>
            <button
              v-else
              class="font-body font-bold text-primaryDark rounded-full border border-primaryDark py-4 px-4"
              @click="step--"
            >
              Previous
            </button>
            <button
              v-if="step === arrQuestions.length-1 && title === 'holidays'"
              class="font-body font-bold text-white rounded-full bg-green-500 py-4 px-4"
              @click="addHolidayAnswers(captionAnswers)"
            >
              Submit and view my holiday creation
            </button>
            <button
              v-else-if="step === arrQuestions.length-1"
              class="font-body font-bold text-white rounded-full bg-green-500 py-4 px-4"
              @click="showModal = true"
            >
              Submit and view my creation
            </button>
            <button
              v-else
              class="font-body font-bold text-white rounded-full bg-primaryDark py-4 px-4"
              @click="step++"
            >
              Continue
            </button>
          </div>
          <Teleport to="body">
            <!-- use the modal component, pass in the prop -->
            <base-modal :show="showModal" @close="showModal = false">
              <template #header>
                <h3>custom header</h3>
              </template>
            </base-modal>
          </Teleport>
        </div>
      </div>
    </div>
  </div>
</template>
