import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { equalNodeType } from 'src/modules/editor/utils/utils'

/**
 * Extension based on:
 * - https://github.com/ueberdosis/tiptap/blob/v1/packages/tiptap-extensions/src/extensions/TrailingNode.js
 * - https://github.com/remirror/remirror/blob/e0f1bec4a1e8073ce8f5500d62193e52321155b9/packages/prosemirror-trailing-node/src/trailing-node-plugin.ts
 */

interface TrailingNodeOptions {
  node: string,
  notAfter: string[],
}

const TrailingNode = Extension.create<TrailingNodeOptions>({
  name: 'trailingNode',

  addOptions() {
    return {
      node: 'paragraph',
      notAfter: [
        'draggableBlock',
        'paragraph'
      ]
    }
  },

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)
    const disabledNodes = Object.entries(this.editor.schema.nodes)
      .map(([, value]) => value)
      .filter(node => this.options.notAfter.includes(node.name))

    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state
          const shouldInsertNodeAtEnd = plugin.getState(state)
          const endPosition = doc.content.size
          const type = schema.nodes[this.options.node]

          if (!shouldInsertNodeAtEnd) {
            return
          }

          return tr.insert(endPosition, type.create())
        },
        state: {
          init: (_, state) => {
            const lastNode = state.tr.doc.lastChild

            if (!lastNode) {
              return false
            }

            return !equalNodeType({ node: lastNode, nodeType: disabledNodes })
          },
          apply: (tr, value) => {
            if (!tr.docChanged) {
              return value
            }

            const lastNode = tr.doc.lastChild

            if (!lastNode) {
              return false
            }

            return !equalNodeType({ node: lastNode, nodeType: disabledNodes })
          }
        }
      })
    ]
  }
})

export { type TrailingNodeOptions, TrailingNode, TrailingNode as default }
