import { HeadingLevel, Paragraph, TextRun } from 'docx'
import { removeAllHtml } from 'src/utils'

export interface INormalCaption {
  [key: string]: string[] | string;
  educationalDocx: string;
  educationalPdf: string;
  engagementDocx: string;
  engagementPdf: string;
  promotionDocx: string;
  promotionPdf: string;
}

export default function normalizeDocxCaptions(captions: INormalCaption, isPro = false) {
  const result = []
  if (captions.engagementDocx) {
    result.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Engagement'
          })
        ],
        heading: HeadingLevel.HEADING_5
      })
    )
    for (const [index, caption] of captions.engagementDocx.split(/<\/div>/).entries()) {
      if (caption) {
        const normalOrder = index + 1
        const normalCaption = normalizeValue({
          order: String(normalOrder),
          value: caption
        })
        result.push(
          new Paragraph({
            style: 'basic',
            children: [
              ...normalCaption
            ]
          })
        )
      }
    }
  }
  if (captions.promotionDocx) {
    result.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Promotion'
          })
        ],
        heading: HeadingLevel.HEADING_5
      })
    )
    for (const [index, caption] of captions.promotionDocx.split(/<\/div>/).entries()) {
      if (caption) {
        const normalOrder = index + 1
        const normalCaption = normalizeValue({
          order: String(normalOrder),
          value: caption
        })
        result.push(
          new Paragraph({
            style: 'basic',
            children: [
              ...normalCaption
            ]
          })
        )
      }
    }
  }
  if (isPro && captions.educationalDocx) {
    result.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Educational'
          })
        ],
        heading: HeadingLevel.HEADING_5
      })
    )
    for (const [index, caption] of captions.educationalDocx.split(/<\/div>/).entries()) {
      if (caption) {
        const normalOrder = index + 1
        const normalCaption = normalizeValue({
          order: String(normalOrder),
          value: caption
        })
        result.push(
          new Paragraph({
            style: 'basic',
            children: [
              ...normalCaption
            ]
          })
        )
      }
    }
  }
  return result

  function normalizeValue(
    {
      order,
      value
    }: {
      order: string;
      value: string;
    }
  ) {
    const result = [
      new TextRun({
        bold: true,
        font: 'Poppins',
        size: 26,
        text: order + '.'
      })
    ]
    value
      .replace(/<br>/gm, '\n')
      .replace(/<br \/>/gm, '\n')
      .split(/\n/)
      .filter((val: string) => ![''].includes(val))
      .forEach((item: string) => {
        result.push(
          new TextRun({
            bold: item.includes('<b>'),
            break: 2,
            text: removeAllHtml(item.trim())
          })
        )
      })

    return result
  }
}
