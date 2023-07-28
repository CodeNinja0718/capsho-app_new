import type { IPotentQuotables } from 'src/models/episode'
import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import upperFirst from 'src/helpers/upper-first-char'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { removeAllHtml } from 'src/utils'
import { Paragraph, TextRun } from 'docx'
import downloadDocx from 'src/helpers/downloader-docx'

export function downloadPDFPotentQuotables() {
  const data = getPotentQuotableSource()
  const normalQuotables = normalizePotentQuotablesBeforeDownload(data.source.value)
  convertHtmlToPdf(normalQuotables, 'potent-quotables.pdf')
}

export function getPDFPotentQuotables() {
  const data = getPotentQuotableSource()
  const normalQuotables = normalizePotentQuotablesBeforeDownload(data.source.value)
  return normalQuotables
}

export function downloadDocxPotentQuotables() {
  const data = getPotentQuotableSource()
  const normalData = normalizeDocxPotentQuotables(data.source.value)
  downloadDocx({
    data: normalData,
    heading: 'Potent Quotables',
    fileName: 'potent-quotables.docx',
    title: 'Potent Quotables',
    mainTitleItalics: true
  })
}

export function normalizeDocxPotentQuotables(quotables: IPotentQuotables) {
  const normalData = []
  for (const [key, value] of Object.entries(quotables)) {
    if (key && value) {
      const normalKey = key === 'sales' ? 'Promotional' : upperFirst(key)
      const normalValue = normalizeValue(value)
      normalData.push(
        new Paragraph({
          style: 'basic',
          children: [
            new TextRun({
              text: normalKey,
              bold: true
            })
          ]
        }),
        ...normalValue
      )
    }
  }
  function normalizeValue(value: string) {
    return value
      .replace(/<br>/gm, '\n')
      .replace(/<br \/>/gm, '\n')
      .split(/\n/)
      .filter((val: string) => ![''].includes(val))
      .map((item: string) => {
        return new Paragraph({
          style: 'basic',
          children: [
            new TextRun({
              text: removeAllHtml(item),
              bold: item.includes('<b>')
            })
          ]
        })
      })
  }
  return normalData
}

export function getPotentQuotableSource() {
  const store = useUploadPodcastStore()
  const quotables = computed(() => {
    if (store.selectedEpisode.potentQuotables) {
      return store.selectedEpisode.potentQuotables
    }
    return store.potentQuotables
  })
  return {
    source: quotables
  }
}

export function normalizePotentQuotablesBeforeDownload(data: IPotentQuotables) {
  let quotables = '<h4 id="quotables">Potent Quotables</h4>\n\n'
  for (const [key, value] of Object.entries(data)) {
    const normalKey = key === 'sales' ? 'Promotional' : upperFirst(key)
    quotables += `<b>${normalKey}</b><br><br>${value}<br>`
  }
  return quotables
}
