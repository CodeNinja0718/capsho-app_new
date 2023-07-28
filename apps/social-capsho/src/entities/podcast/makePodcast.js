export const buildMakePodcast = (podcastValidator) => {
	return function makePodcast({ user_id, podcast_id, title, image_url, description, rss_url } = {}) {
		const { error } = podcastValidator({ user_id, title, podcast_id, image_url, description, rss_url })
		if (error) {
			const ValidationError = new Error()
			ValidationError.name = 'ValidationError'
			ValidationError.message = `${error}`
			throw ValidationError
		}
		return Object.freeze({
			getUserId: () => user_id,
			getCreatedAt: () => Date.now(),
			getPodcastId: () => podcast_id,
			getTitle: () => title,
			getImageUrl: () => image_url,
			getDescription: () => description,
			getRssUrl: () => rss_url
		})
	}
}