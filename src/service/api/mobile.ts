import { $http } from '../http/index'

import { GetDingtalkAuthInterface, AddRechargeStoreInterface } from '../types/mobile'

enum Api {
  getDingtalkAuth = '/ding/getUserInfo',
  getConsignorList = '/index',
  rechargeStore = '/rechargeStore',
}

/**
 * @description: 移动端钉钉登录
 */
export function apiGetDingtalkAuth(params: GetDingtalkAuthInterface): Promise<any> {
  return $http.request({
    url: Api.getDingtalkAuth,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取货主列表
 */
export function apiGetConsignorList(): Promise<any> {
  return $http.request({
    url: Api.getConsignorList,
    method: 'POST',
  })
}

/**
 * @description: 移动充值提交
 */
export function apiAddRechargeStore(params: AddRechargeStoreInterface): Promise<any> {
  return $http.request({
    url: Api.rechargeStore,
    method: 'POST',
    params,
  })
}
