import * as actionType from './actionType'

// 修改密码dialog状态
export const setUserInfo = (value) => ({
  type: actionType.SET_USER_INFO,
  value,
})

// 修改权限信息
export const setAuthInfo = (value) => ({
  type: actionType.AUTH_INFO,
  value,
})

// 修改登录密码dialog状态
export const setModifyPasswordDialogStatus = (value) => ({
  type: actionType.SET_MODIFY_PASSWORD_DIALOG_STATUS,
  value,
})

// 修改支付密码dialog状态
export const setModifyPayPasswordDialogStatus = (value) => ({
  type: actionType.SET_MODIFY_PAY_PASSWORD_DIALOG_STATUS,
  value,
})

// 侧边菜单收放状态
export const setSidebarStatus = (value) => ({
  type: actionType.SET_SIDEBAR_STATUS,
  value,
})

// 当前选中菜单
export const setActiveMenu = (value) => ({
  type: actionType.SET_ACTIVE_MENU,
  value,
})

export const setWaybillDetailDialogStatus = (value) => ({
  type: actionType.SET_WAYBILL_DETAIL_DIALOG_STATUS,
  value,
})

// 货单dialog状态
export const setManifestDetailDialogStatus = (value) => ({
  type: actionType.SET_MANIFEST_DETAIL_DIALOG_STATUS,
  value,
})

export const setPayAgainDialogStatus = (value) => ({
  type: actionType.SET_PAY_AGAIN_DIALOG_STATUS,
  value,
})

export const setVehicleDetailDialogStatus = (value) => ({
  type: actionType.SET_VEHICLE_DETAIL_DIALOG_STATUS,
  value,
})

export const setConsignorDetailDialogStatus = (value) => ({
  type: actionType.SET_CONSIGNOR_DETAIL_DIALOG_STATUS,
  value,
})

export const setAddressMapDialogStatus = (value) => ({
  type: actionType.SET_ADDRESS_MAP_DIALOG_STATUS,
  value,
})

export const setDriverDetailDialogStatus = (value) => ({
  type: actionType.SET_DRIVER_DETAIL_DIALOG_STATUS,
  value,
})

export const setBankcardDetailDialogStatus = (value) => ({
  type: actionType.SET_BANKCARD_DETAIL_DIALOG_STATUS,
  value,
})

export const setApplyCountStatus = (value) => ({
  type: actionType.SET_APPLY_COUNT_DIALOG_STATUS,
  value,
})

export const setPrintInvoiceDialogStatus = (value) => ({
  type: actionType.SET_PRINT_INVOICE_DIALOG_STATUS,
  value,
})

export const setRechargeDetailDialogStatus = (value) => ({
  type: actionType.SET_RECHARGE_DETAIL_DIALOG_STATUS,
  value,
})

export const setFreightInvoiceDetailDialogStatus = (value) => ({
  type: actionType.SET_FREIGHT_INVOICE_DETAIL_DIALOG_STATUS,
  value,
})

export const setImportInvoiceDetailDialogStatus = (value) => ({
  type: actionType.SET_IMPORT_INVOICE_DETAIL_DIALOG_STATUS,
  value,
})
//咨询记录页面dialog类型
export const setConsultingDetailDialogStatus = (value) => ({
  type: actionType.SET_CONSULTING_DETAIL_DIALOG_STATUS,
  value,
})

//咨询页面配置类型dialog状态
export const setConfigureTypeDetailDialogStatus = (value) => ({
  type: actionType.SET_CONFIGURE_TYPE_DETAIL_DIALOG_STATUS,
  value,
})

//咨询页面配置类型dialog状态
export const setCarriageAgreementDetailDialogStatus = (value) => ({
  type: actionType.SET_CARRIAGE_AGREEMENT_DETAIL_DIALOG_STATUS,
  value,
})
