import axios, { AxiosResponse } from 'axios'

const PIXABAY_API_KEY = process.env.VUE_APP_PIXABAY_API_KEY

const pixabayUrl = 'https://pixabay.com/api'

export interface IVideoFromPixabay {
  id: number; // 125,
  pageURL: string; // https://pixabay.com/videos/id-125/,
  type: string; // film,
  tags: string; // flowers, yellow, blossom,
  duration: number; // 12,
  picture_id: string; // 529927645,
  videos: {
  large: {
    url: string; // https://player.vimeo.com/external/135736646.hd.mp4?s=ed02d71c92dd0df7d1110045e6eb65a6&profile_id=119,
    width: number; // 1920,
    height: number; // 1080,
    size: number; // 6615235
  },
  medium: {
    url: string; // https://player.vimeo.com/external/135736646.hd.mp4?s=ed02d71c92dd0df7d1110045e6eb65a6&profile_id=174,
    width: number; // 1280,
    height: number; // 720,
    size: number; // 3562083
  },
  small: {
    url: string; // https://player.vimeo.com/external/135736646.sd.mp4?s=db2924c48ef91f17fc05da74603d5f89&profile_id=165,
    width: number; // 950,
    height: number; // 540,
    size: number; // 2030736
  },
  tiny: {
    url: string; // https://player.vimeo.com/external/135736646.sd.mp4?s=db2924c48ef91f17fc05da74603d5f89&profile_id=164,
    width: number; // 640,
    height: number; // 360,
    size: number; // 1030736
  }
  },
  views: number; // 169,
  downloads: number; // 66,
  likes: number; // 3,
  comments: number; // 2,
  user_id: number; // 1281706,
  user: string; // CoverrFreeFootage,
  userImageURL: string; // "https://cdn.pixabay.com/user/2015/10/16/09-28-45-303_250x250.png"
}

export function getVideosFromPixabay(episodeCategory?: string, videoType?: 'all' | 'film' | 'animation', page?: number) {
  return new Promise<IVideoFromPixabay[]>((resolve, reject) => {
    axios.get(`${pixabayUrl}/videos/?key=${PIXABAY_API_KEY}&category=${episodeCategory || ''}&video_type=${videoType || 'all'}`).then(
      (res: AxiosResponse<{total: number; totalHits: number; hits: IVideoFromPixabay[] }>) => {
        resolve(res.data.hits.splice(((page || 1) - 1) * 10, 10))
      }
    ).catch(() => {
      reject()
    })
  })
}

export interface IPhotoFromPixabay {
  id: number; // 195893,
  pageURL: string; // https://pixabay.com/en/blossom-bloom-flower-195893/,
  type: string; // photo,
  tags: string; // blossom, bloom, flower,
  previewURL: string; // https://cdn.pixabay.com/photo/2013/10/15/09/12/flower-195893_150.jpg
  previewWidth: number; // 150,
  previewHeight: number; // 84,
  webformatURL: string; // https://pixabay.com/get/35bbf209e13e39d2_640.jpg,
  webformatWidth: number; // 640,
  webformatHeight: number; // 360,
  largeImageURL: string; // https://pixabay.com/get/ed6a99fd0a76647_1280.jpg,
  fullHDURL: string; // https://pixabay.com/get/ed6a9369fd0a76647_1920.jpg,
  imageURL: string; // https://pixabay.com/get/ed6a9364a9fd0a76647.jpg,
  imageWidth: number; // 4000,
  imageHeight: number; // 2250,
  imageSize: number; // 4731420,
  views: number; // 7671,
  downloads: number; // 6439,
  likes: number; // 5,
  comments: number; // 2,
  user_id: number; // 48777,
  user: string; // Josch13,
  userImageURL: string; // "https://cdn.pixabay.com/user/2013/11/05/02-10-23-764_250x250.jpg"
}

export function getPhotosFromPixabay(episodeCategory?: string, imageType?: 'all' | 'photo' | 'illustration' | 'vector', page?: number) {
  return new Promise<IPhotoFromPixabay[]>((resolve, reject) => {
    axios.get(`${pixabayUrl}/?key=${PIXABAY_API_KEY}&category=${episodeCategory || ''}&image_type=${imageType || 'all'}&page=${page || 1}&per_page=10`).then(
      (res: AxiosResponse<{total: number; totalHits: number; hits: IPhotoFromPixabay[] }>) => {
        resolve(res.data.hits)
      }
    ).catch(() => {
      reject()
    })
  })
}
