import { cloudFunction } from 'src/services/firebase/base'

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
 * @param {Boolean} isGuest
 * @param {String} guestName
 * @param {String} topic1
 * @param {String} text
 * @return {Promise<unknown>}
 */
export async function storyLinkedInArticle ({
  isGuest,
  guestName,
  topic1,
  text
}) {
  const response = await cloudFunction('development-storyLinkedinArticleV2')({
    isGuest,
    guestName,
    topic1,
    text
  })
  return response.data
}

/**
 * @param {Boolean} isGuest
 * @param {String} guestBio
 * @param {String} guestName
 * @param {String} podcastName
 * @param {String} audience
 * @param {String} result
 * @param {String} topic2
 * @param {String} solution
 * @param {String} value
 * @param {String} text
 * @return {Promise<unknown>}
 */
export async function storyLinkedInCaption ({
  isGuest,
  guestBio,
  guestName,
  podcastName,
  audience,
  result,
  topic2,
  solution,
  value,
  text
}) {
  const response = await cloudFunction('development-storyLinkedinCaptionV2')({
    isGuest,
    guestBio,
    guestName,
    podcastName,
    audience,
    result,
    topic2,
    solution,
    value,
    text
  })
  return response.data
}

/**
 * @param {Boolean} isGuest
 * @param {String} guestName
 * @param {String} podcastName
 * @param {String} result
 * @param {String} value
 * @param {String} logLine1
 * @param {String} story
 * @param {String} chapters
 * @param {String} tagLine1
 * @param {String} title
 * @param {String} text
 * @return {Promise<unknown>}
 */
export async function storyTwitterCaption ({
  isGuest,
  guestName,
  podcastName,
  result,
  value,
  logLine1,
  story,
  chapters,
  tagLine1,
  title,
  text
}) {
  const response = await cloudFunction('development-storyTwitterCaptionV2')({
    isGuest,
    guestName,
    podcastName,
    result,
    value,
    logLine1,
    story,
    chapters,
    tagLine1,
    title,
    text
  })
  return response.data
}

/**
 * @param {Boolean} isGuest
 * @param {String} tagLine1
 * @param {String} guestName
 * @param {String} podcastName
 * @param {String} title
 * @param {String} story
 * @param {String} audience
 * @param {String} text
 * @return {Promise<unknown>}
 */
export async function storyTikTokCaption ({
  isGuest,
  tagLine1,
  guestName,
  podcastName,
  title,
  story,
  audience,
  text
}) {
  const response = await cloudFunction('development-storyTiktokCaptionV2')({
    isGuest,
    tagLine1,
    guestName,
    podcastName,
    title,
    story,
    audience,
    text
  })
  return response.data
}

/**
 * @param {Boolean} isGuest
 * @param {String} guestName
 * @param {String} topic1
 * @param {String} text
 * @return {Promise<unknown>}
 */
export async function strategyLinkedInArticle ({
  isGuest,
  guestName,
  topic1,
  text
}) {
  const response = await cloudFunction('development-strategyLinkedinArticleV2')({
    isGuest,
    guestName,
    topic1,
    text
  })
  return response.data
}

/**
 * @param {Boolean} isGuest
 * @param {String} guestName
 * @param {String} guestBio
 * @param {String} audience
 * @param {String} podcastName
 * @param {String} result
 * @param {String} solution
 * @param {String} topic2
 * @param {String} text
 * @param {String} value
 * @return {Promise<unknown>}
 */
export async function strategyLinkedInCaption ({
  isGuest,
  guestName,
  guestBio,
  audience,
  podcastName,
  result,
  solution,
  topic2,
  text,
  value
}) {
  const response = await cloudFunction('development-strategyLinkedinCaptionV2')({
    isGuest,
    guestName,
    guestBio,
    audience,
    podcastName,
    result,
    solution,
    topic2,
    text,
    value
  })
  return response.data
}

/**
 * @param {Boolean} isGuest
 * @param {String} guestName
 * @param {String} podcastName
 * @param {String} result
 * @param {String} topic2
 * @param {String} value
 * @param {String} logLine1
 * @param {String} hook
 * @param {String} text
 * @return {Promise<unknown>}
 */
export async function strategyTwitterCaption ({
  isGuest,
  guestName,
  podcastName,
  result,
  topic2,
  value,
  logLine1,
  hook,
  text
}) {
  const response = await cloudFunction('development-strategyTwitterCaptionV2')({
    isGuest,
    guestName,
    podcastName,
    result,
    topic2,
    value,
    logLine1,
    hook,
    text
  })
  return response.data
}

/**
 * @param {Boolean} isGuest
 * @param {String} hook
 * @param {String} guestName
 * @param {String} podcastName
 * @param {String} text
 * @param {String} audience
 * @return {Promise<unknown>}
 */
export async function strategyTikTokCaption ({
  isGuest,
  hook,
  guestName,
  podcastName,
  text,
  audience
}) {
  const response = await cloudFunction('development-strategyTiktokCaptionV2')({
    isGuest,
    hook,
    guestName,
    podcastName,
    text,
    audience
  })
  return response.data
}

/**
 * Generates content
 * @param {String} data.text
 * @param {String} data.chapterSummaries
 * @param {Boolean} data.isGuest
 * @param {String} data.podcastId
 * @param {String} data.transcriptId
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function generateEpisodeDrafts (data) {
  const { text, chapterSummaries, isGuest, guestName, isDev, podcastId, transcriptId } = data
  const response = await cloudFunction('development-generateEpisodeDraftsV2')({ text, chapterSummaries, isGuest, guestName, isDev, podcastId, transcriptId })
  return response.data
}

export async function generateBlogDrafts (data) {
  const {
    text,
    title,
    audience,
    result,
    value,
    solution,
    intention,
    podcastId,
    isGuest,
    guestName
  } = data
  const response = await cloudFunction('development-generateBlogDraftsV2')({
    text,
    title,
    audience,
    result,
    value,
    solution,
    intention,
    podcastId,
    isGuest,
    guestName
  })
  return response.data
}

/**
 * Generates random strategy based cht prompt
 * @param {String} topic1
 * @param {String} topic2
 * @param {String} solution
 * @param {Boolean} isGuest
 * @param {String} audience
 * @param {String} result,
 * @param {String} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function getRandomStrategyBasedCht ({ topic1, topic2, isGuest, audience, solution, result, guestName }) {
  const dataContext = {
    topic1,
    topic2,
    solution,
    audience,
    result,
    isGuest,
    guestName
  }
  const response = await cloudFunction('development-getRandomStrategyBasedCht')({ dataContext })
  return response.data
}

/**
 * Generates random story based cht prompt
 * @param {String} chapterSummaries
 * @param {String} title
 * @param {String} story
 * @param {String} audience
 * @param {String} result
 * @param {Boolean} isGuest
 * @param {String} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function getRandomStoryBasedCht ({ chapterSummaries, story, title, isGuest, audience, result, guestName }) {
  const dataContext = {
    chapterSummaries,
    story,
    title,
    audience,
    result,
    isGuest,
    guestName
  }
  const response = await cloudFunction('development-getRandomStoryBasedCht')({ dataContext })
  return response.data
}

/**
 * Generates random story based cht prompt
 * @param {String} chapterSummaries
 * @param {String} title
 * @param {String} story
 * @param {String} audience
 * @param {String} result
 * @param {Boolean} isGuest
 * @param {String} guestName
 * @return {Promise<HttpsCallableResult<unknown>>}
 */
export async function getRandomStoryBasedCaption ({ chapterSummaries, story, title, isGuest, audience, result, guestName }) {
  const dataContext = {
    chapterSummaries,
    story,
    title,
    audience,
    result,
    isGuest,
    guestName
  }
  const response = await cloudFunction('development-getRandomStoryBasedCaption')({ dataContext })
  return response.data
}
