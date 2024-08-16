import Index from './index.vue'
import List from './components/List.vue'

export default [
  {
    path: '/invoice',
    name: 'invoice',
    component: Index,
    title: 'Invoice',
    redirect: { name: 'invoice-list' },
    children: [
      {
        path: 'list',
        name: 'invoice-list',
        component: List,
      },
    ],
  },
]
