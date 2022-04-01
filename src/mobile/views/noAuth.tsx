import React, { FC, ReactElement } from 'react'
import '@/style/mobile/noAuth.less'

const noAuth: FC = (): ReactElement => {
  return <div className='no-auth-wrap'>登录失败，请返回重试</div>
}

export default noAuth
