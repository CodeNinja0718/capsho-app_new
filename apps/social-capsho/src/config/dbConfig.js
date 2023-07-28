import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: 'capsho-abdf4.firebaseapp.com',
  projectId: 'capsho-abdf4',
  storageBucket: 'capsho-abdf4.appspot.com',
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
}

export const firebase = initializeApp(firebaseConfig)

export const db = getFirestore()

if (process.env.NODE_ENV === 'testing') {
  //  interact with the Authentication emulator
  const auth = getAuth()
  connectAuthEmulator(auth, "http://localhost:9099")
  // interact with Cloud Firestore emulator
  connectFirestoreEmulator(db, 'localhost', 8088)
  // interact with the Cloud Storage emulator
  const storage = getStorage()
  connectStorageEmulator(storage, "localhost", 9199)
  // interact with Cloud Functions emulator
  const functions = getFunctions(firebase)
  connectFunctionsEmulator(functions, "localhost", 5001)
}
