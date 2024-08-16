import Index from './index.vue'
import Login from './components/Login.vue'
import Logout from './components/Logout.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import ResetPassword from './components/ResetPassword.vue'
import SelectOrganization from './components/SelectOrganization.vue'

export default [
  {
    path: '/login',
    name: 'login',
    component: Index,
    title: 'Login',
    children: [
      {
        path: '/',
        name: 'authentication-login',
        component: Login,
        props: true,
      },
      {
        path: '/forgotPassword',
        component: ForgotPassword,
      },
      {
        path: '/resetPassword',
        component: ResetPassword,
      },
      {
        path: 'organization',
        name: 'authentication-select-organization',
        component: SelectOrganization,
        props: true,
      },
    ],
  },
  {
    path: '/logout',
    component: Logout,
  },
]
