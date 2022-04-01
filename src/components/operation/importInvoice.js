import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/freightInvoice.less'
import { Modal, Button, Space, message } from 'antd'
import JwUpload from '@/components/common/jwUpload'
import axios from 'axios'

const ImportInvoice = (props) => {
  const [title, setTitle] = useState('')
  const [importLoading, setImportLoading] = useState(false)

  const childRef = useRef()

  useEffect(() => {
    if (props.importInvoiceDetailDialogStatus) {
      if (props.titleType === 'vehicle') {
        setTitle('导入车辆备案状态')
      } else if (props.titleType === 'status') {
        setTitle('导入ETC开票状态')
      } else if (props.titleType === 'detail') {
        setTitle('导入ETC发票详情')
      }
    }
  }, [props.importInvoiceDetailDialogStatus, props.titleType])

  //导入按钮
  const importFile = () => {
    let files = childRef.current.getFileSource()
    if (!files.name) {
      message.warn('请上传xlsx类型文件')
      return
    } else {
      let fileType = files.name.slice(files.name.length - 4, files.name.length)
      if (fileType !== 'xlsx') {
        message.warn('请上传xlsx类型文件')
        onClearUpload()
        return
      }
      if (props.titleType === 'vehicle') {
        importInfo('/api/v2/transportInvoice/importCarRecord', files)
      } else if (props.titleType === 'status') {
        importInfo('/api/v2/transportInvoice/importEtcOpenInfo', files)
      } else if (props.titleType === 'detail') {
        importInfo('/api/v2/transportInvoice/importEtcInvoiceInfo', files)
      }
    }
  }

  // 获取导入文件信息
  // TODO 使用封装接口上传
  const importInfo = (url, file) => {
    const baseUrl = process.env.REACT_APP_BASEURL
    let formData = new FormData()
    formData.append('importCarRecord', file)
    setImportLoading(true)
    axios({
      url: baseUrl + url,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + props.token,
      },
    })
      .then((res) => {
        if (res.data.code === 0) {
          message.success('上传成功')
          props.actions.setImportInvoiceDetailDialogStatus(false)
          onClearUpload()
          props.getTableData({ pageNum: 1, perPage: 20 })
        } else if (res.data.code === 1000000) {
          message.warn(res.data.message)
        }
      })
      .finally(() => {
        setImportLoading(false)
      })
  }

  // 取消事件
  const handleCancel = () => {
    onClearUpload()
    setImportLoading(false)
    props.actions.setImportInvoiceDetailDialogStatus(false)
  }

  const onClearUpload = () => {
    childRef.current.clearUploadContent()
  }

  return (
    <Modal
      footer={null}
      onCancel={handleCancel}
      title={title}
      visible={props.importInvoiceDetailDialogStatus}
      width={800}
    >
      <div className='importInvoice-wrap'>
        <div className='importInvoice-btn'>
          <Button onClick={onClearUpload} shape='round'>
            清空内容
          </Button>
        </div>
        <div className='importFile-wrap'>
          <JwUpload
            autoUpload={false}
            cRef={childRef}
            fileKey={'invoiceImage'}
            handleType={'edit'}
            isEdit
            showTools={false}
            style={{ width: 700, height: 250 }}
            title={title}
          />
        </div>
        <div className='importInvoice-btn'>
          <Space size={20}>
            <Button onClick={handleCancel} shape='round'>
              取消
            </Button>
            <Button loading={importLoading} onClick={importFile} shape='round' type='primary'>
              导入
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    importInvoiceDetailDialogStatus: state.importInvoiceDetailDialogStatus,
    token: state.userInfo.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ImportInvoice)
