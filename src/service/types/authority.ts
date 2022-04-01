/**
 * @description: 获取用户列表
 */
export interface GetUsersListInterface {
  pageNum: number
  perPage: number
  nameOrTel?: string
  isDisabled?: string
}

/**
 * @description: 新增用户
 */
export interface CreateUserInterface {
  realName: string
  roleId: number
  mobile: string
  remark?: string
}

/**
 * @description: 编辑用户
 */
export interface UpdateUserInterface {
  realName: string
  roleId: number
  mobile: string
  remark?: string
}

/**
 * @description: 禁用/打开账号
 */
export interface DisableAccountInferface {
  userId: number
}

/**
 * @description: 恢复初始密码
 */
export interface RestoreInitialPasswordInferface {
  userId: number
}

/**
 * @description: 获取所有权限信息
 */
export interface GetAuthInfoInferface {
  adminUserId: number
}

/**
 * @description: 权限恢复默认
 */
export interface RestoreDefaultAuthInferface {
  userId: number
}

/**
 * @description: 保存权限设置
 */
export interface SaveAuthSettingInferface {
  userId: number
  menuList: Array<number>
}
