import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/dbConfig'

export async function getEmailTemplates () {
  const emailTemplatesRef = doc(db, 'templates', 'email')
  const emailTemplatesSnap = await getDoc(emailTemplatesRef)
  if (emailTemplatesSnap.exists()) {
    return emailTemplatesSnap.data()
  } else {
    return []
  }
}

export async function getTemplateByType({ template, type }) {
  const templateRef = doc(db, 'templates', type + "_" + template)
  const templatesSnap = await getDoc(templateRef)
  if (templatesSnap.exists()) {
    return templatesSnap.data()
  } else {
    return null
  }
}

export const templatesServiceThreeBackUp = [
  {
    creative: 'reel (about me)',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20About%20Me%20(Service).png?alt=media&token=30042f77-3ff2-4441-93c2-2d91c1ff6a1a',
    text: '',
    tool: '',
    type: 'prehero'
  },
  {
    creative: 'IGTV (how-to)',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FVideo%20%2B%20IGTV%20cover.png?alt=media&token=0ee3e583-350f-4f73-b6aa-a927349b3581',
    text: '',
    tool: 'how_to',
    type: 'howto'
  },
  {
    creative: 'quote',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FQuote.png?alt=media&token=5e8b339c-c81c-45e0-8e70-cd6cd6983cbc',
    text: '',
    tool: 'engage',
    type: 'engage'
  },
  {
    creative: 'reel (how-to)',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20How-to%20(Service).png?alt=media&token=99831099-ff90-4d2e-9809-24618f1385de',
    text: '',
    tool: 'how_to',
    type: 'howto'
  },
  {
    creative: 'lifestyle shot with you',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FLifestyle%20shot%20with%20you.png?alt=media&token=472dd9f2-ad24-4583-be4c-4db3582d5ac0',
    text: '',
    tool: 'promised-land',
    type: 'prehero'
  },
  {
    creative: 'carousel (steps of a how-to)',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FCarousel%20(steps%20of%20a%20how-to).png?alt=media&token=aa9d40d5-dce9-4784-a4c1-5a619d0aedeb',
    text: '',
    tool: 'how_to',
    type: 'howto'
  },
  {
    creative: 'reel (about me)',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20About%20Me%20(Service).png?alt=media&token=30042f77-3ff2-4441-93c2-2d91c1ff6a1a',
    text: '',
    tool: 'about_me',
    type: 'aboutme'
  },
  {
    creative: 'IGTV (how-to)',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FVideo%20%2B%20IGTV%20cover%20(2).png?alt=media&token=e23b91ec-376f-4752-9513-72462d75b198',
    text: '',
    tool: 'product_spotlight',
    type: 'product'
  },
  {
    creative: 'reel (how-to)',
    image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20How-to%20(Service).png?alt=media&token=99831099-ff90-4d2e-9809-24618f1385de',
    text: '',
    tool: '',
    type: 'guide'
  }
]

export const updatedServiceThreeTemplated = {
  outputs: [
    {
      creative: 'carousel (product)',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FCarousel%20(product).png?alt=media&token=1a8a4d20-5ac4-4518-9836-d43b8a9d0de2',
      text: '',
      tool: 'product_spotlight',
      type: 'product'
    },
    {
      creative: 'reel (how-to)',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20How-to%20(Service).png?alt=media&token=99831099-ff90-4d2e-9809-24618f1385de',
      text: '',
      tool: 'how_to',
      type: 'howto'
    },
    {
      creative: 'quote',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FQuote.png?alt=media&token=5e8b339c-c81c-45e0-8e70-cd6cd6983cbc',
      text: '',
      tool: 'engage',
      type: 'engage'
    },
    {
      creative: 'reel (honey-trap)',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20Service.png?alt=media&token=bcbcabac-4f33-4092-9383-fb8358287e35',
      text: '',
      tool: '',
      type: 'honeytrap'
    },
    {
      creative: 'carousel (steps of a how-to)',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FCarousel%20(steps%20of%20a%20how-to).png?alt=media&token=aa9d40d5-dce9-4784-a4c1-5a619d0aedeb',
      text: '',
      tool: 'how_to',
      type: 'howto'
    },
    {
      creative: 'lifestyle shot with you',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FLifestyle%20shot%20with%20you.png?alt=media&token=472dd9f2-ad24-4583-be4c-4db3582d5ac0',
      text: '',
      tool: 'promised_land',
      type: 'prehero'
    },
    {
      creative: 'reel (how-to)',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20How-to%20(Service).png?alt=media&token=99831099-ff90-4d2e-9809-24618f1385de',
      tool: 'how_to',
      text: '',
      type: 'howto'
    },
    {
      creative: 'reel (photo of me)',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FPhoto%20of%20me.png?alt=media&token=c18b7fed-09da-45c8-82fb-369729abad0c',
      text: '',
      tool: 'about_me',
      type: 'about'
    },
    {
      creative: 'reel (honey-trap)',
      image: 'https://firebasestorage.googleapis.com/v0/b/capsho-abdf4.appspot.com/o/template_service%2FIG%20Reel%20Service.png?alt=media&token=bcbcabac-4f33-4092-9383-fb8358287e35',
      text: '',
      tool: '',
      type: 'honeytrap'
    }
  ]
}
