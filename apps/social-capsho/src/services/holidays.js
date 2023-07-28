import {collection, getDocs, query, orderBy, doc, getDoc} from 'firebase/firestore'
import { db } from '../config/dbConfig'

export async function getHolidays () {
  const holidaysRef = collection(db, 'holidays')
  const q = query(holidaysRef, orderBy('order'))
  const querySnapshot = await getDocs(q)
  const holidays = []
  querySnapshot.forEach((doc) => {
    let docData = doc.data()
    let temp = []
    docData.days.forEach((item) => {
      const { day, date } = item
      let obj = {
        name: day,
        date: date,
        month: docData.month,
        color: 'white',
        text: 'primaryDark',
        isEnabled: false
      }
      temp.push(obj)
    })
    holidays.push({
      name: docData.month,
      days: temp
    })
  })
  return holidays
}

export async function getHolidayByDocId(id) {
  const holidayRef = doc(db, 'holidays', id)
  const holidaySnap = await getDoc(holidayRef)
  if (holidaySnap.exists()) {
    return holidaySnap.data()
  }
  return {}
}
