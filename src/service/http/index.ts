import type { CreateAxiosOptions } from './types'
import { transform } from './transform'
import { deepMerge } from '@/utils/base'
import { initAxios } from './axios'
import { ContentTypeEnum } from '@/enums/httpEnum'
import { REACT_APP_BASEURL, Prefix } from '@/enums/envEnum'

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new initAxios(
    deepMerge(
      {
        timeout: 10 * 1000,
        // 基础接口地址
        baseURL: REACT_APP_BASEURL,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        prefixUrl: Prefix,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 需要对返回数据进行处理
          isTransformRequestResult: false,
          // 消息提示类型
          errorMessageMode: 'none',
          // 其他接口地址
          apiUrl: '',
        },
      },
      opt || {}
    )
  )
}

export const $http = createAxios()
