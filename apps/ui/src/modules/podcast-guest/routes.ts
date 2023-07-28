import { RouteRecordRaw } from 'vue-router'

const podcastGuestRoutes: RouteRecordRaw[] = [
  {
    path: '/podcast-guest/',
    name: 'PodcastGuestModule',
    component: () => import(/* webpackChunkName: "PodcastModule" */ './PodcastGuestModule.vue'),
    meta: {
      requiresAuth: true,
      showBanner: true
    },
    children: [
      {
        path: '',
        name: 'DefaultPodcastGuest',
        redirect: { name: 'PodcastGuestStages' }
      },
      {
        path: 'upload',
        name: 'UploadPodcastGuest',
        component: () => import(/* webpackChunkName: "PodcastGuestStages" */ './pages/CreateEpisode.vue')
      },
      {
        path: 'stages',
        name: 'PodcastGuestStages',
        component: () => import(/* webpackChunkName: "PodcastGuestStages" */ './pages/StagesList.vue')
      },
      {
        path: 'episode-drafts',
        name: 'PodcastGuestEpisodeDrafts',
        component: () => import(/* webpackChunkName: "PodcastGuestEpisodeDrafts" */ './pages/OutputEpisodeDrafts.vue')
      }
    ]
  }
]

export default podcastGuestRoutes
