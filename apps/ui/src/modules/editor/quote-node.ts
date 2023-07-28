import {
  Node,
  Tracker,
  findChildrenInRange,
  mergeAttributes,
  wrappingInputRule
} from '@tiptap/core'

export interface BlockquoteOptions {
  HTMLAttributes: Record<string, unknown>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    appBlockQuote: {
      /**
       * Set a blockquote node
       */
      setBlockquote: () => ReturnType,
      /**
       * Toggle a blockquote node
       */
      toggleBlockquote: () => ReturnType,
      /**
       * Unset a blockquote node
       */
      unsetBlockquote: () => ReturnType,
      removeBlockquote: () => ReturnType
    }
  }
}

export const inputRegex = /^\s*>\s$/

const Blockquote = Node.create<BlockquoteOptions>({

  name: 'blockQuote',

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  content: 'quoteContent quoteAuthor',

  group: 'block',

  defining: true,

  parseHTML() {
    return [
      { tag: 'blockquote' }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setBlockquote: () => ({ chain, state }) => {
        let _a
        const { schema, selection } = state
        const { $from, $to } = selection
        const range = $from.blockRange($to)
        if (!range) {
          return false
        }
        const slice = state.doc.slice(range.start, range.end)
        const match = schema.nodes.quoteContent.contentMatch.matchFragment(slice.content)
        if (!match) {
          return false
        }
        const content = ((_a = slice.toJSON()) === null || _a === void 0 ? void 0 : _a.content) || []
        return chain()
          .insertContentAt({ from: range.start, to: range.end }, {
            type: this.name,
            content: [
              {
                type: 'quoteContent',
                content
              },
              {
                type: 'quoteAuthor'
              }
            ]
          })
          .setTextSelection(range.start + 2)
          .run()
      },
      toggleBlockquote: () => ({ commands }) => {
        return commands.toggleWrap(this.name)
      },
      unsetBlockquote: () => ({ tr, commands }) => {
        const { doc, selection } = tr
        const { from, to } = selection
        const quotes = findChildrenInRange(doc, { from, to }, node => node.type.name === this.name)

        if (!quotes.length) {
          return false
        }

        const tracker = new Tracker(tr)

        return commands.forEach(quotes, ({ node, pos }) => {
          const mapResult = tracker.map(pos)

          if (mapResult.deleted) {
            return false
          }

          const range = {
            from: mapResult.position,
            to: mapResult.position + node.nodeSize
          }

          if (!node.textContent) {
            return commands.insertContentAt(range, {
              type: 'text',
              text: 'empty text'
            })
          }
          return commands.insertContentAt(range, {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: node.textContent ?? ''
              }
            ]
          })
        })
      },
      removeBlockquote: () => ({ commands }) => {
        return commands.deleteNode(this.name)
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-b': () => this.editor.commands.toggleBlockquote()
    }
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type
      })
    ]
  }
})

export { Blockquote, Blockquote as default }
