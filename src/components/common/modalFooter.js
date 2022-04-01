import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Button, Modal, message, Input, Form } from 'antd'
import { formatParams } from '@/utils/business'
import AuthButton from '@/components/common/authButton'

const ModalFooter = (props) => {
  const {
    cRef,
    antdForm,
    status,
    type,
    tableDetail,
    uploadStatusInfo, // 上传图片状态
    handleClose, // 关闭对话框
    resetInfo,
    disabledEdit,
    openEdit,
    httpKey,
    getTableData,
    idKey,
    reasonKey,
    verificationImage,
  } = props

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }
  const [refuseForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [refuseLoading, setRefuseLoading] = useState(false)
  const [showRefuse, setShowRefuse] = useState(true)
  const [showPass, setShowPass] = useState(true)
  const [showRefuseModal, setShowRefuseModal] = useState(false)
  useImperativeHandle(cRef, () => ({
    // 暴露给父组件的方法
    onFormChange: () => {
      setShowPass(true)
    },
  }))

  useEffect(() => {
    setModalFooter()
  }, [])

  // 设置页脚
  const setModalFooter = () => {
    if (type === 'add') {
      setShowRefuse(true)
    } else if (type === 'edit') {
      if (status === 1) {
        setShowRefuse(true)
        setShowPass(true)
      } else {
        setShowRefuse(false)
        setShowPass(false)
      }
    }
  }

  // 保存并通过认证按钮事件
  const handleOk = () => {
    antdForm
      .validateFields()
      .then(() => {
        for (let item in uploadStatusInfo) {
          if (uploadStatusInfo[item] === 'start') {
            message.warn('图片正在上传中，请稍等...')
            return
          }
        }
        if (idKey === 'transporterId') {
          const { identityImageObverse, identityImageReverse, driverLicenseObverse, driverLicenseReverse } = tableDetail
          if (!identityImageObverse || !identityImageReverse || !driverLicenseObverse || !driverLicenseReverse) {
            message.warn('证件图片不全，请上传')
            return
          }
        }
        if (!verificationImage) {
          message.warn('证件图片不全，请上传')
          return
        }
        switch (type) {
          case 'add':
            addHandle()
            break
          case 'edit':
            editHandle()
            break
          default:
            console.warn('没有当前事件！')
            break
        }
      })
      .catch(() => {
        message.warn('输入内容错误，请检查')
      })
  }

  // 添加类型操作
  const addHandle = () => {
    setConfirmLoading(true)
    httpKey.add(formatParams({ ...tableDetail })).then((res) => {
      setConfirmLoading(false)
      if (res.code === 0) {
        requestHandle('添加信息成功')
      }
    })
  }

  // 编辑类型操作
  const editHandle = () => {
    setConfirmLoading(true)
    httpKey.edit(formatParams({ ...tableDetail })).then((res) => {
      setConfirmLoading(false)
      if (res.code === 0) {
        requestHandle('修改成功')
      }
    })
  }

  // 保存/编辑请求后的处理
  const requestHandle = (msg) => {
    getTableData({ pageNum: 1, perPage: 20 }) // 更新父组件列表
    message.success(msg)
    handleClose()
  }

  // 认证拒绝
  const handleRefuse = () => {
    refuseForm
      .validateFields()
      .then(() => {
        setRefuseLoading(true)
        let params = {}
        params[idKey] = tableDetail[idKey]
        params[reasonKey] = refuseForm.getFieldValue('refuseReason')
        httpKey.refuse(params).then((res) => {
          setRefuseLoading(false)
          if (res.code === 0) {
            requestHandle('操作成功')
          }
        })
      })
      .catch(() => {
        message.warn('输入内容错误，请检查')
      })
  }

  // 取消编辑
  const cancelEdit = () => {
    resetInfo()
  }

  const closeRefuse = () => {
    setShowRefuseModal(false)
    refuseForm.resetFields() // 表单重置
  }

  return (
    <>
      {type === 'add' ? (
        <Button key='创建' loading={confirmLoading} onClick={handleOk} type='primary'>
          创建
        </Button>
      ) : (
        <>
          {disabledEdit ? (
            <AuthButton authKey='pass' onClick={openEdit} type='primary'>
              修改
            </AuthButton>
          ) : (
            <Button onClick={cancelEdit}>取消</Button>
          )}
          {showRefuse ? (
            <AuthButton
              authKey='refuse'
              onClick={() => {
                setShowRefuseModal(true)
              }}
              type='danger'
            >
              拒绝
            </AuthButton>
          ) : null}
          {showPass ? (
            <AuthButton authKey='pass' loading={confirmLoading} onClick={handleOk} type='primary'>
              通过
            </AuthButton>
          ) : null}
        </>
      )}
      <Modal
        footer={
          <AuthButton authKey='refuse' loading={refuseLoading} onClick={handleRefuse} type='danger'>
            修改
          </AuthButton>
        }
        onCancel={closeRefuse}
        title='拒绝'
        visible={showRefuseModal}
        width={600}
      >
        <Form {...layout} autoComplete='off' form={refuseForm} name='form' style={{ marginTop: 20 + 'px' }}>
          <Form.Item
            colon={false}
            name='refuseReason'
            rules={[
              {
                required: true,
                message: '请输入拒绝原因',
              },
              {
                max: 15,
                message: '拒绝原因最多输入15个字符',
              },
            ]}
          >
            <Input placeholder='请输入拒绝原因，该原因将同步展示给司机，限制输入15个字符' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModalFooter
