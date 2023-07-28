/* @unocss-include */
import { Editor, Range } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import fuzzysort from 'fuzzysort'
import tippy from 'tippy.js'
import * as icons from './menu-icons'

import CommandList from './SlashCommandList.vue'
import showImage from 'src/modules/editor/extensions/image/show-image.dialog'

const stopPrevent = <T extends Event>(e: T): T => {
  (e as Event).stopPropagation();
  (e as Event).preventDefault()

  return e
}

interface SlashMenuItem {
  command: (params: { editor: Editor; range: Range }) => void
  desc: string
  icon: string
  iconSize?: string
  isActive?(params: { editor: Editor; range: Range }): boolean
  shortcut: string
  title: string
  type: string
}

const SlashMenuItems: Partial<SlashMenuItem>[] = [
  {
    title: 'Heading 1',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    },
    icon: icons.get('h1'),
    shortcut: '#'
  },
  {
    title: 'Heading 2',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
    icon: icons.get('h2'),
    shortcut: '##'
  },
  {
    title: 'Heading 3',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
    icon: icons.get('h3'),
    shortcut: '###'
  },
  {
    title: 'Paragraph',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('paragraph')
        .run()
    },
    icon: icons.get('p'),
    shortcut: '###'
  },
  {
    title: 'Image',
    icon: icons.get('image'),
    iconSize: 'sm',
    type: 'image',
    command: ({ editor, range }) => {
      if (editor) {
        showImage(editor)
        editor.chain().focus().deleteRange(range).run()
      }
    }
  },
  {
    title: 'Ordered List',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
    icon: icons.get('ul'),
    shortcut: '1. L'
  },
  {
    title: 'Bullet List',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
    icon: icons.get('ul'),
    shortcut: '- L'
  }
]

const suggestions = {
  items: ({ query: q }: { query: string }) => {
    const query = q.toLowerCase().trim()

    if (!query) return SlashMenuItems

    const fuzzyResults = fuzzysort
      .go(query, SlashMenuItems, { key: 'title' })
      .map((item) => ({
        ...item,
        highlightedTitle: fuzzysort.highlight(item, '<b>', '</b>')
      }))

    return fuzzyResults.map(({ obj, highlightedTitle }) => ({
      ...obj,
      highlightedTitle
    }))
  },

  render: () => {
    let component: VueRenderer
    let popup: { destroy: () => void }[]
    let localProps: Record<string, any> | undefined

    return {
      onStart: (props: Record<string, any> | undefined) => {
        localProps = { ...props, event: '' }

        component = new VueRenderer(CommandList, {
          props: localProps,
          editor: localProps?.editor
        })

        popup = tippy('body', {
          getReferenceClientRect: localProps.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          animation: 'shift-toward-subtle',
          duration: 250
        })
      },

      onUpdate(props: Record<string, any> | undefined) {
        localProps = { ...props, event: '' }

        component.updateProps(localProps);

        (popup[0] as any).setProps({
          getReferenceClientRect: localProps.clientRect
        })
      },

      onKeyup(props: { event: KeyboardEvent }) {
        component.updateProps({ ...localProps, event: props.event });

        (component.ref as any).onKeyup({ event: props.event })

        if (props.event.key === 'Escape') {
          (popup[0] as any).hide()

          return true
        }

        if (props.event.key === 'Enter') {
          stopPrevent(props.event)

          return true
        }

        return false
      },

      onExit() {
        if (popup && popup[0]) popup[0]?.destroy()
        if (component) component.destroy()
      }
    }
  }
}

export { suggestions, suggestions as default }
