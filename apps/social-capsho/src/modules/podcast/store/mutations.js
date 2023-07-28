export const addPodcast = (state, podcast) => {
  state.podcasts.push(podcast)
}

export const setPodcasts = (state, podcasts) => {
  state.podcasts = podcasts
}

export const setPodcastInfo = (state, podcastInfo) => {
  state.podcastInfo = podcastInfo
}

export const addTranscript = (state, transcript) => {
  state.transcripts[transcript.doc_id] = transcript.data
}

export const setTranscripts = (state, transcripts) => {
  state.transcripts = transcripts
}

export const setPodcastUploadProgress = (state, progress) => {
  state.podcastProgress = progress
}

export const setUploadedPodcastURL = (state, url) => {
  state.uploadedPodcastURL = url
}

export const setTranscript = (state, data) => {
  state.transcript = data
}

export const setTranscriptionData = (state, data) => {
  state.transcriptionData = data
}
