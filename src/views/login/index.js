import React, { useState, useEffect } from 'react'
import { getToken, submitLogin } from '@/service/api/login'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { createHashHistory } from 'history'
import '../../style/login/index.less'
import { Button, Form, Input, Tag } from 'antd'
import IconFont from '@/middleware/iconfont'
import { BugFilled } from '@ant-design/icons'
import { phoneReg } from '@/enums/regEnum'

const Login = (props) => {
  const [antdForm] = Form.useForm()
  const [loginLoading, setLoginLoading] = useState(false)
  const env = process.env.REACT_APP_ENV
  const hashRouter = createHashHistory()

  useEffect(() => {
    if (localStorage.getItem('jwUserInfo') && JSON.parse(localStorage.getItem('jwUserInfo')).token) {
      hashRouter.replace('/home/homePage')
    }
  }, [hashRouter])

  const loginSubmit = (values, token) => {
    setLoginLoading(true)
    submitLogin({
      userName: values.username,
      userPassword: values.password,
      token,
    }).then((res) => {
      setLoginLoading(false)
      if (res.code === 0) {
        let userInfo = { token: token, userName: res.data.adminName }
        localStorage.setItem('jwUserInfo', JSON.stringify(userInfo))
        props.actions.setUserInfo(userInfo)
        hashRouter.replace('/home/homePage')
      }
    })
  }

  const onFinish = (values) => {
    getToken().then((res) => {
      if (res.code === 0) {
        const token = res.data.token
        loginSubmit(values, token)
      }
    })
  }
  const onValuesChange = (changedFields, allFields) => {
    // 限制手机号长度
    if (changedFields.username && changedFields.username.length > 11) {
      antdForm.setFieldsValue({
        ...allFields,
        username: changedFields.username.substr(0, 11),
      })
    }
    // 限制密码长度
    if (changedFields.password && changedFields.password.length > 8) {
      antdForm.setFieldsValue({
        ...allFields,
        password: changedFields.password.substr(0, 8),
      })
    }
  }

  return (
    <div className='login-wrapper'>
      <div className='login-content-wrap'>
        <div className='login-form-wrap'>
          <div className='login-logo'>
            <img alt='logo' src={require('@/assets/images/loginLogo.svg')} />
            <div>
              {env === 'qa' ? (
                <Tag className='beta-icon' color='#f84507' icon={<BugFilled />}>
                  测试
                </Tag>
              ) : null}
            </div>
          </div>
          <div className='login-form-content'>
            <Form
              form={antdForm}
              initialValues={{
                username: '',
                password: '',
              }}
              name='normal_login'
              onFinish={onFinish}
              onValuesChange={onValuesChange}
            >
              <div className='username-form'>
                <IconFont className='iconfont' type='iconyonghu' />
                <Form.Item
                  name='username'
                  rules={[
                    {
                      required: true,
                      message: '账户不能为空!',
                    },
                    () => ({
                      validator(rule, value) {
                        if (value) {
                          if (phoneReg.test(value) || value === 'admin') {
                            return Promise.resolve()
                          }
                          return Promise.reject('请输入正确的手机号')
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Input placeholder='请输入账户' />
                </Form.Item>
              </div>

              <div className='username-form'>
                <IconFont className='iconfont' type='iconmima1' />
                <Form.Item
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: '密码不能为空!',
                    },
                  ]}
                >
                  <Input placeholder='请输入密码' type='password' />
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  className='login-form-button'
                  htmlType='submit'
                  loading={loginLoading}
                  shape='round'
                  type='primary'
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateProps = (state) => {
  return {
    userInfo: state.userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Login)
