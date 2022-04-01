import moment from 'moment'

/**
 * 添加一个对象作为参数到URL中
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  let url = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters
  }
  return url
}

export function deepMerge<T = any>(src: any, target: any): T {
  let key: string
  for (key in target) {
    src[key] =
      src[key] && src[key].toString() === '[object Object]'
        ? deepMerge(src[key], target[key])
        : (src[key] = target[key])
  }
  return src
}

/**
 * 获取本周的开始时间和结束时间
 */
export function getCurrentWeek(formatType?: string): string[] {
  const start = moment()
    .startOf('isoWeek')
    .format(formatType || 'YYYY-MM-DD') //本周一
  const end = moment()
    .endOf('isoWeek')
    .format(formatType || 'YYYY-MM-DD') //本周日
  return [start, end]
}

/**
 * 获取本月的开始时间和结束时间
 */
export function getCurrentMonth(formatType?: string): string[] {
  const start = moment()
    .startOf('month')
    .format(formatType || 'YYYY-MM-DD')
  const end = moment()
    .endOf('month')
    .format(formatType || 'YYYY-MM-DD')
  return [start, end]
}

/**
 * 数字大写
 */
export const convertCurrency = (money: string): string => {
  //汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  //基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  //对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  //对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘']
  //整数金额时后面跟的字符
  const cnInteger = '整'
  //整型完以后的单位
  const cnIntLast = '元'
  //最大处理的数字
  const maxNum = 999999999999999.9999
  //金额整数部分
  let integerNum
  //金额小数部分
  let decimalNum
  //输出的中文金额字符串
  let chineseStr = ''
  //分离金额后用的数组，预定义
  let parts
  //转换中间变量
  let convertMoney

  if (money === '') {
    return ''
  }
  convertMoney = parseFloat(money)
  if (convertMoney >= maxNum) {
    //超出最大处理数字
    return ''
  }
  if (convertMoney === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 判断为负数
  if (convertMoney < 0) {
    chineseStr = '负'
    convertMoney = Math.abs(convertMoney)
  }
  //转换为字符串
  convertMoney = convertMoney.toString()
  if (convertMoney.indexOf('.') === -1) {
    integerNum = convertMoney
    decimalNum = ''
  } else {
    parts = convertMoney.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        //归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  //小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}
