// Podcast
import { buildMakePodcast } from './makePodcast'
import { makeValidator } from '../../validator/'
import { podcastSchema } from '../../validator/podcastSchema'

const podcastValidator = makeValidator(podcastSchema)

export const makePodcast = buildMakePodcast(podcastValidator)

// Transcript
import { transcriptSchema } from '../../validator/transcriptSchema'
import { buildMakeTranscript } from './makeTranscript'

const transcriptValidator = makeValidator(transcriptSchema)

export const makeTranscript = buildMakeTranscript(transcriptValidator)

export const services = Object.freeze({
	makePodcast,
	makeTranscript
})