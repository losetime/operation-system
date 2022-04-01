/**
 * @description: 申请列表
 */
export interface GetInvoiceApplyListInterface {
  pageNum: number
  perPage: number
  number?: string
  invoiceNumber?: string
  courierNumber?: string
  invoiceTitle?: string
  packCompany?: string
  unloadCompany?: string
  billingStatus?: string
  timeType: number
  startTime?: string
  endTime?: string
}

/**
 * @description: 申请列表导出
 */
export interface InvoiceApplyListExportInterface {
  number?: string
  invoiceNumber?: string
  courierNumber?: string
  invoiceTitle?: string
  packCompany?: string
  unloadCompany?: string
  billingStatus?: string
  timeType: number
  startTime?: string
  endTime?: string
}

/**
 * @description: 发票申请列表详情
 */
export interface GetInvoiceApplyDetailInterface {
  invoiceId: string
}

/**
 * @description: 获取服务费相关内容
 */
export interface GetInvoiceSerivceInterface {
  recordId: string
}

/**
 * @description: 更新开票信息
 */
export interface UpdateInvoiceEnterpriseInterface {
  address: string
  bankAccountNumber: string
  bankOfDeposit: string
  enterpriseTelephone: string
  invoiceTitle: string
  recordId: string
  remark: string
  taxNumber: string
}

/**
 * @description: 修改结算单信息
 */
export interface UpdateStatementInfoInterface {
  carrier: string
  client: string
  confirmationDate: string
  confirmationSignature: string
  invoiceId: string
  invoiceRemark: string
  manifest: Array<ManifestInterface>
}

/**
 * @description: 下载结算单
 */
export interface DownloadStatementInfoInterface {
  invoiceId: string
}

interface ManifestInterface {
  countData: CountDataInterface
  deliveryId: number
  destination: string
  distance: string
  endTime: string
  placeOfOrigin: string
  productName: string
  project: string
  settlementQuantity: string
  startTime: string
  totalTax: string
  transportCount: number
  unitPrice: string
}

interface CountDataInterface {
  realMineSendWeight: string
  realPayAmount: string
  realTransportWeight: string
  transportCount: number
}

/**
 * @description: 取消开票
 */
export interface CancelInvoiceApplyInterface {
  invoiceId: number
}

/**
 * @description: 修改服务费
 */
export interface UpdateServiceChargeInterface {
  recordId: string
  invoiceTaxAmount: string
  invoiceTax: string
  invoiceCountAmount: string
}

/**
 * @description: 扣除服务费
 */
export interface DeductServiceChargeInterface {
  recordId: string
}

/**
 * @description: 发票作废
 */
export interface AbandonedInvoiceInterface {
  recordId: string
}

/**
 * @description: 获取打印发票详情
 */
export interface GetInvoicePrintInfoInterface {
  infoId: number
}

/**
 * @description: 获取发票预览详情
 */
export interface GetInvoicePerviewInfoInterface {
  deliveryId: string
  recordId: string
}

/**
 * @description: 确认结算单-获取已选择运单列表
 */
export interface GetApplyTransportListInterface {
  pageNum: number
  perPage: number
  recordId: string
  nameOrTel?: string
  transportSn?: string
  vehicleNo?: string
}

/**
 * @description: 移除开票
 */
export interface RemoveWayBillInterface {
  logId: Array<number>
}

/**
 * @description: 发票开具并打印
 */
export interface PrintInvoiceInterface {
  infoId: number
  invoiceCode: string
  invoiceNumber: string
}

/**
 * @description: 发票重开
 */
export interface PrintInvoiceAgainInterface {
  infoId: number
  invoiceCode: string
  invoiceNumber: string
}

/**
 * @description: 批量下载XML
 */
export interface BatchDownloadInterface {
  recordId: string
}

/**
 * @description: 下载详单
 */
export interface DownloadInvoiceDetailInterface {
  infoId: number
}

/**
 * @description: 开票成功
 */
export interface InvoiceFinishedInterface {
  invoiceId: string
}

/**
 * @description: 上传结算单
 */
export interface UploadStatementInterface {
  recordId: string
  imgName: string
}

/**
 * @description: 发票邮寄修改
 */
export interface UpdateMailAddressInterface {
  recordId: string
  mailingAddress: string
  addressee: string
  contactTel: string
}

/**
 * @description: 更新快递单号
 */
export interface UpdateExpressNoInterface {
  recordId: string
  courierNumber: string
  expressNotes: string
}

/**
 * @description: 上传绥德
 */
export interface UpSuideDataInterface {
  transportSn: Array<string>
  transportType: number
}

/**
 * @description: 充值列表
 */
export interface GetRechargeListInterface {
  pageNum: number
  perPage: number
  createdAtEnd?: string
  createdAtStart?: string
  nameOrTel?: string
  rechargeSn?: string
  rechargeStatus?: Array<string>
  rechargeType?: Array<string>
  shortCompanyName?: string
}

/**
 * @description: 充值列表导出
 */
export interface RechargeListExportInterface {
  createdAtEnd?: string
  createdAtStart?: string
  nameOrTel?: string
  rechargeSn?: string
  rechargeStatus?: Array<string>
  rechargeType?: Array<string>
  shortCompanyName?: string
}

/**
 * @description: 充值详情
 */
export interface GetRechargeDetailsInterface {
  rechargeId: number
}

/**
 * @description: 充值记录创建
 */
export interface AddRechargeStoreInterface {
  rechargeType: string
  userId: number
  rechargeAmount: string
  rechargeAmountFreeze?: string
  rechargeLicense?: string
  failedExplain?: string
}

/**
 * @description: 充值审核-同意
 */
export interface GetRechargeTrailInterface {
  rechargeId: number
  rechargeType?: string
  failedExplain?: string
}

/**
 * @description: 添加充值图片
 */
export interface AddRechargeLicenseInterface {
  rechargeId: number
  rechargeLicense: string
}

/**
 * @description: 充值-拒绝
 */
export interface RefuseRechargeRefuseInterface {
  rechargeId: number
  failedExplain?: string
}

/**
 * @description: 利润提现列表
 */
export interface GetProfitWithdrawalListInterface {
  pageNum: number
  perPage: number
  cashSn?: string
  consignorShortName?: string
  cashStatus?: string
  cashPayStatus?: string
  timeType?: string
  startTime?: string
  endTime?: string
}

/**
 * @description: 利润提现详情
 */
export interface GetProfitWithdrawalDetailInterface {
  cashId: number
}

/**
 * @description: 利润提现导出
 */
export interface ProfitWithdrawalExport {
  cashSn?: string
  consignorShortName?: string
  cashStatus?: string
  cashPayStatus?: string
  timeType?: string
  startTime?: string
  endTime?: string
}

/**
 * @description: 利润提现详情更改
 */
export interface SaveProfitWithdrawalDetailInterface {
  cashBankNumber?: string
  cashUserName?: string
  cashUserCard?: string
  cashType?: number
  transferVoucherNo?: string
  transferVoucherTime?: string
  transferVoucherAddress?: string
  cashPayStatus?: number
  remark?: string
  cashSn?: string
}

/**
 * @description: 支付失败导出
 */
export interface PayFailureExport {
  transportNo?: string
  vehicleNo?: string
  nameOrTel?: string
}

/**
 * @description: 油票抵扣-列表
 */
export interface GetOilTicketDeductionList {
  perPage?: number
  pageNum?: number
  stampSn?: string
  shortCompany?: string
  timeType?: string
  startTime?: string
  endTime?: string
}

/**
 * @description: 邮票抵扣-编辑
 */
export interface SaveOilTicketDeductionDetail {
  stampId?: number
  stampSn?: string
  shortCompany?: string
  stampMobile?: string
  stampAmount?: string
  stampRealAmount?: string
  stampLicense?: string
}

/**
 * @description: 邮票抵扣-详情
 */
export interface GetOilTicketDeductionDetail {
  stampId?: number
}

/**
 * @description: 油票抵扣-导出
 */
export interface OilTicketDeductionExport {
  stampSn?: string
  shortCompany?: string
  timeType?: string
  startTime?: string
  endTime?: string
}
