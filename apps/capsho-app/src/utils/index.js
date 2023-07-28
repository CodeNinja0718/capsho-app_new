import { unref } from 'vue'
import * as sanitizeHtml from 'sanitize-html'

export function htmlSanitizer (str) {
  return sanitizeHtml(str, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['font', 'strike']),
    allowedAttributes: {
      div: ['style', 'class', 'contenteditable'],
      font: ['size'],
      p: ['style', 'class', 'contenteditable'],
      span: ['id', 'class', 'style', 'contenteditable', 'hidden']
    }
  })
}

export function removeAllHtml (str) {
  const clean = sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {}
  })
  return clean.trim()
}

export function htmlSanitizerForDisplay (str, removeAll = false) {
  if (str.length) {
    str.replace(/<br>/gm, '\n')
    return sanitizeHtml(str, {
      allowedTags: removeAll ? [] : ['br', 'div'],
      allowedAttributes: {
        div: ['style', 'class']
      }
    })
  }
}

// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte
export function toBinary (string) {
  const codeUnits = new Uint16Array(string.length)
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i)
  }
  const charCodes = new Uint8Array(codeUnits.buffer)
  let result = ''
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i])
  }
  return result
}

export function toBase64 (string) {
  return Buffer.from(toBinary(string), 'binary').toString('base64')
}

export function downloadText (text, filename) {
  const FileSaver = require('file-saver')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, filename)
}

function unRefIfProxy (item) {
  return unref(item)
}

export function downloadZipFolder (episodeContent, text) {
  const content = {
    transcript: text
  }
  for (let [key, value] of Object.entries(episodeContent)) {
    value = unRefIfProxy(value)
    if (key === 'captions' && value.length >= 1) {
      content[key] = value.reduce((acc, caption, index) => {
        acc += `[${index + 1}]\n\n${caption.replace(/<br>/gm, '')}\n\n`
        return acc
      }, '')
    } else if (key === 'email') {
      content[key] = `${value.subjectLine.toString().replace(/<br>/gm, '\n')}\n\n${value.body.toString().replace(/<br>/gm, '\n')}`
    } else {
      if (!['createdAt', 'transcriptRef', 'id', 'title', 'drafts', 'displayDate'].includes(key)) {
        content[key] = value.toString().replace(/<br>/gm, '\n')
      }
    }
  }
  const FileSaver = require('file-saver')
  const JSZip = require('jszip')
  const zip = new JSZip()
  const folder = zip.folder('content')
  Object.entries(content).forEach((entry) => {
    folder.file(`${entry[0]}.txt`, entry[1])
  })
  folder.generateAsync({ type: 'blob' })
    .then(function (blob) {
      FileSaver.saveAs(blob, episodeContent.title)
    })
}
