import { getDoc, doc } from 'firebase/firestore'
import { firestore } from './db'

export async function getArticleTemplate(templateId: string) {
  try {
    const articleRef = doc(firestore(), `article_templates/${templateId}`)
    const articleTemplate = await getDoc(articleRef)
    if (articleTemplate.exists()) {
      return articleTemplate.data()
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
  }
}
