import Index from './index.vue'
import List from './components/List.vue'

export default [
  {
    path: 'timeClock',
    name: 'reports-timeClock',
    component: Index,
    title: 'TimeClock',
  },
  {
    path: 'timeClock/list',
    name: 'reports-timeClock-list',
    component: List,
    title: 'TimeClockList',
  },

]
