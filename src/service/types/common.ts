/**
 * @description: 获取用户列表
 */
export interface GetEnumsOptionsInterface {
  enumByParams: Array<string>
}

/**
 * @description: 根据银行卡号获取开户银行信息
 */
export interface GetBankCardInfoInterface {
  bankNo: string
}

/**
 * @description: 上传绥德/省厅数据
 */
export interface UploadGovDataInterface {
  transportSn: Array<string>
  transportType: number
}
