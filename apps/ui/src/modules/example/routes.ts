import { RouteRecordRaw } from 'vue-router'

const exampleRoutes: RouteRecordRaw[] = [
  {
    path: '/example/',
    name: 'ExampleModule',
    component: () => import('./ExampleModule.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'ExamplePage',
        component: () => import('./pages/ExamplePage.vue')
      }
    ]
  }
]

export default exampleRoutes
