import convertHtmlToPdf from 'src/helpers/convert-html-to-pdf'
import { computed } from 'vue'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { htmlSanitizer, removeAllHtml } from 'src/utils'
import { HeadingLevel, Paragraph, TextRun } from 'docx'
import downloadDocx from 'src/helpers/downloader-docx'

export function downloadPDFBlogPostTemplate() {
  const data = getBlogPostSource()
  const normalTemplate = normalizeBlogPostBeforeDownload(data.source.blogTitle.value, data.source.blogPost.value)
  convertHtmlToPdf(normalTemplate, 'blog-post.pdf')
}

export function getPDFBlogPostTemplate() {
  const data = getBlogPostSource()
  const normalTemplate = normalizeBlogPostBeforeDownload(data.source.blogTitle.value, data.source.blogPost.value)
  return normalTemplate
}

export function downloadDocxBlogPostTemplate() {
  const data = getBlogPostSource()
  const normalData = normalizeDocxBlogPost(data.source.blogTitle.value, data.source.blogPost.value)
  downloadDocx({
    data: normalData,
    heading: 'Blog Post',
    fileName: 'blog-post.docx',
    mainTitleItalics: true
  })
}

export function normalizeDocxBlogPost(title: string | null, template: string) {
  const normalData = []
  if (title) {
    normalData.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_5
      })
    )
  }
  template
    .replace(/<\/div>/gm, '</div>\n')
    .replace(/<\/p>/gm, '</p>\n')
    .split(/\n/)
    .filter((val: string) => ![''].includes(val))
    .forEach((item: string) => {
      normalData.push(
        new Paragraph({
          style: 'basic',
          children: [
            new TextRun(
              {
                text: removeAllHtml(item.trim()),
                bold: item.includes('<b>')
              }
            )
          ]
        })
      )
    })
  return normalData
}

export function getBlogPostSource() {
  const store = useUploadPodcastStore()
  const blogPost = computed(() => {
    if (store.selectedEpisode.blogPostTemplate) {
      return htmlSanitizer(store.selectedEpisode.blogPostTemplate)
    }
    return htmlSanitizer(store.blogTemplate)
  })
  const blogTitle = computed(() => {
    return store.blogPost?.blogTitle ?? null
  })
  return {
    source: {
      blogPost,
      blogTitle
    }
  }
}

export function normalizeBlogPostBeforeDownload(title: string | null, template: string) {
  let normalTemplate = template
    .replace(/<b>/gm, '<div><b>')
    .replace(/<\/b>/gm, '</b></div><br>')
  normalTemplate = `<div id="blog" style="color: black;">${normalTemplate}</div>`
  return `${normalTemplate}`
}
