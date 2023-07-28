<script lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
export default {
  components: {
    VueDraggableResizable
  }
}
</script>

<script setup lang="ts">
import { useDocumentStore } from 'src/stores/document-state'
import { storeToRefs } from 'pinia'
import { Editor, EditorContent, BubbleMenu, FloatingMenu, AnyExtension } from '@tiptap/vue-3'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from 'tiptap-extension-font-size'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const documentStore = useDocumentStore()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  contentValue: {
    type: String,
    required: true,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = ref()
const data = ref(props.item)
const openDialog = ref(false)
const fonts = ref(
  [
    'Abril Fatface',
    'Audiowide',
    'Average',
    'Calligraffitti',
    'Carrois Gothic',
    'Chewy',
    'Chicle',
    'Concert One'
  ]
)

const sizeArr = ['12', '14', '16', '18', '24', '30', '36', '72']
const sizes = ref(sizeArr)

const font = ref<string>('')
const color = ref<string>('')
const size = ref<string>('')

const { preview } = storeToRefs(documentStore)

const { removeItem, addTextGridItem, addImageGridItem, setTextContent, setSelectedItemIndex } = documentStore

const initEditor = () => {
  editor.value = new Editor({
    editorProps: {
      attributes: {
        class: `ProseMirror-${data.value.subtype}`
      }
    },
    content: data.value.content,
    editable: !preview.value,
    extensions: [
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      FontFamily,
      FontSize as AnyExtension,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: `${data.value.subtype}`,
        emptyEditorClass: `is-editor-empty is-editor-empty-${data.value.subtype}`,
        showOnlyWhenEditable: false
      }),
      StarterKit
    ],
    onUpdate({ editor }) {
      data.value.content = editor.getJSON()
      emit('update:modelValue', editor.getHTML())
    }
  })
}

const onDrag = (left: number, top: number) => {
  data.value.x = left
  data.value.y = top
}

const onResize = (handle: string, left: number, top: number, width: number, height: number) => {
  data.value.x = left
  data.value.y = top
  data.value.w = width
  data.value.h = height
}

const createValue = (val: string, done: (item?: string, mode?: 'add' | 'add-unique' | 'toggle' | undefined) => void) => {
  if (val.length > 0) {
    if (!sizeArr.includes(val)) {
      sizeArr.push(val)
    }
    done(val, 'toggle')
  }
}

const filterFn = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    if (val === '') {
      sizes.value = sizeArr
    } else {
      const needle = val.toLowerCase()
      sizes.value = sizeArr.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

onMounted(() => {
  initEditor()
})

watch(preview, (n) => {
  editor.value.setOptions({
    editable: !n
  })
})

watch(font, (newValue) => {
  editor.value.chain().focus().setFontFamily(newValue).run()
})

watch(color, (newValue) => {
  editor.value.chain().focus().setColor(newValue).run()
})

watch(size, (newValue) => {
  editor.value.chain().focus().setFontSize(newValue + 'pt').run()
})

watch(() => props.contentValue, (selectedContent) => {
  setTextContent(selectedContent)
})

watch(() => props.item.content, (newContent) => {
  editor.value.commands.setContent(newContent)
})

watch(() => props.modelValue, (value) => {
  // HTML
  const isSame = editor.value.getHTML() === value

  // JSON
  // const isSame = JSON.stringify(editor.value.getJSON()) === JSON.stringify(value)

  if (isSame) {
    return
  }

  editor.value.commands.setContent(value, false)
})

const mousedown = () => {
  setSelectedItemIndex(props.index)
}

onBeforeUnmount(() => editor.value.destroy())
</script>

<template>
  <div
    class="parent border-none"
    @mousedown="mousedown"
  >
    <vue-draggable-resizable
      drag-handle=".drag"
      :draggable="!preview"
      :h="data.h"
      :parent="true"
      :resizable="!preview"
      :w="data.w"
      :x="data.x"
      :y="data.y"
      :z="data.order"
      @drag="onDrag"
      @resize="onResize"
    >
      <q-btn
        v-if="!preview"
        class="add"
        color="primary"
        icon="loupe"
        round
        size="sm"
        tag="div"
      >
        <q-menu
          :auto-close="true"
          class="bg-[#222222] text-white border-white border-2 border-solid"
          transition-hide="jump-up"
          transition-show="jump-down"
        >
          <q-list style="min-width: 100px">
            <q-item
              clickable
              @click="addTextGridItem('Title')">
              <q-item-section>Add Title</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addTextGridItem('Intro')">
              <q-item-section>Add Intro</q-item-section>
            </q-item>
            <!-- <q-separator /> -->
            <q-item
              clickable
              @click="addTextGridItem('SubTitle')">
              <q-item-section>Add SubTitle</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addTextGridItem('SubDetail')">
              <q-item-section>Add SubDetail</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addTextGridItem('Conclusion')">
              <q-item-section>Add Conclusion</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addImageGridItem()">
              <q-item-section>Add Image</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-icon
        v-if="!preview"
        class="drag"
        color="primary"
        name="drag_indicator"
        size="sm"
        tag="div"
      />

      <q-btn
        class="delete setting_btn"
        color="pink-13"
        icon="delete_forever"
        round
        size="sm"
        @click="removeItem({key: index})" />

      <div v-if="editor">
        <bubble-menu
          v-if="editor"
          class="border-dashed rounded-md p-2 border-2 gap-[2px] flex w-full"
          :editor="editor"
          :tippy-options="{ duration: 100 }"
        >
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()">
            <q-icon name="format_bold"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()">
            <q-icon name="format_italic"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('strike') }"
            @click="editor.chain().focus().toggleStrike().run()">
            <q-icon name="strikethrough_s"></q-icon>
          </q-btn>
          <!-- <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
            <q-icon name="mdi-format-header-1"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
            <q-icon name="mdi-format-header-2"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('heading', { level: 3 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
            <q-icon name="mdi-format-header-3"></q-icon>
          </q-btn> -->
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive({ textAlign: 'left' }) }"
            @click="editor.chain().focus().setTextAlign('left').run()">
            <q-icon name="mdi-format-align-left"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive({ textAlign: 'center' }) }"
            @click="editor.chain().focus().setTextAlign('center').run()">
            <q-icon name="mdi-format-align-center"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive({ textAlign: 'right' }) }"
            @click="editor.chain().focus().setTextAlign('right').run()">
            <q-icon name="mdi-format-align-right"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            @click="openDialog = true">
            <q-icon name="settings"></q-icon>
          </q-btn>
        </bubble-menu>
        <floating-menu
          class="floating-menu border-dashed rounded-md p-2 border-2 gap-[2px] flex"
          :editor="editor"
          :tippy-options="{ duration: 100 }"
        >
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
            <q-icon name="mdi-format-header-1"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
            <q-icon name="mdi-format-header-2"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'bg-[#14b8a6]': editor.isActive('heading', { level: 3 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
            <q-icon name="mdi-format-header-3"></q-icon>
          </q-btn>
          <q-btn
            class="bg-[#5eead4] rounded-md border-none shadow-md z-50 p-[4px]"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()">
            <q-icon name="format_list_bulleted"></q-icon>
          </q-btn>
        </floating-menu>
      </div>
      <editor-content
        class="editor__content row px-[10px] py-[10px]"
        :editor="editor"
      />
    </vue-draggable-resizable>
  </div>
  <q-dialog
    v-model="openDialog"
    persistent>
    <q-card
      class="q-pa-md"
      style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Select Text Font</div>
        <q-select
          v-model="font"
          borderless
          class="select"
          :options="fonts"
          outlined
        >
          <template v-slot:option="scope">
            <q-item
              clickable
              :style="`font-family: ${scope.opt}`"
              @click="scope.toggleOption(scope.opt)"
            >{{ scope.opt }}</q-item>
          </template>
          <template v-slot:selected>
            <div
              :style="`font-family: ${font}`"
              v-html="font"></div>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Select Font Color</div>
        <q-input
          v-model="color"
          class="my-input"
          outlined
          :rules="['anyColor']"
        >
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="colorize">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale">
                <q-color v-model="color" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Select Font Size</div>
        <q-select
          v-model="size"
          input-debounce="0"
          :options="sizes"
          outlined
          style="width: 250px"
          use-input
          @filter="filterFn"
          @new-value="createValue"
        />
      </q-card-section>

      <q-card-actions
        align="right"
        class="text-primary">
        <q-btn
          v-close-popup
          flat
          label="Cancel" />
        <q-btn
          v-close-popup
          flat
          label="Confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
  [contenteditable]:focus {
    outline: 0px solid transparent;
  }
  .editor__content {
    height: max-content;
    min-height: 100%;
  }
</style>
<style>
  .ProseMirror {
    outline: none !important;
    width: 100%;
    font-size: 14pt;
  }
  .ProseMirror p::before{
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  .ProseMirror-Title{
    font-size: 28pt;
  }
  .ProseMirror p.is-editor-empty-Title{
    font-size: 28pt;
  }
  .ProseMirror-SubTitle{
    font-size: 20pt;
  }
  .ProseMirror p.is-editor-empty-SubTitle{
    font-size: 20pt;
  }
  .ProseMirror-SubDetail{
    font-size: 14pt;
  }
  .ProseMirror p.is-editor-empty-SubDetail{
    font-size: 14pt;
  }
  .ProseMirror-Conclusion{
    font-size: 14pt;
  }
  .ProseMirror p.is-editor-empty-Conclusion{
    font-size: 14pt;
  }
</style>
