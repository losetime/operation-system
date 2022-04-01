import { $http } from '../http/index'

import {
  GetUsersListInterface,
  CreateUserInterface,
  UpdateUserInterface,
  DisableAccountInferface,
  RestoreInitialPasswordInferface,
  GetAuthInfoInferface,
  RestoreDefaultAuthInferface,
  SaveAuthSettingInferface,
} from '../types/authority'

enum Api {
  getUsersList = '/transport/adminUserIndex',
  addUser = '/transport/adminUserStore',
  editUser = '/transport/adminUserSave',
  isDisableAccount = '/transport/adminUserDisable',
  restoreInitialPassword = '/transport/adminUserSavePass',
  getAuthInfo = '/transport/allMenuList',
  restoreDefault = '/transport/adminUserResetAuth',
  saveAuthSetting = '/transport/adminUserSaveAuthority',
}

/**
 * @description: 获取用户列表
 */
export function getUsersList(params: GetUsersListInterface): Promise<any> {
  return $http.request({
    url: Api.getUsersList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 新增用户
 */
export function createUser(params: CreateUserInterface): Promise<any> {
  return $http.request({
    url: Api.addUser,
    method: 'POST',
    params,
  })
}

/**
 * @description: 编辑用户
 */
export function updateUser(params: UpdateUserInterface): Promise<any> {
  return $http.request({
    url: Api.editUser,
    method: 'POST',
    params,
  })
}

/**
 * @description: 禁用/打开账号
 */
export function disableAccount(params: DisableAccountInferface): Promise<any> {
  return $http.request({
    url: Api.isDisableAccount,
    method: 'POST',
    params,
  })
}

/**
 * @description: 恢复初始密码
 */
export function restoreInitialPassword(params: RestoreInitialPasswordInferface): Promise<any> {
  return $http.request({
    url: Api.restoreInitialPassword,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取所有权限信息
 */
export function apiGetAuthInfo(params: GetAuthInfoInferface): Promise<any> {
  return $http.request({
    url: Api.getAuthInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 权限恢复默认
 */
export function apiRestoreDefault(params: RestoreDefaultAuthInferface): Promise<any> {
  return $http.request({
    url: Api.restoreDefault,
    method: 'POST',
    params,
  })
}

/**
 * @description: 保存权限设置
 */
export function apiSaveAuthSetting(params: SaveAuthSettingInferface): Promise<any> {
  return $http.request({
    url: Api.saveAuthSetting,
    method: 'POST',
    params,
  })
}
