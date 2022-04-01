import { $http } from '../http/index'

import {
  GetInvoiceApplyListInterface,
  InvoiceApplyListExportInterface,
  GetInvoiceApplyDetailInterface,
  GetInvoiceSerivceInterface,
  UpdateInvoiceEnterpriseInterface,
  UpdateStatementInfoInterface,
  DownloadStatementInfoInterface,
  CancelInvoiceApplyInterface,
  UpdateServiceChargeInterface,
  DeductServiceChargeInterface,
  AbandonedInvoiceInterface,
  GetInvoicePrintInfoInterface,
  GetInvoicePerviewInfoInterface,
  PrintInvoiceInterface,
  PrintInvoiceAgainInterface,
  GetApplyTransportListInterface,
  BatchDownloadInterface,
  DownloadInvoiceDetailInterface,
  RemoveWayBillInterface,
  InvoiceFinishedInterface,
  UploadStatementInterface,
  UpdateMailAddressInterface,
  UpdateExpressNoInterface,
  UpSuideDataInterface,
  GetRechargeListInterface,
  RechargeListExportInterface,
  GetRechargeDetailsInterface,
  GetRechargeTrailInterface,
  AddRechargeLicenseInterface,
  AddRechargeStoreInterface,
  RefuseRechargeRefuseInterface,
  GetProfitWithdrawalListInterface,
  GetProfitWithdrawalDetailInterface,
  ProfitWithdrawalExport,
  SaveProfitWithdrawalDetailInterface,
  PayFailureExport,
  GetOilTicketDeductionList,
  SaveOilTicketDeductionDetail,
  GetOilTicketDeductionDetail,
  OilTicketDeductionExport,
} from '../types/finance'

enum Api {
  getInvoiceApplyList = '/invoice/invoiceList',
  invoiceApplyListExport = '/invoice/invoiceRecordExport',
  getInvoiceApplyDetail = '/invoice/show',
  getInvoiceSerivce = '/invoice/detail',
  updateInvoiceEnterprise = '/invoice/informationUpdate',
  updateStatementInfo = '/transport/adminInvoiceStatementSave',
  downloadStatementInfo = '/transport/invoiceDownload',
  cancelInvoiceApply = '/invoice/cancel',
  updateServiceCharge = '/invoice/complete',
  deductServiceCharge = '/invoice/conductComplete',
  abandonedInvoice = '/invoice/invoiceInfoScrap',
  getInvoicePrintInfo = '/invoice/infoDetail',
  getInvoicePerviewInfo = '/invoice/invoiceInfoPreview',
  printInvoice = '/invoice/infoUpdate',
  printInvoiceAgain = '/invoice/infoAgainUpdate',
  getApplyTransportList = '/invoice/showNumber',
  batchDownload = '/invoice/invoiceStamp',
  downloadInvoiceDetail = '/invoice/infoExport',
  updateMailAddress = '/invoice/emailIndex',
  removeWayBill = '/invoice/invoiceDelete',
  invoiceFinished = '/transport/invoiceSuccess',
  uploadStatement = '/transport/adminInvoiceUpload',
  getInvoiceEnumerate = '/invoice/enumInvoice',
  updateExpressNo = '/invoice/emailSave',
  upSuideData = '/transport/provincialGovernment',

  getRechargeList = '/transport/rechargeIndex',
  rechargeListExport = '/transport/rechargeLogExport',
  getRechargeDetails = '/transport/rechargeDetail',
  getRechargeTrail = '/transport/rechargeTrail',
  addRechargeStore = '/transport/rechargeStore',
  refuseRechargeRefuse = '/transport/rechargeRefuse',
  addRechargeLicense = '/transport/rechargeSaveImage',
  rechargeReceipts = '/transport/payment',
  rechargeEnum = '/transport/rechargeEnum',

  getProfitWithdrawalList = '/withdrawal/index',
  getProfitWithdrawalDetail = '/withdrawal/detail',
  profitWithdrawalExport = '/withdrawal/export',
  saveProfitWithdrawalDetail = '/withdrawal/preservation',

  payFailureExport = '/transport/transportFaildExport',

  getOilTicketDeductionList = '/stamp/index',
  saveOilTicketDeductionDetail = '/stamp/stampSave',
  getOilTicketDeductionDetail = '/stamp/show',
  oilTicketDeductionExport = '/stamp/stampExport',
}

/**
 * ---------------------------------------货主开票审批-----------------------------------------------
 */

/**
 * @description: 申请列表
 */
export function apiGetInvoiceApplyList(params: GetInvoiceApplyListInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoiceApplyList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 申请列表导出
 */
export function apiInvoiceApplyListExport(params: InvoiceApplyListExportInterface): Promise<any> {
  return $http.request({
    url: Api.invoiceApplyListExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 发票申请列表详情
 */
export function apiGetInvoiceApplyDetail(params: GetInvoiceApplyDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoiceApplyDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取服务费相关内容
 */
export function apiGetInvoiceSerivce(params: GetInvoiceSerivceInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoiceSerivce,
    method: 'POST',
    params,
  })
}

/**
 * @description: 更新开票信息
 */
export function apiUpdateInvoiceEnterprise(params: UpdateInvoiceEnterpriseInterface): Promise<any> {
  return $http.request({
    url: Api.updateInvoiceEnterprise,
    method: 'POST',
    params,
  })
}

/**
 * @description: 修改结算单信息
 */
export function apiUpdateStatementInfo(params: UpdateStatementInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateStatementInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 下载结算单
 */
export function apiDownloadStatementInfo(params: DownloadStatementInfoInterface): Promise<any> {
  return $http.request({
    url: Api.downloadStatementInfo,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 取消开票
 */
export function apiCancelInvoiceApply(params: CancelInvoiceApplyInterface): Promise<any> {
  return $http.request({
    url: Api.cancelInvoiceApply,
    method: 'POST',
    params,
  })
}

/**
 * @description: 修改服务费
 */
export function apiUpdateServiceCharge(params: UpdateServiceChargeInterface): Promise<any> {
  return $http.request({
    url: Api.updateServiceCharge,
    method: 'POST',
    params,
  })
}

/**
 * @description: 扣除服务费
 */
export function apiDeductServiceCharge(params: DeductServiceChargeInterface): Promise<any> {
  return $http.request({
    url: Api.deductServiceCharge,
    method: 'POST',
    params,
  })
}

/**
 * @description: 发票作废
 */
export function apiAbandonedInvoice(params: AbandonedInvoiceInterface): Promise<any> {
  return $http.request({
    url: Api.abandonedInvoice,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取打印发票详情
 */
export function apiGetInvoicePrintInfo(params: GetInvoicePrintInfoInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicePrintInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取发票预览详情
 */
export function apiGetInvoicePerviewInfo(params: GetInvoicePerviewInfoInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicePerviewInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 确认结算单-获取已选择运单列表
 */
export function apiGetApplyTransportList(params: GetApplyTransportListInterface): Promise<any> {
  return $http.request({
    url: Api.getApplyTransportList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 移除开票
 */
export function apiRemoveWayBill(params: RemoveWayBillInterface): Promise<any> {
  return $http.request({
    url: Api.removeWayBill,
    method: 'POST',
    params,
  })
}

/**
 * @description: 发票开具并打印
 */
export function apiPrintInvoice(params: PrintInvoiceInterface): Promise<any> {
  return $http.request({
    url: Api.printInvoice,
    method: 'POST',
    params,
  })
}

/**
 * @description: 发票重开
 */
export function apiPrintInvoiceAgain(params: PrintInvoiceAgainInterface): Promise<any> {
  return $http.request({
    url: Api.printInvoiceAgain,
    method: 'POST',
    params,
  })
}

/**
 * @description: 批量下载XML
 */
export function apiBatchDownload(params: BatchDownloadInterface): Promise<any> {
  return $http.request({
    url: Api.batchDownload,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 下载详单
 */
export function apiDownloadInvoiceDetail(params: DownloadInvoiceDetailInterface): Promise<any> {
  return $http.request({
    url: Api.downloadInvoiceDetail,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 开票成功
 */
export function apiInvoiceFinished(params: InvoiceFinishedInterface): Promise<any> {
  return $http.request({
    url: Api.invoiceFinished,
    method: 'POST',
    params,
  })
}

/**
 * @description: 上传结算单
 */
export function apiUploadStatement(params: UploadStatementInterface): Promise<any> {
  return $http.request({
    url: Api.uploadStatement,
    method: 'POST',
    params,
  })
}

/**
 * @description: 开票枚举状态
 */
export function apiGetInvoiceEnumerate(): Promise<any> {
  return $http.request({
    url: Api.getInvoiceEnumerate,
    method: 'POST',
  })
}

/**
 * @description: 发票邮寄修改
 */
export function apiUpdateMailAddress(params: UpdateMailAddressInterface): Promise<any> {
  return $http.request({
    url: Api.updateMailAddress,
    method: 'POST',
    params,
  })
}

/**
 * @description: 更新快递单号
 */
export function apiUpdateExpressNo(params: UpdateExpressNoInterface): Promise<any> {
  return $http.request({
    url: Api.updateExpressNo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 上传绥德
 */
export function apiUpSuideData(params: UpSuideDataInterface): Promise<any> {
  return $http.request({
    url: Api.upSuideData,
    method: 'POST',
    params,
  })
}

/**
 * ---------------------------------------货主资金管理-----------------------------------------------
 */

/**
 * @description: 充值列表
 */
export function apiGetRechargeList(params: GetRechargeListInterface): Promise<any> {
  return $http.request({
    url: Api.getRechargeList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 充值列表导出
 */
export function apiRechargeListExport(params: RechargeListExportInterface): Promise<any> {
  return $http.request({
    url: Api.rechargeListExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 充值详情
 */
export function apiGetRechargeDetails(params: GetRechargeDetailsInterface): Promise<any> {
  return $http.request({
    url: Api.getRechargeDetails,
    method: 'POST',
    params,
  })
}

/**
 * @description: 充值记录创建
 */
export function apiAddRechargeStore(params: AddRechargeStoreInterface): Promise<any> {
  return $http.request({
    url: Api.addRechargeStore,
    method: 'POST',
    params,
  })
}

/**
 * @description: 充值审核-同意
 */
export function apiGetRechargeTrail(params: GetRechargeTrailInterface): Promise<any> {
  return $http.request({
    url: Api.getRechargeTrail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 添加充值图片
 */
export function apiAddRechargeLicense(params: AddRechargeLicenseInterface): Promise<any> {
  return $http.request({
    url: Api.addRechargeLicense,
    method: 'POST',
    params,
  })
}

/**
 * @description: 充值回款
 */
export function apiRechargeReceipts(params: GetRechargeTrailInterface): Promise<any> {
  return $http.request({
    url: Api.rechargeReceipts,
    method: 'POST',
    params,
  })
}

/**
 * @description: 充值-拒绝
 */
export function apiRefuseRechargeRefuse(params: RefuseRechargeRefuseInterface): Promise<any> {
  return $http.request({
    url: Api.refuseRechargeRefuse,
    method: 'POST',
    params,
  })
}

/**
 * @description: 交易类型枚举
 */
export function apiRechargeEnum(): Promise<any> {
  return $http.request({
    url: Api.rechargeEnum,
    method: 'POST',
  })
}

/**
 * ---------------------------------------利润提现管理-----------------------------------------------
 */

/**
 * @description: 利润提现列表
 */
export function apiGetProfitWithdrawalList(params: GetProfitWithdrawalListInterface): Promise<any> {
  return $http.request({
    url: Api.getProfitWithdrawalList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 利润提现详情
 */
export function apiGetProfitWithdrawalDetail(params: GetProfitWithdrawalDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getProfitWithdrawalDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 利润提现导出
 */
export function apiProfitWithdrawalExport(params: ProfitWithdrawalExport): Promise<any> {
  return $http.request({
    url: Api.profitWithdrawalExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 利润提现详情更改
 */
export function apiSaveProfitWithdrawalDetail(params: SaveProfitWithdrawalDetailInterface): Promise<any> {
  return $http.request({
    url: Api.saveProfitWithdrawalDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 支付失败-导出
 */
export function apiPayFailureExport(params: PayFailureExport): Promise<any> {
  return $http.request({
    url: Api.payFailureExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 油票抵扣-列表
 */
export function apiGetOilTicketDeductionList(params: GetOilTicketDeductionList): Promise<any> {
  return $http.request({
    url: Api.getOilTicketDeductionList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 邮票抵扣-编辑
 */
export function apiSaveOilTicketDeductionDetail(params: SaveOilTicketDeductionDetail): Promise<any> {
  return $http.request({
    url: Api.saveOilTicketDeductionDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 邮票抵扣-详情
 */
export function apiGetOilTicketDeductionDetail(params: GetOilTicketDeductionDetail): Promise<any> {
  return $http.request({
    url: Api.getOilTicketDeductionDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 油票抵扣-导出
 */
export function apiOilTicketDeductionExport(params: OilTicketDeductionExport): Promise<any> {
  return $http.request({
    url: Api.oilTicketDeductionExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}
