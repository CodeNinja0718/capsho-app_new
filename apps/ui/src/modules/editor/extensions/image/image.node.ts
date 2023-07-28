import { mergeAttributes } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import type { ImageOptions } from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNodeView from 'src/modules/editor/extensions/image/ImageNodeView.vue'
import type { ImageAttrsOptions } from 'src/types'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    appImage: {
      /**
       * Add an image
       */
      setAppImage: (options: ImageAttrsOptions) => ReturnType
    }
  }
}

const AppImage = Image.extend<ImageOptions>({
  name: 'appImage',

  defining: true,
  isolating: true,
  allowGapCursor: false,

  addAttributes () {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      caption: {
        default: null,
        parseHTML: element => element.getAttribute('data-caption'),
        renderHTML: (attrs) => {
          if (!attrs.caption) {
            return {}
          }

          return {
            'data-caption': attrs.caption
          }
        }
      },
      width: {
        default: '100%'
      },
      height: {
        default: null
      },
      display: {
        default: 'inline',
        renderHTML: ({ display }) => {
          if (!display) {
            return {}
          }

          return {
            'data-display': display
          }
        },
        parseHTML: element => {
          const display = element.getAttribute('data-display')
          return display || 'inline'
        }
      }
    }
  },

  parseHTML () {
    return [
      {
        tag: 'app-image[data-display="inline"]',
        contentElement: 'app-input'
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return [
      'app-image', mergeAttributes(HTMLAttributes, { 'data-display': 'inline' }),
      ['img', mergeAttributes(HTMLAttributes, { draggable: true, contenteditable: false })],
      ['app-input']
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageNodeView)
  },

  addCommands() {
    return {
      setAppImage: ({ caption, alt, title, ...attrs }) => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: {
              ...attrs,
              alt,
              caption,
              title
            }
          })
          // set cursor at end of caption field
          .command(({ tr, commands }) => {
            const { doc, selection } = tr
            const position = doc.resolve(selection.to - 2).end()

            return commands.setTextSelection(position)
          })
          .run()
      }
    }
  }
})

export { AppImage, AppImage as default }
