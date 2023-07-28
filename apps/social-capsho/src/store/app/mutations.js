export function logIn(state, value) {
	state.user.loggedIn = value
	state.loginError = null
}

export function logOut(state) {
	state.user.data = null
	state.user.loggedIn = false
	state.user.createdProfile = false
	state.user.toneOfVoice = null
	state.user.type = null
	state.user.template = null
	state.user.subscription = null
	state.user.businessName = null
	state.user.stripeId = null
	state.sets = []
	state.captions = []
	state.emails = []
	state.emailSubjectLines = []
	state.templates = []
	state.honeyTrapCaptions = []
	state.engageCaptions = []
	state.honeyTrapCaptions = []
	state.emails = []
	state.captions = []
	state.emailSubjectLines = []
}

export function setLoginError(state, value) {
	state.loginError = value
}

export function setVerifyEmailError(state, value) {
	state.verifyEmailError = value
}

export function setUserData(state, data) {
	state.user.data = data
}

export function setUsersData(state, data) {
	state.sets = []
	state.emails = []
	state.captions = []
	state.emailSubjectLines = []
	state.sets.push(...data.sets)
	state.captions.push(...data.captions)
	state.emailSubjectLines.push(...data.email_subject_lines)
	state.emails.push(...data.emails)
}

export function setCreatedProfile(state, value) {
	state.user.createdProfile = value
}

export function changeUserName(state, newName) {
	state.user.data.displayName = newName
}

export function changeUserPhoto(state, newPhoto) {
	state.user.data.photoURL = newPhoto
}

export function updateUserBusinessName(state, newBusinessName) {
	state.user.businessName = newBusinessName
}

export function updateUserToneOfVoice(state, newToneOfVoice) {
	state.user.toneOfVoice = newToneOfVoice
}

export function setUpdateUser(state, obj) {
	state.user.loggedIn = true
	state.user.firstLogin = obj.first_login
	state.user.toneOfVoice = obj.toneOfVoice
	state.user.type = obj.type
	state.user.businessName = obj.businessName
	state.user.createdProfile = obj.created_profile
	state.user.template = obj.template
	state.user.subscription = obj.subscription
	state.user.stripeId = obj.stripe_id
}

export function setTemplates(state, payload) {
	state.templates = payload
}

export function updateHoneyTrapTemplate(state, payload) {
	state.templates[payload.index].tool = payload.latestHoneyTrapTool.tool
	state.templates[payload.index].creattive = payload.template.creative
	state.templates[payload.index].text = payload.template.text
	state.templates[payload.index].image = payload.template.image
	state.templates[payload.index].type = payload.template.type
}

export function updateTemplateText(state, { pos, value }) {
	state.templates[pos].text = value
}

export function updateTemplate(state, { pos, value }) {
	state.templates[pos].caption = value
}

export function setEngageCaptions(state, payload) {
	state.captions.push(...payload)
}

export function setHoneyTrapCaptions(state, payload) {
	state.honeyTrapCaptions = payload
}
