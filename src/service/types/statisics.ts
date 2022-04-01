/**
 * @description: 获取统计中心数据
 */
export interface GetStatisticalDataInterface {
  startTime: string
  endTime: string
}

/**
 * @description: 获取数据总概览
 */
export interface GetDataOverviewInterface {
  dataType: number
  startTime: string
  endTime: string
}

/**
 * @description: 获取运单来源统计
 */
export interface GetSourceOfWaybillInterface {
  dataType: number
  startTime: string
  endTime: string
}

/**
 * @description: 获取运单数据统计
 */
export interface GetWaybillDataStatisticsInterface {
  dataType: number
  startTime: string
  endTime: string
}

/**
 * @description: 获取车辆、司机新增统计
 */
export interface GetVehiclesAndDriversInterface {
  dataType: number
  startTime: string
  endTime: string
}
