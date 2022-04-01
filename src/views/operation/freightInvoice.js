import React, { useState, useEffect, useCallback } from 'react'
import { apiGetFreightTableData, apiFreightInvoiceExport } from '@/service/api/operation'
import { apiGetEnumsOptions } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Input, Button, Table, Form, Select, DatePicker, message, Space } from 'antd'
import '@/style/operation/freightInvoice.less'
import { freightInvoiceTableHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams, compareDate } from '@/utils/business'
import ImportInvoice from '@/components/operation/importInvoice'
import FreightInvoiceDetail from '@/components/operation/freightInvoiceDetail'
import AuthButton from '@/components/common/authButton'

const FreightInvoice = (props) => {
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
  const [statistics, setStatistics] = useState({})
  const [invoiceId, setInvoiceId] = useState('')
  const [titleType, setTitleType] = useState('')

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    apiGetFreightTableData(tableParams).then((res) => {
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

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取货单开放状态选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['transportStatus', 'tradeStatus', 'vehicleRecordStatus', 'etcInvoicingStatus', 'deliveryTime'],
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
    if (paramsObj.startTime || paramsObj.endTime) {
      if (!paramsObj.timeType) {
        message.warn('请选择时间类型')
        return
      }
    }
    if (paramsObj.timeType) {
      paramsObj.timeType = Number(paramsObj.timeType)
    }
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
  const openFreightInvoiceDetail = (record) => {
    setInvoiceId(record.invoiceId)
    props.actions.setFreightInvoiceDetailDialogStatus(true)
  }

  //导入按钮
  const importFile = (fileName) => {
    setTitleType(fileName)
    props.actions.setImportInvoiceDetailDialogStatus(true)
  }

  // 导出
  const exportInfo = () => {
    let tempParams = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (tempParams.startTime || tempParams.endTime) {
      if (!tempParams.timeType) {
        message.warn('请选择时间类型')
        return
      }
    }
    if (tempParams.timeType) {
      tempParams.timeType = Number(tempParams.timeType)
    }
    if (compareDate(tempParams.startTime, tempParams.endTime)) {
      apiFreightInvoiceExport(tempParams)
    } else {
      message.warn('开始时间不能大于结束时间')
    }
  }

  return (
    <div className='freightInvoice-wrapper'>
      <div className='_search-handle-wrap'>
        <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form'>
          <Form.Item colon={false} name='orderSn'>
            <Input allowClear placeholder='运单编号' />
          </Form.Item>
          <Form.Item colon={false} name='nameOrTitle'>
            <Input allowClear placeholder='司机姓名/联系方式' />
          </Form.Item>
          <Form.Item colon={false} name='vehicleSn'>
            <Input allowClear placeholder='车牌号' />
          </Form.Item>
          <Form.Item colon={false} name='carType'>
            <Input allowClear placeholder='车辆类型' />
          </Form.Item>
          <Form.Item colon={false} name='orderStatus'>
            <Select allowClear maxTagCount={1} mode='multiple' placeholder='运单状态（多选）' showArrow>
              {searchOptions.transportStatus
                ? searchOptions.transportStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='orderPayStatus'>
            <Select allowClear maxTagCount={1} mode='multiple' placeholder='支付状态（多选）' showArrow>
              {searchOptions.tradeStatus
                ? searchOptions.tradeStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='carInvoiceStatus'>
            <Select allowClear placeholder='车辆备案状态'>
              {searchOptions.vehicleRecordStatus
                ? searchOptions.vehicleRecordStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='etcInvoiceStatus'>
            <Select allowClear maxTagCount={1} mode='multiple' placeholder='ETC开票状态（多选）' showArrow>
              {searchOptions.etcInvoicingStatus
                ? searchOptions.etcInvoicingStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='packCompany'>
            <Input allowClear placeholder='装货企业' />
          </Form.Item>
          <Form.Item colon={false} name='unloadCompany'>
            <Input allowClear placeholder='卸货企业' />
          </Form.Item>
          <Form.Item colon={false} name='createCompany'>
            <Input allowClear placeholder='运单创建企业' />
          </Form.Item>
          <Form.Item colon={false} name='timeType'>
            <Select allowClear placeholder='选择时间类型'>
              {searchOptions.deliveryTime
                ? searchOptions.deliveryTime.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='startTime'>
            <DatePicker allowClear placeholder='开始时间' showTime />
          </Form.Item>
          <Form.Item colon={false} name='endTime'>
            <DatePicker allowClear placeholder='结束时间' showTime />
          </Form.Item>
        </Form>
        <div className='search-handle-btn'>
          <Space size={20}>
            <Button onClick={onSearchBtn} shape='round'>
              查询
            </Button>
            <AuthButton
              authKey='up_car'
              onClick={() => {
                importFile('vehicle')
              }}
              shape='round'
            >
              导入车辆备案状态
            </AuthButton>
            <AuthButton
              authKey='up_open'
              onClick={() => {
                importFile('status')
              }}
              shape='round'
            >
              导入ETC开票状态
            </AuthButton>
            <AuthButton
              authKey='up_open_detail'
              onClick={() => {
                importFile('detail')
              }}
              shape='round'
            >
              导入ETC发票详情
            </AuthButton>
          </Space>
          <Space size={20}>
            <AuthButton authKey='export' onClick={exportInfo} shape='round'>
              导出
            </AuthButton>
            <Button onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </Space>
        </div>
      </div>
      <div className='statistics-wrap'>
        <span className='statistics-title'>统计：运单总数：{statistics.count}；</span>
        <span className='statistics-title'>ETC已开票运单条数：{statistics.etcOpenCount}；</span>
        <span className='statistics-title'>ETC已交易总票数：{statistics.etcPayCount}；</span>
        <span className='statistics-title'>已支付实付运费：{statistics.realPayAmount}；</span>
        <span className='statistics-title'>ETC发票总金额：{statistics.etcPayAmount}；</span>
        <span className='statistics-title'>ETC发票总税额：{statistics.etcTaxAmount}；</span>
      </div>
      <div className='table-wrap _table-wrap'>
        <Table
          columns={freightInvoiceTableHead(openFreightInvoiceDetail)}
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
          rowKey={(record) => record.orderSn}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>

      <FreightInvoiceDetail invoiceId={invoiceId}></FreightInvoiceDetail>
      <ImportInvoice getTableData={getTableData} titleType={titleType}></ImportInvoice>
    </div>
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

export default connect(mapStateProps, mapDispatchToProps)(FreightInvoice)
