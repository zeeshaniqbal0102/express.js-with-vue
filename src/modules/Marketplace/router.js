import Index from './index.vue'
import AppView from './views/App.vue'
import Home from './views/Home.vue'

const routes = [
  {
    path: 'app/:id',
    name: 'marketplace-app',
    component: AppView,
  },
  {
    path: 'home',
    name: 'marketplace-home',
    component: Home,
  },
]

// routes = routes.concat(ProductRoutes)
// routes = routes.concat(CategoryRoutes)
export default [
  {
    path: '/marketplace',
    name: 'marketplace',
    component: Index,
    redirect: { name: 'marketplace-home' },
    title: 'Marketplace',
    children: routes,
  },
]
