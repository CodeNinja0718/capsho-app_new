/* eslint-disable */
import 'pinia'
import type {Folder} from 'src/models/folders'
import type {ImageFile} from 'src/models/uploadableFile'
import type {Unsubscribe} from '@firebase/firestore'
export interface ISocialPrefix {
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  twitter: string;
  youtube: string;
}
declare module 'pinia' {
  export interface FolderStateProperties<> {
    $cloudFunctions: any;
    $fbServices: any;
    $router: any;
    businessName: string;
    comments: string;
    documents: Folder[];
    editFolder: boolean;
    email: string;
    facebookLink: string;
    folderFile: ImageFile;
    folderFileUrl: string;
    foldersListener: Unsubscribe;
    hostName: string;
    id: string;
    instagramLink: string;
    linkedinLink: string;
    order: number;
    podcastLink: string;
    podcastName: string;
    saving: boolean;
    selectedFolder: Folder;
    selectedFolderId: string;
    socialLinksPrefix: ISocialPrefix;
    twitterLink: string;
    websiteLink: string;
    youtubeLink: string;
  }
}
