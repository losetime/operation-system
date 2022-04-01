import * as actionType from './actionType'

const defaultState = {
  userInfo: {}, // 用户信息
  authInfo: {
    menuAuth: {},
    operationAuth: {},
  }, // 权限信息
  modifyPasswordDialogStatus: false, // 修改登录密码dialog
  modifyPayPasswordDialogStatus: false, // 修改支付密码dialog
  sidebarStatus: false, // 侧边栏收起展开状态
  activeMenu: '', // 当前选中菜单
  waybillDetailDialogStatus: false, // 运单详情dialog
  manifestDetailDialogStatus: false, // 货单详情dialog
  payAgainDialogStatus: false, // 重新支付dialog
  vehicleDetailDialogStatus: false, // 车辆详情dialog
  consignorDetailDialogStatus: false, // 货主详情dialog
  driverDetailDialogStatus: false, // 司机详情dialog
  bankcardDetailDialogStatus: false, // 银行卡详情dialog
  addressMapDialogStatus: false, // 地址地图dialog
  applyCountDialogStatus: false, // 申请条数dialog
  printInvoiceDialogStatus: false, // 打印票据dialog
  rechargeDetailDialogStatus: false, //充值详情dialog
  freightInvoiceDetailDialogStatus: false, //货运发票详情dialog
  importInvoiceDetailDialogStatus: false, //货运发票导入页面详情dialog
  consultingDetailDialogStatus: false, //咨询记录dialog
  configureTypeDetailDialogStatus: false, //咨询记录->配置类型dialog
}

export default (state = defaultState, action) => {
  switch (action.type) {
    // 设置用户信息
    case actionType.SET_USER_INFO:
      return { ...state, userInfo: action.value }

    // 设置权限信息
    case actionType.AUTH_INFO:
      return { ...state, authInfo: action.value }

    // 修改密码dialog状态
    case actionType.SET_MODIFY_PASSWORD_DIALOG_STATUS:
      return { ...state, modifyPasswordDialogStatus: action.value }

    // 修改支付密码dialog状态
    case actionType.SET_MODIFY_PAY_PASSWORD_DIALOG_STATUS:
      return { ...state, modifyPayPasswordDialogStatus: action.value }

    // 设置侧边栏状态
    case actionType.SET_SIDEBAR_STATUS:
      return { ...state, sidebarStatus: action.value }

    // 当前选中菜单
    case actionType.SET_ACTIVE_MENU:
      return { ...state, activeMenu: action.value }

    // 设置运单详情dialog状态
    case actionType.SET_WAYBILL_DETAIL_DIALOG_STATUS:
      return { ...state, waybillDetailDialogStatus: action.value }

    // 设置重新支付dialog状态
    case actionType.SET_PAY_AGAIN_DIALOG_STATUS:
      return { ...state, payAgainDialogStatus: action.value }

    // 设置车辆详情dialog
    case actionType.SET_VEHICLE_DETAIL_DIALOG_STATUS:
      return { ...state, vehicleDetailDialogStatus: action.value }

    // 设置货主详情dialog
    case actionType.SET_CONSIGNOR_DETAIL_DIALOG_STATUS:
      return { ...state, consignorDetailDialogStatus: action.value }

    // 设置地址地图dialog
    case actionType.SET_ADDRESS_MAP_DIALOG_STATUS:
      return { ...state, addressMapDialogStatus: action.value }

    // 设置司机详情dialog
    case actionType.SET_DRIVER_DETAIL_DIALOG_STATUS:
      return { ...state, driverDetailDialogStatus: action.value }

    // 设置银行详情dialog
    case actionType.SET_BANKCARD_DETAIL_DIALOG_STATUS:
      return { ...state, bankcardDetailDialogStatus: action.value }

    // 设置申请条数dialog
    case actionType.SET_APPLY_COUNT_DIALOG_STATUS:
      return { ...state, applyCountDialogStatus: action.value }

    // 设置打印票据dialog
    case actionType.SET_PRINT_INVOICE_DIALOG_STATUS:
      return { ...state, printInvoiceDialogStatus: action.value }

    //设置充值详情dialog
    case actionType.SET_RECHARGE_DETAIL_DIALOG_STATUS:
      return { ...state, rechargeDetailDialogStatus: action.value }

    //设置货单详情dialog
    case actionType.SET_MANIFEST_DETAIL_DIALOG_STATUS:
      return { ...state, manifestDetailDialogStatus: action.value }

    //设置货运发票详情dialog
    case actionType.SET_FREIGHT_INVOICE_DETAIL_DIALOG_STATUS:
      return { ...state, freightInvoiceDetailDialogStatus: action.value }

    //设置货运发票详情dialog
    case actionType.SET_IMPORT_INVOICE_DETAIL_DIALOG_STATUS:
      return { ...state, importInvoiceDetailDialogStatus: action.value }
    //设置咨询记录dialog
    case actionType.SET_CONSULTING_DETAIL_DIALOG_STATUS:
      return { ...state, consultingDetailDialogStatus: action.value }

    //设置咨询记录配置类型dialog
    case actionType.SET_CONFIGURE_TYPE_DETAIL_DIALOG_STATUS:
      return { ...state, configureTypeDetailDialogStatus: action.value }

    //设置承运协议详情dialog
    case actionType.SET_CARRIAGE_AGREEMENT_DETAIL_DIALOG_STATUS:
      return { ...state, carriageAgreementDetailDialogStatus: action.value }

    default:
      return state
  }
}
