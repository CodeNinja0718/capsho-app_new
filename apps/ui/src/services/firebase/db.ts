import { collection, doc, DocumentData, Firestore, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { FirebaseApp } from 'firebase/app'

export const firestore = (app?: FirebaseApp): Firestore => {
  if (app) {
    return getFirestore(app)
  } else {
    return getFirestore()
  }
}

/**
 * @param  {String} collectionName - Firestore collection name
 * @param  {String} id - Uid to assign to a doc in firestore collection
 * @returns {Object} - DocumentReference https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export const docRef = (collectionName: string, id: string) => {
  const collection = collectionRef(collectionName)
  return doc(collection, id)
}

/**
 * @param  {String} collectionName - Firestore collection name
 * @param  {String} id - Uid to assign to a doc in firestore collection
 * @param {Object} data
 * @returns {Object} - DocumentReference https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export const setDocument = async (collectionName: string, id: string, data: object) => {
  const document = docRef(collectionName, id)
  return await setDoc(document, data, { merge: true })
}

/**
 * @param  {String} collectionName - Firestore collection name
 * @param  {String} id - Uid to assign to a doc in firestore collection
 * @returns {Object} - DocumentReference https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export const getDocument = async (collectionName: string, id: string):Promise<DocumentData | undefined> => {
  const document = await getDoc(docRef(collectionName, id))
  return document.data()
}

/**
 * @param  {String} collectionName - Firestore collection name
 * @returns {Object} - DocumentReference https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference
 */
export const collectionRef = (collectionName: string) => {
  return collection(firestore(), collectionName)
}
