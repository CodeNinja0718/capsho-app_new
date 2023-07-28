<script setup>
  import { watch, ref, onMounted, computed, onUnmounted } from 'vue'
  import StoryTellingToolList from '../components/StoryTellingToolList'
  import NotPaid from '@/modules/dashboard/components/NotPaid'
  import OnboardingOne from '@/modules/dashboard/components/OnboardingOne'
  import OnboardingTwo from '@/modules/dashboard/components/OnboardingTwo'
  import { useOnboarding } from '@/modules/dashboard/composables/useOnboarding'
  import { intercom } from '@/modules/dashboard/js/intercom'
  import { useUser } from '@/composables/useUser'
  import { fetchCaptions } from '@/modules/dashboard/services/captions'
  import { getTemplateByType } from '@/modules/dashboard/services/templates'
  import store from '@/store'
  import { evaluateBreakLines } from '@/utils'
  import { getUserData } from '@/services/usersData'

  const { paid, onboarding1, onboarding2, hasDoneOnboarding } = useOnboarding()
  const { isSubscribed, userData } = useUser()

  watch(userData, (newUser) => {
    if (newUser) {
      const { id, displayName, email } = newUser
      hasDoneOnboarding(id)
      if (isSubscribed) {
        intercom({ id, name: displayName, email })
      }
    }
  })

  const { user } = useUser()
  const error = ref(null)
  const loading = ref(true)
  const setNames = computed(() => store.getters['app/getEnabledSetNames'])
  const enabledSets = computed(() => store.getters['app/getUserEnabledSets'])
  const captions = computed(() => store.getters['app/getCaptions'])
  const templates = computed(() => store.getters['app/getTemplates'])
  const setTemplatesText = () => {
    if (templates.value.length) {
      try {
        for (let i = 0; i < templates.value.length; i++) {
          const possibles = []
          captions.value.forEach((caption) => {
            if (templates.value[i].type === caption.type || templates.value[i].tool === caption.tool) {
              if (setNames.value.includes(caption.set)) {
                const cleanText = evaluateBreakLines(caption.text)
                possibles.push(cleanText)
              } else if (caption.tool === 'engage') {
                const temp = evaluateBreakLines(caption.text)
                possibles.push(temp)
              }
            }
          })
          if (possibles.length > 0) {
            const rand = Math.floor(Math.random() * possibles.length)
            store.commit('app/updateTemplateText', { pos: i, value: possibles[rand] })
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const getLatestHoneyTrapTool = computed(() => {
    return enabledSets.value.filter((set) => set.type === 'honeytrap').sort((a,b) => {
      const createdAtSetA = new Date(a?.createdAt.seconds * 1000).getDate()
      const createdAtSetB = new Date(b?.createdAt.seconds * 1000).getDate()
      return createdAtSetA > createdAtSetB ? 1 : -1
    }).slice(0, 2)
  })

  onUnmounted(() => {
    store.commit('app/setTemplates', [])
  })

  onMounted(() => {
    try {
      if (user.value) {
        getUserData(userData.value.id)
          .then((data) => {
            store.commit('app/setUsersData', data)
          })
          .catch((e) => error.value = e)
          .finally(() => loading.value = !loading.value)

        fetchCaptions({
          userId: user.value.data.id,
          toneOfVoice: user.value.toneOfVoice
        })

        getTemplateByType({ template: user.value.template, type: user.value.type })
          .then(async ({outputs}) => {
            outputs.forEach((template) => {
              if (template.type === 'honeytrap') {
                // get latest HT tools
                template.tool = getLatestHoneyTrapTool.value[0].tool
              }
            })
            store.commit('app/setTemplates', outputs)
          })
          .then(() => setTemplatesText())
          .catch((e) => error.value = e)
          .finally(() => loading.value = !loading.value)
      }
    } catch (e) {
      console.error(e)
    }
  })
</script>

<template>
  <div class="bg-gradient-to-r from-backgroundGradient to-white text-left min-h-screen mb-16">
    <div
      v-if="!paid"
      class="container"
    >
      <NotPaid />
    </div>
    <div
      v-else
      class="container pb-5"
    >
      <StoryTellingToolList />
      <div
        v-if="onboarding1"
        class="overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none flex"
      >
        <OnboardingOne />
      </div>
      <div
        v-if="onboarding2"
        class="overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none flex"
      >
        <OnboardingTwo />
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
