import Index from './index.vue'
import Create from './components/Create.vue'
import List from './components/List.vue'
import Edit from './components/Edit.vue'

export default [
  {
    path: 'role',
    name: 'role',
    component: Index,
    title: 'Role',
    redirect: { name: 'employee-role-list' },
    children: [
      {
        path: 'create',
        name: 'employee-role-create',
        component: Create,
      },
      {
        path: 'list',
        name: 'employee-role-list',
        component: List,
      },
      {
        path: ':id/edit',
        name: 'employee-role-edit',
        component: Edit,
      },
    ],
  },
]
