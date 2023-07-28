import { useNotification } from 'src/composables/useNotification'
import { getAuth } from 'firebase/auth'
import { logtail } from 'boot/logtail'
import { spellingAPI } from 'src/boot/axios'
import type { Transcript } from 'src/models/models'
import { useUploadPodcastStore } from 'stores/upload-podcast'

export default async function getNameMismatch (
  {
    guestName,
    hostName,
    businessName,
    text,
    transcriptId,
    isGuest
  }: {
    guestName: string;
    hostName: string;
    businessName: string;
    text: string;
    transcriptId: string;
    isGuest: boolean;
  }
) {
  const { triggerNegative } = useNotification()
  try {
    const auth = getAuth()
    if (auth.currentUser) {
      return await spellingAPI({
        method: 'POST',
        url: '/transcriptionV2',
        data: {
          guest_name: guestName,
          host_name: hostName,
          business_name: businessName,
          id: transcriptId,
          is_guest: isGuest,
          text
        }
      })
    }
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('spelling.ts - getNameMismatch', {
        message: err.message
      })
      triggerNegative(err.message)
    }
  }
}

/**
 * Finds misspelled person and business names and updates them.
 * @param {Transcript} transcript
 */
export async function runTranscriptionSpellingNames (transcript: Transcript) {
  const store = useUploadPodcastStore()
  const isGuest = store.isGuest
  const guestName = store.isGuest ? store.guestName : ''
  const hostName = store.selectedFolder.hostName ?? ''
  const businessName = store.selectedFolder.businessName ?? ''
  const updatedTranscript: Transcript = {
    ...transcript,
    chapterSummaries: '',
    gistSummaries: '',
    headlineSummaries: '',
    labeledText: '',
    speakerLabeledText: '',
    text: ''
  }
  const promises = [
    runChapterSummaries(transcript.chapterSummaries),
    runGistSummaries(transcript.gistSummaries),
    runHeadlineSummaries(transcript.headlineSummaries),
    runLabeledText(transcript.labeledText),
    runSpeakerLabeledText(transcript.speakerLabeledText),
    runTranscriptText(transcript.text)
  ]
  await Promise.allSettled(promises)
  return Object.freeze({
    ...updatedTranscript
  })
  // chapter summaries
  function runChapterSummaries (text: string) {
    if (!text) {
      return null
    }
    return new Promise((resolve, reject) => {
      getNameMismatch({
        guestName,
        hostName,
        businessName,
        text,
        isGuest,
        transcriptId: ''
      })
        .then((resp) => {
          if (resp) {
            const personNames = resp.data.names_res.map((name: object) => {
              return {
                ...name,
                isName: true
              }
            })
            if (Array.isArray(personNames)) {
              for (const name of personNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.chapterSummaries = text.replace(p, validName)
              }
            }
            const businessNames = [...resp.data.business_names_res]
            if (Array.isArray(businessNames)) {
              for (const name of businessNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.chapterSummaries = text.replace(p, validName)
              }
            }
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  // gist
  function runGistSummaries(text: string | undefined) {
    if (!text) {
      return null
    }
    return new Promise((resolve, reject) => {
      getNameMismatch({
        guestName,
        hostName,
        businessName,
        text,
        isGuest,
        transcriptId: ''
      })
        .then((resp) => {
          if (resp) {
            const personNames = resp.data.names_res.map((name: object) => {
              return {
                ...name,
                isName: true
              }
            })
            if (Array.isArray(personNames)) {
              for (const name of personNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.gistSummaries = text.replace(p, validName)
              }
            }
            const businessNames = [...resp.data.business_names_res]
            if (Array.isArray(businessNames)) {
              for (const name of businessNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.gistSummaries = text.replace(p, validName)
              }
            }
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  // headline
  function runHeadlineSummaries (text: string | undefined) {
    if (!text) {
      return null
    }
    return new Promise((resolve, reject) => {
      getNameMismatch({
        guestName,
        hostName,
        businessName,
        text,
        isGuest,
        transcriptId: ''
      })
        .then((resp) => {
          if (resp) {
            const personNames = resp.data.names_res.map((name: object) => {
              return {
                ...name,
                isName: true
              }
            })
            if (Array.isArray(personNames)) {
              for (const name of personNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.headlineSummaries = text.replace(p, validName)
              }
            }
            const businessNames = [...resp.data.business_names_res]
            if (Array.isArray(businessNames)) {
              for (const name of businessNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.headlineSummaries = text.replace(p, validName)
              }
            }
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  // labeledText
  function runLabeledText (text: string) {
    if (!text) {
      return null
    }
    return new Promise((resolve, reject) => {
      getNameMismatch({
        guestName,
        hostName,
        businessName,
        text,
        isGuest,
        transcriptId: ''
      })
        .then((resp) => {
          if (resp) {
            const personNames = resp.data.names_res.map((name: object) => {
              return {
                ...name,
                isName: true
              }
            })
            if (Array.isArray(personNames)) {
              for (const name of personNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.labeledText = text.replace(p, validName)
              }
            }
            const businessNames = [...resp.data.business_names_res]
            if (Array.isArray(businessNames)) {
              for (const name of businessNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.labeledText = text.replace(p, validName)
              }
            }
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  // speakerLabeledText
  function runSpeakerLabeledText (text: string) {
    if (!text || !isGuest) {
      return null
    }
    return new Promise((resolve, reject) => {
      getNameMismatch({
        guestName,
        hostName,
        businessName,
        text,
        isGuest,
        transcriptId: ''
      })
        .then((resp) => {
          if (resp) {
            const personNames = resp.data.names_res.map((name: object) => {
              return {
                ...name,
                isName: true
              }
            })
            if (Array.isArray(personNames)) {
              for (const name of personNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.speakerLabeledText = text.replace(p, validName)
              }
            }
            const businessNames = [...resp.data.business_names_res]
            if (Array.isArray(businessNames)) {
              for (const name of businessNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.speakerLabeledText = text.replace(p, validName)
              }
            }
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  // text
  function runTranscriptText (text: string) {
    if (!text) {
      return null
    }
    return new Promise((resolve, reject) => {
      getNameMismatch({
        guestName,
        hostName,
        businessName,
        text,
        isGuest,
        transcriptId: ''
      })
        .then((resp) => {
          if (resp) {
            const personNames = resp.data.names_res.map((name: object) => {
              return {
                ...name,
                isName: true
              }
            })
            if (Array.isArray(personNames)) {
              for (const name of personNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.text = text.replace(p, validName)
              }
            }
            const businessNames = [...resp.data.business_names_res]
            if (Array.isArray(businessNames)) {
              for (const name of businessNames) {
                const p = new RegExp(name.name, 'gi')
                const validName = name.target
                updatedTranscript.text = text.replace(p, validName)
              }
            }
          }
          resolve(null)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
