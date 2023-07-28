import { cloudFunction } from 'src/services/firebase/base'
import { useNotification } from 'src/composables/useNotification'

/** ********** Emails Api ***************/
/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<unknown>}
 */
export async function createEmails (
  {
    podcastId,
    transcriptId
  }
) {
  const response = await cloudFunction('emailsApi-generateEmails')({
    podcastId,
    transcriptId
  })
  return response.data
}

/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<unknown>}
 */
export async function createEmailsPlus (
  {
    podcastId,
    transcriptId
  }
) {
  const response = await cloudFunction('emailsApi-generateEmailsPlus')({
    podcastId,
    transcriptId
  })
  return response.data
}

/** ********** Captions Api ***************/
/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<unknown>}
 */
export async function createCaptions (
  {
    podcastId,
    transcriptId
  }
) {
  const response = await cloudFunction('captionsApi-generateCaptions')({
    podcastId,
    transcriptId
  })
  return response.data
}

/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<unknown>}
 */
export async function createCaptionsPlus (
  {
    podcastId,
    transcriptId
  }
) {
  const response = await cloudFunction('captionsApi-generateCaptionsPlus')({
    podcastId,
    transcriptId
  })
  return response.data
}

/** ********** Initial Drafts Api **********/

/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<object>}
 */
export async function createInitialDraftsOne (podcastId, transcriptId) {
  const response = await cloudFunction('initialDraftsApi-first')({
    podcastId,
    transcriptId
  })
  return response.data
}

/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @param {boolean} isGuest
 * @param {string} guestName
 * @param {string} topic1
 * @param {string} intention
 * @param {string} audience
 * @return {Promise<object>}
 */
export async function createInitialDraftsTwo (
  {
    podcastId,
    transcriptId,
    isGuest,
    guestName,
    topic1,
    intention,
    audience
  }
) {
  const response = await cloudFunction('initialDraftsApi-second')({
    podcastId,
    transcriptId,
    isGuest,
    guestName,
    topic1,
    intention,
    audience
  })
  return response.data
}

/** ********** Description Api ************/

/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<object>}
 */
export async function createRandomDescription ({ podcastId, transcriptId }) {
  const response = await cloudFunction('descriptionApi-createRandomDescription')({
    podcastId,
    transcriptId
  })
  return response.data
}

/** *********** LinkedIn article intro *************/

/**
 * @param {string} transcriptId
 * @param {string} podcastId
 * @return {Promise<unknown>}
 */
export async function strategyLinkedInArticle ({
  transcriptId,
  podcastId
}) {
  const response = await cloudFunction('strategyLinkedInArticle')({
    transcriptId,
    podcastId
  })
  return response.data
}

/**
 * @param {string} transcriptId
 * @param {string} podcastId
 * @return {Promise<unknown>}
 */
export async function storyLinkedInArticle ({
  transcriptId,
  podcastId
}) {
  const response = await cloudFunction('storyLinkedInArticle')({
    transcriptId,
    podcastId
  })
  return response.data
}

/** ************* Drafts Api *************/

/**
 * @param {string} transcriptId
 * @param {string} podcastId
 * @return {Promise<unknown>}
 */
export async function createPotentQuotables ({
  transcriptId,
  podcastId
}) {
  const response = await cloudFunction('draftsApi-generatePotentQuotables')({
    transcriptId,
    podcastId
  })
  return response.data
}

/**
 * Generates content
 * @param {string} data.podcastId
 * @param {string} data.transcriptId
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function generateEpisodeDrafts (data) {
  const { podcastId, transcriptId } = data
  const response = await cloudFunction('draftsApi-generateEpisodeDrafts')({
    podcastId,
    transcriptId
  })
  return response.data
}

/**
 * Generates random strategy based cht prompt
 * @param {string} topic1
 * @param {string} topic2
 * @param {string} solution
 * @param {boolean} isGuest
 * @param {string} audience
 * @param {string} result
 * @param {string} value
 * @param {string} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function getRandomStrategyBasedCht (
  {
    topic1,
    topic2,
    isGuest,
    audience,
    solution,
    result,
    value,
    guestName
  }
) {
  const dataContext = {
    topic1,
    topic2,
    solution,
    audience,
    result,
    isGuest,
    guestName,
    value
  }
  const response = await cloudFunction('draftsApi-getRandomStrategyBasedCht')({ dataContext })
  return response.data
}

/**
 * Generates random story based cht prompt
 * @param {string} chapterSummaries
 * @param {string} title
 * @param {string} story
 * @param {string} audience
 * @param {string} result
 * @param {boolean} isGuest
 * @param {string} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function getRandomStoryBasedCht (
  {
    chapterSummaries,
    story,
    title,
    isGuest,
    audience,
    result,
    guestName
  }
) {
  const dataContext = {
    chapterSummaries,
    story,
    title,
    audience,
    result,
    isGuest,
    guestName
  }
  const response = await cloudFunction('draftsApi-getRandomStoryBasedCht')({ dataContext })
  return response.data
}

/**
 * Generates random story based cht prompt
 * @param {string} chapterSummaries
 * @param {string} title
 * @param {string} story
 * @param {string} audience
 * @param {string} result
 * @param {boolean} isGuest
 * @param {string} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function getRandomStoryBasedCaption (
  {
    chapterSummaries,
    story,
    title,
    isGuest,
    audience,
    result,
    guestName
  }
) {
  const dataContext = {
    chapterSummaries,
    story,
    title,
    audience,
    result,
    isGuest,
    guestName
  }
  const response = await cloudFunction('draftsApi-getRandomStoryBasedCaption')({ dataContext })
  return response.data
}

/** ******** Blog drafts Api ********/

/**
 * @param {string} data.podcastId
 * @param {string} data.transcriptId
 * @returns {Promise<*>}
 */
export async function generateBlogDraftsOne (data) {
  const { transcriptId, podcastId } = data
  const response = await cloudFunction('blogDraftsApi-generateBlogDraftsOne')({
    transcriptId,
    podcastId
  })
  return response.data
}

/**
 * @param {string} data.podcastId
 * @param {string} data.transcriptId
 * @param {string} data.blogSeoQuestion
 * @returns {Promise<*>}
 */
export async function generateBlogDraftsTwo (data) {
  const { transcriptId, podcastId, blogSeoQuestion } = data
  const response = await cloudFunction('blogDraftsApi-generateBlogDraftsTwo')({
    transcriptId,
    podcastId,
    blogSeoQuestion
  })
  return response.data
}

/**
 * @param {string} data.podcastId
 * @param {string} data.transcriptId
 * @returns {Promise<*>}
 */
export async function generateFiveSeoQuestions (data) {
  const { transcriptId, podcastId } = data
  const response = await cloudFunction('blogDraftsApi-generateFiveSeoQuestions')({
    transcriptId,
    podcastId
  })
  return response.data
}

/** ******** Refresh Api ************/
/**
 * Summarizes three top topics as curiosity hooks
 * @param {string} transcriptId
 * @param {boolean} isGuest
 * @param {string} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function generateFindings ({ transcriptId, isGuest = false, guestName }) {
  const response = await cloudFunction('refreshDraftsApi-createValue')(
    {
      transcriptId,
      isGuest,
      guestName
    }
  )
  return response.data
}

/**
 * Summarizes the text into short story
 * @param {string} transcriptId
 * @param {boolean} isGuest
 * @param {string} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function generateStory ({ transcriptId, isGuest = false, guestName }) {
  const response = await cloudFunction('refreshDraftsApi-createStory')(
    {
      transcriptId,
      isGuest,
      guestName
    }
  )
  return response.data
}

/**
 * Generates title
 * @param {string} transcriptId - transcriptId
 * @param {boolean} isGuest - if podcast having a podcast-guest include podcast-guest name
 * @param {string} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function createTitle (transcriptId, isGuest = false, guestName) {
  const { triggerNegative } = useNotification()
  try {
    const data = {
      transcriptId,
      isGuest,
      guestName
    }
    const result = await cloudFunction('refreshDraftsApi-createTitle')(data)
    return {
      getTitle: () => result.data.title
    }
  } catch (e) {
    triggerNegative(e.message)
  }
}

/**
 * Creates a short curiosity hook for an email subject line
 * @param {string} story
 * @param {string} findings
 * @param {string} topic - first topic
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function generateEmailSubject ({ story, findings, topic }) {
  const { triggerNegative } = useNotification()
  try {
    const result = await cloudFunction('refreshDraftsApi-createEmailSubject')({
      topic,
      findings,
      story
    })
    return {
      getEmailSubjectLine: () => result.data.emailSubject
    }
  } catch (e) {
    triggerNegative(e.message)
  }
}
