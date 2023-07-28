import type { Editor } from '@tiptap/core'
import type { NodeSelection } from 'prosemirror-state'
import { Dialog } from 'quasar'
import ImageDialog from 'src/modules/editor/extensions/image/ImageDialog.vue'
import type { ImageAttrsOptions } from 'src/types'

export default function showImageDialog(editor: Editor) {
  const value: ImageAttrsOptions = {}
  const selection = editor?.view.state.selection as NodeSelection | null
  if (selection?.node?.attrs) {
    const attrs = selection.node.attrs as ImageAttrsOptions
    value.caption = attrs.caption || ''
    value.src = attrs.src || ''
    value.alt = attrs.alt || ''
    value.title = attrs.title || ''
  }

  Dialog.create({
    component: ImageDialog,
    componentProps: {
      editor,
      imageAttrs: value
    },
    persistent: false,
    position: 'standard'
  })
}
