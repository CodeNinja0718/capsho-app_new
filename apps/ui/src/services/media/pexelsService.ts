import { createClient } from 'pexels'
import type { ErrorResponse, PhotosWithTotalResults, Photo, Video, Videos } from 'pexels'

const PEXELS_ACCESS_KEY = process.env.VUE_APP_PEXELS_API_KEY || ''

const client = createClient(PEXELS_ACCESS_KEY)

export function getPhotosFromPexels(episodeCategory?: string, count?: number, page?: number) {
  return new Promise<Photo[]>((resolve, reject) => {
    client.photos.search({
      query: episodeCategory ?? '',
      per_page: count ?? 10,
      page: page ?? 1
    }).then((photos) => {
      if ((photos as ErrorResponse).error) {
        reject()
      } else {
        resolve((photos as PhotosWithTotalResults).photos)
      }
    })
  })
}

export function getVideosFromPexels(episodeCategory?: string, count?: number, page?: number) {
  return new Promise<Video[]>((resolve, reject) => {
    client.videos.search({
      query: episodeCategory ?? '',
      per_page: count ?? 10,
      page: page ?? 1
    }).then((videos) => {
      if ((videos as ErrorResponse).error) {
        reject()
      } else {
        reject((videos as Videos).videos)
      }
    })
  })
}
