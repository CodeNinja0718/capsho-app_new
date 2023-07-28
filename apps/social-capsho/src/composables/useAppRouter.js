import router from '@/router'

export function useAppRouter() {
  /**
   *
   * @param route
   * @returns {Promise<void>}
   */
  async function routerPush (route) {
    await router.push({ name: route })
  }

  return {
    routerPush
  }
}
