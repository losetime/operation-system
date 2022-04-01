import React, { useState, useEffect, useCallback } from 'react'
import { Input, Button, Table, Form, Space, Select, message, DatePicker } from 'antd'
import '@/style/finance/profitWithdrawal.less'
import { apiGetEnumsOptions } from '@/service/api/common'
import { profitWithdrawalHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams, compareDate } from '@/utils/business'
import { useHistory } from 'react-router-dom'
import { apiGetProfitWithdrawalList, apiProfitWithdrawalExport } from '@/service/api/finance'
import AuthButton from '@/components/common/authButton'

const ProfitWithdrawal = (props) => {
  const { Option } = Select
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }
  const history = useHistory()
  // 表格数据
  const [tableData, setTableData] = useState([])
  // table数据总条数
  const [total, setTotal] = useState(0)
  // table当前选中行索引
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  // table分页参数
  const [tableParams, setTableParams] = useState({
    pageNum: 1, // 当前页
    perPage: perPage, // 每页条数
  })
  // 认证状态选项
  const [searchOptions, setSearchOptions] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  //统计数据
  const [statisticData, setStatisticData] = useState({})

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    apiGetProfitWithdrawalList(tableParams).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        setActiveRowIndex(-1)
        let result = res.data
        setTotal(result.count)
        setTableData(result.listData)
        setStatisticData(result.countData)
      }
    })
  }, [tableParams])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  //获取搜索枚举
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['cashStatus', 'cashPayStatusMap'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  useEffect(() => {
    getSearchOptions()
  }, [])

  const onSearchBtn = () => {
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (paramsObj.startTime || paramsObj.endTime) {
      paramsObj = { ...paramsObj, timeType: '1' }
    }
    if (compareDate(paramsObj.startTime, paramsObj.endTime) === false) {
      message.warn('开始时间不能大于结束时间')
    } else {
      setTableParams({ ...paramsObj, pageNum: 1, perPage: perPage })
    }
  }

  const onRefresh = () => {
    antdForm.resetFields()
    setTableParams({ pageNum: 1, perPage: perPage })
  }

  // 监听表格
  const onTableChange = (pagination) => {
    setTableParams({ ...tableParams, pageNum: pagination.current })
  }

  // 选择表格当前行
  const selectTableRow = (row, index) => {
    setActiveRowIndex(index)
  }

  // 设置表格样式
  const setTableRowStyle = (record, index) => {
    //record代表表格行的内容，index代表行索引
    //判断索引相等时添加行的高亮样式
    return index === activeRowIndex ? 'active-current-row' : index % 2 === 1 ? 'row-zebra-crossing' : ''
  }

  //进入详情
  const checkTableDetail = (record) => {
    history.push({
      pathname: `/home/profitWithdrawalDetail/${record.cashId}`,
    })
  }

  //导出
  const onExportBtn = () => {
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (paramsObj.startTime || paramsObj.endTime) {
      paramsObj = { ...paramsObj, timeType: '1' }
    }
    if (compareDate(paramsObj.startTime, paramsObj.endTime) === false) {
      message.warn('开始时间不能大于结束时间')
    } else {
      apiProfitWithdrawalExport(paramsObj)
    }
  }

  return (
    <div className='profitWithdrawal-wrapper'>
      <div className='_search-handle-wrap'>
        <div className='search-handle-wrap'>
          <Form {...layout} form={antdForm} name='form' layout={'inline'} autoComplete='off'>
            <Form.Item name='cashSn'>
              <Input allowClear placeholder='交易单号' />
            </Form.Item>
            <Form.Item name='consignorShortName'>
              <Input allowClear placeholder='企业简称' />
            </Form.Item>
            <Form.Item name='cashStatus'>
              <Select allowClear placeholder='利润提现状态'>
                {searchOptions.cashStatus
                  ? searchOptions.cashStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item name='cashPayStatus'>
              <Select allowClear placeholder='交易状态'>
                {searchOptions.cashPayStatusMap
                  ? searchOptions.cashPayStatusMap.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item name='startTime'>
              <DatePicker allowClear placeholder='时间[起]' showTime />
            </Form.Item>
            <Form.Item name='endTime'>
              <DatePicker allowClear placeholder='时间[止]' showTime />
            </Form.Item>
          </Form>
          <div className='test'>
            <Button shape='round' onClick={onSearchBtn}>
              查询
            </Button>
          </div>
        </div>
        <div className='search-handle-btn'>
          <Space size={20}>
            <AuthButton authKey='export' shape='round' onClick={onExportBtn}>
              导出
            </AuthButton>
            <Button shape='round' type='primary' onClick={onRefresh}>
              刷新
            </Button>
          </Space>
        </div>
      </div>

      <div className='statistics-wrap'>
        <span>
          <span>统计：利润总计（元）：{statisticData.differCount}；</span>
          <span>已提取利润（元）：{statisticData.differWithdrawal}；</span>
          <span>剩余未提利润（元）：{statisticData.differNotWithdrawal}；</span>
        </span>
      </div>

      <div className='table-wrap _table-wrap'>
        <Table
          columns={profitWithdrawalHead(checkTableDetail)}
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
          rowKey={(record) => record.cashId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>
    </div>
  )
}

export default ProfitWithdrawal
