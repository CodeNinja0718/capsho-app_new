// if prop exists
export const isPropExists = (obj: object, key: string) => Object.prototype.hasOwnProperty.call(obj, key)
