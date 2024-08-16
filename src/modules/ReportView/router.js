
import customerRoutes from '@/modules/ReportView/components/Customer/router'
import locationRoutes from '@/modules/ReportView/components/Location/router'
// import invoiceRoutes from '@/modules/ReportView/components/invoice/router'
// import saleRoutes from '@/modules/ReportView/components/sale/router'
// import productRoutes from '@/modules/ReportView/components/Product/router'

const Index = () => import(/* webpackChunkName: "report" */ './index.vue');
// import expenseRoutes from '@/modules/ReportView/components/expense/router'
// import paymentRoutes from '@/modules/ReportView/components/payment/router'


let childrenRoutes = []

childrenRoutes = childrenRoutes.concat(customerRoutes)
childrenRoutes = childrenRoutes.concat(locationRoutes)
// childrenRoutes = childrenRoutes.concat(profitRoutes)
// childrenRoutes = childrenRoutes.concat(saleRoutes)
// childrenRoutes = childrenRoutes.concat(expenseRoutes)
// childrenRoutes = childrenRoutes.concat(paymentRoutes)
// childrenRoutes = childrenRoutes.concat(productRoutes)


export default [{
  path: '/reportview',
  name: 'report-view',
  component: Index,
  children: childrenRoutes,
}]
