import { isPropExists } from './template-helpers'

const templates = {
  rebelN1: [],
  rebelN2: [],
  boxerN1: [],
  boxerN2: [],
  boxerN3: [],
  boxerN4: [],
  boxerN5: [],
  boxerN6: [],
  marvel: [],
  jawDropper: [],
  hook: [],
  logLine1: []
}

describe('[>>> isPropExists]', () => {
  test('returns true', () => {
    expect(isPropExists(templates, 'marvel')).toBe(true)
  })
  test('returns false', () => {
    expect(isPropExists(templates, 'boxerN13')).toBe(false)
  })
})
