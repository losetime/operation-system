/**
 * @description: 货单详情数据
 */
export interface ManifestDetailInterface {
  isRelease: number
  deliverySn: string
  dataSource: string
  allowRange: number
  deliveryDistance: string
  packPercentage: string
  unloadPercentage: string
  freightCalcRule: number
  isDeductionLoss: number
  lossCalcRule: number
  freightIgnoreZeroRule: number
  realPayedFreightRule: number
  pack: MapInfoInterface
  unload: MapInfoInterface
}

/**
 * @description: 地图信息
 */
export interface MapInfoInterface {
  address: string
  city: string
  company: string
  contact: string
  contactTel: string
  county: string
  latItude: string
  longItude: string
  province: string
  allowRange?: number
}

/**
 * @description: 运单列表枚举
 */
export interface WaybillListOptionsInterface {
  transportStatus: Array<EnumInterface>
  tradeStatus: Array<EnumInterface>
  makeInvoiceStatus: Array<EnumInterface>
}

export interface EnumInterface {
  label: number
  text: string
}

/**
 * @description: 运单统计
 */
export interface StatisticsInterface {
  transportCount: string
  realMineSendWeight: string
  realTransportWeight: string
  realPayAmount: string
  realPayCount: string
  realPayCountAmount: string
}
