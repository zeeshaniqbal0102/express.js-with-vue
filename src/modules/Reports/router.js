import Index from './index.vue'
import Home from './views/Home.vue'
import salesRoutes from './Sales/router'
import timeClockRoutes from './TimeClock/router'

let routes = [{
  path: '/reports/home',
  name: 'reports-home',
  component: Home,
  title: 'Reports Home',
}]

routes = routes.concat(salesRoutes)
routes = routes.concat(timeClockRoutes)

export default [
  {
    path: '/reports',
    name: 'reports',
    component: Index,
    title: 'Reports',
    children: routes,
    redirect: { name: 'reports-home' },
  },
]
