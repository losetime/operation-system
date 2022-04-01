import { perPage } from '@/enums/common'
import moment from 'moment'
import { message } from 'antd'

/**
 * @desc 分页参数
 */
export const paginationObj = (total: string, tableParams: any) => {
  return {
    size: 'default',
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: () => `共${total}条`,
    pageSize: perPage,
    current: tableParams.pageNum,
    total: total,
  }
}

/**
 * @desc 格式化对象，去除字符串两边空格，格式化moment时间
 */
export const formatParams = (obj: any, dateFormat: string) => {
  const convertObj = Object.assign({}, obj)
  for (const item in convertObj) {
    if (convertObj[item] === undefined || convertObj[item] === null) {
      delete convertObj[item]
    } else if (typeof convertObj[item] === 'string') {
      convertObj[item] = convertObj[item].trim()
    } else if (convertObj[item] instanceof Object) {
      if (convertObj[item]._isAMomentObject) {
        convertObj[item] = convertObj[item].format(dateFormat ? dateFormat : 'YYYY-MM-DD')
      }
    }
  }
  return convertObj
}

/**
 * @desc 比较时间大小
 */
export const compareDate = (startTime: string | Date, endTime: string | Date): boolean => {
  let start = moment()
  let end = moment()
  if (startTime && endTime) {
    if (typeof startTime === 'string' || startTime instanceof Date) {
      start = moment(startTime)
    }
    if (typeof endTime === 'string' || endTime instanceof Date) {
      end = moment(endTime)
    }
    if (end.diff(start, 'seconds') >= 0) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * @desc 下载文件
 */
export const downloadFiles = (res: any) => {
  let fileName = res.headers['content-disposition']
  if (fileName) {
    if (fileName.includes('filename*')) {
      fileName = decodeURIComponent(fileName.split(';')[2].split('=')[1].substr(7))
    } else {
      fileName = fileName.split(';')[1].split('=')[1]
    }
    if ('msSaveOrOpenBlob' in navigator) {
      window.navigator.msSaveOrOpenBlob(res.data, fileName)
    } else {
      const elink = document.createElement('a')
      elink.download = fileName
      elink.href = URL.createObjectURL(res.data)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
    }
  } else {
    const reader = new FileReader()
    reader.onload = function () {
      const content: any = reader.result
      const msg = JSON.parse(content).message // 错误信息
      message.warn(msg)
    }
    reader.readAsText(res.data)
  }
}
