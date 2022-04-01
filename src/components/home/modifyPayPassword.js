import React, { useState, useEffect } from 'react'
import { apiModifyPayPassword } from '@/service/api/home'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/information/consignor.less'
import { Modal, Form, Input, message } from 'antd'
import { passwordReg } from '@/enums/regEnum'

const ModifyPayPassword = (props) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const [antdForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [tableDetail, setTableDetail] = useState({})

  useEffect(() => {
    setTableDetail({ ...props.tableDetail })
  }, [props.tableDetail])

  useEffect(() => {
    antdForm.setFieldsValue(tableDetail) // 同步表单数据
  }, [tableDetail, antdForm])

  // 保存按钮事件
  const handleOk = () => {
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        const { oldPassword, newPassword } = tableDetail
        apiModifyPayPassword({
          oldPayPassword: oldPassword,
          newPayPassword: newPassword,
        }).then((res) => {
          setConfirmLoading(false)
          if (res.code === 0) {
            requestHandle('修改成功')
          }
        })
      })
      .catch(() => {
        message.warn('请修改错误信息')
      })
  }

  // 编辑请求后的处理
  const requestHandle = (msg) => {
    setTableDetail({}) //数据重置
    antdForm.resetFields() // 表单重置
    message.success(msg)
    props.actions.setModifyPayPasswordDialogStatus(false)
  }

  // 取消事件
  const handleCancel = () => {
    setTableDetail({}) //数据重置
    antdForm.resetFields() // 表单重置
    props.actions.setModifyPayPasswordDialogStatus(false)
  }

  // 监听表单状态
  const onValuesChange = (changedFields, allFields) => {
    let key = Object.keys(changedFields)[0]
    if (changedFields[key].length > 8) {
      let fields = allFields
      fields[key] = fields[key].substr(0, 8)
      setTableDetail({ ...fields })
    } else {
      setTableDetail({ ...allFields })
    }
  }

  return (
    <Modal
      cancelText='取消'
      confirmLoading={confirmLoading}
      destroyOnClose
      forceRender
      getContainer={false}
      okText='确定'
      onCancel={handleCancel}
      onOk={handleOk}
      title='修改支付密码'
      visible={props.modifyPayPasswordDialogStatus}
      width={500}
    >
      <div className='bankcard-detail-dialog-wrap'>
        <div className='form-content-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} name='form1' onValuesChange={onValuesChange}>
            <Form.Item
              colon={false}
              label='原始密码'
              name='oldPassword'
              rules={[
                {
                  required: true,
                },
                () => ({
                  validator(rule, value) {
                    if (!passwordReg.test(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject('不能输入中文')
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              colon={false}
              label='新密码'
              name='newPassword'
              rules={[
                {
                  required: true,
                },
                () => ({
                  validator(rule, value) {
                    if (!passwordReg.test(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject('不能输入中文')
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              colon={false}
              label='再次输密码'
              name='confirmPassword'
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject('两次输入密码不一致')
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    modifyPayPasswordDialogStatus: state.modifyPayPasswordDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ModifyPayPassword)
