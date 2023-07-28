import { slackFrontendErrors } from 'boot/axios'
import axios, { AxiosError } from 'axios'

export class AppErrorService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static onError(error: Error | AxiosError | any) {
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: error.message
        }
      }
    ]
    if (axios.isAxiosError(error)) {
      if (error.response) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: String(error.response.status)
          }
        })
      }
    }
    Promise.resolve(slackFrontendErrors({
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      data: { blocks }
    }))
  }

  static initHandler() {
    window.onerror = (message, url, lineNo, columnNo, error) => {
      if (error) {
        this.onError(error)
        console.log(message, url, lineNo, columnNo, error)
      }
    }
  }
}
