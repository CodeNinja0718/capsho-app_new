import PodcastModule from './PodcastModule'

const PodcastsPage = () => import('./pages/Podcasts')
const PodcastDetail = () => import('./components/PodcastDetail')

const PodcastRoutes = [
	{
		path: '/podcast',
		name: 'PodcastModule',
		component: PodcastModule,
		meta: { hideFooter: true },
		children: [
			{
				path: '',
				name: 'Podcasts',
				component: PodcastsPage,
				meta: {
					title: 'Podcasts Page'
				}
			},
			{
				path: ':id',
				name: 'PodcastDetail',
				component: PodcastDetail,
				meta: {
					title: 'Podcast Detail'
				}
			},
		]
	}
]

export default PodcastRoutes