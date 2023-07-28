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
        // redirect: () => ({ name: 'PodcastFolders' })
      },
      {
        path: 'episode-drafts/host',
        name: 'OutputEpisodeDrafts',
        component: () => import(/* webpackChunkName: "OutputEpisodeDrafts" */ './pages/HostEpisodeDrafts.vue')
      },
      {
        path: 'episode-drafts/guest',
        name: 'GuestEpisodeDrafts',
        component: () => import(/* webpackChunkName: "PodcastGuestEpisodeDrafts" */ './pages/GuestEpisodeDrafts.vue')
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
      },
      {
        path: 'share/blog-post/:uId/:templateId',
        name: 'BlogPostSharing',
        redirect: (to) => ({ name: 'AuthSignUp', query: { referelUserId: to.params.uId, templateId: to.params.templateId, affiliateLink: to.query.affiliateLink } })
      }
    ]
  }
]

export default podcastRoutes
