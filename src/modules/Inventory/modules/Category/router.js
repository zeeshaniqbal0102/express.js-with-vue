import Index from './index.vue'
import Create from './components/Create.vue'
import List from './components/List.vue'
import Edit from './components/Edit.vue'

export default [
  {
    path: 'category',
    name: 'category',
    component: Index,
    title: 'Category',
    redirect: { name: 'category-list' },
    children: [
      {
        path: 'create',
        name: 'category-create',
        component: Create,
      },
      {
        path: 'list',
        name: 'category-list',
        component: List,
      },
      {
        path: 'edit',
        name: 'category-edit',
        component: Edit,
      },
    ],
  },
]
