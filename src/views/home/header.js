import React, { Fragment, useEffect } from 'react'
import { signOut } from '@/service/api/login'
import '../../style/home/header.less'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import { createHashHistory } from 'history'
import { Breadcrumb, Modal, Tag } from 'antd'
import ModifyPassword from '@/components/home/modifyPassword'
import {
  UserOutlined,
  LogoutOutlined,
  UnlockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExclamationCircleOutlined,
  BugFilled,
} from '@ant-design/icons'

const Header = withRouter((props) => {
  const { location } = props
  const { confirm } = Modal
  const env = process.env.REACT_APP_ENV

  const breadcrumbNameMap = {
    '/home/homePage': '后台首页',
    '/home/manifest': '运营管理 > 货单管理',
    '/home/waybill': '运营管理 > 运单管理',
    '/home/consignor': '信息管理 > 货主信息管理',
    '/home/driver': '信息管理 > 司机信息管理',
    '/home/vehicle': '信息管理 > 车辆信息管理',
    '/home/contract': '信息管理 > 托运合同管理',
    '/home/bankCard': '信息管理 > 银行卡信息管理',
    '/home/invoicing': '信息管理 > 开票信息管理',
    '/home/invoiceApproval': '财务管理 > 货主开票审批',
    '/home/funds': '财务管理 > 货主资金管理',
    '/home/confirmInvoiceInfo': '财务管理 > 货主开票审批 > 确认开票审批',
    '/home/freightInvoice': '运营管理 > 货运发票',
    '/home/consulting': '运营管理 > 咨询记录',
    '/home/users': '权限管理 > 用户列表',
    '/home/carriageAgreement': '信息管理 > 承运协议管理',
    '/home/profitWithdrawal': '财务管理 > 利润提现审批',
    '/home/profitWithdrawalDetail': '财务管理 > 利润详情',
    '/home/payFailure': '财务管理 > 支付失败管理',
    '/home/oilTicketDeduction': '财务管理 > 油票抵扣审批',
    '/home/oilTicketDeductionDetail': '财务管理 > 油票抵扣详情',
    '/home/statisticalCenter': '数据管理 > 数据统计',
  }

  const pathSnippets = location.pathname.split('/').filter((i) => i)

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return <Breadcrumb.Item key={url}>{breadcrumbNameMap[url]}</Breadcrumb.Item>
  })

  const breadcrumbItems = [<Breadcrumb.Item key='home'></Breadcrumb.Item>].concat(extraBreadcrumbItems)

  useEffect(() => {
    props.actions.setUserInfo(JSON.parse(localStorage.getItem('jwUserInfo')))
  }, [])

  // 打开/收回侧边栏
  const sidebarToggle = () => {
    props.actions.setSidebarStatus(!props.sidebarStatus)
  }

  //修改密码
  const onModifyPassword = () => {
    props.actions.setModifyPasswordDialogStatus(true)
  }

  // 登录退出
  const onSignOut = () => {
    confirm({
      title: '操作提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要退出登录吗?',
      onOk() {
        signOut().then((res) => {
          if (res.code === 0) {
            localStorage.removeItem('jwUserInfo')
            const hashRouter = createHashHistory()
            hashRouter.replace('/login')
          }
        })
      },
      onCancel() {},
    })
  }

  return (
    <Fragment>
      <div className='header-wrapper'>
        <div className='sidebar-trigger-wrap'>
          {React.createElement(props.sidebarStatus ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'sidebar-trigger',
            onClick: sidebarToggle,
          })}
        </div>
        <div className='info-wrap'>
          <div className='current-router-wrap'>
            <Breadcrumb separator=''>{breadcrumbItems}</Breadcrumb>
          </div>
          <div className='user-wrap'>
            {env === 'qa' ? (
              <Tag color='#f84507' icon={<BugFilled />}>
                测试
              </Tag>
            ) : null}
            <div className='user-name-wrap'>
              <UserOutlined />
              <p>{props.userInfo ? props.userInfo.userName : ''}</p>
            </div>
            <div className='modify-password-wrap' onClick={onModifyPassword}>
              <UnlockOutlined />
              <p>修改密码</p>
            </div>
            <div className='quite-wrap' onClick={onSignOut}>
              <LogoutOutlined />
              <p>退出</p>
            </div>
          </div>
        </div>
      </div>
      <ModifyPassword></ModifyPassword>
    </Fragment>
  )
})

const mapStateProps = (state) => {
  return {
    sidebarStatus: state.sidebarStatus,
    userInfo: state.userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Header)
