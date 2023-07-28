import { getTopic, getKeywords, generateCuriosityHook, generateTitle } from '@/config/cloudFunctions'
import { useNotification } from '@/composables/useNotification'

/**
 * param {string} text
 * @return {Promise}
 */
export async function getTopicFromAI (text) {
  return await getTopic({ text: text })
  // const { alertDanger } = useNotification()
  // try {
  //   return await getTopic({ text })
  // } catch (e) {
  //   alertDanger(e.message)
  // }
}

/**
 * param {string} topic
 * @return {Promise}
 */
export async function getKeywordsForTopic (topic) {
  const { alertDanger } = useNotification()
  try {
    return await getKeywords({ topic })
  } catch (e) {
    alertDanger(e.message)
  }
}

/**
 * param {string} keywords
 * @return {Promise}
 */
export async function generateCuriosityHookFromKeywords (keywords) {
  const { alertDanger } = useNotification()
  try {
    return await generateCuriosityHook({ keywords })
  } catch (e) {
    alertDanger(e.message)
  }
}

export async function createTitle (text) {
  const { alertDanger } = useNotification()
  try {
    return await generateTitle({ text })
  } catch (e) {
    alertDanger(e.message)
  }
}


