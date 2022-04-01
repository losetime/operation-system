import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'

import axios from 'axios'
// import { AxiosCanceler } from './axiosCancel'
import { isFunction } from '@/utils/is'
import { cloneDeep } from 'lodash-es'

import type { RequestOptions, CreateAxiosOptions, Result } from './types'
import { ContentTypeEnum } from '@/enums/httpEnum'
import { errorResult } from './const'

export * from './abstracts'

/**
 * @description:  axios模块
 */
export class initAxios {
  private axiosInstance: AxiosInstance
  private options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  private getTransform() {
    const { transform } = this.options
    return transform
  }

  /**
   * @description: 设置通用header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  /**
   * @description: 拦截器配置
   */
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform

    // const axiosCanceler = new AxiosCanceler()

    // 请求拦截器配置处理
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      // const { headers: { ignoreCancelToken } = { ignoreCancelToken: false } } = config
      // !ignoreCancelToken && axiosCanceler.addPending(config)
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config)
      }
      return config
    }, undefined)

    // 请求拦截器错误捕获
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      let resTemp: AxiosResponse<any> | any = cloneDeep(res)
      // res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        resTemp = responseInterceptors(resTemp)
      }
      return resTemp
    }, undefined)

    // 响应结果拦截器错误捕获
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
  }

  /**
   * @description: 文件上传
   */
  uploadFiles<T = any>(config: AxiosRequestConfig, params: any, options?: any): Promise<T> {
    const formData = new FormData()
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key as any])
    })
    return this.request(
      {
        ...config,
        method: 'POST',
        data: formData,
        headers: {
          'Content-type': ContentTypeEnum.FORM_DATA,
        },
      },
      options
    )
  }

  /**
   * @description: 请求方法
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: AxiosRequestConfig = cloneDeep(config)
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt: RequestOptions = Object.assign({}, requestOptions, options)
    const { beforeRequestHook, requestCatch, transformRequestData } = transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res) => {
          if ((res as unknown) === errorResult) {
            resolve((res as unknown) as Promise<T>)
          } else {
            if (transformRequestData && isFunction(transformRequestData)) {
              const transformRes = transformRequestData(res, opt)
              resolve(transformRes)
            } else {
              resolve((res as unknown) as Promise<T>)
            }
          }
        })
        .catch((e: Error) => {
          if (requestCatch && isFunction(requestCatch)) {
            reject(requestCatch(e))
            return
          }
          reject(e)
        })
    })
  }
}
