import React, { useState, useEffect } from 'react'
import { apiGetAuthInfo, apiRestoreDefault, apiSaveAuthSetting } from '@/service/api/authority'
import '@/style/authority/users.less'
import { Modal, Form, message, Checkbox, Spin } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import AuthButton from '@/components/common/authButton'

const UserDetail = (props) => {
  const CheckboxGroup = Checkbox.Group

  const [antdForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(false)
  const [tableDetail, setTableDetail] = useState([])
  // 恢复默认loading
  const [restoreLoading, setRestoreLoading] = useState(false)

  useEffect(() => {
    if (props.modalStatus) {
      getAllAuthInfo()
    }
  }, [props.modalStatus])

  useEffect(() => {
    antdForm.setFieldsValue({ ...tableDetail }) // 同步表单数据
  }, [tableDetail])

  // 获取所有权限
  const getAllAuthInfo = () => {
    apiGetAuthInfo({
      adminUserId: props.userId,
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        for (let [index, item] of result.entries()) {
          if (item.checkedList) {
            if (item.checkedList.length === item.children.length) {
              result[index].checkedAll = true
            } else if (item.checkedList.length > 0) {
              result[index].indeterminate = true
            }
          }
        }
        setTableDetail(result)
        setInitLoading(true)
      } else {
        handleCancel()
      }
    })
  }

  // 选择当前类型的所有权限
  const checkAllAuth = (e, index) => {
    let tempTableDetail = [...tableDetail]
    let checkedList = tempTableDetail[index].children.map((val) => val.value)
    tempTableDetail[index].checkedList = e.target.checked ? checkedList : []
    tempTableDetail[index].indeterminate = false
    tempTableDetail[index].checkedAll = e.target.checked
    setTableDetail(tempTableDetail)
  }

  // 选择当前权限
  const checkCurrentAuth = (checkedList, index) => {
    let tempTableDetail = [...tableDetail]
    tempTableDetail[index].checkedList = checkedList
    tempTableDetail[index].checkedAll = checkedList.length === tempTableDetail[index].children.length
    tempTableDetail[index].indeterminate =
      !!checkedList.length && checkedList.length < tempTableDetail[index].children.length
    setTableDetail(tempTableDetail)
  }

  // 恢复默认
  const resotreDefault = () => {
    setRestoreLoading(true)
    apiRestoreDefault({
      userId: props.userId,
    }).then((res) => {
      setRestoreLoading(false)
      if (res.code === 0) {
        message.success('恢复默认成功')
        handleCancel()
      }
    })
  }

  // 保存权限设置
  const saveAuthSetting = () => {
    let menuList = []
    for (let item of tableDetail) {
      if (item.checkedList) {
        menuList = [...menuList, ...item.checkedList]
      }
    }
    setConfirmLoading(true)
    apiSaveAuthSetting({
      userId: props.userId,
      menuList: menuList,
    }).then((res) => {
      setConfirmLoading(false)
      if (res.code === 0) {
        message.success('用户权限修改成功')
        props.getTableData()
        handleCancel()
      }
    })
  }

  // 取消事件
  const handleCancel = () => {
    setInitLoading(false)
    setTableDetail([]) // 数据重置
    antdForm.resetFields() // 表单重置
    props.closeModal()
  }

  return (
    <Modal
      destroyOnClose
      footer={
        <AuthButton
          authKey='edit_auth'
          disabled={!initLoading}
          loading={confirmLoading}
          onClick={saveAuthSetting}
          type={'primary'}
        >
          保存
        </AuthButton>
      }
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={handleCancel}
      title='权限'
      visible={props.modalStatus}
      width={1000}
      zIndex={1200}
    >
      {initLoading ? (
        <div className='auth-detail-modal-wrap'>
          <div className='auth-modal-title'>
            <span className='title-text'>分配权限</span>
            <AuthButton
              authKey='init_auth'
              icon={<ReloadOutlined />}
              loading={restoreLoading}
              onClick={resotreDefault}
              type='text'
            >
              恢复默认
            </AuthButton>
          </div>
          <div className='auth-list-wrap'>
            <div className='item-wrap' key={-1}>
              <Checkbox checked className='checkbox-title' disabled indeterminate>
                后台首页
              </Checkbox>
              <CheckboxGroup options={[{ value: 50, label: '修改登录密码', disabled: true }]} value={[50]} />
            </div>
            {tableDetail.map((val, index) => (
              <div className='item-wrap' key={index}>
                <Checkbox
                  checked={val.checkedAll}
                  className='checkbox-title'
                  disabled={val.disabled}
                  indeterminate={val.indeterminate}
                  onChange={(e) => checkAllAuth(e, index)}
                >
                  {val.label}
                </Checkbox>
                <CheckboxGroup
                  onChange={(checkedList) => checkCurrentAuth(checkedList, index)}
                  options={val.children}
                  value={val.checkedList}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='init-loading-wrap'>
          <Spin />
        </div>
      )}
    </Modal>
  )
}

export default UserDetail
