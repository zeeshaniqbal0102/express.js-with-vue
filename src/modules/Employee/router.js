import Index from './index.vue'
import Create from './components/Create.vue'
import List from './components/List.vue'
import Edit from './components/Edit.vue'
import RolesRoutes from './modules/Roles/router'

let routes = [
  {
    path: 'create',
    name: 'employee-create',
    component: Create,
  },
  {
    path: 'list',
    name: 'employee-list',
    component: List,
  },
  {
    path: ':id/edit',
    name: 'employee-edit',
    component: Edit,
  },
]
routes = routes.concat(RolesRoutes)
export default [
  {
    path: 'employee',
    name: 'employee',
    component: Index,
    title: 'employee',
    redirect: { name: 'employee-list' },
    children: routes,
  },
]
