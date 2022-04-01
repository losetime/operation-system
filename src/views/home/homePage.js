import React, { useState, useEffect } from 'react'
import { apiGetHomePageInfo, apiResetPayPassword, apiGetHomePageAmount } from '@/service/api/home'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import { bindActionCreators } from 'redux'
import '@/style/home/homepage.less'
import { Button, message, Modal } from 'antd'
import ModifyPayPassword from '@/components/home/modifyPayPassword'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const HomePage = (props) => {
  const { confirm } = Modal

  const [homePageInfo, setHomePageInfo] = useState({})
  const [homePageAmount, setHomePageAmount] = useState({})
  const [isShowAmount, setisShowAmount] = useState(false)

  useEffect(() => {
    getHomePageInfo()
  }, [])

  const getHomePageInfo = () => {
    apiGetHomePageInfo().then((res) => {
      if (res.code === 0) {
        setHomePageInfo(res.data)
      }
    })
  }

  // 重置支付密码
  const resetPayPassword = () => {
    confirm({
      title: '操作提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要重置支付密码吗?',
      onOk() {
        apiResetPayPassword().then((res) => {
          if (res.code === 0) {
            message.success('重置密码成功')
          }
        })
      },
    })
  }

  // 修改支付密码
  const modifyPayPassword = () => {
    props.actions.setModifyPayPasswordDialogStatus(true)
  }

  //重新获取数据
  const getAmount = () => {
    setisShowAmount(true)
    apiGetHomePageAmount().then((res) => {
      if (res.code === 0) {
        setHomePageAmount(res.data)
      }
    })
  }

  return (
    <div className='homepage-wrapper'>
      <div className='user-header-wrap'>
        <div className='user-info-wrap'>
          <div className='say-hello'>欢迎登录运营操作平台，happy one day ~ 😀</div>
          <div className='user-info'>
            <div className='user-name'>
              <p className='user-name-item'>
                <span className='show-span'>真实姓名：</span>
                <span className='show-span'>
                  {homePageInfo.adminUserInfo ? homePageInfo.adminUserInfo.admin_real_name : ''}
                </span>
              </p>
              <p className='user-name-item'>
                <span className='show-span'>登录手机号：</span>
                <span className='show-span'>
                  {homePageInfo.adminUserInfo ? homePageInfo.adminUserInfo.admin_mobile : ''}
                </span>
              </p>
            </div>
            <div className='info-handle'>
              <Button className='reset-pay-password' onClick={resetPayPassword}>
                重置支付密码
              </Button>
              <Button onClick={modifyPayPassword}>修改支付密码</Button>
            </div>
          </div>
        </div>
        <div className='pay-info-wrap'>
          <div className='pay-hello'>易宝支付</div>
          <div className='pay-info'>
            <div className='pay-name'>
              <p className='pay-name-item'>
                <span className='show-span'>余额（元）：</span>
                <span className='show-Amount'>{isShowAmount ? homePageAmount.accountAmount : '--'}</span>
              </p>
              <p className='pay-name-item'>
                <span className='show-span'>日结算可用余额（元）：</span>
                <span className='show-span'>{isShowAmount ? homePageAmount.rjtValidAmount : '--'}</span>
              </p>
            </div>
            <div className='pay-handle'>
              <Button onClick={getAmount}>获取最新数据</Button>
            </div>
          </div>
        </div>
      </div>

      <div className='payee-info-wrap'>
        <div className='info-title'>收款方信息</div>
        <div className='content-wrap'>
          <div className='bank-info'>
            <div>
              <span>转账银行</span>
              <span>
                <img alt='' src={require('../../assets/images/ICBC.png')} />
              </span>
            </div>
            <div>
              <span>开户行</span>
              <span>{homePageInfo.bankInfo ? homePageInfo.bankInfo.depositBankName : ''}</span>
            </div>
            <div>
              <span>银行账户</span>
              <span>{homePageInfo.bankInfo ? homePageInfo.bankInfo.bankNo : ''}</span>
            </div>
            <div>
              <span>银行户名</span>
              <span>{homePageInfo.bankInfo ? homePageInfo.bankInfo.companyName : ''}</span>
            </div>
          </div>
          <div className='slogan-wrap'>
            <img alt='slogan' src={require('../../assets/images/slogan.png')} />
          </div>
        </div>
      </div>
      <div className='product-info-wrap'>
        <div className='info-title'>产品信息</div>
        <div className='content-wrap'>
          <div className='product-info'>
            <div>
              <span>名称</span>
              <span>网址</span>
            </div>
            <div>
              <span>货当当 | 货主物流平台</span>
              <span>
                <a
                  href={homePageInfo.goodsInfo ? homePageInfo.goodsInfo.deliver : ''}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {homePageInfo.goodsInfo ? homePageInfo.goodsInfo.deliver : ''}
                </a>
              </span>
            </div>
            <div>
              <span>货当当 | 运营工作台</span>
              <span>
                <a
                  href={homePageInfo.goodsInfo ? homePageInfo.goodsInfo.operate : ''}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {homePageInfo.goodsInfo ? homePageInfo.goodsInfo.operate : ''}
                </a>
              </span>
            </div>
            <div>
              <span>货当当 | 官网</span>
              <span>
                <a
                  href={homePageInfo.goodsInfo ? homePageInfo.goodsInfo.miniQrCode : ''}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {homePageInfo.goodsInfo ? homePageInfo.goodsInfo.miniQrCode : ''}
                </a>
              </span>
            </div>
          </div>
          <div className='QRcode-wrap'>
            <div className='android-QRcode-wrap'>
              <img alt='' src={homePageInfo.shareQRCodeUrl} />
              <p>Android - 货主端/司机端</p>
            </div>
            <div className='applet-QRcode-wrap'>
              <img alt='' src={homePageInfo.miniProgramQRCode} />
              <p>微信小程序 - 司机端</p>
            </div>
          </div>
        </div>
      </div>
      <ModifyPayPassword></ModifyPayPassword>
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

export default connect(mapStateProps, mapDispatchToProps)(HomePage)
