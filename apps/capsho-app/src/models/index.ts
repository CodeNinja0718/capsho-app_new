export interface Template {
  [key: string]: {
    [key: string]: Array<() => string>
  },
}
