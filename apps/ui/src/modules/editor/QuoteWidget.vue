<script setup lang="ts">
import { useDocumentStore } from 'src/stores/document-state'
import { storeToRefs } from 'pinia'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import QuoteAuthor from './quote-author'
import QuoteContent from './quote-content'
import Quote from './quote-node'
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'

const documentStore = useDocumentStore()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const data = ref(props.item)

const editor = ref()
const { preview } = storeToRefs(documentStore)

const initEditor = () => {
  editor.value = new Editor({
    content: data.value.content,
    editable: !preview.value,
    extensions: [
      QuoteContent,
      QuoteAuthor,
      Quote,
      StarterKit
    ]
  })
}

onMounted(() => initEditor())

watch(preview, (n) => {
  editor.value.setOptions({
    editable: !n
  })
})

const { removeItem } = documentStore

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

onBeforeUnmount(() => editor.value.destroy())
</script>

<template>
  <div class="parent border-none">
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
      <q-icon
        v-if="!preview"
        class="drag"
        color="primary"
        name="drag_indicator"
        size="sm"
        tag="div"
      />

      <q-btn
        v-if="item.type === 'image'"
        class="setting setting_btn"
        color="primary"
        icon="settings"
        round
        size="sm" />
      <q-btn
        class="delete setting_btn"
        color="pink-13"
        icon="delete_forever"
        round
        size="sm"
        @click="removeItem({key: index})" />

      <editor-content
        class="editor__content row px-[10px] py-[5px]"
        :editor="editor"
      />

    </vue-draggable-resizable>
  </div>
</template>

<!-- <style scoped>

</style> -->
<style lang="scss">
  .ProseMirror {
    outline: none !important;
  }
  blockquote{
    border-left: 4px solid black;
    padding-left: 15px;
    margin: 0;

    & > quote-content {
      font-style: italic;
    }
  }
</style>
