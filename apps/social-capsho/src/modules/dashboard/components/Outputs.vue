<template>
  <div class="q-px-md full-width column q-gutter-y-sm">
    <div class="row justify-end">
      <div class="col-4">
        <q-select
          v-model="selectedTool"
          :options="sets"
          outlined
          dense
          popup-content-class="text-capitalize"
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>
                  {{ 'Created at: ' + scope.opt.createdAt }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div>
      <q-card style="height: 400px">
        <q-scroll-area
          v-if="!editCaption"
          class="full-width full-height"
        >
          <q-card-section
            v-if="shownSet.text"
            class="text-h6"
            @click="editCaption = !editCaption"
          >
            <div v-html="htmlSanitizer(shownSet.text)" />
            <q-tooltip
              anchor="center middle"
              self="center middle"
              class="bg-primary text-body2"
            >
              Click to edit
            </q-tooltip>
          </q-card-section>
        </q-scroll-area>
        <q-card-section
          v-else
          class="full-height"
        >
          <q-editor
            v-model="shownSet.text"
            min-height="5rem"
            class="full-height"
            :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify']
                },
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  options: ['left', 'center', 'right', 'justify']
                }
              ],
              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
              ['token', 'hr', 'link', 'custom_btn'],
              ['fullscreen'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                  ]
                },
                'removeFormat'
              ],
              ['undo', 'redo'],
              ['viewsource']
            ]"
            :fonts="{
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana'
            }"
            @keyup.enter.stop
          />
        </q-card-section>
      </q-card>
      <div class="q-pt-md row items-center q-gutter-x-md">
        <q-btn
          v-if="editCaption"
          no-caps
          class="text-h6"
          padding="4px 14px"
          label="Cancel"
          @click="editCaption = !editCaption"
        />
        <q-btn
          no-caps
          class="text-h6"
          padding="4px 14px"
          label="Save"
          :loading="updating"
          @click="updateCaption"
        />
        <q-btn
          no-caps
          round
          text-color="dark"
          icon="refresh"
          @click="refreshCaption"
        >
          <q-tooltip class="bg-primary text-body2">
            Refresh caption
          </q-tooltip>
        </q-btn>
        <q-btn
          no-caps
          round
          text-color="dark"
          icon="file_download"
          @click="downloadText"
        >
          <q-tooltip class="bg-primary text-body2">
            Download caption
          </q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue'
import { backticksTemplate, htmlSanitizer } from '@/utils'
import { getUsersSubCollectionData, updateUsersCaptionData } from '@/services/usersData'
import { useSets } from '@/modules/profile/composables/useSets'
import { useUser } from '@/composables/useUser'
const { user } = useUser()
const { getSets, sets } = useSets()
const selectedTool = ref('Choose Tool')
const editCaption = ref(false)
const updating = ref(false)
const shownSet = reactive({
  text: '',
  id: '',
  set: ''
})
const captions = ref([])
const setNames = computed(() => {
  return sets.value.map((set) => {
    if (set.enabled) {
      return set.name
    }
  })
})
const isHasTypeOrTool = ({ tool, caption }) => {
  return (tool.type === caption.type || tool.tool === caption.tool)
}
const isEngageTool = (caption) => (caption.tool === 'engage')
const refreshCaption = () => {
  let possibles = []
  captions.value.forEach((caption) => {
    if (isHasTypeOrTool({ tool: selectedTool.value, caption })) {
      if (setNames.value.includes(caption.set) || isEngageTool(caption)) {
        possibles.push({
          ...caption,
          text: backticksTemplate(caption.text)
        })
      }
    }
  })
  if (possibles.length > 0) {
    const rand = Math.floor(Math.random() * possibles.length)
    const { set, id, text } = possibles[rand]
    shownSet.set = set
    shownSet.id = id
    shownSet.text = text
  }
}

function downloadText() {
  const FileSaver = require('file-saver')
  let blob = new Blob([shownSet.text], { type: "text/plain;charset=utf-8" })
  FileSaver.saveAs(blob, 'caption.txt')
}

async function updateCaption () {
  try {
    updating.value = true
    await updateUsersCaptionData({ subCollectionName: 'captions', set: shownSet })
    await fetchCaptions()
    editCaption.value = !editCaption.value
  } catch (e) {
    console.error(e.message)
  } finally {
    updating.value = false
  }
}

async function fetchCaptions () {
  captions.value = await getUsersSubCollectionData('captions', user.value.data.id)
}

watch(selectedTool, () => {
  refreshCaption()
})

onMounted(() => {
  fetchCaptions()
  getSets()
})
</script>

<style scoped>
</style>
