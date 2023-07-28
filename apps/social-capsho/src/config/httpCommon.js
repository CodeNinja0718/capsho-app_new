import axios from 'axios'
import { ASSEMBLY_API_KEY } from './appConstants'
// https://us-central1-capsho-abdf4.cloudfunctions.net/transcription-submitFileForTranscription
export const assembly = axios.create({
  baseURL: 'https://api.assemblyai.com/v2',
  headers: {
    authorization: ASSEMBLY_API_KEY,
    'content-type': 'application/json',
    'transfer-encoding': 'chunked'
  },
});
