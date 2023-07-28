export function user(state) {
	return state.user
}

export function createdProfile(state) {
	return state.user.createdProfile
}

export function toneOfVoice(state) {
	return state.user.toneOfVoice
}

export function businessName(state) {
	return state.user.businessName
}

export function type(state) {
	return state.user.type
}

export function userData(state) {
	return state.user.data
}

export function isLoggedIn(state) {
	return state.user.loggedIn
}

export function hasCreatedProfile(state) {
	return state.user.createdProfile
}

export function loginError(state) {
	return state.loginError
}

export function verifyEmailError(state) {
	return state.verifyEmailError
}

export function getTemplates(state) {
	return state.templates
}

export function getEngageCaptions(state) {
	return state.engageCaptions
}

export function getHoneyTrapCaptions(state) {
	return state.honeyTrapCaptions
}

export function getUserSets(state) {
	return state.sets
}

export function getUserEnabledSets(state) {
	return state.sets.filter((set) => set.enabled)
}

export function getEnabledSetNames(state) {
	return state.sets.filter((set) => set.enabled).map((set) => set.name)
}

export function getCaptions(state) {
	return state.captions
}

export function getUserEmailSubjectLines(state) {
	return state.emailSubjectLines
}

export function getUserEmails(state) {
	return state.emails
}
