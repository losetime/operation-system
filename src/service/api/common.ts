import { $http } from '../http/index'

import { GetEnumsOptionsInterface, GetBankCardInfoInterface, UploadGovDataInterface } from '../types/common'

enum Api {
  getEnumsOptions = '/transport/enumeration',
  getBankCardInfo = '/transport/checkBank',
  uploadGovData = '/transport/provincialGovernment',
}

/**
 * @description: 获取枚举通用接口
 */
export function apiGetEnumsOptions(params: GetEnumsOptionsInterface): Promise<any> {
  return $http.request({
    url: Api.getEnumsOptions,
    method: 'POST',
    params,
  })
}

/**
 * @description: 根据银行卡号获取开户银行信息
 */
export function apiGetBankCardInfo(params: GetBankCardInfoInterface): Promise<any> {
  return $http.request({
    url: Api.getBankCardInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 上传绥德/省厅数据
 */
export function apiUploadGovData(params: UploadGovDataInterface): Promise<any> {
  return $http.request({
    url: Api.uploadGovData,
    method: 'POST',
    params,
  })
}
