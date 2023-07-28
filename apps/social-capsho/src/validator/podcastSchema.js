import Joi from 'joi'

export const podcastSchema = Joi.object({
	user_id: Joi.string()
		.required()
		.messages({
			'any.required': '"user_id" is required'
		}),
	podcast_id: Joi.string()
		.required()
		.messages({
			'any.required': '"id" is required'
		}),
	title: Joi.string()
		.required()
		.messages({
			'any.required': '"title" is required'
		}),
	description: Joi.string()
		.required()
		.messages({
			'any.required': '"description" is required'
		}),
	image_url: Joi.string()
		.required()
		.messages({
			'any.required': '"image_url" is required'
		}),
	rss_url: Joi.string()
		.required()
		.messages({
			'any.required': '"rss_url" is required'
		}),
	createdAt: Joi.date().greater('now')
})