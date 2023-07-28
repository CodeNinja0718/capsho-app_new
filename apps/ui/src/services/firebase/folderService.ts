import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc
} from 'firebase/firestore'
import { firestore } from 'src/services/firebase/db'
import { getAuth } from 'firebase/auth'
import type { Folder } from 'src/models/folders'
import { useFolderStore } from 'stores/folder-store'
import { useNotification } from 'src/composables/useNotification'
import { logtail } from 'boot/logtail'

export async function createFolderDocument(data: Folder) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return null

  const folderColRef = collection(firestore(), 'users_data', user.uid, 'folders')
  return await addDoc(folderColRef, data)
}

export async function listAllDocuments() {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const folderStore = useFolderStore()
  const uid = 'epXH5eJKosPPS4gG79RS8J2T9Mv1'
  const folderColRef = collection(firestore(), 'users_data', uid, 'folders')
  const q = query(folderColRef)
  folderStore.foldersListener = onSnapshot(q, (querySnapshot) => {
    const folders: Folder[] = []
    querySnapshot.forEach((doc) => {
      const folderData = doc.data()
      folders.push({
        id: doc.id,
        ...folderData,
        order: folderData.order ?? 100,
        folderFileUrl: folderData.folderFileUrl,
        placeHolderImg: folderData.folderFileUrl === ''
      } as Folder)
    })
    folderStore.documents = [...folders].sort((a, b) => a.order - b.order)
  })
}

export async function getFolderById(folderId: string) {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const folderRef = doc(firestore(), `users_data/${user.uid}/folders/${folderId}`)
    const folderSnap = await getDoc(folderRef)
    if (folderSnap.exists()) {
      return folderSnap.data()
    } else {
      return null
    }
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('usersData.ts - deleteEpisode', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}

export async function deleteFolderDocument(docId: string) {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const usersSubCollectionDataRef = doc(firestore(), `users_data/${user.uid}/folders/${docId}`)
    await deleteDoc(usersSubCollectionDataRef)
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('usersData.ts - deleteEpisode', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}

export async function editFolderDocument(data: Folder) {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const db = firestore()
    const docRef = doc(db, 'users_data', user.uid, 'folders', data.id)
    await setDoc(docRef, { ...data }, { merge: true })
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('folders.ts - update Folder fields', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}
