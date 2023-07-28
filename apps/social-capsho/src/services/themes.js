import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/dbConfig'

export async function getThemes () {
  const themes = []
  await getDocs(collection(db, 'themes'))
    .then((querySnapshot) => {
      querySnapshot.forEach((theme) => {
        let newName = theme.id.replaceAll("_", " & ")
        themes.push({
          name: newName,
          img: theme.data().img,
          id: theme.id
        })
      })
    })
  return themes
}
