import React, { useState, useEffect, useImperativeHandle } from 'react'
import { apiGetInvoicePrintInfo, apiPrintInvoice, apiPrintInvoiceAgain } from '@/service/api/finance'
import { Modal, Input, Button, Form, message } from 'antd'
import '@/style/finance/printInvoice.less'
import { invoiceNumber, invoiceNO } from '@/enums/regEnum'
import InvoiceTemp from '@/components/common/invoiceTemp'

const PrintInvoice = (props) => {
  useImperativeHandle(props.cRef, () => ({
    handleOpen,
  }))

  const layoutTitle = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  }
  const [antdForm] = Form.useForm()
  const [invoiceData, setInvoiceData] = useState({})
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (modalVisible) {
      apiGetInvoicePrintInfo({
        infoId: props.infoId,
      }).then((res) => {
        if (res.code === 0) {
          let result = res.data
          setInvoiceData(result)
        }
      })
    }
  }, [modalVisible, props.infoId])

  useEffect(() => {
    antdForm.setFieldsValue(invoiceData)
  }, [invoiceData])

  // 监听表单状态
  const onValuesChange = (changedFields, allFields) => {
    setInvoiceData({ ...invoiceData, ...allFields })
  }

  // 开具并打印
  const printIssue = () => {
    antdForm
      .validateFields()
      .then(() => {
        const params = {
          infoId: invoiceData.infoId,
          invoiceCode: invoiceData.invoiceCode,
          invoiceNumber: invoiceData.invoiceNumber,
        }
        if (invoiceData.openNum === 0) {
          apiPrintInvoice(params).then((res) => {
            if (res.code === 0) {
              message.success('操作成功')
              handleCancel()
              if (props.reacquireData instanceof Function) {
                props.reacquireData()
              }
            }
          })
        } else {
          apiPrintInvoiceAgain(params).then((res) => {
            if (res.code === 0) {
              message.success('操作成功')
              handleCancel()
              if (props.reacquireData instanceof Function) {
                props.reacquireData()
              }
            }
          })
        }
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // 取消事件
  const handleCancel = () => {
    antdForm.resetFields() // 表单重置
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
      title='开具并打印'
      visible={modalVisible}
      width={1100}
    >
      <div className='print-invoice-wrapper'>
        <div className='invoice-header-wrap'>
          <Form
            {...layoutTitle}
            autoComplete='off'
            form={antdForm}
            labelAlign='left'
            name='form3'
            onValuesChange={onValuesChange}
            size='small'
          >
            <Form.Item
              colon
              label='发票代码'
              name='invoiceCode'
              rules={[
                {
                  required: true,
                  message: '请输入发票代码',
                },
                {
                  pattern: invoiceNumber,
                  message: '发票代码格式错误',
                },
              ]}
            >
              <Input allowClear disabled placeholder='发票代码' />
            </Form.Item>
          </Form>
          <span>开票日期：{invoiceData.invoiceTime}</span>
          <Form
            {...layoutTitle}
            autoComplete='off'
            form={antdForm}
            labelAlign='left'
            name='form4'
            onValuesChange={onValuesChange}
            size='small'
          >
            <Form.Item
              colon
              label='发票号码'
              name='invoiceNumber'
              rules={[
                {
                  required: true,
                  message: '请输入发票编号',
                },
                {
                  pattern: invoiceNO,
                  message: '发票号码格式错误',
                },
              ]}
            >
              <Input allowClear placeholder='发票号码' />
            </Form.Item>
          </Form>
        </div>
        <InvoiceTemp invoiceData={invoiceData} showTotal />
        <div className='invoice-footer-wrap'>
          <div className='footer-item'>收款人：{invoiceData.payee}</div>
          <div className='footer-item'>复核人：{invoiceData.reviewer}</div>
          <div className='footer-item'>开票人：{invoiceData.drawer}</div>
          <div className='footer-item'>销货单位：（章）</div>
        </div>
        <div className='print-handle'>
          <Button onClick={printIssue} shape='round' type='primary'>
            {invoiceData.openNum === 0 ? '开具并打印' : `重开(${invoiceData.reopenNum})`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PrintInvoice
