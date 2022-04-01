import React, { useState, useEffect, useImperativeHandle } from 'react'
import { apiUpdateStatementInfo } from '@/service/api/finance'
import { apiGetEnumsOptions } from '@/service/api/common'
import { Form, Input, Modal, DatePicker, message, AutoComplete } from 'antd'
import '@/style/finance/confirmInvoiceInfo.less'
import { statementRules } from '@/validator/finance'
import { formatParams, compareDate } from '@/utils/business'
import moment from 'moment'
import bignumber from 'bignumber.js'

const StatementEdit = (props) => {
  useImperativeHandle(props.cRef, () => ({
    setModalVisible,
  }))

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const [antdForm] = Form.useForm()

  const [modalVisible, setModalVisible] = useState(false)
  const [dataSource, setDataSource] = useState({})
  const [confirmLoading, setConfirmLoading] = useState(false)
  // 是否需要校验
  const [isCheck, setIsCheck] = useState(false)
  // 校验结果
  const [checkStatus, setCheckStatus] = useState([])
  // 品名select
  const [selectOptions, setSelectOptions] = useState([])

  useEffect(() => {
    if (modalVisible) {
      setDataSource(props.dataSource)
      getClassification()
    }
  }, [modalVisible])

  useEffect(() => {
    const { client, confirmationSignature, confirmationDate } = dataSource
    antdForm.setFieldsValue({
      client,
      confirmationSignature,
      confirmationDate: moment(confirmationDate),
    })
  }, [dataSource])

  /**
   * 这里为了提交表单时做校验
   * 定义【isCheck】变量在保存时改变状态，触发子组件表单分别做校验
   * 定义【checkStatus】保存校验后的状态，判断如果该数组里有false，则说明校验失败；反之则进行下一步
   */
  useEffect(() => {
    const manifest = dataSource.manifest
    if (manifest) {
      if (checkStatus.length === manifest.length) {
        if (checkStatus.includes(false)) {
          message.warning('输入内容错误，请检查')
          setCheckStatus([])
          setIsCheck(false)
        } else {
          handleOk()
        }
      }
    }
  }, [checkStatus])

  const getFormValue = (obj) => {
    const tempManifest = dataSource.manifest.map((val) => {
      if (val.deliveryId === obj.deliveryId) {
        return obj
      } else {
        return val
      }
    })
    setDataSource({ ...dataSource, manifest: tempManifest })
  }

  const getCheckResult = (val) => {
    setCheckStatus((res) => [...res, val])
  }

  const onValuesChange = (changedFields, allFields) => {
    setDataSource({ ...dataSource, ...allFields })
  }

  // 获取货物详细分类
  const getClassification = () => {
    apiGetEnumsOptions({ enumByParams: ['cargoTypeName'] }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSelectOptions(
          result.cargoTypeName.map((item) => ({
            value: item.text,
            label: item.text,
          }))
        )
      }
    })
  }

  const handleOk = () => {
    setCheckStatus([])
    setIsCheck(false)
    for (let [index, item] of dataSource.manifest.entries()) {
      if (!compareDate(item.startTime, item.endTime)) {
        message.warning(`结算业务${index + 1}: 日期开始时间不能大于结束时间,请修改后提交`)
        return
      }
    }
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        apiUpdateStatementInfo({
          invoiceId: props.invoiceId,
          ...dataSource,
        })
          .then((res) => {
            if (res.code === 0) {
              message.success('修改成功')
              props.reacquireData()
              handleCancel()
            }
          })
          .finally(() => {
            setConfirmLoading(false)
          })
      })
      .catch(() => {
        message.warn('输入内容错误，请检查')
      })
  }

  const handleCancel = () => {
    setDataSource({})
    setModalVisible(false)
  }
  return (
    <Modal
      cancelText='取消'
      confirmLoading={confirmLoading}
      destroyOnClose
      forceRender
      getContainer={false}
      maskClosable={false}
      okText='保存'
      onCancel={handleCancel}
      onOk={() => {
        setIsCheck(true)
      }}
      title='查看/修改'
      visible={modalVisible}
      width={1000}
    >
      <div className='statement-edit-wrapper'>
        {dataSource.manifest
          ? dataSource.manifest.map((item, index) => (
              <div className='statement-item-wrap' key={item.deliveryId}>
                <div className='form-title'>{'结算业务' + (index + 1)}</div>
                <div className='statistics-wrap'>
                  <span>
                    已选择运单数量：
                    {item.countData ? item.countData.transportCount : ''}；
                  </span>
                  <span>
                    矿发吨数：
                    {item.countData ? item.countData.realMineSendWeight : ''}；
                  </span>
                  <span>
                    实收吨数：
                    {item.countData ? item.countData.realTransportWeight : ''}；
                  </span>
                  <span>
                    实付运费：
                    {item.countData ? item.countData.realPayAmount : ''}；
                  </span>
                </div>
                <div className='form-wrap'>
                  <FormSub
                    dataSource={{
                      ...item,
                      startTime: moment(item.startTime),
                      endTime: moment(item.endTime),
                    }}
                    getCheckResult={getCheckResult}
                    getFormValue={getFormValue}
                    isCheck={isCheck}
                    selectOptions={selectOptions}
                  />
                </div>
              </div>
            ))
          : null}
        <div className='statement-item-wrap'>
          <div className='form-title'>委托方</div>
          <div className='form-wrap'>
            <Form {...layout} autoComplete='off' form={antdForm} name={'clientForm'} onValuesChange={onValuesChange}>
              <Form.Item colon={false} label='委托方' name='client' rules={statementRules.client} validateFirst>
                <Input />
              </Form.Item>
              <Form.Item
                colon={false}
                label='日期'
                name='confirmationDate'
                rules={statementRules.confirmationDate}
                validateFirst
              >
                <DatePicker allowClear={false} inputReadOnly />
              </Form.Item>
              <Form.Item
                colon={false}
                label='确认签章'
                name='confirmationSignature'
                rules={statementRules.confirmationSignature}
                validateFirst
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// 单组表单
const FormSub = ({ dataSource, isCheck, selectOptions, getCheckResult, getFormValue }) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const [antdForm] = Form.useForm()

  useEffect(() => {
    antdForm.setFieldsValue(dataSource)
  }, [dataSource])

  useEffect(() => {
    if (isCheck) {
      antdForm
        .validateFields()
        .then(() => {
          getCheckResult(true)
        })
        .catch(() => {
          getCheckResult(false)
        })
    }
  }, [isCheck])

  const onValuesChange = (changedFields, allFields) => {
    const key = Object.keys(changedFields)[0]
    if (key === 'settlementQuantity' || key === 'totalTax') {
      const totalTax = new bignumber(allFields.totalTax)
      const settlementQuantity = new bignumber(allFields.settlementQuantity)
      let unitPrice = totalTax.dividedBy(settlementQuantity).toFixed(2)
      if (isNaN(unitPrice) || !isFinite(unitPrice)) {
        getFormValue(formatParams({ ...dataSource, ...changedFields, unitPrice: '' }))
      } else {
        getFormValue(formatParams({ ...dataSource, ...changedFields, unitPrice: unitPrice }))
      }
    } else {
      getFormValue(formatParams({ ...dataSource, ...changedFields }))
    }
  }

  return (
    <Form
      {...layout}
      autoComplete='off'
      form={antdForm}
      name={`subform${dataSource.deliveryId}`}
      onValuesChange={onValuesChange}
    >
      <Form.Item colon={false} label='装货企业' name='placeOfOrigin' rules={statementRules.placeOfOrigin} validateFirst>
        <Input />
      </Form.Item>
      <Form.Item colon={false} label='日期' required>
        <Form.Item name='startTime' noStyle>
          <DatePicker allowClear={false} inputReadOnly />
        </Form.Item>
        <span className='placeholder-span'>&nbsp;-&nbsp;</span>
        <Form.Item name='endTime' noStyle>
          <DatePicker allowClear={false} inputReadOnly />
        </Form.Item>
      </Form.Item>
      <Form.Item colon={false} label='卸货企业' name='destination' rules={statementRules.destination} validateFirst>
        <Input />
      </Form.Item>
      <Form.Item
        colon={false}
        label='结算吨位'
        name='settlementQuantity'
        rules={statementRules.settlementQuantity}
        validateFirst
      >
        <Input />
      </Form.Item>
      <Form.Item colon={false} label='运距(KM)' name='distance' rules={statementRules.distance} validateFirst>
        <Input />
      </Form.Item>
      <Form.Item colon={false} label='单价(元)' name='unitPrice' rules={statementRules.unitPrice} validateFirst>
        <Input disabled />
      </Form.Item>
      <Form.Item colon={false} label='品名' name='productName' rules={statementRules.productName} validateFirst>
        <AutoComplete options={selectOptions} />
      </Form.Item>
      <Form.Item colon={false} label='含税总价(元)' name='totalTax' rules={statementRules.totalTax} validateFirst>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default StatementEdit
