import { Node, mergeAttributes } from '@tiptap/core'

const QuoteAuthor = Node.create({
  name: 'quoteAuthor',
  content: 'text*',
  group: 'quoteAuthor',
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
        tag: 'quote-author'
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'quote-author',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ]
  }
})

export { QuoteAuthor, QuoteAuthor as default }
