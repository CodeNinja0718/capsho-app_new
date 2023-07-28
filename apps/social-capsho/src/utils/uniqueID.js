let UUID = 1

export default function UniqueID () {
  return Object.freeze({
    getID: () => {
      UUID++
      return UUID
    }
  })
}
