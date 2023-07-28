import { Node, mergeAttributes } from '@tiptap/core'

const QuoteContent = Node.create({
  name: 'quoteContent',
  content: 'paragraph',
  group: 'quoteContent',
  defining: true,
  selectable: false,
  isolating: true,
  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },
  parseHTML() {
    return [
      {
        tag: 'quote-content'
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'quote-content',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ]
  }
})

export { QuoteContent, QuoteContent as default }
