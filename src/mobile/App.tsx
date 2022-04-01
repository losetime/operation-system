import React, { Fragment, FC, useEffect } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom' //可以选择BrowserRouter，history模式
import { mobileRoutes } from '@/router/index'
import { Provider } from 'react-redux'
import store from '@/store'
import { getToken } from '@/service/api/login'
import { apiGetDingtalkAuth } from '@/service/api/mobile'
import * as dd from 'dingtalk-jsapi'
import { Toast } from 'zarm'

const App: FC = () => {
  useEffect(() => {
    dd.util.domainStorage
      .getItem({
        name: 'key',
      })
      .then((res: any) => {
        if (res.value) {
          store.dispatch({ type: 'set_user_info', value: { token: res.value } })
        } else {
          getDingtalkCode()
        }
      })
  }, [])

  // 获取钉钉免登授权码
  const getDingtalkCode = () => {
    const url = window.location.href
    const corpid = url.substr(url.indexOf('=') + 1)
    dd.ready(function () {
      dd.runtime.permission
        .requestAuthCode({
          corpId: corpid, // 企业id
        })
        .then((res) => {
          HandleGetToken(res.code)
        })
    })
  }

  // 获取token
  const HandleGetToken = (ddCode: string) => {
    getToken().then((res) => {
      if (res.code === 0) {
        getDingtalkAuth(res.data.token, ddCode)
      }
    })
  }

  // 钉钉绑定token
  const getDingtalkAuth = (token: string, ddCode: string) => {
    apiGetDingtalkAuth({
      code: ddCode,
      token: token,
    }).then((res) => {
      if (res.code === 0) {
        Toast.show('登录成功')
        store.dispatch({ type: 'set_user_info', value: { token: token } })
        dd.util.domainStorage.setItem({
          name: 'mobileToken', // 存储信息的key值
          value: token, // 存储信息的Value值
        })
      }
    })
  }

  /* exact的意思是完全匹配才渲染dom */
  return (
    <Fragment>
      <Provider store={store}>
        <Router>
          <div className='app-wrapper'>
            <Switch>
              {mobileRoutes.map((routeItem: any, key) => {
                if (routeItem.exact) {
                  return (
                    <Route
                      exact
                      key={key}
                      path={routeItem.path}
                      render={(props: any) => <routeItem.component {...props} />}
                    ></Route>
                  )
                } else {
                  return (
                    <Route
                      key={key}
                      path={routeItem.path}
                      render={(props: any) => <routeItem.component {...props} />}
                    ></Route>
                  )
                }
              })}
            </Switch>
          </div>
        </Router>
      </Provider>
    </Fragment>
  )
}

export default App
