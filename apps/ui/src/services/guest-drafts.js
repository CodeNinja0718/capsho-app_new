import { cloudFunction } from 'src/services/firebase/base'

/** ********** Guest Main Drafts Api **********/

/**
 * @param {string} topicCG1
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<object>}
 */
export async function createGuestDrafts (
  {
    podcastId,
    topicCG1,
    transcriptId
  }
) {
  const response = await cloudFunction('guestDraftsApi-generateEngDrafts')({
    podcastId,
    topicCG1,
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
export async function createGuestInitialDraftsOne (podcastId, transcriptId) {
  const response = await cloudFunction('guestInitialDraftsApi-first')({
    podcastId,
    transcriptId
  })
  return response.data
}

/** ********** Invitations Api ***************/
/**
 * @param {string} emailBody
 * @param {string} from
 * @param {string} guestName
 * @param {string} hostName
 * @param {string} podcastId
 * @param {string} podcastName
 * @param {string} recipient
 * @param {string} sendCopyToHost
 * @param {string} transcriptId
 * @return {Promise<unknown>}
 */
export async function saveGuestDraftsAndInvite (
  {
    emailBody,
    from,
    guestName,
    hostName,
    podcastId,
    podcastName,
    recipient,
    sendCopyToHost,
    transcriptId
  }
) {
  const response = await cloudFunction('guestInvitationApi-saveGuestDraftsAndInvite')({
    emailBody,
    from,
    guestName,
    hostName,
    podcastId,
    podcastName,
    recipient,
    sendCopyToHost,
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
export async function createGuestCaptions (
  {
    podcastId,
    transcriptId
  }
) {
  const response = await cloudFunction('guestCaptionsApi-generateCaptions')({
    podcastId,
    transcriptId
  })
  return response.data
}

/** ********** Emails Api ***************/
/**
 * @param {string} podcastId
 * @param {string} transcriptId
 * @return {Promise<unknown>}
 */
export async function createGuestEmails (
  {
    podcastId,
    transcriptId
  }
) {
  const response = await cloudFunction('guestEmailsApi-generateEmails')({
    podcastId,
    transcriptId
  })
  return response.data
}
