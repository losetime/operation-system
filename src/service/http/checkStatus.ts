import { message, Modal } from 'antd'
import { createHashHistory } from 'history'

// 重新登录
const afreshLogin = (msg: string) => {
  const hashRouter = createHashHistory()
  Modal.error({
    title: '提示',
    content: msg,
    onOk() {
      localStorage.removeItem('jwUserInfo')
      hashRouter.replace('/login')
    },
  })
}

export function checkStatus(status: number, msg?: string): void {
  switch (status) {
    // 没有token
    case 2000007:
      afreshLogin(msg as string)
      break
    // 没有权限
    case 2000010:
      afreshLogin(msg as string)
      break
    // 用户被禁用
    case 2000008:
      afreshLogin(msg as string)
      break
    // 重新支付
    case 8000001:
      Modal.error({
        title: '提示',
        content: msg,
      })
      break
    // 支付状态查询错误
    case 99999:
      break
    // 重新支付返回值
    case 99998:
      break
    // 移动端登录失败
    case 9000002:
      const hashRouter = createHashHistory()
      hashRouter.replace('/noAuth')
      break
    case 400:
      message.error(`${msg}`)
      break
    case 401:
      message.error('用户没有权限（令牌、用户名、密码错误）!')
      break
    case 403:
      message.error('用户得到授权，但是访问是被禁止的。!')
      break
    // 404请求不存在
    case 404:
      message.error('网络请求错误,未找到该资源!')
      break
    case 405:
      message.error('网络请求错误,请求方法未允许!')
      break
    case 408:
      message.error('网络请求超时!')
      break
    case 500:
      message.error('服务器错误,请联系管理员!')
      break
    case 501:
      message.error('网络未实现!')
      break
    case 502:
      message.error('网络错误!')
      break
    case 503:
      message.error('服务不可用，服务器暂时过载或维护!')
      break
    case 504:
      message.error('网络超时!')
      break
    case 505:
      message.error('http版本不支持该请求!')
      break
    default:
      message.error(msg)
  }
}
