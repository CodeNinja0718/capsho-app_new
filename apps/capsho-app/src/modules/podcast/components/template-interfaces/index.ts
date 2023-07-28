import type { RefreshInterface } from 'src/models/refreshModel'

export interface IFolderLinks {
  instagramLink?: string;
  facebookLink?: string;
  youtubeLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  websiteLink?: string;
  podcastLink?: string;
  comments?: string;
}

export interface IShowNotesContext {
  description: string;
  quoteB: string;
  story: string;
  guestName: string;
  guestBio: string;
  value: string;
  isGuest: boolean;
  folderLinks: IFolderLinks;
}

export interface IShowNotesNormalContext {
  description: string;
  quoteB: string;
  story: string;
  guestInfo: string;
  value: string;
  isGuest: boolean;
  ctaLink: string;
  folderLinks: string;
}

export interface IYoutubeContext {
  logLine1: RefreshInterface | string;
  value: string;
  isGuest: boolean;
  folderLinks: IFolderLinks;
}

export interface IYoutubeNormalContext {
  logLine1: string;
  value: string;
  isGuest: boolean;
  cta: string;
  folderLinks: string;
}
