export class UniqueConstraintError extends Error {
  constructor(value: string) {
    super(`${value} must be unique.`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UniqueConstraintError)
    }
  }
}

export class InvalidPropertyError extends Error {
  constructor(msg: string) {
    super(msg)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError)
    }
  }
}

export class RequiredParameterError extends Error {
  constructor(param: string) {
    super(`${param} can not be null or undefined.`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParameterError)
    }
  }
}
