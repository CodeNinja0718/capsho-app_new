import {
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  writeBatch,
  deleteDoc
} from 'firebase/firestore'
import { db } from '@/config/dbConfig'
import { getAuth } from 'firebase/auth'
import store from '@/store'
import { htmlSanitizer } from '@/utils'

export async function getUserData (id) {
  const userDataRef = doc(db, 'users_data', id)
  const userDataSnap = await getDoc(userDataRef)
  if (userDataSnap.exists()) {
    store.commit('profile/setSets', userDataSnap.data().sets)
    return userDataSnap.data()
  } else {
    return {}
  }
}

export async function updateUsersCaptions ({ captions }) {
  try {
    const docRef = doc(db, 'users_data', 'VMr1jWFdBfStyHyDcOmr4U4vzMb2')
    await updateDoc(docRef, {
      captions: captions
    })
  } catch (e) {
    console.error(e.message)
  }
}

export async function updateUsersEmails ({ emails }) {
  try {
    const docRef = doc(db, 'users_data', 'VMr1jWFdBfStyHyDcOmr4U4vzMb2')
    await updateDoc(docRef, {
      emails: emails
    })
  } catch (e) {
    console.error(e.message)
  }
}

export async function getUsersDataCollection () {
  const collectionRef = collection(db, 'users_data')
  const querySnapshot = await getDocs(collectionRef)
  const usersDataCollection = []
  querySnapshot.forEach((doc) => {
    if (doc.id !== '5nDJ8fG9t2R5LsKKX18yJCVexo93') {
      usersDataCollection.push({
        id: doc.id,
        ...doc.data()
      })
    }
  })
  return usersDataCollection
}

/**
 *
 * @param subCollectionName
 * @param id
 * @returns {Promise<*[]>}
 */
export async function getUsersSubCollectionData (subCollectionName, id) {
  const allowedSubCollectionNames = ['captions', 'email_subject_lines', 'emails', 'sets']
  if (allowedSubCollectionNames.includes(subCollectionName)) {
    try {
      const userSubCollectionDataRef = collection(db, 'users_data', id, subCollectionName)
      const querySnapshot = await getDocs(userSubCollectionDataRef)
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data()
        })
      })
      return data
    } catch (e) {
      console.error(e.message)
    }
  }
}

/**
 *
 * @param subCollectionName
 * @param data
 * @returns {Promise<void>}
 */
export async function addDataToUsersSubCollection ({ subCollectionName, data }) {
  const allowedSubCollectionNames = ['captions', 'email_subject_lines', 'emails', 'sets']
  if (allowedSubCollectionNames.includes(subCollectionName)) {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const userSubCollectionDataRef = collection(db, 'users_data', user.uid, subCollectionName)
      await addDoc(userSubCollectionDataRef, data)
    } catch (e) {
      console.error(e.message)
    }
  }
}

export async function updateUsersSetsData ({ subCollectionName, set }) {
  const allowedSubCollectionNames = ['sets']
  if (allowedSubCollectionNames.includes(subCollectionName)) {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const userSubCollectionDataRef = doc(db, 'users_data', user.uid, subCollectionName, set.id)
      await updateDoc(userSubCollectionDataRef, {
        enabled: set.enabled
      })
    } catch (e) {
      console.error(e.message)
    }
  }
}

export async function updateUsersCaptionData ({ subCollectionName, set }) {
  const allowedSubCollectionNames = ['captions']
  if (allowedSubCollectionNames.includes(subCollectionName)) {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      const userSubCollectionDataRef = doc(db, 'users_data', user.uid, subCollectionName, set.id)
      await updateDoc(userSubCollectionDataRef, {
        text: htmlSanitizer(set.text)
      })
    } catch (e) {
      console.error(e.message)
    }
  }
}

export async function deleteUsersSetDoc ({ set }) {
  try {
    const auth = getAuth()
    const user = auth.currentUser
    const batch = writeBatch(db)
    // reference users_data doc
    const userDataCollectionRef = doc(db, 'users_data', user.uid)
    // reference set doc from sets collection
    const setRef = doc(db, 'sets', set.name)
    // reference set doc from users sets sub collection
    const usersDataSetRef = doc(userDataCollectionRef, 'sets', set.id)
    // query captions where caption.set is equal set.name
    const captionRefs = collection(userDataCollectionRef, 'captions')
    const qCaptions = query(captionRefs, where('set', '==', set.name))
    const captionSnapshots = await getDocs(qCaptions)
    captionSnapshots.forEach((doc) => {
      batch.delete(doc.ref)
    })
    // query emails where email.set is equal set name
    const emailRefs = collection(userDataCollectionRef, 'emails')
    const qEmails = query(emailRefs, where('set', '==', set.name))
    const emailSnapshots = await getDocs(qEmails)
    emailSnapshots.forEach((doc) => {
      batch.delete(doc.ref)
    })
    // query email subject lines where doc.set is equal set name
    const emailSubjectLinesRefs = collection(userDataCollectionRef, 'email_subject_lines')
    const qEmailSubjectLines = query(emailSubjectLinesRefs, where('set', '==', set.name))
    const emailSubjectLinesSnapshots = await getDocs(qEmailSubjectLines)
    emailSubjectLinesSnapshots.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
    await deleteDoc(setRef)
    await deleteDoc(usersDataSetRef)
  } catch (e) {
    console.error(e.message)
  }
}

export async function updateUserData({ text, tool, set, type, key }) {
  const auth = getAuth()
  const user = auth.currentUser
  const userDataRef = doc(db, 'users_data', user.uid)
  const data = await getUserData(user.uid)
  const obj = {
    text: text,
    tool: tool,
    order: data.captions.length + 1,
    set: set
  }

  if (type) {
    obj.type = type
  }

  await updateDoc(userDataRef, {
    [key]: arrayUnion(obj)
  })
}

export async function updateUserSets({ id, sets }) {
  const userRef = doc(db, 'users_data', id)
  await updateDoc(userRef, {
    sets: sets
  })
  await getUserData(id)
}

export async function getEngageCaptions({ toneOfVoice }) {
  return await getDoc(doc(db, 'engage', toneOfVoice))
}

export function getCaption({ captionRef }) {
  return getDoc(captionRef)
}
