import { AnyExtension } from '@tiptap/core'
import History from '@tiptap/extension-history'
import AppDocument from 'src/modules/editor/extensions/doc'
import AppDraggableBlock from 'src/modules/editor/extensions/draggable-block/draggable-block.node'
import AppPlaceholder from 'src/modules/editor/extensions/placeholder/placeholder.node'
import AppImage from 'src/modules/editor/extensions/image/image.node'
import TrailingNode from 'src/modules/editor/extensions/trailing-node/trailing.node'
import SnippetExtension from 'src/modules/editor/extensions/snippet/snippet.ext'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Blockquote from '@tiptap/extension-blockquote'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Commands from 'src/modules/editor/menu/command'
import suggestion from 'src/modules/editor/menu/suggestions'
import GapCursor from '@tiptap/extension-gapcursor'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'

export interface GetExtensionsProps {
  user?: {
    name: string
    color: string
  }
}
const getExtensions = ({ user }: GetExtensionsProps): AnyExtension[] => {
  return [
    AppDocument,
    AppDraggableBlock,
    Heading.configure({
      levels: [1, 2, 3, 4, 5]
    }),
    Paragraph,
    Blockquote,
    Text,
    TextStyle,
    GapCursor,
    Bold,
    Italic,
    Strike,
    ListItem,
    BulletList,
    OrderedList,
    Color,
    TrailingNode,
    AppImage,
    History,
    Commands.configure({
      suggestion
    }),
    SnippetExtension,
    AppPlaceholder.configure({
      includeChildren: true,
      showOnlyCurrent: false,
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return 'Heading ...'
        }
        if (node.type.name === 'blockquote') {
          return 'Add citation ...'
        }
        return 'Type / for menu'
      }
    })
  ]
}

export { getExtensions, getExtensions as default }
