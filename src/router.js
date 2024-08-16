import Vue from 'vue'
import Router from 'vue-router'
import Main from './modules/Layout/index.vue'
import loginRoutes from '@/modules/Authentication/router'
import signUpRoutes from '@/modules/SignUp/router'
import newOrganizationRoutes from '@/modules/NewOrganization/router'
import homeRoutes from '@/modules/Home/router'
import locationRoutes from '@/modules/Location/router'
import settingsRoutes from '@/modules/Settings/router'
import inventoryRoutes from '@/modules/Inventory/router'
import contactRoutes from '@/modules/Contact/router'
import employeeRoutes from '@/modules/Employee/router'
import invoiceRoutes from '@/modules/Invoice/router'
import marketplaceRoutes from '@/modules/Marketplace/router'
import reportRoutes from '@/modules/Reports/router'
import stripeExpressRoutes from '@/modules/StripeExpress/router'
import reportViewRoutes from '@/modules/ReportView/router'

const PageNotFound = () => import('./views/PageNotFound.vue')
const Support = () => import('./modules/Support/index.vue')
const Receipt = () => import('./views/Receipt.vue')

Vue.use(Router);

let mainRoutes = []
mainRoutes = mainRoutes.concat(homeRoutes)
mainRoutes = mainRoutes.concat(inventoryRoutes)
mainRoutes = mainRoutes.concat(locationRoutes)
mainRoutes = mainRoutes.concat(contactRoutes)
mainRoutes = mainRoutes.concat(employeeRoutes)
mainRoutes = mainRoutes.concat(settingsRoutes)
mainRoutes = mainRoutes.concat(invoiceRoutes)
mainRoutes = mainRoutes.concat(marketplaceRoutes)
mainRoutes = mainRoutes.concat(reportRoutes)
mainRoutes = mainRoutes.concat(stripeExpressRoutes)

let routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: mainRoutes,
    redirect: { path: '/location' },
    beforeEnter: (to, from, next) => {
      if ((localStorage.getItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`) == null)) {
        console.log('No token was found') // eslint-disable-line
        next({
          path: '/login',
          params: { nextUrl: to.fullPath },
        })
      } else {
        next()
      }
    },
  },
  {
    path: '/support',
    name: 'support',
    component: Support,
  },
  {
    path: '/receipt',
    name: 'receipt',
    component: Receipt,
  },
  {
    path: '*',
    name: 'pagenotfound',
    component: PageNotFound,
  },
]

// Add login routes to the app.
routes = routes.concat(loginRoutes)
routes = routes.concat(signUpRoutes)
routes = routes.concat(newOrganizationRoutes)
routes = routes.concat(reportViewRoutes);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  },
})

export default router
