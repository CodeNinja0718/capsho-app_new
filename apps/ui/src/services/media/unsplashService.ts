import { Random } from 'unsplash-js/src/methods/photos/types'
import { createApi } from 'unsplash-js'

const UNSPLASH_ACCESS_KEY = process.env.VUE_APP_UNSPLASH_ACCESS_KEY || ''

const unsplash = createApi({
  accessKey: UNSPLASH_ACCESS_KEY
})

/**
 * fetch {count} of images with episodeCategory
 * @param episodeCategory string | undefine, default ''
 * @param count number | undefine, default 10
 * @returns success: Random[], reject: null
 */
export function getPhotosFromUnsplash(episodeCategory?: string, count?: number) {
  return new Promise<Random[]>((resolve, reject) => {
    unsplash.photos.getRandom({
      count: count ?? 10,
      query: episodeCategory ?? ''
    }).then((result1) => {
      if (result1.errors) {
        unsplash.photos.getRandom({
          count: count ?? 10
        }).then((result2) => {
          if (result2.errors) {
            reject()
          } else {
            resolve(result2.response as Random[])
          }
        })
      } else {
        resolve(result1.response as Random[])
      }
    })
  })
}
