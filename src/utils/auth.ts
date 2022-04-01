import store from '@/store'

/**
 * @description:  获取token
 */
export function getToken(): string {
  return store.getState().userInfo.token
}

/**
 * @description: 获取操作权限
 */
export function getOperationAuth(authKey: string): boolean {
  const operationAuth = store.getState().authInfo.operationAuth
  const activeMenu = store.getState().activeMenu
  try {
    if (operationAuth[activeMenu][authKey]) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('权限请求出错：', error)
    return false
  }
}
