
const Index = () => import(/* webpackChunkName: "customer" */ "./index");
const CustomerList = () => import(/* webpackChunkName: "customer" */ "./CustomerList");
// const BalanceSheet = () => import(/* webpackChunkName: "customer" */ "./BalanceSheet");

export default [
  {
    path: 'customer',
    name: 'customer',
    component: Index,
    redirect: { name: 'customer-list' },
    children: [
      {
        path: 'list',
        name: 'customer-list',
        component: CustomerList,
      },
      // {
      //   path: 'balanceSheet',
      //   name: 'balance-sheet',
      //   component: BalanceSheet,
      // },
    ],
    
  },
]
