export default function () {
	return {
		user: {
			loggedIn: false,
			firstLogin: null,
			createdProfile: false,
			toneOfVoice: null,
			type: null,
			template: null,
			businessName: null,
			subscription: null,
			stripeId: null,
			data: null
		},
		loginError: null,
		verifyEmailError: null,
		templates: [],
		engageCaptions: [],
		honeyTrapCaptions: [],
		sets: [],
		emails: [],
		captions: [],
		emailSubjectLines: []
	}
}
