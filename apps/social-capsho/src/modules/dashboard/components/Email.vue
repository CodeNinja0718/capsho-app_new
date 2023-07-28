<template>
  <div
    v-if="shownEmails.length > 0"
    class="flex flex-col items-center"
  >
    <div class="pb-8 flex justify-center w-full">
      <select
        v-model="selectedTool"
        class="appearance-none bg-backgroundGradient rounded-xl w-1/2 py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        @change="getTemplate()"
      >
        <option
          v-for="(tool, i) in tools"
          :key="i"
          :value="tool"
        >
          <span>{{ tool }}</span>
        </option>
      </select>
    </div>
    <div
      v-for="(email, i) in shownEmails"
      :key="i"
      class="flex flex-col items-center"
    >
      <div class="flex flex-col justify-center bg-white rounded-2xl shadow w-2/3 my-4 pb-4">
        <div class="py-4">
          <img
            src="../../../assets/email-logo.png"
            class="w-1/5 mx-auto"
          >
        </div>
        <div class="py-4">
          <img src="../../../assets/email-img.png">
        </div>
        <span class="text-center font-heading text-2xl py-4">{{ email.esl.text }}</span>
        <span
          style="white-space: pre-wrap"
          class="font-body py-4 text-center px-6"
        >
          {{ email.email.text }}
        </span>
        <div class="flex flex-col pt-8">
          <div class="flex flex-row py-4 justify-center">
            <img
              src="../../../assets/socials/instagram.png"
              class="h-10 w-10 mx-2"
            >
            <img
              src="../../../assets/socials/dribbble.png"
              class="h-10 w-10 mx-2"
            >
            <img
              src="../../../assets/socials/twitter.png"
              class="h-10 w-10 mx-2"
            >
            <img
              src="../../../assets/socials/youtube.png"
              class="h-10 w-10 mx-2"
            >
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="py-10 flex justify-evenly">
          <button
            class="border border-primaryDark flex flex-row text-primaryDark items-center rounded-full px-6"
            @click="selectEmail()"
          >
            <span>Refresh</span>
          </button>
          <button
            class="flex flex-row text-white bg-primaryDark rounded-full items-center py-4 px-4"
            @click="saveFile()"
          >
            <img
              src="../../../assets/icons/download2.svg"
              class="h-4 w-4 mr-2"
            >
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    You dont have any emails yet, click on a storytelling tool to generate some
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { getEmailTemplates } from '../services/templates.js'
import { getUsersSubCollectionData } from '@/services/usersData'
import { evaluateBreakLines } from '@/utils'

const $store = useStore()

const userData = computed(() => $store.getters['app/userData'])

onMounted(() => {
  getEmails(userData.value.id)
})

// const emails = computed(() => $store.getters['app/getUserEmails'])
const emails = ref([])
const emailSubjectLines = ref([])
const shownEmails = ref([])
const template = ref([])
const tools = ref([])

const selectedTool = ref()

watch(selectedTool, (newSelectedTool) => {
  if (newSelectedTool) {
    getEmails(userData.value.id)
  }
})

function saveFile() {
  const text = `<SUBJECT LINE>${shownEmails.value[0].esl.text}<SUBJECT LINE> \n\n${shownEmails.value[0].email.text}`
  const FileSaver = require('file-saver')
  let blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, 'email.txt')
}

function getEmails(id) {
  let temp = []
  getUsersSubCollectionData('emails', id)
    .then((emailsData) => {
      emailsData.forEach((email) => {
        emails.value.push({
          text: evaluateBreakLines(email.text),
          tool: email.tool
        })
        temp.push(email.tool)
      })
      return getUsersSubCollectionData('email_subject_lines', id)
    })
    .then((emailSubjectLinesData) => {
      emailSubjectLinesData.forEach((esl) => {
        emailSubjectLines.value.push({
          text: evaluateBreakLines(esl.text),
          tool: esl.tool
        })
      })
      if (emails.value.length > 0) {
        selectedTool.value = emails.value[0].tool
      }
    })
    .then(() => {
      temp.map((tool) => {
        tool = tool.replaceAll("_", " ")
        if (!tools.value.includes(tool)) {
          tools.value.push(tool)
        }
      })
      getTemplate()
    })

  // getUserData(id)
  //   .then((data) => {
  //     data.emails.forEach((email) => {
  //       emails.value.push({
  //         text: evaluateBreakLines(email.text),
  //         tool: email.tool
  //       })
  //       temp.push(email.tool)
  //     })
  //     data.email_subject_lines.forEach((esl) => {
  //       emailSubjectLines.value.push({
  //         text: evaluateBreakLines(esl.text),
  //         tool: esl.tool
  //       })
  //     })
  //     if (emails.value.length > 0) {
  //       selectedTool.value = emails.value[0].tool
  //     }
  //   })
  //   .then(() => {
  //     temp.map((tool) => {
  //       tool = tool.replaceAll("_", " ")
  //       if (!tools.value.includes(tool)) {
  //         tools.value.push(tool)
  //       }
  //     })
  //     getTemplate()
  //   })
}

function getTemplate() {
  getEmailTemplates()
    .then((emailTemplateData) => {
      template.value = emailTemplateData
    })
    .then(() => {
      selectEmail()
    })
}

function selectEmail() {
  const displayEmails = []
  const displaySubjectLines = []
  shownEmails.value = []

  emails.value.forEach((email) => {
    if (email?.tool === selectedTool.value) {
      displayEmails.push(email)
    }
  })
  emailSubjectLines.value.forEach((esl) => {
    if (esl?.tool === selectedTool.value) {
      displaySubjectLines.push(esl)
    }
  })

  const rand = Math.floor(Math.random() * displayEmails.length)
  const randEsl = Math.floor(Math.random() * displaySubjectLines.length)

  if (displayEmails.length > 0 && displaySubjectLines.length > 0) {
    shownEmails.value.push({
      email: displayEmails[rand],
      esl: displaySubjectLines[randEsl]
    })
  }
}
</script>
