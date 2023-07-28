import { Logtail } from '@logtail/browser'
import { CONSTANTS } from 'src/config'

const sourceToken = CONSTANTS.APP.LOGTAIL_TOKEN
export const logtail = sourceToken !== '' ? new Logtail(sourceToken) : null
