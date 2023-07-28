import sanitizeHtml from 'sanitize-html'
const {encode} = require('gpt-3-encoder')

/**
 * Returns an array of token ids
 * @param {String} text
 * @return {Number[]}
 */
export function encodeText (text) {
  return encode(text);
}

export function htmlSanitizer (str) {
  return sanitizeHtml(str, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'font' ]),
    allowedAttributes: {
      a: [ 'href', 'name', 'target' ],
      font: [ 'face' ],
      img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
    }
  })
}

export function evaluateBreakLines(text) {
  if (text.match(/<br \/>/g)) {
    text = text.split('<br />')
  }
  if (text.match(/<br \/><br \/>/gm)) {
    text = text.split('<br /><br />')
  }
  if (text.match(/\\n\\n/gm)) {
    text = text.split('\\n\\n')
  }
  return Array.isArray(text) ? text.join(' ') : text
}

export function backticksTemplate(str) {
  str = str.replaceAll(/\\n\\n/gm, '<br><br>')
  return sanitizeHtml(str.replaceAll(/\\n/gm, '<br>'))
}

export function evaluateExpressions({ str, questions, emotions }) {
  const qRegex = /\${?Q\[\d+]}/gm
  const eRegex = /\${?E\[\d+]}/gm
  const digitsRegex = /\d+/
  const answerExpressionPositions = [...str.matchAll(qRegex)]
  const emotionExpressionPositions = [...str.matchAll(eRegex)]

  answerExpressionPositions.forEach((expression) => {
    const answerPosition = expression[0].match(digitsRegex)
    str = str.replace(expression[0], questions[Number(answerPosition[0])])
  })
  emotionExpressionPositions.forEach((expression) => {
    // get emotion position
    const emotionPosition = expression[0].match(digitsRegex)
    // get emotion's name from question reference
    const emotionName = questions[Number(emotionPosition[0])]
    // find emotion
    const emotion = emotions.find((emotion) => emotion.name === emotionName)
    // get random option from emotion
    const rand = Math.floor(Math.random() * emotion.options.length)
    // replace the reference
    str = str.replace(expression[0], emotion.options[rand])
  })
  return str
}
