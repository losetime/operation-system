import React, { Suspense, useEffect } from 'react'
import { apiGetMenuList } from '@/service/api/home'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '../../style/home/home.less'
import { HashRouter as Router, Route, useLocation } from 'react-router-dom' //可以选择BrowserRouter，history模式
import { secondRoutes } from '../../router/index'
import Header from './header'
import SideBar from './sidebar'
import { Spin } from 'antd'

function Home(props) {
  // 获取菜单列表
  useEffect(() => {
    apiGetMenuList().then((res) => {
      if (res.code === 0) {
        props.actions.setAuthInfo(res.data)
      }
    })
  }, [props.actions])

  let location = useLocation()

  useEffect(() => {
    if (window._czc) {
      let location = window.location
      let contentUrl = location.pathname + location.hash
      let refererUrl = '/'
      window._czc.push(['_trackPageview', contentUrl, refererUrl])
    }
  }, [location])

  /* exact的意思是完全匹配才渲染dom */
  return (
    <div className='home-wrapper'>
      <SideBar></SideBar>
      <div className='home-content-wrap'>
        <Header></Header>
        <Router>
          <div className='router-view-wrap'>
            <Suspense fallback={<Spin tip='页面加载中...' />}>
              {secondRoutes.map((routeItem, key) => {
                if (routeItem.exact) {
                  return (
                    <Route
                      exact
                      key={key}
                      path={routeItem.path}
                      render={(props) => <routeItem.component {...props} />}
                    ></Route>
                  )
                } else {
                  return (
                    <Route
                      key={key}
                      path={routeItem.path}
                      render={(props) => <routeItem.component {...props} />}
                    ></Route>
                  )
                }
              })}
            </Suspense>
          </div>
        </Router>
      </div>
    </div>
  )
}

const mapStateProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Home)
