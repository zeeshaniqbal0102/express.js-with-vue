import Index from './index.vue'
import ProductRoutes from './modules/Product/router'
import CategoryRoutes from './modules/Category/router'
import ItemTransfer from './modules/ItemTransfer/ItemTransfer.vue'

let routes = []

routes = routes.concat(ProductRoutes)
routes = routes.concat(CategoryRoutes)
routes = routes.concat({
  path: 'item-transfer',
  name: 'ItemTransfer',
  component: ItemTransfer,
})

export default [
  {
    path: 'inventory',
    name: 'inventory',
    component: Index,
    title: 'Inventory',
    children: routes,
  },
]
