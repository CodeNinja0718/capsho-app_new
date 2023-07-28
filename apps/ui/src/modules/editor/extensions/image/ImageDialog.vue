<script setup lang="ts">
import { computed } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useEditorStore } from 'src/modules/editor/store/editor.store'
import AppButton from 'components/base/AppButton.vue'

const store = useEditorStore()

const props = defineProps({
  editor: {
    type: Object,
    required: true
  },
  imageAttrs: {
    type: Object,
    required: false
  }
})

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const disable = computed(() => {
  return !(store.src && (store.src.length > 0))
})
function onOKClick () {
  const { src, caption, alt, title } = store
  if (!src) return

  try {
    props.editor
      .chain()
      .focus()
      .focus()
      .insertContent({
        type: 'draggableBlock',
        attrs: {
          label: 'Image'
        },
        content: [
          {
            type: 'appImage'
          }
        ]
      })
      .setAppImage({
        alt,
        caption,
        display: 'inline',
        height: null,
        src,
        title,
        width: '399'
      })
      .run()
  } finally {
    onDialogOK()
    store.$reset()
  }
}
</script>

<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide">
    <q-card class="app-dialog-card q-pa-md poppins-regular text-darkish text-16">
      <q-card-section class="q-py-sm">
        <p class="text-h6">Upload Image</p>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <q-form class="q-gutter-y-md">
          <div>
            <label for="url">URL</label>
            <q-input
              id="url"
              v-model="store.src"
              hide-bottom-space
              lazy-rules
              name="url"
              outlined
              :rules="[
                val => !!val || '*URL is required',
                val => /^https?:\/\//.test(val) || '*Please Provide a valid URL'
              ]"
            />
          </div>
          <div>
            <label for="caption">Caption</label>
            <q-input
              id="caption"
              v-model.trim="store.caption"
              name="caption"
              outlined
            />
          </div>
          <div>
            <label for="alt">Alt</label>
            <q-input
              id="alt"
              v-model="store.alt"
              name="alt"
              outlined
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions
        align="right"
        class="q-px-md"
      >
        <app-button
          class="dialog-button"
          :disable="disable"
          label="Insert"
          no-caps
          @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
