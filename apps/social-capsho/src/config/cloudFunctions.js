import axios from 'axios'
import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions();
export const addNumbers = httpsCallable(functions, 'addNumbers');
export const getTopic = httpsCallable(functions, 'contentGeneration-getTopic');
export const getKeywords = httpsCallable(functions, 'contentGeneration-getKeywordsForTopic');
export const extractKeywords = httpsCallable(functions, 'contentGeneration-extractKeywords');
export const generateCuriosityHook = httpsCallable(functions, 'contentGeneration-generateCuriosityHook');
export const generateTitle = httpsCallable(functions, 'contentGeneration-generateTitle');
export const generateStory = httpsCallable(functions, 'contentGeneration-generateStory');
export const generateFindings = httpsCallable(functions, 'contentGeneration-generateFindings');
export const extractGuestName = httpsCallable(functions, 'contentGeneration-extractGuestName');
export const generateGuestBio = httpsCallable(functions, 'contentGeneration-generateGuestBio');
export const generateQuote = httpsCallable(functions, 'contentGeneration-generateQuote');

export const cloudFunctions = axios.create({
  baseURL: 'https://us-central1-capsho-abdf4.cloudfunctions.net'
})
