import { Editor, Extension } from '@tiptap/core'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

interface AppPlaceholderOptions {
  emptyEditorClass: string
  emptyNodeClass: string
  includeChildren: boolean
  placeholder: ((PlaceholderProps: {
    editor: Editor
    hasAnchor: boolean
    node: ProseMirrorNode
    pos: number
  }) => string) | string
  showOnlyCurrent: boolean
  showOnlyWhenEditable: boolean
}

const AppPlaceholder = Extension.create<AppPlaceholderOptions>({
  name: 'placeholder',

  addOptions() {
    return {
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-empty',
      includeChildren: true,
      placeholder: 'Write something …',
      showOnlyCurrent: false,
      showOnlyWhenEditable: true
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const active =
              this.editor.isEditable || !this.options.showOnlyWhenEditable
            const { anchor } = selection
            const decorations: Decoration[] = []

            if (!active) {
              return null
            }

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize
              const isEmpty = !node.isLeaf && !node.childCount

              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass]

                if (this.editor.isEmpty) {
                  classes.push(this.options.emptyEditorClass)
                }

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(' '),
                  'data-placeholder':
                    typeof this.options.placeholder === 'function'
                      ? this.options.placeholder({
                        editor: this.editor,
                        node,
                        pos,
                        hasAnchor
                      })
                      : this.options.placeholder
                })

                decorations.push(decoration)
              }

              return this.options.includeChildren
            })

            return DecorationSet.create(doc, decorations)
          }
        }
      })
    ]
  }
})

export { type AppPlaceholderOptions, AppPlaceholder, AppPlaceholder as default }
