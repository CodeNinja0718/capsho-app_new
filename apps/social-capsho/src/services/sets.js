import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/dbConfig'

export async function getSet (setName) {
  const setRef = doc(db, 'sets', setName)
  const setSnap = await getDoc(setRef)
  if (setSnap.exists()) {
    return setSnap.data()
  }
  return {}
}

export async function deleteSet (docId) {
  try {
    const setRef = doc(db, 'sets', docId)
    await deleteDoc(setRef)
  } catch (e) {
    console.error({
      code: e.code,
      message: e.message
    })
  }
}
