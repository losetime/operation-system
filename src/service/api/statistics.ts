import { $http } from '../http/index'

import {
  GetStatisticalDataInterface,
  GetDataOverviewInterface,
  GetSourceOfWaybillInterface,
  GetWaybillDataStatisticsInterface,
  GetVehiclesAndDriversInterface,
} from '../types/statisics'

enum Api {
  getStatisticalData = '/dataStatistics/index',
  getDataOverview = '/dataStatistics/dataOverview',
  getSourceOfWaybill = '/dataStatistics/sourceOfWaybill',
  getWaybillDataStatistics = '/dataStatistics/waybillDataStatistics',
  getVehiclesAndDrivers = '/dataStatistics/vehiclesAndDrivers',
}

/**
 * @description: 获取统计中心数据
 */
export function apiGetStatisticalData(params: GetStatisticalDataInterface): Promise<any> {
  return $http.request({
    url: Api.getStatisticalData,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取数据总概览
 */
export function apiGetDataOverview(params: GetDataOverviewInterface): Promise<any> {
  return $http.request({
    url: Api.getDataOverview,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取运单来源统计
 */
export function apiGetSourceOfWaybill(params: GetSourceOfWaybillInterface): Promise<any> {
  return $http.request({
    url: Api.getSourceOfWaybill,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取运单数据统计
 */
export function apiGetWaybillDataStatistics(params: GetWaybillDataStatisticsInterface): Promise<any> {
  return $http.request({
    url: Api.getWaybillDataStatistics,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取车辆、司机新增统计
 */
export function apiGetVehiclesAndDrivers(params: GetVehiclesAndDriversInterface): Promise<any> {
  return $http.request({
    url: Api.getVehiclesAndDrivers,
    method: 'POST',
    params,
  })
}
