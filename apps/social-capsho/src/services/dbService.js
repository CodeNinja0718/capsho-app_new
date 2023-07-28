import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  collection,
  getDocs
} from 'firebase/firestore'
import { db } from '@/config/dbConfig'
import { getAuth } from 'firebase/auth'
import { updateUserInfo } from './authService'
import router from '@/router'
import store from '@/store'

export async function getUserByDocId(uid) {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)
  if (userSnap.exists()) {
    return userSnap.data()
  }
  return {}
}

export async function setFirstLogin(uid) {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    first_login: true
  })
}

export async function addUserToCollection({ tone, type, business, holidays, themes, expectation }) {
  const auth = getAuth()
  const user = auth.currentUser

  await setDoc(doc(db, 'users', user.uid), {
    first_login: false,
    tone_of_voice: tone,
    type: type,
    business_name: business,
    created_profile: true,
    holidays: holidays,
    themes: themes,
    subscription: 'none',
    stripe_id: null,
    expectation: expectation,
    template: 1,
    lastUpdated: serverTimestamp()
  }).then(() => {
    const obj = {
      toneOfVoice: tone,
      type: type,
      businessName: business,
      created_profile: true,
      template: 1,
      subscription: 'none',
      stripe_id: null
    }
    store.commit('app/setUpdateUser', obj)
    router.push({ name: 'Dashboard' })
  })

  await setDoc(doc(db, 'users_data', user.uid), {
    captions: [],
    emails: [],
    email_subject_lines: [],
    sets: []
  })
}

export function saveAnswersSet({ answerSets, questions, tool, type }) {
  const auth = getAuth()
  const user = auth.currentUser
  let newId = null

  const userDataRef = doc(db, 'users_data', user.uid)

  return getDoc(userDataRef)
    .then((doc) => {
      let pos = doc.data().sets.length
      newId = user.uid + tool + pos

      return newId
    })
    .then(async () => {
      await setDoc(doc(db, 'sets', newId), {
        answers: answerSets,
        questions: questions
      })

      return newId
    })
    .then(async () => {
      let date = new Date()
      if (type === 'honeytrap') {
        await updateDoc(userDataRef, {
          sets: arrayUnion({
            name: newId,
            enabled: true,
            tool: tool,
            type: type,
            createdAt: date
          })
        })
      } else {
        await updateDoc(userDataRef, {
          sets: arrayUnion({
            name: newId,
            enabled: true,
            tool: tool,
            createdAt: date
          })
        })
      }

      return newId
    })
}

export async function updateAnswerSets(sets) {
  const auth = getAuth()
  const user = auth.currentUser
  const userDataRef = doc(db, 'users_data', user.uid)
  await updateDoc(userDataRef, {
    sets: sets
  })
}

export function updateUserProfile(newData) {
  const auth = getAuth()
  const user = auth.currentUser

  updateDoc(doc(db, 'users', user.uid), {
    business_name: newData.businessName,
    tone_of_voice: newData.toneOfVoice
  })
  .then(() => {
    const type = store.getters['app/type']
    let obj = {
      toneOfVoice: newData.toneOfVoice,
      type: type,
      businessName: newData.businessName,
      created_profile: true,
      template: store.getters['app/user'].template,
      subscription: store.getters['app/user'].subscription,
      stripe_id: store.getters['app/user'].stripeId
    }
    store.commit('app/setUpdateUser', obj)
    router.push({ name: 'Dashboard' })
    updateUserInfo({ newName: newData.data.displayName })
  })
}

export async function getToolByDocId(tool, id) {
  const toolRef = doc(db, tool, id)
  const toolSnap = await getDoc(toolRef)
  if (toolSnap.exists()) {
    return toolSnap.data()
  }
  return {}
}

export async function getEmotions () {
  return await getDocs(collection(db, 'emotions'))
}
