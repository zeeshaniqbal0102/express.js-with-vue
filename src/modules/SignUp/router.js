import Index from './index.vue'
import Verify from './components/Verify.vue'

export default [
  {
    path: '/signup',
    name: 'signup',
    component: Index,
    title: 'Sign Up',
    children: [],
  },
  {
    path: '/verify',
    name: 'verify',
    component: Verify,
    title: 'Verify',
    children: [],
  },
]
