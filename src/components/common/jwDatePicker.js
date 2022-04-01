import React, { useState, useEffect } from 'react'
import '@/style/information/consignor.less'
import { Form, Input, DatePicker, Button } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

const JwDatePicker = (props) => {
  const {
    tableDetail,
    formKey,
    disabledEdit,
    setTableDetail,
    modalFooterRef,
    noStyle,
    label,
    rules,
    getPopupContainer,
  } = props
  const [isLongTerm, setIsLongTerm] = useState(true)
  const [detaPickerSwitch, setDetaPickerSwitch] = useState(false)
  const [tempDate, setTempDate] = useState('')
  const [style, setStyle] = useState(true)

  useEffect(() => {
    if (tableDetail[formKey] === '长期') {
      setIsLongTerm(true)
    } else {
      setIsLongTerm(false)
    }
  }, [tableDetail])

  useEffect(() => {
    if (noStyle === false) {
      setStyle(false)
    }
    setTempDate(tableDetail[formKey])
  }, [])

  useEffect(() => {
    if (!detaPickerSwitch) {
      let tableDetailTemp = { ...tableDetail }
      tableDetailTemp[formKey] = tempDate
      setTableDetail(tableDetailTemp)
      if (modalFooterRef) {
        modalFooterRef.current.onFormChange() // 显示通过按钮
      }
    }
  }, [detaPickerSwitch, tempDate])

  // 监听时间选择的【长期】按钮
  const onLongTermBtn = () => {
    let tableDetailTemp = { ...tableDetail }
    tableDetailTemp[formKey] = '长期'
    setTempDate('长期')
    setTableDetail(tableDetailTemp)
    setDetaPickerSwitch(false)
  }

  // 监听时间选择变化
  const onDatePickerChange = (val) => {
    setTempDate(val)
  }

  // 点击【长期】input框
  const onLongTermInput = () => {
    let tableDetailTemp = { ...tableDetail }
    tableDetailTemp[formKey] = ''
    setTableDetail(tableDetailTemp)
    setDetaPickerSwitch(true)
  }

  // 监听时间选择框的切换
  const onDatePickerSwitch = (open) => {
    setDetaPickerSwitch(open)
  }

  return isLongTerm ? (
    <Form.Item name={formKey} label={label} noStyle={style} rules={rules} colon={false}>
      <Input
        disabled={disabledEdit}
        onClick={onLongTermInput}
        placeholder='请选择日期'
        suffix={<CalendarOutlined style={{ color: '#BFBFBF' }} />}
      />
    </Form.Item>
  ) : (
    <Form.Item name={formKey} label={label} noStyle={style} rules={rules} colon={false}>
      <DatePicker
        allowClear={false}
        disabled={disabledEdit}
        inputReadOnly
        onChange={onDatePickerChange}
        onOpenChange={onDatePickerSwitch}
        open={detaPickerSwitch}
        getPopupContainer={() => document.getElementById(getPopupContainer)}
        renderExtraFooter={() => (
          <Button onClick={onLongTermBtn} type='link'>
            长期
          </Button>
        )}
      />
    </Form.Item>
  )
}

export default JwDatePicker
