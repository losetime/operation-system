import { lazy } from 'react'

import Login from '../views/login/index'
import Home from '../views/home/home'
import HomePage from '../views/home/homePage'
import RechargeMobile from '../mobile/views/rechargeMobile'
import NoAuth from '../mobile/views/noAuth'

const StatisticalCenter = lazy(() => import('../views/statistics/statisticalCenter'))

const Consignor = lazy(() => import('../views/information/consignor'))
const Driver = lazy(() => import('../views/information/driver'))
const Vehicle = lazy(() => import('../views/information/vehicle'))
const BankCard = lazy(() => import('../views/information/bankCard'))
const Contract = lazy(() => import('../views/information/contract'))
const CarriageAgreement = lazy(() => import('../views/information/carriageAgreement'))
const Invoicing = lazy(() => import('@/views/information/invoicing'))

const InvoiceApproval = lazy(() => import('../views/finance/invoiceApproval'))
const ConfirmInvoiceInfo = lazy(() => import('../views/finance/confirmInvoiceInfo'))
const Recharge = lazy(() => import('../views/finance/recharge'))
const ProfitWithdrawal = lazy(() => import('../views/finance/profitWithdrawal'))
const ProfitWithdrawalDetail = lazy(() => import('../components/finance/profitWithdrawalDetail'))
const PayFailure = lazy(() => import('../views/finance/payFailure'))
const OilTicketDeduction = lazy(() => import('../views/finance/oilTicketDeduction'))
const OilTicketDeductionDetail = lazy(() => import('../components/finance/oilTicketDeductionDetail'))

const Waybill = lazy(() => import('../views/operation/waybill'))
const Manifest = lazy(() => import('../views/operation/manifest'))
const FreightInvoice = lazy(() => import('../views/operation/freightInvoice'))
const Consulting = lazy(() => import('../views/operation/consulting'))

const ManifestDetail = lazy(() => import('../components/operation/manifestDetail'))
const FreightRules = lazy(() => import('../components/operation/freightRules'))
const WaybillList = lazy(() => import('../components/operation/waybillList'))
const ManifestAgreement = lazy(() => import('../components/operation/manifestAgreement'))

const Users = lazy(() => import('../views/authority/users'))

export const firstRoutes = [
  // 登录
  { path: '/login', state: { name: '登录' }, component: Login, exact: true },
  // 首页
  { path: '/home', state: { name: '首页' }, component: Home },
]

export const secondRoutes = [
  /**---------------------------------------后台首页------------------------------------------------------*/

  // 后台首页
  { path: '/home/HomePage', component: HomePage, exact: true },

  /**---------------------------------------统计------------------------------------------------------*/

  // 统计中心
  { path: '/home/statisticalCenter', component: StatisticalCenter, exact: true },

  /**---------------------------------------信息管理------------------------------------------------------*/

  // 货主信息管理
  { path: '/home/consignor', component: Consignor, exact: true },
  // 司机信息管理
  { path: '/home/driver', component: Driver, exact: true },
  // 车辆信息管理
  { path: '/home/vehicle', component: Vehicle, exact: true },
  // 银行卡信息管理
  { path: '/home/bankCard', component: BankCard, exact: true },
  // 托运合同信息管理
  { path: '/home/contract', component: Contract, exact: true },
  //承运协议管理
  {
    path: '/home/carriageAgreement',
    component: CarriageAgreement,
    exact: true,
  },
  //开票信息管理
  { path: '/home/Invoicing', component: Invoicing, exact: true },

  /**---------------------------------------财务管理------------------------------------------------------*/

  //充值信息管理
  { path: '/home/funds', component: Recharge, exact: true },
  // 货主开票审批
  { path: '/home/invoiceApproval', component: InvoiceApproval, exact: true },
  // 确认开票信息
  {
    path: '/home/confirmInvoiceInfo/:id/:invoiceNumber',
    component: ConfirmInvoiceInfo,
    exact: true,
  },
  //利润提现
  { path: '/home/profitWithdrawal', component: ProfitWithdrawal, exact: true },
  //利润提现
  { path: '/home/profitWithdrawalDetail/:id', component: ProfitWithdrawalDetail, exact: true },
  //支付失败
  { path: '/home/payFailure', component: PayFailure, exact: true },
  //油票抵扣
  { path: '/home/oilTicketDeduction', component: OilTicketDeduction, exact: true },
  //油票抵扣详情
  { path: '/home/oilTicketDeductionDetail/:id', component: OilTicketDeductionDetail, exact: true },

  /**---------------------------------------运单管理------------------------------------------------------*/

  // 运单管理
  {
    path: '/home/waybill',
    state: { name: '运单管理' },
    component: Waybill,
    exact: true,
  },
  // 货单管理
  {
    path: '/home/manifest',
    state: { name: '货单管理' },
    component: Manifest,
    exact: true,
  },
  // 货单详情
  {
    path: '/home/manifest/detail/:id',
    state: { name: '货单详情' },
    component: ManifestDetail,
    exact: true,
  },
  // 运费规则
  {
    path: '/home/manifest/freightRules/:id',
    state: { name: '运费规则' },
    component: FreightRules,
    exact: true,
  },
  // 运单列表
  {
    path: '/home/manifest/waybill/:id',
    state: { name: '运单列表' },
    component: WaybillList,
    exact: true,
  },
  //货当当平台货物托运服务协议
  {
    path: '/home/manifest/manifestAgreement/:id',
    state: { name: '货当当平台货物托运服务协议' },
    component: ManifestAgreement,
    exact: true,
  },
  // 货运发票管理
  {
    path: '/home/freightInvoice',
    state: { name: '货运发票' },
    component: FreightInvoice,
    exact: true,
  },
  // 咨询管理
  {
    path: '/home/consulting',
    state: { name: '咨询记录' },
    component: Consulting,
    exact: true,
  },

  /**---------------------------------------权限管理------------------------------------------------------*/

  // 用户管理
  {
    path: '/home/users',
    state: { name: '用户管理' },
    component: Users,
    exact: true,
  },
]

export const mobileRoutes = [
  // 移动端充值
  { path: '/rechargeMobile', state: { name: '充值' }, component: RechargeMobile },
  // 登录失败
  { path: '/noAuth', component: NoAuth },
]
