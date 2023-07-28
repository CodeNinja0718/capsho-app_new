<script setup lang="ts">
import { computed, ref } from 'vue'
import { htmlSanitizer } from 'src/utils'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    required: false,
    default: 'read',
    validator (value: string) {
      return [
        'read',
        'blur'
      ].includes(value)
    }
  },
  border20: {
    type: Boolean,
    required: false,
    default: false
  },
  size: {
    type: String,
    required: false,
    default: 'md',
    validator (value: string) {
      return [
        'sm',
        'md',
        'lg',
        'xl',
        'xll',
        'xxl'
      ].includes(value)
    }
  },
  editorSize: {
    type: String,
    required: false,
    validator (value: string) {
      return [
        'sm',
        'md',
        'lg',
        'xl',
        'xll',
        'xxl'
      ].includes(value)
    }
  }
})
const editor = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])
function handleUpdate (val: string) {
  emit('update:modelValue', htmlSanitizer(val))
}
interface ContainerSize {
  [key: string]: string,
}
const containerSizes: ContainerSize = {
  sm: 'max-width: 100%; height: 16vh',
  md: 'max-width: 100%;',
  lg: 'max-width: 100%; height: 53vh;',
  xl: 'max-width: 100%; height: 58vh;',
  xll: 'max-width: 100%; height: 65vh;',
  xxl: 'max-width: 100%; height: 70vh;'
}
const getStyle = computed<string>(() => {
  const size: string = props.size
  return containerSizes[size]
})
const editorSizes: ContainerSize = {
  sm: '15vh',
  md: '20vh',
  lg: '47.8vh',
  xl: '53vh',
  xll: '59vh',
  xxl: '65vh'
}
const getEditorMinHeight = computed(() => {
  const size: string = props.size
  return editorSizes[size]
})

const $q = useQuasar()

const editorOptions = [
  [
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
    }
  ],
  ['link'],
  ['bold', 'italic', 'strike', 'underline'],
  ['quote', 'unordered', 'ordered'],
  ['undo', 'redo']
]
const wse = ref(null)

defineExpose({
  wse
})

const contentActiveStyle = {
  backgroundColor: '#eee',
  color: 'black'
}

const thumbStyle = {
  right: '2px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: '0.75'
}
</script>

<template>
  <div>
    <q-scroll-area
      :content-active-style="contentActiveStyle"
      :style="getStyle"
      :thumb-style="thumbStyle"
    >
      <div>
        <q-editor
          ref="wse"
          v-bind="{
            ...$attrs
          }"
          v-model="editor"
          class="border-radius-6 bg-darkish bg-opacity-25"
          :content-class="mode === 'read' ? 'readable-text q-px-xl q-py-lg' : 'blurred-text'"
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
          :height="getEditorMinHeight"
          :min-height="getEditorMinHeight"
          :toolbar="editorOptions"
          toolbar-text-color="grey-3"
          @update:model-value="handleUpdate($event)"
        />
      </div>
    </q-scroll-area>
  </div>
</template>

<style scoped lang="scss">
.border-20 {
  border-radius: 20px;
}
.green {
  background: #44aa99;
}
.yellow {
  background: #ddcc77;
}

.q-editor {
  border: 1px solid $app-border-color;
}
</style>
