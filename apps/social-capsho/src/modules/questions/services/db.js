import {
  doc,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/config/dbConfig'
import { getAuth } from 'firebase/auth'
import { addDataToUsersSubCollection, getUsersSubCollectionData } from '@/services/usersData'

const getUser = () => {
  const auth = getAuth()
  return auth.currentUser
}

export function saveAnswersSet({ answerSets, questions, tool, customToolTitle }) {
  let user = getUser()
  let newId = null

  return getUsersSubCollectionData('sets', user.uid)
    .then((setsData) => {
      let pos = setsData.length
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
      const data = {
        name: newId,
        enabled: true,
        tool: tool,
        customToolTitle: customToolTitle,
        createdAt: date
      }
      await addDataToUsersSubCollection({ subCollectionName: 'sets', data })
      return newId
    })
}

export async function saveCaption(text, tool, set, type) {
  let captionType
  if (!type) {
    captionType = ''
  } else {
    captionType = type
  }

  try {
    const data = {
      text: text,
      tool: tool,
      set: set,
      type: captionType
    }
    await addDataToUsersSubCollection({ subCollectionName: 'captions', data })
  } catch (e) {
    console.error(e.message)
  }
}

export async function saveEmail(text, tool, set) {
  try {
    const data = {
      text: text,
      tool: tool,
      set: set
    }
    await addDataToUsersSubCollection({ subCollectionName: 'emails', data })
  } catch (e) {
    console.error(e.message)
  }
}

export async function saveSubjectLine(text, tool, set) {
  try {
    const data = {
      text: text,
      tool: tool,
      set: set
    }
    await addDataToUsersSubCollection({ subCollectionName: 'email_subject_lines', data })
  } catch (e) {
    console.error(e.message)
  }
}
