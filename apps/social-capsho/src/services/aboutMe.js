import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/dbConfig'

export async function getAboutMe () {
  return await getDocs(collection(db, 'about_me'))
}


export async function getTones () {
  const tones = []
  await getDocs(collection(db, 'about_me'))
    .then((querySnapshot) => {
      querySnapshot.forEach((tone) => {
        let display = tone.id.replaceAll("_", " ")
        display = display[0].toUpperCase() + display.substring(1)
        tones.push({
          name: display,
          db: tone.id,
          isEnabled: false
        })
      })
    })
  return tones
}
