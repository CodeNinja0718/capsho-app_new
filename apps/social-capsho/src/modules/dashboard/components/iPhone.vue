<script setup>
  import { nextTick, ref, onMounted } from 'vue'
  import UserIcon from '@/components/UserIcon.vue'
  import Popup from '@/components/Popup.vue'
  import { backticksTemplate } from '@/utils'
  import { useUser } from '@/composables/useUser'
  import { copyText } from 'vue3-clipboard'
  import { doc, getDoc } from 'firebase/firestore'
  import { db } from '@/config/dbConfig'
  import { updatedServiceThreeTemplated } from '../services/templates'
  import { getUsersSubCollectionData } from '@/services/usersData'
  const { user } = useUser()

  const shownCaption = ref(null)
  // const selectedTool = ref('Choose tool')
  const copiedSuccessfully = ref(false)
  const output = ref('captions')

  function doCopy() {
    copyText(shownCaption.value.caption, undefined, (error) => {
      copiedSuccessfully.value = !error
    })
    nextTick(() => {
      window.setInterval(() => {
        copiedSuccessfully.value = false
      }, 4000)
    })
  }

  function downloadText() {
    const FileSaver = require('file-saver')
    let blob = new Blob([shownCaption.value.caption], { type: "text/plain;charset=utf-8" })
    FileSaver.saveAs(blob, 'caption.txt')
  }

  function refreshCaption() {
    let availableCaptions = []
    captions.value.forEach((caption) => {
      if (caption.type === shownCaption.value.type || caption.tool === shownCaption.value.tool) {
        if (setNames.value.includes(caption.set)) {
          availableCaptions.push(caption)
        } else if (caption.tool === 'engage') {
          availableCaptions.push(caption)
        }
      }
    })
    let num = Math.floor(Math.random() * availableCaptions.length)
    let temp
    if (availableCaptions[num].tool === 'engage') {
      temp = backticksTemplate(availableCaptions[num].text)
    }  else {
      temp = availableCaptions[num].text
    }
    shownCaption.value.caption = temp
    templates.value[shownCaption.value.pos].caption = temp
  }

  const sets = ref([])
  const setNames = ref([])
  const captions = ref([])
  const templates = ref([])

  function showCaption(space, i) {
    if (!i) {
      i = 0
    }
    console.log(templates.value)
    space = templates.value[0]
    shownCaption.value = {
      caption: space.text,
      tool: space.tool,
      image: space.image,
      type: space.type,
      pos: i
    }
  }

  function getTemplate({ id, template, toneOfVoice }) {
    if (template) {
      templates.value = updatedServiceThreeTemplated.outputs.map((template) => {
        return {
          ...template,
          label: template.type,
          value: template.type
        }
      })
      getUsersSubCollectionData('sets', id)
        .then((dataSets) => {
          const honeyTrapTools = []
          const howToTools = []
          const storyTools = []
          const honeyTrapToolNames = [
            'the_rebel_captions',
            'the_jawdropper_captions',
            'the_marvel_captions',
            'the_boxer_captions',
            'the_paradox_captions',
            'the_cliffhanger_captions',
            'the_big_reveal_captions',
            'the_sharer_captions',
            'the_rebel_guest_captions',
            'the_jawdropper_guest_captions',
            'the_marvel_guest_captions',
            'the_boxer_guest_captions',
            'the_paradox_guest_captions',
            'the_cliffhanger_guest_captions',
            'the_big_reveal_guest_captions',
            'the_sharer_guest_captions'
          ]
          sets.value = dataSets
          sets.value.forEach((set) => {
            if (set.enabled) {
              if (honeyTrapToolNames.includes(set.tool)) {
                honeyTrapTools.push(set)
              } else if (set.tool === 'how_to') {
                howToTools.push(set)
              } else if (set.tool === 'promised_land') {
                storyTools.push(set)
              }
              setNames.value.push(set.name)
            }
          })

          if (honeyTrapTools.length) {
            const latestHoneyTrapTool = honeyTrapTools.sort((a, b) => {
              const createdAtSetA = new Date(a?.createdAt.seconds * 1000).getDate()
              const createdAtSetB = new Date(b?.createdAt.seconds * 1000).getDate()
              return createdAtSetA > createdAtSetB ? -1 : 1
            }).slice(0, 1)
            const honeyTrapTemplate = {
              creative: 'reel (honey-trap)',
              image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20Service.png?alt=media&token=bcbcabac-4f33-4092-9383-fb8358287e35',
              text: '',
              tool: '',
              type: 'honeytrap'
            }

            templates.value.forEach((template) => {
              if (template.type === 'honeytrap') {
                template.tool = latestHoneyTrapTool[0].tool
                template.creative = honeyTrapTemplate.creative
                template.text = honeyTrapTemplate.text
                template.image = honeyTrapTemplate.image
                template.type = honeyTrapTemplate.type
              }
            })
          } else if (howToTools.length) {
            const howToTemplate = {
              creative: 'reel (how-to)',
              image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20How-to%20(Service).png?alt=media&token=99831099-ff90-4d2e-9809-24618f1385de',
              text: '',
              tool: 'how_to',
              type: 'howto'
            }
            templates.value.forEach((template) => {
              if (template.type === 'honeytrap') {
                template.creative = howToTemplate.creative
                template.image = howToTemplate.image
                template.text = howToTemplate.text
                template.tool = howToTemplate.tool
                template.type = howToTemplate.type
              }
            })
          } else if (storyTools.length) {
            const storyTemplate = {
              creative: 'lifestyle shot with you',
              image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FLifestyle%20shot%20with%20you.png?alt=media&token=472dd9f2-ad24-4583-be4c-4db3582d5ac0',
              text: '',
              tool: 'promised_land',
              type: 'prehero'
            }
            templates.value.forEach((template) => {
              if (template.type === 'honeytrap') {
                template.creative = storyTemplate.creative
                template.image = storyTemplate.image
                template.text = storyTemplate.text
                template.tool = storyTemplate.tool
                template.type = storyTemplate.type
              }
            })
          } else {
            const engageTemplate = {
              creative: 'quote',
              image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FQuote.png?alt=media&token=5e8b339c-c81c-45e0-8e70-cd6cd6983cbc',
              text: '',
              tool: 'engage',
              type: 'engage'
            }

            templates.value.forEach((template) => {
              if (template.type === 'honeytrap') {
                template.creative = engageTemplate.creative
                template.image = engageTemplate.image
                template.text = engageTemplate.text
                template.tool = engageTemplate.tool
                template.type = engageTemplate.type
              }
            })
          }
          getUsersSubCollectionData('captions', id)
            .then((captionsData) => captions.value = captionsData)

          return getDoc(doc(db, 'engage', toneOfVoice))
        })
        .then((engageSnap) => {
          const promises = []
          engageSnap.data().captions.forEach((caption) => {
            const p = getDoc(caption)
            promises.push(p)
          })

          return Promise.all(promises)
        })
        .then((engageCaptions) => {
          engageCaptions.forEach((caption) => {
            captions.value.push(caption.data())
          })
        })
        .then(() => {
          for (let i = 0; i < templates.value.length; i++) {
            let possibles = []
            captions.value.forEach((caption) => {
              if (templates.value[i].type === caption.type || templates.value[i].tool === caption.tool) {
                if (setNames.value.includes(caption.set)) {
                  possibles.push(caption.text)
                } else if (caption.tool === 'engage') {
                  // const temp = backticksTemplate(caption.text)
                  // const temp = eval("`" + caption.text + "`")
                  possibles.push(caption.text)
                }
              }
            })
            if (possibles.length > 0) {
              const rand = Math.floor(Math.random() * possibles.length)
              templates.value[i].text = possibles[rand]
            }
          }
        })
    }
  }

  onMounted(() => {
    getTemplate({
      id: user.value.data.id,
      template: user.value.template,
      type: user.value.type,
      toneOfVoice: user.value.toneOfVoice
    })
  })
</script>

<template>
  <div
    v-show="false"
    class="flex flex-col w-full items-center"
  >
    <div
      v-if="output === 'grid'"
      class="flex flex-row flex-wrap"
    >
      <div
        v-for="(space, i) in templates"
        :key="i"
        class="w-1/3 h-auto px-2 py-2"
      >
        <div
          class="flex flex-col bg-gradient-to-br from-primaryLight to-backgroundGradient px-4 py-4 rounded-2xl h-full border border-primaryLight"
        >
          <span class="capitalize font-bold font-body text-xl">{{ space.creative }}</span>
          <span
            v-if="space.text"
            style="white-space: pre-wrap;"
            class="font-body"
          >
            <span
              v-for="(line, idx) in space.text.split('\\n\\n')"
              :key="idx"
              class="inline-block"
            >
              {{ line }}
            </span>
          </span>
          <span v-else>No caption yet keep using other story telling tools to fill this space!</span>
        </div>
      </div>
    </div>
    <div
      v-if="output === 'captions'"
      class="flex flex-row w-4/5 justify-end"
    >
      <div class="w-1/2 flex flex-col justify-center">
        <div class="flex justify-center pb-4">
          <Popup
            button-text="Watch this video"
            video="https://player.vimeo.com/video/618207625?h=bfad239af6&badge=0&autopause=0&player_id=0&app_id=58479"
          />
        </div>
        <div class="bg-white rounded-3xl border-2 shadow h-iphoneHeight w-iphoneWidth mx-auto">
          <div class="flex flex-col">
            <!-- Status bar -->
            <img
              src="../../../assets/iphone/top.svg"
              class="px-2"
              alt="iphone top screen status bar"
            >
            <!-- Name -->
            <div class="flex justify-center py-2">
              <span>{{ user.businessName }}</span>
            </div>
            <!-- DP, Followers -->
            <div class="flex flex-row items-center justify-evenly text-center">
              <UserIcon class="w-16 h-16" />
              <div class="flex flex-col">
                <span>1,476</span>
                <span class="text-sm">Posts</span>
              </div>
              <div class="flex flex-col">
                <span>898</span>
                <span class="text-sm">Followers</span>
              </div>
              <div class="flex flex-col">
                <span>564</span>
                <span class="text-sm">Following</span>
              </div>
            </div>
            <!-- Name + Bio -->
            <div class="flex flex-col">
              <span class="font-bold text-xs px-2 pt-2">{{ user.businessName }}</span>
              <p class="text-xs px-2 pb-2">
                Your Instagram bio should be a combination of the benefit you create for your customer and what you sell
              </p>
            </div>
            <!-- Buttons -->
            <img
              src="../../../assets/iphone/buttons.jpeg"
              alt="instagram app for iphone screen buttons"
            >
            <!-- Gallery -->
            <img
              src="../../../assets/iphone/gallery.svg"
              alt="instagram app for iphone screen gallery"
            >
            <!-- Posts -->
            <div class="flex flex-row flex-wrap">
              <div
                v-for="(space, i) in templates"
                :key="i"
                class="flex justify-center h-ig w-ig border border-gray-100"
              >
                <button
                  :disabled="space.text === ''"
                  class="disabled:opacity-25 disabled:cursor-not-allowed"
                  @click="showCaption(space, i)"
                >
                  <img
                    class="object-cover h-ig"
                    :src="space.image"
                    alt="instagram app for iphone screen post"
                  >
                </button>
              </div>
            </div>
          </div>
          <img
            src="../../../assets/iphone/bar.svg"
            class="mx-auto rounded-2xl"
            alt="instagram app for iphone screen bottom bar section"
          >
        </div>
      </div>
      <div class="w-1/2">
        <div
          v-if="shownCaption"
          class="flex flex-col w-iphoneWidth mx-auto"
        >
          <div class="pb-4 flex flex-row">
            <button
              class="w-full border border-primaryDark text-primaryDark font-bold rounded-full bg-white py-4"
              @click="refreshCaption"
            >
              Refresh
            </button>
            <button
              class="ml-4 text-primaryDark"
              @click="shownCaption = null"
            >
              Close
            </button>
          </div>
          <div class="flex flex-col bg-white rounded-3xl border-2 shadow">
            <img
              class="rounded-t-3xl"
              :src="shownCaption.image"
              alt="instagram app for iphone screen post"
            >
            <div v-if="typeof shownCaption.caption === 'object'">
              <span
                v-for="(caption, idx) in shownCaption.caption"
                :key="idx"
                style="white-space: pre-wrap"
                class="block font-body py-2 text-center px-6"
              >
                {{ caption }}
              </span>
            </div>
            <div v-else>
              <span
                style="white-space: pre-wrap;"
                class="block font-body py-4 text-center px-6"
              >
                <span
                  v-for="(line, index) in shownCaption.caption.split('\\n\\n')"
                  :key="index"
                  class="inline-block"
                >
                  {{ line }}
                </span>
              </span>
            </div>
            <div>
              {{ showCaption.tool }}
            </div>
            <div class="flex flex-row py-4">
              <button
                class="flex flex-row items-center px-4"
                @click="downloadText"
              >
                <span class="text-gray-400">Download text</span>
                <img
                  src="../../../assets/icons/download.svg"
                  class="h-4 w-4 ml-2"
                  alt="download icon"
                >
              </button>
              <button
                class="flex flex-row items-center px-4"
                @click="doCopy"
              >
                <span class="text-gray-400">Copy text</span>
                <img
                  src="../../../assets/icons/copy.svg"
                  class="h-4 w-4 ml-2"
                  alt="copy icon"
                >
              </button>
            </div>
          </div>
          <div
            v-if="copiedSuccessfully"
            class="flex flex-row justify-center items-center pt-4"
          >
            <img
              src="../../../assets/icons/check.svg"
              class="w-6 h-6 mr-2"
              alt="check icon"
            >
            <span class="text-green-500">Copied Successfully!</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <div class="py-10 flex justify-center">
        <button
          v-if="output === 'captions'"
          class="flex flex-row text-white bg-primaryDark rounded-full items-center py-4 px-4"
          @click="output = 'grid'"
        >
          <span>View all as text</span>
        </button>
        <button
          v-if="output === 'grid'"
          class="flex flex-row text-white bg-primaryDark rounded-full items-center py-4 px-4"
          @click="output = 'captions'"
        >
          <span>View all as grid</span>
        </button>
      </div>
    </div>
  </div>
</template>

