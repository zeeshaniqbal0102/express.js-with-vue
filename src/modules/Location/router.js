import Index from './index.vue'
import Dashboard from './views/Dashboard.vue'
import Profile from './views/Profile.vue'
import List from './components/List.vue'
import Create from './components/Create.vue'

export default [
  {
    path: '/location',
    name: 'location',
    component: Index,
    title: 'Location',
    redirect: { name: 'location-dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'location-dashboard',
        component: Dashboard,
      },
      {
        path: ':id/profile',
        name: 'location-profile',
        component: Profile,
        props: true,
      },
      {
        path: 'list',
        name: 'location-list',
        component: List,
      },
      {
        path: 'create',
        name: 'location-create',
        component: Create,
      },
    ],
  },
]
