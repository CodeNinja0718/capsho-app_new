import { RequiredParameterError } from './errors'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function assertParam(data: any, param: string) {
  if (!Object.keys(data).includes(param)) {
    throw new RequiredParameterError(param)
  } else {
    return data[param]
  }
}
