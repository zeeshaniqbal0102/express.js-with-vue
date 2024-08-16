import Index from './index.vue'
import billingRoutes from './components/Billing/router'
import generalRoutes from './components/General/router'
import userRoutes from '../User/router'

let routes = []
routes = routes.concat(generalRoutes)
routes = routes.concat(billingRoutes)
routes = routes.concat(userRoutes)

export default [
  {
    path: '/settings',
    name: 'settings',
    component: Index,
    title: 'Settings',
    redirect: { name: 'settings-general' },
    children: routes,
  },
]
