import { $http } from '../http/index'

import { SubmitLoginInterface, UpdatePasswordInterface } from '../types/login'

enum Api {
  getToken = '/getToken',
  submitLogin = '/transport/login',
  signOut = '/transport/loginOut',
  updatePassword = '/transport/changePassword',
}

/**
 * @description: 获取token
 */
export function getToken(): Promise<any> {
  return $http.request({
    url: Api.getToken,
    method: 'POST',
  })
}

/**
 * @description: 登录
 */
export function submitLogin(params: SubmitLoginInterface): Promise<any> {
  $http.setHeader({
    Authorization: `Bearer ${params.token}`,
  })
  return $http.request({
    url: Api.submitLogin,
    method: 'POST',
    params,
  })
}

/**
 * @description: 退出
 */
export function signOut(): Promise<any> {
  return $http.request({
    url: Api.signOut,
    method: 'POST',
  })
}

/**
 * @description: 修改登录密码
 */
export function updatePassword(params: UpdatePasswordInterface): Promise<any> {
  return $http.request({
    url: Api.updatePassword,
    method: 'POST',
    params,
  })
}
