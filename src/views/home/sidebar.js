import React, { useState, useEffect } from 'react'
import { createHashHistory } from 'history'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { bindActionCreators } from 'redux'
import '../../style/home/sidebar.less'
import { Layout, Menu } from 'antd'
import * as Icon from '@ant-design/icons'
import IconFont from '@/middleware/iconfont'
import { useHistory } from 'react-router-dom'

const SideBar = (props) => {
  const { SubMenu } = Menu
  const { Sider } = Layout
  const rootSubmenuKeys = ['信息管理', '运营管理', '财务管理', '权限管理', '数据管理']

  const [currentOpenKey, setCurrentOpenKey] = useState([])
  const [menuList, setMenuList] = useState([])
  const history = useHistory()

  useEffect(() => {
    const activeMenu = history.location.pathname.split('/')[2]
    if (activeMenu === 'confirmInvoiceInfo') {
      props.actions.setActiveMenu('invoiceApproval')
    } else {
      props.actions.setActiveMenu(activeMenu)
    }
  }, [])

  useEffect(() => {
    setMenuList(props.authInfo.menuAuth)
  }, [props.authInfo])

  const onMenuClick = (value) => {
    props.actions.setActiveMenu(value.key.split('/')[2])
    const hashRouter = createHashHistory()
    hashRouter.replace(value.key)
  }

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find((key) => currentOpenKey.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setCurrentOpenKey(openKeys)
    } else {
      latestOpenKey ? setCurrentOpenKey([latestOpenKey]) : setCurrentOpenKey([])
    }
  }

  return (
    <div className='sidebar-wrapper'>
      <Sider collapsed={props.sidebarStatus} collapsible trigger={null} width={240}>
        <div className='sidebar-logo'>
          <img
            alt='logo'
            className={props.sidebarStatus ? 'putAwayLogo' : 'unfoldLogo'}
            src={
              props.sidebarStatus
                ? require('@/assets/images/putAwayLogo.svg')
                : require('@/assets/images/unfoldLogo.svg')
            }
          />
        </div>
        <Menu
          defaultSelectedKeys={['/home/homePage']}
          mode='inline'
          onClick={onMenuClick}
          onOpenChange={onOpenChange}
          openKeys={currentOpenKey}
          theme='light'
        >
          <Menu.Item key='/home/homePage'>
            {React.createElement(Icon['HomeOutlined'])}
            <span>后台首页</span>
          </Menu.Item>
          {menuList.length > 0
            ? menuList.map((item) => {
                return (
                  <SubMenu
                    icon={
                      item.firstMenuIcon.includes('icon') ? (
                        <IconFont type={item.firstMenuIcon} />
                      ) : (
                        React.createElement(Icon[item.firstMenuIcon])
                      )
                    }
                    key={item.firstMenuName}
                    title={item.firstMenuName}
                  >
                    {item.twoMenu.map((val) => {
                      return <Menu.Item key={val.twoMenuUrl}>{val.twoMenuName}</Menu.Item>
                    })}
                  </SubMenu>
                )
              })
            : null}
        </Menu>
      </Sider>
    </div>
  )
}

const mapStateProps = (state) => {
  return {
    sidebarStatus: state.sidebarStatus,
    authInfo: state.authInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(SideBar)
