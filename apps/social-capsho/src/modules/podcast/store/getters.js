export const getPodcasts = (state) => {
	return state.podcasts
}

export const getPodcastByRssUrl = (state) => (rssUrl) => {
	return state.podcasts.find((podcast) => podcast.rss_url === rssUrl)
}

export const getPodcastInfo = (state) => {
	return state.podcastInfo
}

export const getTranscripts = (state) => {
	return state.transcripts
}