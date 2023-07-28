export interface CreativeAsset {
  isImage: boolean
  isUploaded?: boolean
  name?: string
  placeholder?: boolean
  src: string|null|undefined
  type?: string
  url?: string
}

export interface CreativeAssetFile extends File {
  isImage: boolean
}

export interface CreativeAssetUploaded {
  isUploaded?: boolean
  name: string
  uploadedDate: string|number
  url: string
}

export interface AudioFile {
  file: File | undefined
  id: string
  readonly name: string
}

export interface DropboxFile extends AudioFile {
  _id: string;
  extension: string;
  link: string;
  size: number;
  title: string;
}

export interface GoogleDriveFile extends AudioFile {
  _id: string;
  bytes: string;
  extension: string;
  id: string;
  link: string;
  mimeType: string;
  name: string;
  size: number;
  title: string;
}

export class UploadableFile implements AudioFile {
  file: File | undefined
  id: string
  readonly name: string

  constructor (file: File) {
    this.file = file
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type.split('/')[1]}`
    this.name = file.name
  }
}

export interface ImageFile {
  file: File | undefined
  id: string
  readonly name: string
  readonly url: string
}

export class UploadableImage implements ImageFile {
  file: File | undefined
  id: string
  readonly name: string
  readonly url: string

  constructor (file: File) {
    this.file = file
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type.split('/')[1]}`
    this.name = file.name
    this.url = URL.createObjectURL(file)
  }
}
