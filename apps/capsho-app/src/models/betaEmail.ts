export class BetaEmailList {
  readonly emails: string[]
  constructor (emails: string[]) {
    this.emails = emails
  }

  isBetaEmail (email: string) {
    return this.emails.includes(email)
  }
}
