import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '@/style/init.css'
import 'zarm/dist/zarm.css'
// import 'moment/locale/zh-cn'
// import { ConfigProvider } from 'antd-mobile'
// import zhCN from 'antd-mobile/es/locale/zh_CN'

ReactDOM.render(
  // 注释掉的是DOM的严格模式，antd目前会报错
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // <ConfigProvider locale={zhCN}>
  //   <App />
  // </ConfigProvider>,
  document.getElementById('root')
)
