import type { Editor } from '@tiptap/core'
import type { NodeSelection } from 'prosemirror-state'
import { Dialog } from 'quasar'
import ColorPickerDialog from 'src/modules/editor/extensions/color/ColorPickerDialog.vue'

interface ColorAttrsOptions {
  hexColor?: string
}
export default function showColorDialog(editor: Editor) {
  const value: ColorAttrsOptions = {}
  const selection = editor?.view.state.selection as NodeSelection | null
  if (selection?.node?.attrs) {
    const attrs = selection.node.attrs as ColorAttrsOptions
    value.hexColor = attrs.hexColor || ''
  }

  Dialog.create({
    component: ColorPickerDialog,
    componentProps: {
      editor,
      hexColor: value
    },
    persistent: false,
    position: 'standard'
  })
}
