import React, { useState, useEffect, useImperativeHandle } from 'react'
import { apiGetCarriageAgreementDetail } from '@/service/api/information'
import '@/style/information/carriageAgreement.less'
import { Button, message, Modal } from 'antd'
import axios from 'axios'

const CarriageAgreementDetail = (props) => {
  const [visible, setVisible] = useState(false)
  const [tableDetail, setTableDetail] = useState('')
  const [filePath, setFilePath] = useState('')

  useImperativeHandle(props.cRef, () => ({
    setVisible,
  }))

  useEffect(() => {
    if (visible) {
      apiGetCarriageAgreementDetail({ driverId: props.driverId }).then((res) => {
        if (res.code === 0) {
          let result = res.data
          setTableDetail(result)
        }
      })
    }
  }, [visible])

  useEffect(() => {
    if (tableDetail) {
      const readOssUrl = process.env.REACT_APP_READOSSURL // 读取oss图片地址
      axios
        .post(readOssUrl, {
          listData: [
            {
              field: 'agreementImg',
              path: tableDetail,
            },
          ],
        })
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.listData[0].NewImageUrl) {
              setFilePath(res.data.data.listData[0].NewImageUrl)
            }
          } else {
            message.warn(res.data.message)
          }
        })
    }
  }, [tableDetail])

  // 取消事件
  const handleCancel = () => {
    setFilePath('')
    setTableDetail('')
    setVisible(false)
  }

  return (
    <Modal footer={null} onCancel={handleCancel} title='承运协议' visible={visible} width={770}>
      <div className='carriageAgreement-detail-dialog-wrap'>
        <div className='carriageAgreement-content'>
          <iframe height={1080} src={filePath} width={720}></iframe>
        </div>
        <div className='carriageAgreement-btn'>
          <Button onClick={handleCancel} shape='round' type='primary'>
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CarriageAgreementDetail
