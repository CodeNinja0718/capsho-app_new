<script setup lang="ts">
import getExtensions from 'src/modules/editor/core/starter-kit'
import { CapshoEditor } from 'src/modules/editor/core/editor'
import { EditorContent, JSONContent } from '@tiptap/vue-3'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { watch, onBeforeUnmount, onMounted } from 'vue'

const ext = getExtensions({ user: { name: '', color: '' } })

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'getStructure', 'getJsonOutput'])

const store = useUploadPodcastStore()

const editor = new CapshoEditor({
  content: props.modelValue,
  extensions: ext,
  editorProps: {
    attributes: {
      label: '',
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
    },
    handleDrop(view, event, slice, moved) {
      console.log(view, event, slice, moved)
    }
  },
  onUpdate: ({ editor }) => {
    // HTML
    const htmlOutput = editor.getHTML()
    emit('update:modelValue', htmlOutput)
    // JSON
    const jsonOutput = editor.getJSON()
    emit('getJsonOutput', jsonOutput)
    store.currentTemplateLayout = parseStructure(jsonOutput)
    emit('getStructure', parseStructure(jsonOutput))
  }
})

function parseStructure(jsonOutput: JSONContent) {
  if (!jsonOutput || !jsonOutput.content) {
    return {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: {
            label: 'Title',
            level: 2
          }
        }
      ]
    }
  }
  const structure = Object.values(jsonOutput.content)
    .reduce((acc, val) => {
      acc.push({
        type: val.type,
        attrs: val.attrs
      })
      return acc
    }, [])
  return {
    type: 'doc',
    content: structure
  }
}

watch(() => props.modelValue, (value) => {
  const isSame = editor.getHTML() === value

  if (isSame) {
    return
  }

  const jsonOutput = editor.getJSON()
  store.currentTemplateLayout = parseStructure(jsonOutput)

  editor.commands.setContent(value, false)
})
onMounted(() => {
  store.showContentSnippets = true
})
onBeforeUnmount(() => {
  store.showContentSnippets = false
  editor.destroy()
})
</script>

<template>
  <div
    v-if="editor"
    class="q-pa-sm"
  >
    <q-scroll-area class="editor">
      <EditorContent :editor="editor"/>
    </q-scroll-area>
  </div>
</template>

<style lang="scss">
@import "src/modules/editor/css/editor.scss";
</style>
