/**
 * @description: 获取钉钉权限
 */
export interface GetDingtalkAuthInterface {
  code: string
  token: string
}

/**
 * @description: 移动端充值提交
 */
export interface AddRechargeStoreInterface {
  rechargeType: string
  userId: number
  rechargeAmount: string
  rechargeAmountFreeze?: string
  rechargeLicense?: string
  failedExplain?: string
}
