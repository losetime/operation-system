import React, { useState, useEffect } from 'react'
import { Button, Form, Input, message, Space } from 'antd'
import '@/style/finance/oilTicketDeduction.less'
import { ArrowLeftOutlined } from '@ant-design/icons'
import JwUpload from '@/components/common/jwUpload'
import { useHistory } from 'react-router-dom'
import { apiGetOilTicketDeductionDetail, apiSaveOilTicketDeductionDetail } from '@/service/api/finance'
import { phoneReg } from '@/enums/regEnum'
import AuthButton from '@/components/common/authButton'

const OilTicketDeductionDetail = (props) => {
  const history = useHistory()
  const stampId = props.match.params.id
  const [antdForm] = Form.useForm()

  const [tableDetail, setTableDetail] = useState({})
  const [disabled, setDisabled] = useState(true)
  // 当前上传文件
  const [currentUploadFile, setCurrentUploadFile] = useState({})
  // 当前上传状态
  const [currentUploadStatus, setCurrentUploadStatus] = useState({})
  // 所有上传状态
  const [uploadStatusInfo, setUploadStatusInfo] = useState({})

  const getOilTicketDetail = () => {
    apiGetOilTicketDeductionDetail({ stampId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(result)
      }
    })
  }

  useEffect(() => {
    getOilTicketDetail()
  }, [])

  useEffect(() => {
    antdForm.setFieldsValue(tableDetail) // 同步表单数据
  }, [tableDetail, antdForm])

  useEffect(() => {
    setTableDetail({ ...tableDetail, ...currentUploadFile })
  }, [currentUploadFile])

  useEffect(() => {
    setUploadStatusInfo({ ...uploadStatusInfo, ...currentUploadStatus })
  }, [currentUploadStatus])

  // 获取上传状态
  const getUploadStatus = (status, key) => {
    const uploadStatus = {}
    uploadStatus[key] = status
    setCurrentUploadStatus(uploadStatus)
  }

  // 图片上传Add回调函数
  const uploadCallbackAdd = (imageKey, imageUrl) => {
    const fileInfo = {}
    fileInfo[imageKey] = imageUrl
    setCurrentUploadFile(fileInfo)
  }

  // 图片上传Edit回调函数
  const uploadCallbackEdit = (imageKey, imageUrl) => {
    return new Promise((resolve) => {
      uploadCallbackAdd(imageKey, imageUrl)
      resolve(true)
    })
  }

  const onValuesChange = (changedValues) => {
    setTableDetail({ ...tableDetail, ...changedValues })
  }

  //返回上级页面
  const onBackOilTicketDeduction = () => {
    antdForm.resetFields('')
    history.push('/home/oilTicketDeduction')
  }

  //编辑
  const onEdit = () => {
    setDisabled(false)
  }

  //取消
  const onResetInfo = () => {
    getOilTicketDetail()
    setDisabled(true)
  }

  //保存
  const onSaveInfo = () => {
    antdForm
      .validateFields()
      .then(() => {
        apiSaveOilTicketDeductionDetail({ ...tableDetail }).then((res) => {
          if (res.code === 0) {
            message.success('保存成功')
            setDisabled(true)
            getOilTicketDetail()
          }
        })
      })
      .catch(() => {
        message.warn('内容输入错误，请检查')
      })
  }

  return (
    <div className='oilTicketDeductionDetail-wrapper'>
      <div className='jump-but'>
        <Button type='link' onClick={onBackOilTicketDeduction}>
          <ArrowLeftOutlined />
          油票抵扣详情
        </Button>
      </div>
      <div className='detail-content-wrap'>
        <div className='content-info-wrap'>
          <Form autoComplete='off' form={antdForm} name='infoForm' onValuesChange={onValuesChange}>
            <Form.Item colon={false} label='企业简称' name='shortCompany'>
              <Input disabled={true} allowClear />
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <div className='item-label'>
                  <p>物流单号</p>
                  <p className='item-label-symbol'>*</p>
                </div>
              }
              name='stampSn'
              rules={[
                {
                  required: true,
                  message: '物流单号不能为空',
                },
              ]}
            >
              <Input disabled={disabled} allowClear />
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <div className='item-label'>
                  <p>物流公司</p>
                  <p className='item-label-symbol'>*</p>
                </div>
              }
              name='stampCompany'
              rules={[
                {
                  required: true,
                  message: '物流公司不能为空',
                },
              ]}
            >
              <Input disabled={disabled} allowClear />
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <div className='item-label'>
                  <p>寄件人联系电话</p>
                  <p className='item-label-symbol'>*</p>
                </div>
              }
              name='stampMobile'
              rules={[
                {
                  required: true,
                  message: '寄件人联系电话不能为空',
                },
                {
                  pattern: phoneReg,
                  message: '请输入正确的联系电话',
                },
              ]}
            >
              <Input disabled={disabled} allowClear />
            </Form.Item>
          </Form>
        </div>
        <div className='content-amount-wrap'>
          <Form autoComplete='off' form={antdForm} name='form' onValuesChange={onValuesChange}>
            <Form.Item
              colon={false}
              label={
                <div className='item-label'>
                  <p>总票面额（元）</p>
                  <p className='item-label-symbol'>*</p>
                </div>
              }
              name='stampAmount'
              rules={[
                {
                  required: true,
                  message: '请输入总票面额',
                },
                {
                  validator(_, value) {
                    console.log(isNaN(value))
                    if (isNaN(value)) {
                      return Promise.reject('总票面额只能为数字')
                    }
                    if (value) {
                      if (value.split('.')[1] && value.split('.')[1].length > 2) {
                        return Promise.reject('总票面额最大保留2位小数')
                      }
                      if (value > 99999.99) {
                        return Promise.reject('总票面额最大为99999.99')
                      }
                      if (value < 1) {
                        return Promise.reject('总票面额最小为1')
                      }
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input disabled={disabled} allowClear />
            </Form.Item>
            <Form.Item
              colon={false}
              label='实际抵扣金额（元）'
              name='stampRealAmount'
              rules={[
                {
                  validator(_, value) {
                    console.log(isNaN(value))
                    if (isNaN(value)) {
                      return Promise.reject('实际抵扣金额只能为数字')
                    }
                    if (value) {
                      if (value.split('.')[1] && value.split('.')[1].length > 2) {
                        return Promise.reject('实际抵扣金额最大保留2位小数')
                      }
                      if (value > 99999.99) {
                        return Promise.reject('实际抵扣金额最大为99999.99')
                      }
                      if (value < 1) {
                        return Promise.reject('实际抵扣金额最小为1')
                      }
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input disabled={disabled} allowClear />
            </Form.Item>
          </Form>
          <div className='image-content-wrap'>
            <text className='image-content-label'>油票拍照</text>
            <JwUpload
              fileKey={'stampLicense'}
              handleType={'edit'}
              getUploadStatus={getUploadStatus}
              initFileUrl={tableDetail.stampLicense}
              style={{ width: 820, height: 290 }}
              uploadCallbackAdd={uploadCallbackAdd}
              uploadCallbackEdit={uploadCallbackEdit}
              title={'油票照片'}
              editable={!disabled}
            />
          </div>
        </div>
        <div className='Detail-content-btn'>
          {disabled ? (
            <AuthButton authKey='edit' shape='round' type='primary' onClick={onEdit}>
              编辑
            </AuthButton>
          ) : (
            <Space size={20}>
              <Button shape='round' onClick={onResetInfo}>
                取消
              </Button>
              <Button shape='round' type='primary' onClick={onSaveInfo}>
                保存
              </Button>
            </Space>
          )}
        </div>
      </div>
    </div>
  )
}

export default OilTicketDeductionDetail
