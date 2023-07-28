import { RouteRecordRaw } from 'vue-router'

const podcastRoutes: RouteRecordRaw[] = [
  {
    path: '/podcast/',
    name: 'PodcastModule',
    component: () => import(/* webpackChunkName: "PodcastModule" */ './PodcastModule.vue'),
    meta: {
      requiresAuth: true,
      showBanner: true
    },
    children: [
      {
        path: 'upload',
        name: 'UploadPodcast',
        component: () => import(/* webpackChunkName: "UploadPodcast" */ './pages/CreateEpisode.vue')
      },
      {
        path: 'episode-drafts',
        name: 'OutputEpisodeDrafts',
        component: () => import(/* webpackChunkName: "OutputEpisodeDrafts" */ './pages/OutputEpisodeDrafts.vue')
      },
      {
        path: 'episodes/:id?',
        name: 'PodcastEpisodes',
        component: () => import(/* webpackChunkName: "PodcastEpisodes" */ './pages/FolderEpisodes.vue')
      },
      {
        path: 'folders',
        name: 'PodcastFolders',
        component: () => import(/* webpackChunkName: "PodcastEpisodes" */ './pages/FoldersList.vue')
      }
    ]
  }
]

export default podcastRoutes
