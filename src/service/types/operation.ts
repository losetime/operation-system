/**
 * @description: 运单列表
 */
export interface GetWaybillTableDataInterface {
  pageNum: number
  perPage: number
  createCompany?: string
  endTime?: string
  makeInvoiceStatus?: Array<string>
  nameOrTel?: string
  packCompany?: string
  startTime?: string
  timeType?: string
  tradeStatus?: Array<string>
  transportErrorMessage?: string
  transportNo?: string
  transportStatus?: Array<string>
  unloadCompany?: string
  upProvincialStatus?: string
  upSuideStatus?: string
  vehicleNo?: string
}

/**
 * @description: 运单列表导出
 */
export interface WaybillExportInterface {
  createCompany?: string
  endTime?: string
  makeInvoiceStatus?: Array<string>
  nameOrTel?: string
  packCompany?: string
  startTime?: string
  timeType?: number
  tradeStatus?: Array<string>
  transportErrorMessage?: string
  transportNo?: string
  transportStatus?: Array<string>
  unloadCompany?: string
  upProvincialStatus?: number
  upSuideStatus?: number
  vehicleNo?: string
}

/**
 * @description: 运单详情
 */
export interface GetWaybillDetailInterface {
  transportId: number
}

/**
 * @description: 银行卡信息
 */
export interface GetBankCardInfoInterface {
  bankNo: string
}

/**
 * @description: 保存银行卡号和持卡人
 */
export interface SaveBankCardInterface {
  bankCardHolder: string
  bankNo: string
  transportId: number
}

/**
 * @description:运单迁移
 */
export interface MigrateWaybillInterface {
  deliverySn: string
  transportId: number
}

/**
 * @description: 二次支付
 */
export interface CallSecondPayInterface {
  payPassword: string
  transportId: number
}

/**
 * @description: 货单列表
 */
export interface GetManifestTableDataInterface {
  pageNum: number
  perPage: number
  createCompany?: string
  deliverySn?: string
  endTime: string
  isRelease?: string
  packCompany?: string
  startTime: string
  unloadCompany?: string
}

/**
 * @description: 货单详情
 */
export interface GetManifestDetailInterface {
  deliveryId: number
}

/**
 * @description: 货单列表导出
 */
export interface ManifestExportInterface {
  createCompany?: string
  deliverySn?: string
  endTime: string
  isRelease?: string
  packCompany?: string
  startTime: string
  unloadCompany?: string
}

/**
 * @description: 货单详情的运单列表
 */
export interface GetWaybillListInterface {
  perPage: number
  pageNum: number
  deliveryId: number
  transportSn?: string
  vehicleNo?: string
  paymentStatus?: Array<number>
  makeInvoiceStatus?: Array<number>
  timeType?: number
  startTime?: string
  endTime?: string
}

/**
 * @description: 货单承运协议
 */
export interface GetManifestAgreement {
  deliveryId?: number
}

/**
 * @description: 全部写入/取消
 */
export interface WriteInAllDataInterface {
  transportSn?: string
  vehicleSn?: string
  timeType: number
  startTime?: string
  endTime?: string
  deliveryId: number
  type: number
}

/**
 * @description: 写入发票
 */
export interface WriteInInvoiceInterface {
  transportIds: Array<number>
}

/**
 * @description: 咨询列表
 */
export interface GetConsultingIndexInterface {
  pageNum: number
  perPage: number
  consultSn?: string
  consultStatus?: string
  consultType?: string
  entTime?: string
  nameOrMobile?: string
  startTime?: string
}

/**
 * @description: 咨询列表导出
 */
export interface ConsultingExportInterface {
  consultSn?: string
  consultStatus?: string
  consultType?: string
  entTime?: string
  nameOrMobile?: string
  startTime?: string
}

/**
 * @description: 咨询新建
 */
export interface AddConsultingInfoInterface {
  consultTitle: string
  consultContract: string
  consultSn: string
  consultStatus: number
  consultStatusName: string
  consultType: number
  consultTypeName: string
  createName: string
  recordMobile: string
  recordName: string
  recordTime: string
}

/**
 * @description: 咨询修改
 */
export interface ModifyConsultingInfoInterface {
  consultTitle: string
  consultId: number
  consultContract: string
  consultSn: string
  consultStatus: number
  consultStatusName: string
  consultType: number
  consultTypeName: string
  createName: string
  recordMobile: string
  recordName: string
  recordTime: string
}

/**
 * @description: 咨询详情
 */
export interface GetConsultingDetailInterface {
  consultId: number
}

/**
 * @description: 咨询类型新建
 */
export interface AddConsultTypeInterface {
  consultTypeName: string
}

/**
 * @description: 咨询类型删除
 */
export interface DelConsultTypeInterface {
  consultTypeId: string
}

/**
 * @description: 咨询记录删除
 */
export interface DelConsultInfoInterface {
  consultId: Array<number>
}

/**
 * @description: 货运发票列表
 */
export interface GetFreightTableDataInterface {
  pageNum: 1
  perPage: 20
  carInvoiceStatus?: string
  carType?: string
  createCompany?: string
  endTime?: string
  etcInvoiceStatus?: Array<string>
  nameOrTitle?: string
  orderPayStatus?: Array<string>
  orderSn?: string
  orderStatus?: Array<string>
  packCompany?: string
  startTime?: string
  timeType?: number
  unloadCompany?: string
  vehicleSn?: string
}

/**
 * @description: 货运发票列表导出
 */
export interface FreightInvoiceExportInterface {
  carInvoiceStatus?: string
  carType?: string
  createCompany?: string
  endTime?: string
  etcInvoiceStatus?: Array<string>
  nameOrTitle?: string
  orderPayStatus?: Array<string>
  orderSn?: string
  orderStatus?: Array<string>
  packCompany?: string
  startTime?: string
  timeType?: number
  unloadCompany?: string
  vehicleSn?: string
}

/**
 * @description: 货运发票详情
 */
export interface GetFreightDetailInterface {
  consultId: Array<number>
}

/**
 * @description: 导入车辆备案信息
 */
export interface ImportVehicleInfoInterface {
  consultId: Array<number>
}

/**
 * @description: 导入ETC开票信息
 */
export interface ImportETCInfoInterface {
  consultId: Array<number>
}

/**
 * @description: 导入ETC开票信息
 */
export interface ImportETCDetailInterface {
  consultId: Array<number>
}
