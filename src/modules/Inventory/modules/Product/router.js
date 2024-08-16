import Index from './index.vue'
import Create from './components/Create.vue'
import List from './components/List.vue'
import Edit from './components/Edit.vue'

export default [
  {
    path: 'product',
    name: 'product',
    component: Index,
    title: 'Product',
    redirect: { name: 'product-list' },
    children: [
      {
        path: 'create',
        name: 'product-create',
        component: Create,
      },
      {
        path: 'list',
        name: 'product-list',
        component: List,
      },
      {
        path: 'edit',
        name: 'product-edit',
        component: Edit,
      },
    ],
  },
]
