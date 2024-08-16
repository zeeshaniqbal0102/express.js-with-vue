
const Index = () => import(/* webpackChunkName: "customer" */ "./index");
const SaleSummary = () => import(/* webpackChunkName: "customer" */ "./SaleSummary");
// const BalanceSheet = () => import(/* webpackChunkName: "customer" */ "./BalanceSheet");

export default [
  {
    path: 'location',
    name: 'location',
    component: Index,
    children: [
      {
        path: ':id/saleSummary',
        name: 'sale-summary',
        component: SaleSummary,
      },
      // {
      //   path: 'balanceSheet',
      //   name: 'balance-sheet',
      //   component: BalanceSheet,
      // },
    ],
    
  },
]
