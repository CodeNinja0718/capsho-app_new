/**
 * Title: onClickOutside composable
 * Same implementation as VueUse onClickOutside composable
 * @author VueUse
 * @see https://vueuse.org/core/onclickoutside/
 * @see https://github.com/vueuse/vueuse/blob/main/packages/core/onClickOutside/index.ts
 */
import { watch, unref, onUnmounted } from 'vue'
import { noop } from 'tw-elements/dist/src/js/bs/src/util'

const EVENTS = ['mousedown', 'touchstart', 'pointerdown']

function unrefElement(elRef) {
  return unref(elRef)?.$el ?? unref(elRef)
}

function useEventListener(...args) {
  let target
  let event
  let listener
  let options

  [target, event, listener, options] = args

  if (!target) return

  let cleanup = () => {}

  watch(
    () => unref(target),
    el => {
      cleanup()
      if (!el) return

      el.addEventListener(event, listener, options)

      cleanup = () => {
        el.removeEventListener(event, listener, options)
        cleanup = noop
      }
    },
    { immediate: true },
  )

  onUnmounted(stop)

  return stop
}

export function useOnClickOutside() {
  function onClickOutside(target, callback) {
    const listener = event => {
      const el = unrefElement(target)
      if (!el) return

      if (el === event.target || event.composedPath().includes(el)) return

      callback(event)
    }

    let disposables = EVENTS.map(event =>
      useEventListener(window, event, listener, { passive: true }),
    )

    const stop = () => {
      disposables.forEach(stop => stop())
      disposables = []
    }

    onUnmounted(stop)

    return stop
  }
  return {
    onClickOutside,
  }
}
