import type { AxiosRequestConfig } from 'axios'
import { AxiosTransform } from './abstracts'

export interface RequestOptions {
  // 是否处理请求结果
  isTransformRequestResult?: boolean
  // 是否加入url
  joinPrefix?: boolean
  // 接口地址， 不填则使用默认apiUrl
  apiUrl?: string
  // 错误消息提示类型
  errorMessageMode?: 'none' | 'modal'
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
  prefixUrl?: string
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}

export interface Result<T = any> {
  code: number
  type: 'success' | 'error' | 'warning'
  message: string
  data: T
}
