import React, { useState, useEffect, useCallback, useRef } from 'react'
import { apiGetCarriageAgreementList, apiCarriageAgreementDownload } from '@/service/api/information'
import { apiGetEnumsOptions } from '@/service/api/common'
import { Input, Select, Button, Table, Form, DatePicker, message, Space } from 'antd'
import '@/style/information/carriageAgreement.less'
import { carriageAgreementTableHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams, compareDate } from '@/utils/business'
import CarriageAgreementDetail from '@/components/information/carriageAgreementDetail'
import AuthButton from '@/components/common/authButton'

const CarriageAgreement = () => {
  const { Option } = Select
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  // 表格数据
  const [tableData, setTableData] = useState([])
  // table数据总条数
  const [total, setTotal] = useState(0)
  // table当前选中行索引
  const [activeRowIndex, setActiveRowIndex] = useState(-1)
  // table分页参数
  const [tableParams, setTableParams] = useState({
    pageNum: 1, // 当前页
    perPage: perPage, // 每页条数
  })
  // 认证状态选项
  const [searchOptions, setSearchOptions] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  const [driverId, setDriverId] = useState(-1)
  const carriageAgreementRef = useRef()

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    apiGetCarriageAgreementList(tableParams).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        setActiveRowIndex(-1)
        let result = res.data
        setTotal(result.count)
        setTableData(result.listData)
      }
    })
  }, [tableParams])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 列表查询
  const onSearchBtn = () => {
    let timeComparison = antdForm.getFieldValue()
    if (timeComparison.startTime && timeComparison.endTime) {
      if (Date.parse(timeComparison.startTime) > Date.parse(timeComparison.endTime)) {
        message.warn('开始时间不能大于结束时间')
        return
      }
    }
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    setTableParams({ ...paramsObj, pageNum: 1, perPage: perPage })
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    setTableParams({ pageNum: 1, perPage: perPage })
  }

  // 监听表格
  const onTableChange = (pagination) => {
    setTableParams({ ...tableParams, pageNum: pagination.current })
  }

  // 获取承运协议状态选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['authenticationStatus', 'agreementStatus'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  // 选择表格当前行
  const selectTableRow = (record, index) => {
    setTableRowStyle(index)
  }

  // 设置表格样式
  const setTableRowStyle = (record, index) => {
    //record代表表格行的内容，index代表行索引
    //判断索引相等时添加行的高亮样式
    return index === activeRowIndex ? 'active-current-row' : index % 2 === 1 ? 'row-zebra-crossing' : ''
  }

  // 查看/修改
  const checkTableDetail = (record) => {
    setDriverId(record.driverId)
    carriageAgreementRef.current.setVisible(true)
  }

  //导出承运协议
  const exportAgreement = () => {
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(paramsObj.startTime, paramsObj.endTime) === false) {
      message.warn('开始时间不能大于结束时间')
      return
    }
    apiCarriageAgreementDownload(paramsObj)
  }

  return (
    <div className='carriageAgreement-wrapper'>
      <div className='_search-handle-wrap'>
        <div className='search-handle-header-wrap'>
          <Form
            {...layout}
            autoComplete='off'
            form={antdForm}
            initialValues={{ timeType: 1 }}
            layout={'inline'}
            name='form'
          >
            <Form.Item colon={false} name='nameOrTel'>
              <Input allowClear placeholder='姓名/联系方式' />
            </Form.Item>
            <Form.Item colon={false} name='idCard'>
              <Input allowClear placeholder='身份证号码' />
            </Form.Item>
            <Form.Item colon={false} name='driverStatus'>
              <Select allowClear placeholder='认证状态'>
                {searchOptions.authenticationStatus
                  ? searchOptions.authenticationStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='agreementStatus'>
              <Select allowClear placeholder='签订状态'>
                {searchOptions.agreementStatus
                  ? searchOptions.agreementStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='startTime'>
              <DatePicker allowClear placeholder='签订日期[起]' showTime />
            </Form.Item>
            <Form.Item colon={false} name='endTime'>
              <DatePicker allowClear placeholder='签订日期[止]' showTime />
            </Form.Item>
          </Form>
        </div>
        <div className='handle-wrap-btn'>
          <Button onClick={onSearchBtn} shape='round'>
            查询
          </Button>
          <Space size={20}>
            <AuthButton authKey='export' onClick={exportAgreement} shape='round'>
              导出协议
            </AuthButton>
            <Button onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </Space>
        </div>
      </div>
      <div className='table-wrap _table-wrap'>
        <Table
          columns={carriageAgreementTableHead(checkTableDetail)}
          dataSource={tableData}
          loading={tableLoading}
          onChange={onTableChange}
          onRow={(record, index) => {
            return {
              onClick: () => {
                selectTableRow(record, index)
              },
            }
          }}
          pagination={paginationObj(total, tableParams)}
          rowClassName={setTableRowStyle}
          rowKey={(record) => record.driverId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>

      <CarriageAgreementDetail cRef={carriageAgreementRef} driverId={driverId}></CarriageAgreementDetail>
    </div>
  )
}

export default CarriageAgreement
