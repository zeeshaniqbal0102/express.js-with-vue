import Index from './index.vue'
import List from './components/List.vue'
import Create from './components/Create.vue'
import Edit from './components/Edit.vue'
import ProfileView from './views/Profile.vue'

export default [
  {
    path: '/contact',
    name: 'contact',
    component: Index,
    title: 'Contact',
    redirect: { name: 'contact-list' },
    children: [
      {
        path: 'create',
        name: 'contact-create',
        component: Create,
      },
      {
        path: 'list',
        name: 'contact-list',
        component: List,
      },
      {
        path: ':id/edit',
        name: 'contact-edit',
        component: Edit,
      },
      {
        path: ':id/profile',
        name: 'contact-profile-view',
        component: ProfileView,
        props: true,
      },
    ],
  },
]
