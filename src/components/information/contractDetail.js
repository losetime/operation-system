import React, { useState, useEffect } from 'react'
import {
  apiGetContractDetail,
  apiDeleteContract,
  apiTerminationContract,
  apiEnableContract,
  apiContractFilesDownload,
} from '@/service/api/information'
import { apiGetEnumsOptions } from '@/service/api/common'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/information/contract.less'
import { Modal, Form, Input, Button, message, Tooltip, Select, DatePicker } from 'antd'
import { DeleteOutlined, PictureOutlined, ExpandOutlined, PaperClipOutlined } from '@ant-design/icons'
import { phoneReg } from '@/enums/regEnum'
import { PhotoSlider } from 'react-photo-view'
import 'react-photo-view/dist/index.css'
import AuthButton from '@/components/common/authButton'
import moment from 'moment'

const ContractDetail = (props) => {
  const { Option } = Select
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const [antdForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [terminationLoading, setTerminationLoading] = useState(false)
  const [tableDetail, setTableDetail] = useState({})
  const [deadlineOptions, setDeadlineOptions] = useState([])
  const [fileList, setFileList] = useState([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewImageStatus, setPreviewImageStatus] = useState(false)
  const [photoIndex, setPhotoIndex] = React.useState(0)

  useEffect(() => {
    if (props.contractDialogStatus) {
      getEnumerateInfo()
      getContractDetail()
    }
  }, [props.contractDialogStatus])

  useEffect(() => {
    antdForm.setFieldsValue({ ...tableDetail }) // 同步表单数据
  }, [tableDetail])

  // 监听表单状态
  const onValuesChange = (changedFields) => {
    setTableDetail({ ...tableDetail, ...changedFields })
  }

  // 获取枚举
  const getEnumerateInfo = () => {
    apiGetEnumsOptions({
      enumByParams: ['contractTimer'],
    }).then((res) => {
      if (res.code === 0) {
        setDeadlineOptions(res.data.contractTimer)
      }
    })
  }

  // 获取合同详情
  const getContractDetail = () => {
    apiGetContractDetail({
      contractId: props.contractId,
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setFileList(result.contractContent)
        setTableDetail({
          ...result,
          startTime: result.startTime ? moment(result.startTime) : null,
        })
      }
    })
  }

  // 设置form禁用状态
  const setDisabledStatus = () => {
    return tableDetail.contractStatus !== 1
  }

  // 判断文件是否为pdf
  const getFileType = (val) => {
    return val.filePath.substr(-3) === 'pdf'
  }

  // 下载文件
  const downloadFile = () => {
    apiContractFilesDownload({
      contractId: props.contractId,
    })
  }

  // 查看图片
  const checkImageView = (val) => {
    const readOssUrl = process.env.REACT_APP_READOSSURL // 读取oss图片地址
    axios
      .post(readOssUrl, {
        listData: [
          {
            field: 'fileKey',
            path: val.filePath,
          },
        ],
      })
      .then((res) => {
        if (res.data.code === 0) {
          if (res.data.data.listData[0].NewImageUrl) {
            setPreviewImage(res.data.data.listData[0].NewImageUrl)
            setPreviewImageStatus(true)
          }
        } else {
          message.warn(res.data.message)
        }
      })
  }

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      const element = document.getElementById('PhotoView_Slider')
      if (element) {
        element.requestFullscreen()
      }
    }
  }

  // 启用并生成合同号
  const enableContract = () => {
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        apiEnableContract({
          ...tableDetail,
          startTime: tableDetail.startTime.format('YYYY-MM-DD'),
        }).then((res) => {
          setConfirmLoading(false)
          if (res.code === 0) {
            props.getTableData()
            handleCancel()
            message.success('操作成功')
          }
        })
      })
      .catch(() => {
        message.warn('输入内容错误，请检查')
      })
  }

  // 终止合同
  const terminationContract = () => {
    setTerminationLoading(true)
    apiTerminationContract({
      contractId: tableDetail.contractId,
    }).then((res) => {
      setTerminationLoading(false)
      if (res.code === 0) {
        props.getTableData()
        handleCancel()
        message.success('操作成功')
      }
    })
  }

  // 删除合同
  const deleteContract = () => {
    apiDeleteContract({
      contractId: tableDetail.contractId,
    }).then((res) => {
      if (res.code === 0) {
        props.getTableData()
        handleCancel()
        message.success('操作成功')
      }
    })
  }

  // 取消事件
  const handleCancel = () => {
    setTableDetail({}) //数据重置
    antdForm.resetFields() // 表单重置
    props.closeDetailDialog()
  }

  return (
    <Modal
      destroyOnClose
      footer={
        <div className='dialog-footer-wrap'>
          <div className='footer-left-wrap'>
            <Tooltip placement='top' title='删除合同'>
              <span>
                <AuthButton
                  authKey='delete_contract'
                  icon={<DeleteOutlined style={{ fontSize: '25px', color: '#FF4D4F' }} />}
                  onClick={deleteContract}
                  type='link'
                ></AuthButton>
              </span>
            </Tooltip>
            {tableDetail.contractStatus !== 3 ? (
              <AuthButton authKey='termination_contract' loading={terminationLoading} onClick={terminationContract}>
                终止合同
              </AuthButton>
            ) : null}
          </div>
          <div className='footer-right-wrap'>
            {tableDetail.contractStatus === 1 ? (
              <AuthButton authKey='enabled_contract' loading={confirmLoading} onClick={enableContract} type='primary'>
                启用并生成合同号
              </AuthButton>
            ) : (
              <Button onClick={handleCancel}>关闭</Button>
            )}
          </div>
        </div>
      }
      onCancel={handleCancel}
      title='合同详情'
      visible={props.contractDialogStatus}
      width={1180}
    >
      <div className='contract-detail-dialog-wrap'>
        <div className='detail-title-wrap'>
          <p className='title-text'>合同文件</p>
        </div>
        <div className='detail-content-wrap'>
          <div className='file-list-wrap'>
            {fileList.map((val, index) => (
              <div className='file-item' key={index}>
                {getFileType(val) ? <PaperClipOutlined /> : <PictureOutlined />}
                <span className='item-name'>{val.fileName}</span>
                {getFileType(val) ? null : (
                  <span
                    className='item-btn'
                    onClick={() => {
                      checkImageView(val)
                    }}
                  >
                    大图
                  </span>
                )}
              </div>
            ))}
          </div>
          <AuthButton authKey='download' onClick={downloadFile} shape='round' type='primary'>
            下载
          </AuthButton>
        </div>
        <div className='detail-title-wrap'>
          <p className='title-text'>合同详情</p>
          <p className='contract-status'>
            {tableDetail.contractSn ? `${tableDetail.contractSn} | ` : ''}
            {tableDetail.contractStatusName}
          </p>
        </div>
        <div className='form-content-wrap'>
          <Form
            {...layout}
            autoComplete='off'
            colon={false}
            form={antdForm}
            labelAlign='left'
            name='contract-detail-form-one'
            onValuesChange={onValuesChange}
          >
            <Form.Item
              label='甲方名称'
              name='packCompany'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>

            <Form.Item
              label='乙方名称'
              name='unloadCompany'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>
            <Form.Item
              label='甲方联系人'
              name='packContent'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>
            <Form.Item
              label='乙方联系人'
              name='unloadContent'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>
            <Form.Item
              label='甲方联系方式'
              name='packMobile'
              rules={[
                {
                  required: true,
                },
                {
                  pattern: phoneReg,
                  message: '手机号格式不正确',
                },
              ]}
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>
            <Form.Item
              label='乙方联系方式'
              name='unloadMobile'
              rules={[
                {
                  required: true,
                },
                {
                  pattern: phoneReg,
                  message: '手机号格式不正确',
                },
              ]}
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>
          </Form>
        </div>
        <div className='form-content-wrap' id='form-content-wrap'>
          <Form
            {...layout}
            autoComplete='off'
            colon={false}
            form={antdForm}
            labelAlign='left'
            name='form2'
            onValuesChange={onValuesChange}
          >
            <Form.Item
              label='单价金额(元)'
              name='price'
              rules={[
                {
                  required: true,
                },
                {
                  type: 'number',
                  transform(value) {
                    if (value) {
                      return Number(value)
                    }
                  },
                  message: '请输入输入数字',
                },
                () => ({
                  validator(rule, value) {
                    if (Number(value) >= 0) {
                      return Promise.resolve()
                    }
                    return Promise.reject('单价金额不能为负数')
                  },
                }),
              ]}
              validateFirst
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>

            <Form.Item
              label='生效日期'
              name='startTime'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker
                disabled={setDisabledStatus()}
                getPopupContainer={() => document.getElementById('form-content-wrap')}
              />
            </Form.Item>
            <Form.Item
              label='承运重量(吨)'
              name='weight'
              rules={[
                {
                  required: true,
                },
                {
                  type: 'number',
                  transform(value) {
                    if (value) {
                      return Number(value)
                    }
                  },
                  message: '请输入输入数字',
                },
                () => ({
                  validator(rule, value) {
                    if (Number(value) >= 0) {
                      return Promise.resolve()
                    }
                    return Promise.reject('承运重量不能为负数')
                  },
                }),
              ]}
              validateFirst
            >
              <Input disabled={setDisabledStatus()} />
            </Form.Item>
            <Form.Item
              label='有效期至'
              name='contractTerm'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                allowClear
                disabled={setDisabledStatus()}
                getPopupContainer={() => document.getElementById('form-content-wrap')}
              >
                {deadlineOptions ? deadlineOptions.map((val) => <Option key={val.label}>{val.text}</Option>) : []}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <PhotoSlider
          images={[previewImage].map((item) => ({ src: item }))}
          index={photoIndex}
          onClose={() => setPreviewImageStatus(false)}
          onIndexChange={setPhotoIndex}
          toolbarRender={({ rotate, onRotate }) => {
            return (
              <>
                <svg
                  className='PhotoView-PhotoSlider__toolbarIcon'
                  fill='white'
                  height='44'
                  onClick={() => onRotate(rotate + 90)}
                  viewBox='0 0 768 768'
                  width='44'
                >
                  <path d='M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z' />
                </svg>
                {document.fullscreenEnabled && <ExpandOutlined onClick={toggleFullScreen} />}
              </>
            )
          }}
          visible={previewImageStatus}
        />
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ContractDetail)
