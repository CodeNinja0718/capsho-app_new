export const buildMakeTranscript = (transcriptValidator) => {
	return function makeTranscript({ user_id, transcript_id, title, episode_guid, transcript, podcast_id } = {}) {
		const { error } = transcriptValidator({ user_id, transcript_id, title, episode_guid, transcript, podcast_id })
		if (error) {
			const ValidationError = new Error()
			ValidationError.name = 'ValidationError'
			ValidationError.message = `${error}`
			throw ValidationError
		}
		return Object.freeze({
			getUserId: () => user_id,
			getCreatedAt: () => Date.now(),
			getTranscriptId: () => transcript_id,
			getTitle: () => title,
			getEpisodeGuid: () => episode_guid,
			getTranscript: () => transcript,
			getPodcastId: () => podcast_id
		})
	}
}