import { unref, computed } from 'vue'
import type { Editor } from '@tiptap/core'
import * as icons from './menu-icons'
import type { IconsOptions } from './menu-icons'

import showImage from 'src/modules/editor/extensions/image/show-image.dialog'
import showColor from 'src/modules/editor/extensions/color/show-color.dialog'

type MenuType = keyof IconsOptions | `#${string}`

interface Context {
  editor: Editor | null
  menubar: MenuType[]
}

interface MenuDefinitions {
  action?(...arg: unknown[]): void
  icon?: string
  iconSize?: string
  isActive?(): boolean
  slot?: string
  title?: string
  type: MenuType | 'slot'
}

function useMakeMenu({ editor, menubar }: Context) {
  const menuDefinitions = computed<Record<MenuType, MenuDefinitions>>(() => ({
    color: {
      title: 'Color',
      icon: icons.get('color'),
      iconSize: 'sm',
      type: 'color',
      action: () => {
        if (editor && unref(editor)) showColor(editor)
      },
      isActive: () => unref(editor)?.isActive('textStyle') || false
    },
    h1: {
      title: '',
      icon: icons.get('h1'),
      iconSize: 'sm',
      type: 'h1',
      action: () => unref(editor)?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => unref(editor)?.isActive('heading', { level: 1 }) || false
    },
    h2: {
      title: '',
      icon: icons.get('h2'),
      iconSize: 'sm',
      type: 'h2',
      action: () => unref(editor)?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => unref(editor)?.isActive('heading', { level: 2 }) || false
    },
    h3: {
      title: '',
      icon: icons.get('h3'),
      iconSize: 'sm',
      type: 'h3',
      action: () => unref(editor)?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => unref(editor)?.isActive('heading', { level: 3 }) || false
    },
    h4: {
      title: '',
      icon: icons.get('h4'),
      iconSize: 'sm',
      type: 'h4',
      action: () => unref(editor)?.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: () => unref(editor)?.isActive('heading', { level: 4 }) || false
    },
    h5: {
      title: '',
      icon: icons.get('h5'),
      iconSize: 'sm',
      type: 'h5',
      action: () => unref(editor)?.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: () => unref(editor)?.isActive('heading', { level: 5 }) || false
    },
    p: {
      title: '',
      icon: icons.get('p'),
      iconSize: 'sm',
      type: 'p',
      action: () => unref(editor)?.chain().focus().setParagraph().run(),
      isActive: () => unref(editor)?.isActive('paragraph') || false
    },
    image: {
      title: '',
      icon: icons.get('image'),
      iconSize: 'sm',
      type: 'image',
      action: () => {
        if (editor && unref(editor)) showImage(editor)
      },
      isActive: () => unref(editor)?.isActive('image') || false
    },
    blockQuote: {
      title: '',
      icon: icons.get('blockQuote'),
      iconSize: 'md',
      type: 'blockQuote',
      action: () => unref(editor)?.isActive('blockQuote')
        ? unref(editor)?.chain().focus().unsetBlockquote().run()
        : unref(editor)?.chain().focus().setBlockquote().run(),
      isActive: () => unref(editor)?.isActive('blockQuote') || false
    },
    redo: {
      title: '',
      icon: icons.get('redo'),
      iconSize: 'sm',
      type: 'redo',
      action: () => unref(editor)?.chain().redo().run()
    },
    undo: {
      title: '',
      icon: icons.get('undo'),
      iconSize: 'sm',
      type: 'undo',
      action: () => unref(editor)?.chain().undo().run()
    }
  }))

  const items = computed(() => {
    if (!unref(editor)) return []
    const menuItems: MenuDefinitions[] = []

    for (const i of menubar) {
      const item = unref(menuDefinitions)[i]
      if (item) {
        menuItems.push(item)
      } else if (i[0] === '#') {
        menuItems.push({ type: 'slot', slot: i.substring(1) })
      }
    }

    return menuItems
  })

  return {
    items
  }
}

export { type MenuType, type MenuDefinitions, useMakeMenu, useMakeMenu as default }
