import Index from './index.vue'
import Invite from './components/Invite.vue'
import List from './components/List.vue'
import Edit from './components/Edit.vue'
import Main from './views/Main.vue'

export default [
  {
    path: 'user',
    name: 'user',
    component: Index,
    title: 'user',
    redirect: { name: 'user-main' },
    children: [
      {
        path: 'invite',
        name: 'user-invite',
        component: Invite,
      },
      {
        path: 'list',
        name: 'user-list',
        component: List,
      },
      {
        path: ':id/edit',
        name: 'user-edit',
        component: Edit,
      },
      {
        path: 'main',
        name: 'user-main',
        component: Main,
      },
    ],
  },
]
