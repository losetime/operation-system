import type { AxiosResponse } from 'axios'
import type { RequestOptions } from './types'
import { getToken } from '@/utils/auth'
import { AxiosTransform } from './abstracts'
import { checkStatus } from './checkStatus'
import { RequestEnum, ResultEnum } from '@/enums/httpEnum'
import { Prefix } from '@/enums/envEnum'
import { isString } from '@/utils/is'
import { errorResult } from './const'
import { downloadFiles } from '@/utils/business'

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const transform: AxiosTransform = {
  /**
   * @description: 请求拦截处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    const token = getToken()
    if (token) {
      // jwt token
      config.headers.common['Authorization'] = `Bearer ${token}`
    }
    config.timeout = 0
    return config
  },

  /**
   * @description: 请求之前处理config
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix } = options
    // 拼接接口中间变量
    if (joinPrefix) {
      config.url = `${Prefix}${config.url}`
    }
    // 重新设置请求基础接口
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    // 判断请求类型
    if (config.method === RequestEnum.GET) {
      const now = new Date().getTime()
      if (!isString(config.params)) {
        config.data = {
          // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
          params: Object.assign(config.params || {}, {
            _t: now,
          }),
        }
      } else {
        // 兼容restful风格
        config.url = config.url + config.params + `?_t=${now}`
        config.params = {}
      }
    } else {
      // 说明是上传
      if (config.data) {
        return config
      }
      // 普通post请求
      else {
        config.data = config.params
        config.params = {}
      }
    }
    return config
  },

  /**
   * @description: 响应拦截处理
   */
  responseInterceptors: (res): AxiosResponse<any> | any => {
    const { code, message } = res.data
    if (code === ResultEnum.SUCCESS) {
      return Promise.resolve(res)
    } else if (res.config.responseType === 'blob') {
      return Promise.resolve(res)
    } else {
      checkStatus(code, message)
      return Promise.resolve(errorResult)
    }
  },

  /**
   * @description: 处理响应成功的数据
   */
  transformRequestData: (res: any, options: RequestOptions) => {
    const { isTransformRequestResult } = options
    // 请求错误
    if (res === errorResult) {
      return res
    } else {
      if (isTransformRequestResult) {
        return res.data.data
      }
      // 下载文件，直接返回所有信息
      else if (res.config.responseType === 'blob') {
        downloadFiles(res)
        return Promise.resolve(res)
      }
      // 过滤第一层，返回{code,data,message}
      else {
        return res.data
      }
    }
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    if (error.response) {
      if (error.response && error.response.status) {
        checkStatus(error.response && error.response.status)
      }
      // 发送前端请求异常
      if (error.response.config.url !== 'report') {
        fetch(`${process.env.REACT_APP_DEBUGGER_DOMAIN}/api/v1/report`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8;',
          },
          body: JSON.stringify({
            source: '运营PC',
            requestHeaders: error.response.config.headers, // 前端请求头
            responseHeaders: error.response.headers, // 后端请求头
            data: error.response.config.data, // 请求参数
            url: error.response.config.baseURL + error.response.config.url, // 请求URL
            status: error.response.status, // 错误码
            host: window.location.href, // 域名
          }),
        })
      }
    } else {
      checkStatus(0, '网络异常,请刷新重试')
    }

    return Promise.resolve(errorResult)
  },
}
