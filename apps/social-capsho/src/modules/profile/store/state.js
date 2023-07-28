export default function () {
  return {
    newUserProfile: {
      name: null,
      photo: '',
      business: null,
      tone: null,
      type: null,
      expectation: null
    },
    themes: [],
    tones: [],
    selectedThemes: [],
    profileCreationStep: 1,
    sets: [],
    answers: [],
    questions: [],
    setsPerPage: []
  }
}
