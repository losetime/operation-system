import React, { useState, useEffect } from 'react'
import { createUser, updateUser } from '@/service/api/authority'
import { apiGetEnumsOptions } from '@/service/api/common'
import '@/style/authority/users.less'
import { Modal, Form, Input, Select, message } from 'antd'
import userRules from '@/validator/userRules'
import AuthButton from '@/components/common/authButton'

const UserDetail = (props) => {
  const { Option } = Select
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const [antdForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [tableDetail, setTableDetail] = useState({})
  // 状态状态，支付状态，开票状态选项
  const [searchOptions, setSearchOptions] = useState({})

  useEffect(() => {
    if (props.modalStatus) {
      getSearchOptions()
      if (props.handleType === 'edit') {
        setTableDetail(props.tableDetail)
      }
    }
  }, [props.modalStatus])

  useEffect(() => {
    antdForm.setFieldsValue({ ...tableDetail }) // 同步表单数据
  }, [tableDetail])

  // 获取所属部门选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['adminUserRoleList'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  // 监听表单状态
  const onValuesChange = (changedFields, allFields) => {
    setTableDetail({ ...allFields })
  }

  // 新增用户
  const addUser = () => {
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        createUser({ ...tableDetail }).then((res) => {
          setConfirmLoading(false)
          if (res.code === 0) {
            message.success('新增用户成功')
            props.onRefresh()
            handleCancel()
          }
        })
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  const editUser = () => {
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        updateUser({ ...tableDetail }).then((res) => {
          setConfirmLoading(false)
          if (res.code === 0) {
            message.success('修改用户成功')
            props.getTableData()
            handleCancel()
          }
        })
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // 取消事件
  const handleCancel = () => {
    setTableDetail({}) //数据重置
    antdForm.resetFields() // 表单重置
    props.closeModal()
  }

  return (
    <Modal
      destroyOnClose
      footer={
        <AuthButton
          authKey='edit_list'
          loading={confirmLoading}
          onClick={props.handleType === 'add' ? addUser : editUser}
          type='primary'
        >
          {props.handleType === 'add' ? '创建' : '保存'}
        </AuthButton>
      }
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={handleCancel}
      title={props.handleType === 'add' ? '新增' : '编辑'}
      visible={props.modalStatus}
      width={1000}
      zIndex={1040}
    >
      <div className='user-detail-modal-wrap'>
        <div className='user-modal-title'>{props.handleType === 'add' ? '添加用户' : '编辑用户'}</div>
        <Form
          {...layout}
          autoComplete='off'
          colon={false}
          form={antdForm}
          initialValues={{
            remark: '',
          }}
          labelAlign='left'
          name='form'
          onValuesChange={onValuesChange}
        >
          <Form.Item label='真实姓名' name='realName' rules={userRules.realName}>
            <Input disabled={props.handleType === 'edit'} placeholder='请输入内容' />
          </Form.Item>

          <Form.Item label='所属部门' name='roleId' rules={userRules.roleId}>
            <Select allowClear placeholder='请选择内容'>
              {searchOptions.adminUserRoleList
                ? searchOptions.adminUserRoleList.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item extra='初始登录密码：12345678' label='登录手机号' name='mobile' rules={userRules.mobile}>
            <Input disabled={props.handleType === 'edit'} placeholder='请输入内容' />
          </Form.Item>
          <Form.Item label='备注' name='remark' rules={userRules.remark}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default UserDetail
