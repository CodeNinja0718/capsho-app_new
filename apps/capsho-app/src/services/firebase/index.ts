import * as base from './base'
import * as auth from './auth'
import * as db from './db'
import * as transcription from './transcription.js'
import * as storage from './storageService'
import * as userAuth from './userAuth'
import * as usersData from './usersData'
import * as folderService from './folderService'
/*
  Assign the base service to the firebaseServices namespace in the
  serviceConnection boot file. Over time other service modules separate by
  logic/concerns will be added here. Be aware of name conflicts between
  your modules.
*/
export default Object.assign({}, base, db, auth, transcription, storage, userAuth, usersData, folderService)
