export const setProfile = (state, payload) => {
  state.newUserProfile = payload
}

export const setProfileCreatorsName = (state, payload) => {
  state.newUserProfile.name = payload
}

export const setProfileBusinessName = (state, payload) => {
  state.newUserProfile.business = payload
}

export const setProfileCreatorsPhoto = (state, payload) => {
  state.newUserProfile.photo = payload
}

export const setProfileCreatorsTone = (state, selectedTone) => {
  state.tones.forEach((tone) => {
    tone.isEnabled = selectedTone.name === tone.name
  })
  state.newUserProfile.tone = selectedTone.db
}

export const setProfileCreatorsType = (state, payload) => {
  state.newUserProfile.type = payload
}

export const setProfileCreatorsTheme = (state, payload) => {
  state.selectedThemes.push(payload)
}

export const removeProfileCreatorsTheme = (state, i) => {
  state.selectedThemes = state.selectedThemes.filter((theme, idx) => idx !== i)
}

export const setProfileCreatorsExpectation = (state, payload) => {
  state.newUserProfile.expectation = payload
}

export const increaseStepBy = (state , n) => {
  state.profileCreationStep += n
}

export const decreaseStepBy = (state , n) => {
  state.profileCreationStep -= n
}

export const resetSteps = (state) => {
  state.profileCreationStep = 1
}

export const setThemes = (state, payload) => {
  state.themes = payload
}

export const setTones = (state, payload) => {
  state.tones = payload
}

export const setSets = (state, payload) => {
  state.sets = payload.sort((a, b) => {
    const createdAtSetA = new Date(a?.createdAt.seconds * 1000).getDate()
    const createdAtSetB = new Date(b?.createdAt.seconds * 1000).getDate()
    return createdAtSetA < createdAtSetB ? -1 : 1
  })
}

export const setAnswers = (state, payload) => {
  state.answers = payload
}

export const setQuestions = (state, payload) => {
  state.questions = payload
}

export const updateSet = (state, name) => {
  const index = state.sets.findIndex((set) => set.name === name)
  if (index !== -1) {
    state.sets[index].enabled = !state.sets[index].enabled
  }
}

export const removeSet = (state, name) => {
  state.sets = state.sets.filter((set) => set.name !== name)
}

export const updateSetsPerPage = (state, payload) => {
  state.setsPerPage = payload
}
