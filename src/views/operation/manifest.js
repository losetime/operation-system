import React, { useState, useEffect, useCallback } from 'react'
import { apiGetManifestTableData, apiManifestExport } from '@/service/api/operation'
import { apiGetEnumsOptions } from '@/service/api/common'
import { Input, Button, Table, Form, Select, DatePicker, message, Space } from 'antd'
import '@/style/operation/manifest.less'
import { manifestTableHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams, compareDate } from '@/utils/business'
import { useHistory } from 'react-router-dom'

const Manifest = () => {
  const history = useHistory()
  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const [antdForm] = Form.useForm()
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
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // 货单开发状态选项
  const [searchOptions, setSearchOptions] = useState({})
  //获取统计信息
  const [statistics, setStatistics] = useState([])

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    apiGetManifestTableData(tableParams).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        setActiveRowIndex(-1)
        let result = res.data
        setTotal(result.count)
        setStatistics(result.countData)
        setTableData(result.listData)
      }
    })
  }, [tableParams])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 获取货单开放状态选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['isRelease'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  // 列表查询
  const onSearchBtn = () => {
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(paramsObj.startTime, paramsObj.endTime) === false) {
      message.warn('开始时间不能大于结束时间')
    } else {
      setTableParams({ ...paramsObj, pageNum: 1, perPage: perPage })
    }
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

  // 打开详情
  const openManifestDetail = (record) => {
    history.push({
      pathname: `/home/manifest/detail/${record.deliveryId}`,
    })
  }

  // 导出
  const exportFile = () => {
    let tableParams = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(tableParams.startTime, tableParams.endTime) === false) {
      message.warn('开始时间不能大于结束时间')
      return
    }
    apiManifestExport(tableParams)
  }

  return (
    <div className='manifest-wrapper'>
      <div className='_search-handle-wrap'>
        <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form'>
          <Form.Item colon={false} name='deliverySn'>
            <Input allowClear placeholder='货单号' />
          </Form.Item>
          <Form.Item colon={false} name='packCompany'>
            <Input allowClear placeholder='装货企业' />
          </Form.Item>
          <Form.Item colon={false} name='unloadCompany'>
            <Input allowClear placeholder='卸货企业' />
          </Form.Item>
          <Form.Item colon={false} name='createCompany'>
            <Input allowClear placeholder='货源创建企业' />
          </Form.Item>
          <Form.Item colon={false} name='isRelease'>
            <Select allowClear placeholder='货单开放状态'>
              {searchOptions.isRelease
                ? searchOptions.isRelease.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='startTime'>
            <DatePicker allowClear placeholder='创建时间[起]' showTime />
          </Form.Item>
          <Form.Item colon={false} name='endTime'>
            <DatePicker allowClear placeholder='创建时间[止]' showTime />
          </Form.Item>
          <div className='search-handle-btn'>
            <Button onClick={onSearchBtn} shape='round'>
              查询
            </Button>
            <Space size={20}>
              <Button onClick={exportFile} shape='round'>
                导出
              </Button>
              <Button onClick={onRefresh} shape='round' type='primary'>
                刷新
              </Button>
            </Space>
          </div>
        </Form>
      </div>
      <div className='table-wrap _table-wrap'>
        <div className='statistics-title'>
          <span className='show-statistics-title'>统计：货单总数：{statistics.count}；</span>
          <span className='show-statistics-title'>运单总数：{statistics.transportCount}；</span>
          <span className='show-statistics-title'>已支付运单总数：{statistics.transportPayCount}；</span>
          <span className='show-statistics-title'>已支付实付运费：{statistics.transportPayAmount}；</span>
          <span className='show-statistics-title'>已开票运单总数：{statistics.invoiceCount}；</span>
          <span className='show-statistics-title'>已开票实付运费：{statistics.invoiceAmount}；</span>
        </div>
        <Table
          columns={manifestTableHead(openManifestDetail)}
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
          rowKey={(record) => record.deliveryId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>
    </div>
  )
}

export default Manifest
