import appConstants from '../../../config/appConstants'

const deepgramKey = appConstants.DEEPGRAM_API_KEY

async function deepgram(url) {
  const response = await fetch(
    'https://api.deepgram.com/v1/listen?punctuate=true&diarize=true&utterances=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${deepgramKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url
      })
    }
  )
  const json = await response.json()
  return json.results
}

export default deepgram
