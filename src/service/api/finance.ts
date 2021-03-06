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
 * ---------------------------------------??????????????????-----------------------------------------------
 */

/**
 * @description: ????????????
 */
export function apiGetInvoiceApplyList(params: GetInvoiceApplyListInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoiceApplyList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
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
 * @description: ????????????????????????
 */
export function apiGetInvoiceApplyDetail(params: GetInvoiceApplyDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoiceApplyDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????????????????
 */
export function apiGetInvoiceSerivce(params: GetInvoiceSerivceInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoiceSerivce,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiUpdateInvoiceEnterprise(params: UpdateInvoiceEnterpriseInterface): Promise<any> {
  return $http.request({
    url: Api.updateInvoiceEnterprise,
    method: 'POST',
    params,
  })
}

/**
 * @description: ?????????????????????
 */
export function apiUpdateStatementInfo(params: UpdateStatementInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateStatementInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????
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
 * @description: ????????????
 */
export function apiCancelInvoiceApply(params: CancelInvoiceApplyInterface): Promise<any> {
  return $http.request({
    url: Api.cancelInvoiceApply,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????
 */
export function apiUpdateServiceCharge(params: UpdateServiceChargeInterface): Promise<any> {
  return $http.request({
    url: Api.updateServiceCharge,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????
 */
export function apiDeductServiceCharge(params: DeductServiceChargeInterface): Promise<any> {
  return $http.request({
    url: Api.deductServiceCharge,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiAbandonedInvoice(params: AbandonedInvoiceInterface): Promise<any> {
  return $http.request({
    url: Api.abandonedInvoice,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiGetInvoicePrintInfo(params: GetInvoicePrintInfoInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicePrintInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiGetInvoicePerviewInfo(params: GetInvoicePerviewInfoInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicePerviewInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????-???????????????????????????
 */
export function apiGetApplyTransportList(params: GetApplyTransportListInterface): Promise<any> {
  return $http.request({
    url: Api.getApplyTransportList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiRemoveWayBill(params: RemoveWayBillInterface): Promise<any> {
  return $http.request({
    url: Api.removeWayBill,
    method: 'POST',
    params,
  })
}

/**
 * @description: ?????????????????????
 */
export function apiPrintInvoice(params: PrintInvoiceInterface): Promise<any> {
  return $http.request({
    url: Api.printInvoice,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiPrintInvoiceAgain(params: PrintInvoiceAgainInterface): Promise<any> {
  return $http.request({
    url: Api.printInvoiceAgain,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????XML
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
 * @description: ????????????
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
 * @description: ????????????
 */
export function apiInvoiceFinished(params: InvoiceFinishedInterface): Promise<any> {
  return $http.request({
    url: Api.invoiceFinished,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????
 */
export function apiUploadStatement(params: UploadStatementInterface): Promise<any> {
  return $http.request({
    url: Api.uploadStatement,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetInvoiceEnumerate(): Promise<any> {
  return $http.request({
    url: Api.getInvoiceEnumerate,
    method: 'POST',
  })
}

/**
 * @description: ??????????????????
 */
export function apiUpdateMailAddress(params: UpdateMailAddressInterface): Promise<any> {
  return $http.request({
    url: Api.updateMailAddress,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiUpdateExpressNo(params: UpdateExpressNoInterface): Promise<any> {
  return $http.request({
    url: Api.updateExpressNo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiUpSuideData(params: UpSuideDataInterface): Promise<any> {
  return $http.request({
    url: Api.upSuideData,
    method: 'POST',
    params,
  })
}

/**
 * ---------------------------------------??????????????????-----------------------------------------------
 */

/**
 * @description: ????????????
 */
export function apiGetRechargeList(params: GetRechargeListInterface): Promise<any> {
  return $http.request({
    url: Api.getRechargeList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
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
 * @description: ????????????
 */
export function apiGetRechargeDetails(params: GetRechargeDetailsInterface): Promise<any> {
  return $http.request({
    url: Api.getRechargeDetails,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiAddRechargeStore(params: AddRechargeStoreInterface): Promise<any> {
  return $http.request({
    url: Api.addRechargeStore,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????-??????
 */
export function apiGetRechargeTrail(params: GetRechargeTrailInterface): Promise<any> {
  return $http.request({
    url: Api.getRechargeTrail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiAddRechargeLicense(params: AddRechargeLicenseInterface): Promise<any> {
  return $http.request({
    url: Api.addRechargeLicense,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiRechargeReceipts(params: GetRechargeTrailInterface): Promise<any> {
  return $http.request({
    url: Api.rechargeReceipts,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????-??????
 */
export function apiRefuseRechargeRefuse(params: RefuseRechargeRefuseInterface): Promise<any> {
  return $http.request({
    url: Api.refuseRechargeRefuse,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiRechargeEnum(): Promise<any> {
  return $http.request({
    url: Api.rechargeEnum,
    method: 'POST',
  })
}

/**
 * ---------------------------------------??????????????????-----------------------------------------------
 */

/**
 * @description: ??????????????????
 */
export function apiGetProfitWithdrawalList(params: GetProfitWithdrawalListInterface): Promise<any> {
  return $http.request({
    url: Api.getProfitWithdrawalList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetProfitWithdrawalDetail(params: GetProfitWithdrawalDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getProfitWithdrawalDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
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
 * @description: ????????????????????????
 */
export function apiSaveProfitWithdrawalDetail(params: SaveProfitWithdrawalDetailInterface): Promise<any> {
  return $http.request({
    url: Api.saveProfitWithdrawalDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????-??????
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
 * @description: ????????????-??????
 */
export function apiGetOilTicketDeductionList(params: GetOilTicketDeductionList): Promise<any> {
  return $http.request({
    url: Api.getOilTicketDeductionList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????-??????
 */
export function apiSaveOilTicketDeductionDetail(params: SaveOilTicketDeductionDetail): Promise<any> {
  return $http.request({
    url: Api.saveOilTicketDeductionDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????-??????
 */
export function apiGetOilTicketDeductionDetail(params: GetOilTicketDeductionDetail): Promise<any> {
  return $http.request({
    url: Api.getOilTicketDeductionDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????-??????
 */
export function apiOilTicketDeductionExport(params: OilTicketDeductionExport): Promise<any> {
  return $http.request({
    url: Api.oilTicketDeductionExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}
