import type { ImageFile } from './uploadableFile'

export interface Folder {
  businessName: string;
  comments: string;
  email: string;
  facebookLink: string;
  folderFile: ImageFile;
  folderFileUrl: string;
  hostName: string;
  id: string;
  instagramLink: string;
  linkedinLink: string;
  order: number;
  placeHolderImg?: boolean;
  podcastLink: string;
  podcastName: string;
  twitterLink: string;
  websiteLink: string;
  youtubeLink: string;
}
