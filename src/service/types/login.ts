/**
 * @description: 登录
 */
export interface SubmitLoginInterface {
  username: string
  userPassword: string
  token: string
}

/**
 * @description: 修改登录密码
 */
export interface UpdatePasswordInterface {
  oldPassword: string
  newPassword: string
}
