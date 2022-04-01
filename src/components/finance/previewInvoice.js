import React, { useState, useEffect, useImperativeHandle } from 'react'
import { apiGetInvoicePerviewInfo } from '@/service/api/finance'
import { Modal, Select } from 'antd'
import '@/style/finance/previewInvoice.less'
import InvoiceTemp from '@/components/common/invoiceTemp'

// 发票预览
const PreviewInvoice = (props) => {
  const { Option } = Select
  useImperativeHandle(props.cRef, () => ({
    handleOpen,
  }))
  const [invoiceData, setInvoiceData] = useState({})
  const [selectOptions, setSelectOptions] = useState([])
  const [selectValue, setSelectValue] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (props.manifestList.length > 0) {
      let list = props.manifestList.map((item) => ({
        label: `${item.placeOfOrigin} - ${item.destination}`,
        value: item.deliveryId.toString(),
      }))
      setSelectOptions(list)
      setSelectValue(list[0].value)
    }
  }, [props.manifestList])

  const onSelectChange = (value) => {
    setSelectValue(value)
  }

  useEffect(() => {
    if (modalVisible) {
      apiGetInvoicePerviewInfo({
        recordId: props.recordId,
        deliveryId: selectValue.toString(),
      }).then((res) => {
        if (res.code === 0) {
          let result = res.data
          setInvoiceData(result)
        }
      })
    }
  }, [modalVisible, selectValue])

  // 取消事件
  const handleCancel = () => {
    setModalVisible(false)
  }

  const handleOpen = () => {
    setModalVisible(true)
  }

  return (
    <Modal
      destroyOnClose
      footer={null}
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={handleCancel}
      title='发票预览'
      visible={modalVisible}
      width={1100}
    >
      <div className='preview-invoice-wrapper'>
        <Select onChange={onSelectChange} style={{ width: 250 }} value={selectValue}>
          {selectOptions.map((item) => (
            <Option key={item.value}>{item.label}</Option>
          ))}
        </Select>
        <div className='preview-invoice-header'>
          <span>预览：增值税专用发票</span>
        </div>
        <InvoiceTemp invoiceData={invoiceData} />
        <div className='preview-tip'>
          请确认本次开票预览界面的“劳务名称”和“备注栏”内容，若无异议，实质开票票面内容将与此预览界面一致；
        </div>
      </div>
    </Modal>
  )
}

export default PreviewInvoice
