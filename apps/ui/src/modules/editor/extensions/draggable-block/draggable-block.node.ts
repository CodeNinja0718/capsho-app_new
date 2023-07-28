import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MenuBlockView from 'src/modules/editor/extensions/draggable-block/DraggableBlockView.vue'
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

interface AppDraggableBlockOptions {
  HTMLAttributes: Record<string, unknown>;
  emptyNodeClass: string;
  showOnlyCurrent: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    draggableBlock: {
      /**
       * Toggle a draggableBlock
       */
      setDraggableBlock: (position?: number) => ReturnType;
    };
  }
}

const AppDraggableBlock = Node.create<AppDraggableBlockOptions>({
  name: 'draggableBlock',

  priority: 1000,

  group: 'draggableBlock',

  content: 'block',

  draggable: true,

  selectable: false,

  inline: false,

  addOptions() {
    return {
      HTMLAttributes: {},
      emptyNodeClass: 'content-empty',
      showOnlyCurrent: false
    }
  },

  addAttributes() {
    return {
      label: {
        default: 'Free text',
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: (attrs) => {
          if (!attrs.label) {
            return {}
          }

          return {
            'data-label': attrs.label
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draggable-block"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'draggable-block' }),
      0
    ]
  },

  addCommands() {
    return {
      setDraggableBlock:
        (position) =>
          ({ state, chain, editor }) => {
            const {
              selection: { from }
            } = state

            const pos =
              (position !== undefined) || (position !== null) ? from : position

            return chain()
              .focus()
              .insertContentAt(pos, {
                type: this.name,
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: '/'
                      }
                    ]
                  }
                ]
              })
              .run()
          }
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(MenuBlockView)
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-0': () => this.editor.commands.setDraggableBlock(),
      Enter: ({ editor }) => {
        const {
          selection: { $head, from, to },
          doc
        } = editor.state

        const parent = $head.node($head.depth - 1)

        if (parent.type.name !== 'draggableBlock') return false

        let currentActiveNodeTo = -1

        doc.descendants((node, pos) => {
          if (currentActiveNodeTo !== -1) return false
          // eslint-disable-next-line consistent-return
          if (node.type.name === this.name) return

          const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

          if (nodeFrom <= from && to <= nodeTo) currentActiveNodeTo = nodeTo

          return false
        })

        const content = doc.slice(from, currentActiveNodeTo)?.toJSON().content

        return editor
          .chain()
          .insertContentAt(
            { from, to: currentActiveNodeTo },
            {
              type: this.name,
              content
            }
          )
          .focus(from + 4)
          .run()
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const { anchor } = selection
            const decorations: Decoration[] = []

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize
              const isEmpty = !node.isLeaf && !node.childCount

              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass]

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(' ')
                })

                decorations.push(decoration)
              }
            })

            return DecorationSet.create(doc, decorations)
          }
        }
      })
    ]
  }
})

export { type AppDraggableBlockOptions, AppDraggableBlock, AppDraggableBlock as default }
