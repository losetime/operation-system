import { $http } from '../http/index'

import { ModifyPayPasswordInterface } from '../types/home'

enum Api {
  getMenuList = '/transport/menuList',
  resetPayPassword = '/transport/resetPaypassword',
  modifyPayPassword = '/transport/changePayPass',
  getHomePageInfo = '/transport/getIndexInfo',
  getHomePageAmount = '/transport/getYbAccountAmount',
}

/**
 * @description: 获取菜单列表
 */
export function apiGetMenuList(): Promise<any> {
  return $http.request({
    url: Api.getMenuList,
    method: 'POST',
  })
}

/**
 * @description: 重置支付密码
 */
export function apiResetPayPassword(): Promise<any> {
  return $http.request({
    url: Api.resetPayPassword,
    method: 'POST',
  })
}

/**
 * @description: 修改支付密码
 */
export function apiModifyPayPassword(params: ModifyPayPasswordInterface): Promise<any> {
  return $http.request({
    url: Api.modifyPayPassword,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取主页相关信息
 */
export function apiGetHomePageInfo(): Promise<any> {
  return $http.request({
    url: Api.getHomePageInfo,
    method: 'POST',
  })
}

/**
 * @description: 获取易宝相关数据
 */
export function apiGetHomePageAmount(): Promise<any> {
  return $http.request({
    url: Api.getHomePageAmount,
    method: 'POST',
  })
}
