import React, { Fragment, useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom' //可以选择BrowserRouter，history模式
import { firstRoutes } from './router/index'
import { Umeng } from '@/middleware/umeng'
import { Spin } from 'antd'
import context from '@/store/context'
function App() {
  const [globalLoading, setGlobalLoading] = useState(false)
  useEffect(() => {
    Umeng()
  }, [])

  /* exact的意思是完全匹配才渲染dom */
  return (
    <Fragment>
      <Provider store={store}>
        <context.Provider value={{ setGlobalLoading }}>
          <Router>
            <div className='app-wrapper'>
              {globalLoading ? <Spin className='global-spin-wrap' /> : null}
              <Switch>
                {firstRoutes.map((routeItem, key) => {
                  if (routeItem.exact) {
                    return (
                      <Route
                        exact
                        key={key}
                        path={routeItem.path}
                        render={(props) => <routeItem.component {...props} />}
                        state={{ a: 2 }}
                      ></Route>
                    )
                  } else {
                    return (
                      <Route
                        key={key}
                        path={routeItem.path}
                        render={(props) => <routeItem.component {...props} />}
                        state={{ a: 1 }}
                      ></Route>
                    )
                  }
                })}
                <Redirect exact from='/' to='/login' />
              </Switch>
            </div>
          </Router>
        </context.Provider>
      </Provider>
    </Fragment>
  )
}

export default App
