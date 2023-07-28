import {
  addDoc,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  where
} from 'firebase/firestore'
import { firestore } from './db'
import type { Template } from 'src/models/template'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useDocumentStore } from 'src/stores/document-state'
import { useNotification } from 'src/composables/useNotification'
import { logtail } from 'src/boot/logtail'

export async function saveCapshoTemplate(data: object, docName: string) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return null

  if (!docName) {
    const templateColRef = collection(firestore(), 'capsho_layouts')
    return await addDoc(templateColRef, data)
  } else {
    const templateDocRef = doc(firestore(), 'capsho_layouts', docName)
    return await setDoc(templateDocRef, data, { merge: true })
  }
}
export async function listCapshoDescriptionTemplates() {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const db = firestore()
    const colRef = collection(db, 'capsho_layouts/description/templates')
    const querySnapshot = await getDocs(colRef)
    const templates: object[] = []
    querySnapshot.forEach((doc) => {
      templates.push({
        id: doc.id,
        ...doc.data()
      })
    })
    return templates
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('folders.ts - update Template fields', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}

export async function createTemplateDocument(data: Template, docName = null) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) return null

  if (!docName) {
    const templateColRef = collection(firestore(), 'users_data', user.uid, 'templates')
    return await addDoc(templateColRef, data)
  } else {
    const templateDocRef = doc(firestore(), 'users_data', user.uid, 'templates', docName)
    return await setDoc(templateDocRef, data, { merge: true })
  }
}

export async function listAllTemplates() {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docuemntStore = useDocumentStore()
      const templateColRef = collection(firestore(), 'users_data', user.uid, 'templates')
      const q = query(templateColRef)
      docuemntStore.templatesListener = onSnapshot(q, (querySnapshot) => {
        const templates: Template[] = []
        querySnapshot.forEach(doc => {
          const templateData = doc.data()
          templates.push({
            id: doc.id,
            ...templateData
          } as Template)
        })
        docuemntStore.templates = [...templates]
      })
    } else {
      return null
    }
  })
}

export async function getTemplateById(templateId: string) {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const templateRef = doc(firestore(), `users_data/${user.uid}/templates/${templateId}`)
    const templateSnap = await getDoc(templateRef)
    if (templateSnap.exists()) {
      return templateSnap.data()
    } else {
      return null
    }
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('userData.ts - getTemplate', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}

export async function deleteTemplate(templateId: string) {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const usersSubCollectionDataRef = doc(firestore(), `users_data/${user.uid}/templates/${templateId}`)
    await deleteDoc(usersSubCollectionDataRef)
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('usersData.ts - deleteTemplate', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}

export async function editTemplateDocument(data: Template) {
  const { triggerWarning } = useNotification()
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      return null
    }
    const db = firestore()
    const docRef = doc(db, 'users_data', user.uid, 'templates', data.id)
    await setDoc(docRef, { ...data }, { merge: true })
  } catch (e) {
    if (e instanceof Error) {
      logtail?.error('folders.ts - update Template fields', {
        message: e.message
      })
      triggerWarning(e.message)
    }
  }
}
