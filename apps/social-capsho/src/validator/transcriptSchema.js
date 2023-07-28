import Joi from 'joi'

export const transcriptSchema = Joi.object({
	user_id: Joi.string()
		.required()
		.messages({
			'any.required': '"user_id" is required'
		}),
	transcript_id: Joi.string()
		.required()
		.messages({
			'any.required': '"id" is required'
		}),
	title: Joi.string()
		.required()
		.messages({
			'any.required': '"title" is required'
		}),
	episode_guid: Joi.string()
		.required()
		.messages({
			'any.required': '"episode_guid" is required'
		}),
	transcript: Joi.string()
		.required()
		.messages({
			'any.required': '"transcript" is required'
		}),
	podcast_id: Joi.string()
		.required()
		.messages({
			'any.required': '"podcast_id" is required'
		})
})