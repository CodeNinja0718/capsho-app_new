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
        <img
          v-else
          class="w-full"
          src="../../../assets/stories/regular.svg"
          alt="progressbar"
        >
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
            >
              {{ arrQuestions[step].question }}
            </span>
            <div class="flex flex-row py-2 items-center">
              <span>Pro tip:</span>
              <Popup
                v-if="arrQuestions.length > 0"
                button-text="Watch this video"
                :video="arrQuestions[step].video"
              />
            </div>
            <label class="block text-left text-formLabel font-formText pb-2">{{ arrQuestions[step].narrative }}</label>
            <select
              v-if="arrQuestions[step].holidayDropdown"
              v-model="captionAnswers[step]"
              class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
            >
              <option
                v-for="(holiday, i) in holidays"
                :key="i"
                :value="holiday"
              >
                {{ holiday.name }}
              </option>
            </select>
            <input
              v-else-if="!arrQuestions[step].dropdown"
              v-model="captionAnswers[step]"
              class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
              type="text"
              :placeholder="placeholder"
              autofocus
              @keyup.enter="handleKeyUpEnter"
              @keyup.esc="handleKeyUpEsc"
            >
            <select
              v-else
              v-model="captionAnswers[step]"
              class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
            >
              <option
                v-for="(emotion, i) in emotions"
                :key="i"
                :value="emotion.name"
              >
                {{ emotion.name }}
              </option>
            </select>
          </div>
          <div class="flex flex-row justify-between py-8">
            <button
              v-if="step === 0"
              class="cursor-not-allowed"
              disabled
            >
              <!-- Need some inspiration? -->
            </button>
            <button
              v-if="step > 0"
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
              @click="showModal = !showModal"
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

          <BaseModal
            :show="showModal"
            @onModalClose="showModal = !showModal"
          >
            <template #header>
              <h1 class="font-bold text-2xl text-primaryDark font-bodyLexend">
                Name your saved inputs
              </h1>
            </template>
            <template #body>
              <base-input
                v-model="customToolTitle"
                class="appearance-none bg-backgroundGradient capitalize rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
                :placeholder="title"
                label="Save as"
                label-class="block text-left text-formLabel font-formText pb-2"
              />
            </template>
            <template #footer>
              <button
                v-if="saving"
                type="button"
                class="bg-primaryDark text-white flex justify-center items-center py-1.5 pr-3 rounded-full modal-default-button"
                disabled
              >
                <div
                  class="spinner-border animate-spin inline-block w-5 h-5 mx-3 border-3 rounded-full"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                Saving...
              </button>
              <button
                v-else
                type="button"
                class="mx-2 font-body font-medium rounded-full bg-primaryDark text-white hover:bg-indigo-600 py-1.5 px-6 modal-default-button"
                @click="addAnswers(captionAnswers)"
              >
                Save
              </button>
            </template>
          </BaseModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAnswersSet, saveCaption, saveEmail, saveSubjectLine } from '../services/db'
import Popup from '@/components/Popup.vue'
import BaseModal from '@/components/_Global/BaseModal.vue'
import { mapGetters } from 'vuex'
import { db } from '@/config/dbConfig'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { evaluateExpressions } from '@/utils'
import { useNotification } from '@/composables/useNotification'

export default {
  name: 'Questions',
  components: {
    Popup,
    BaseModal
  },
  data: () => ({
    title: '',
    step: 0,
    progressbar: '',
    arrCaptions: [],
    arrQuestions: [],
    arrEmails: [],
    arrSubjectLines: [],
    emotions: [],
    holidays: [],
    captionAnswers: [],
    displayAnswers: [],
    selectedHoliday: null,
    showModal: false,
    customToolTitle: '',
    saving: false
  }),
  computed: {
    ...mapGetters('app', ['userData', 'user']),
    placeholder() {
      return this.arrQuestions[this.step].placeholder
    },
    calculatePercentage() {
      return 100 - Math.floor(((this.step)/(this.arrQuestions.length)) * 100)
    }
  },
  watch: {
    user(newVal) {
      if (this.title === 'holidays') {
        this.getHolidaysQuestions(newVal.data.id)
      } else {
        this.getQuestions(newVal.toneOfVoice)
      }
    }
  },
  mounted() {
    this.getEmotions()
    this.title = this.$route.params.tool.replaceAll("-", " ")
    if (this.userData) {
      if (this.title === 'holidays') {
        this.getHolidaysQuestions(this.userData.id)
      } else {
        this.getQuestions(this.user.toneOfVoice)
      }
    }
  },
  methods: {
    handleKeyUpEsc() {
      this.step--
      if (this.step < 0) {
        this.step = 0
      }
    },
    handleKeyUpEnter() {
      const { alertWarning } = useNotification()
      if (this.step !== this.arrQuestions.length-1) {
        this.step++
      } else if (this.step === this.arrQuestions.length-1) {
        if (this.captionAnswers.includes('')) {
          alertWarning('Please make sure to add all answers!')
        } else {
          this.showModal = true
        }
      }
    },
    addHolidayAnswers(Q) {
      const route = this.$route.params.tool
      const tool = route.replaceAll("-", "_")
      let questions = []
      let set = null

      this.arrQuestions.forEach((question) => {
        questions.push(question.question)
      })

      const captionsPromise = this.getHolidaysCaptions(Q)
      const emailPromise = this.getHolidaysEmails(Q)
      const eslPromise = this.getHolidaysEsl(Q)
      const setPromise = saveAnswersSet({
        answerSets: this.captionAnswers,
        questions,
        tool
      })

      setPromise.then((data) => {
        set = data

        return captionsPromise
      })
          .then((captions) => {
            for (let i = 0; i < captions.length; i++) {
              let temp = captions[0]
              let tempText = null
              captions.shift()
              tempText = evaluateExpressions({ str: temp, questions: Q })
              captions.push(tempText)
              saveCaption(tempText, 'holidays', set)
            }

            return emailPromise
          })
          .then((emails) => {
            for (let i = 0; i < emails.length; i++) {
              let temp = emails[0]
              let tempText = null
              emails.shift()
              tempText = evaluateExpressions({ str: temp, questions: Q })
              emails.push(tempText)
              saveEmail(tempText, 'holidays', set)
            }

            return eslPromise
          })
          .then((esls) => {
            if (Q[0].month) {
              Q[0] = Q[0].name
            }
            for (let i = 0; i < esls.length; i++) {
              let temp = esls[0]
              let tempText = null
              esls.shift()
              tempText = evaluateExpressions({ str: temp, questions: Q })
              esls.push(tempText)
              saveSubjectLine(tempText, 'holidays', set)
            }
          })
          .then(() => {
            this.$router.push('/dashboard')
          })
    },
    getHolidaysEsl(Q) {
      return getDoc(doc(db, 'holidays', Q[0].month))
          .then((docSnap) => {
            const days = docSnap.data().days
            const eslPromises = []

            days.forEach((day) => {
              if (Q[0].name === day.day) {
                day.email_subject_lines.forEach((esl) => {
                  const p = getDoc(esl)
                  eslPromises.push(p)
                })
              }
            })

            return Promise.all(eslPromises)
          })
          .then((eslData) => {
            const esls = []

            eslData.forEach((esl) => {
              esls.push(esl.data().text)
            })

            return esls
          })
    },
    getHolidaysEmails(Q){
      return getDoc(doc(db, 'holidays', Q[0].month))
          .then((docSnap) => {
            const days = docSnap.data().days
            const emailPromises = []

            days.forEach((day) => {
              if (Q[0].name === day.day) {
                day.emails.forEach((email) => {
                  const p = getDoc(email)
                  emailPromises.push(p)
                })
              }
            })

            return Promise.all(emailPromises)
          })
          .then((emailsData) => {
            const emails = []

            emailsData.forEach((email) => {
              emails.push(email.data().text)
            })

            return emails
          })
    },
    getHolidaysCaptions(Q) {
      return getDoc(doc(db, 'holidays', Q[0].month))
          .then((docSnap) => {
            const days = docSnap.data().days
            let captionPromises = []

            days.forEach((day) => {
              if (Q[0].name === day.day) {
                day.captions.forEach((caption) => {
                  const p = getDoc(caption)
                  captionPromises.push(p)
                })
              }
            })

            return Promise.all(captionPromises)
          })
          .then((captionsData) => {
            const captions = []

            captionsData.forEach((caption) => {
              captions.push(caption.data().text)
            })

            return captions
          })
    },
    addAnswers(Q) {
      const { alertWarning, alertSuccess } = useNotification()

      if (this.captionAnswers.includes('')) {
        alertWarning('Please make sure to add all answers!')
      } else {
        this.saving = true
        try {
          let E = []
          const route = this.$route.params.tool
          const tool = route.replaceAll("-", "_")
          let questions = []

          this.arrQuestions.forEach((question) => {
            questions.push(question.question)
          })

          const set = saveAnswersSet({
            answerSets: this.captionAnswers,
            questions,
            tool,
            customToolTitle: this.customToolTitle
          })

          for (let i = 0; i < this.arrQuestions.length; i++) {
            let num = Math.floor(Math.random() * 3)
            if (this.arrQuestions[i].dropdown) {
              let pos = this.emotions.map(function(e) { return e.name }).indexOf(this.captionAnswers[i])
              E.push(this.emotions[pos].options[num])
            } else {
              E.push(this.captionAnswers[i])
            }
          }

          set.then((data) => {
            this.arrCaptions.forEach(() => {
              let temp = this.arrCaptions[0].text
              let tempText
              const type = this.arrCaptions[0].type
              this.arrCaptions.shift()
              tempText = evaluateExpressions({ str: temp, questions: Q, emotions: this.emotions })
              this.arrCaptions.push(tempText)
              saveCaption(tempText, tool, data, type)
            })

            this.arrEmails.forEach(() => {
              let temp = this.arrEmails[0].text
              let tempText
              this.arrEmails.shift()
              tempText = evaluateExpressions({ str: temp, questions: Q, emotions: this.emotions })
              this.arrEmails.push(tempText)
              saveEmail(tempText, tool, data)
            })

            this.arrSubjectLines.forEach(() => {
              let temp = this.arrSubjectLines[0].text
              let tempText
              this.arrSubjectLines.shift()
              tempText = evaluateExpressions({ str: temp, questions: Q, emotions: this.emotions })
              this.arrSubjectLines.push(tempText)
              saveSubjectLine(tempText, tool, data)
            })
          })
          .then(() => {
            this.saving = false
            this.showModal = false
            alertSuccess('Your creation was saved')
            this.$router.push({ name: 'Dashboard' })
          })
        } catch (e) {
          alertWarning(e.message)
        }
      }
    },
    getQuestions(toneOfVoice) {
      const tool = this.$route.params.tool.replaceAll("-", "_")
      const tone = toneOfVoice.replaceAll("-", "_")
      let globalData = null

      getDoc(doc(db, tool, tone))
        .then((docSnap) => {
          globalData = docSnap.data()
          const promises = []
          this.progressbar = docSnap.data().progressbar

          globalData.questions.forEach((question) => {
            const p = getDoc(question)
            promises.push(p)
          })

          return Promise.all(promises)
        })
        .then((questionsSnapshot) => {
          questionsSnapshot.forEach((questionSnap) => {
            const examples = questionSnap.data().examples || [questionSnap.data().example_1]
            const rand = Math.floor(Math.random() * examples.length)
            let isDropdown = false
            if (questionSnap.data().dropdown) {
              isDropdown = true
            }

            const temp = eval("`" + questionSnap.data().question + "`")
            this.arrQuestions.push({
              question: temp,
              order: questionSnap.data().order,
              dropdown: isDropdown,
              narrative: questionSnap.data().lead_in,
              placeholder: examples[rand],
              video: questionSnap.data().video
            })
            this.captionAnswers.push('')
          })
        })
        .then(() => {
          const promises = []

          globalData.captions.forEach((caption) => {
            const p = getDoc(caption)
            promises.push(p)
          })

          return Promise.all(promises)
        })
        .then((captionsSnapshot) => {
          captionsSnapshot.forEach((caption) => {
            this.arrCaptions.push(caption.data())
          })
        })
        .then(() => {
          if (globalData.emails) {
            const promises = []

            globalData.emails.forEach((email) => {
              const p = getDoc(email)
              promises.push(p)
            })

            return Promise.all(promises)
          } else {
            return null
          }
        })
        .then((emailsSnapshot) => {
          if (emailsSnapshot) {
            emailsSnapshot.forEach((email) => {
              this.arrEmails.push(email.data())
            })
          }
        })
        .then(() => {
          if (globalData.email_subject_lines) {
            const promises = []

            globalData.email_subject_lines.forEach((esl) => {
              const p = getDoc(esl)
              promises.push(p)
            })

            return Promise.all(promises)
          } else {
            return null
          }
        })
        .then((eslSnapshot) => {
          if (eslSnapshot) {
            eslSnapshot.forEach((esl) => {
              this.arrSubjectLines.push(esl.data())
            })
          }
        })
    },
    getEmotions() {
      getDocs(collection(db, 'emotions'))
        .then((querySnapshot) => {
          this.emotions = []
          querySnapshot.forEach((emotion) => {
            const options = []
            emotion.data().options.forEach((option) => {
              options.push(option)
            })
            this.emotions.push({
              name: emotion.id,
              options: options
            })
          })
        })
    },
    getHolidaysQuestions(id) {
      getDoc(doc(db, 'holidays', 'April'))
        .then((docSnap) => {
          docSnap.data().questions.forEach((question) => {
            getDoc(question).then((ref) => {
              let rand = Math.floor(Math.random() * ref.data().examples.length)
              this.arrQuestions.push({
                question: ref.data().question,
                holidayDropdown: ref.data().holiday_dropdown,
                narrative: ref.data().lead_in,
                placeholder: ref.data().examples[rand],
                video: ref.data().video
              })
              this.captionAnswers.push('')
            })
          })
        })
        .then(() => {
          getDoc(doc(db, 'users', id))
              .then((docSnap) => {
                docSnap.data().holidays.forEach((holiday) => {
                  this.holidays.push(holiday)
                })
              })
        })
    }
  }
}
</script>

<style lang="css" scoped>
.update-title ::placeholder {
  text-transform: capitalize;
}
</style>
