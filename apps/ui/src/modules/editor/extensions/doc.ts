import { Node } from '@tiptap/core'

const AppDocument = Node.create({
  name: 'doc',

  topNode: true,

  content: 'draggableBlock+'
})

export { AppDocument, AppDocument as default }
