/* eslint-disable */
import 'pinia'
import type {Unsubscribe} from '@firebase/firestore'
import { IPodcastEpisodeDraftsHostBlogPostTemplate } from 'src/models/podcast/episode-drafts/host/blogPost.interface';

declare module 'pinia' {
  export interface PodcastEpisodeDraftsHostBlogPostProperties<> {
    $cloudFunctions: any;
    $fbServices: any;
    $router: any;
    $guestCloudFunctions: any;
    newTemplate: IPodcastEpisodeDraftsHostBlogPostTemplate;
    templates: Array<IPodcastEpisodeDraftsHostBlogPostTemplate>;
    unsubUsersDataListener: Unsubscribe;
  }
}
