import React, { FC, useState, useEffect, useCallback, ReactElement, useRef } from 'react'
import { apiGetWaybillList, apiWriteInAllData, apiWriteInInvoice } from '@/service/api/operation'
import { apiGetEnumsOptions } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { waybillListTableHead } from '@/utils/tableHead'
import { Input, Select, Button, Form, DatePicker, Space, message } from 'antd'
import '@/style/operation/manifest.less'
import { formatParams, compareDate } from '@/utils/business'
import { WaybillListOptionsInterface, EnumInterface, StatisticsInterface } from '@/types/operation'
import JwTable from '@/components/common/jwTable'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import bignumber from 'bignumber.js'
import AuthButton from '@/components/common/authButton'

export interface IProps {
  match: any
}

const Waybill: FC<IProps> = ({ match }): ReactElement => {
  const history = useHistory()
  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const detailId = Number(match.params.id)
  const [antdForm] = Form.useForm()
  const tableRef = useRef<any>({})
  // 表格数据
  const [tableData, setTableData] = useState([])
  // 状态状态，支付状态，开票状态选项
  const [searchOptions, setSearchOptions] = useState<WaybillListOptionsInterface | any>({})
  // table数据总条数
  const [total, setTotal] = useState(0)
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // 数据统计
  const [statistics, setStatistics] = useState<StatisticsInterface | any>({})
  // 数据统计备份
  const [statisticsBackup, setStatisticsBackup] = useState({})
  // 是否全部写入
  const [isAllSelect, setIsAllSelect] = useState(false)
  // 全部写入loading
  const [writeLoading, setWriteLoading] = useState(false)
  // 写入发票loading
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取表格数据
  const getTableData = useCallback((): void => {
    const paramsObj = getSearchParams()
    setTableLoading(true)
    apiGetWaybillList({
      deliveryId: detailId,
      ...paramsObj,
      ...tableRef.current.pagination,
    }).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        const result = res.data
        setTotal(result.count)
        setTableData(result.listData)
        setStatistics(result.countData)
        setStatisticsBackup(result.countData)
      }
    })
  }, [])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 获取状态状态，支付状态，开票状态选项
  const getSearchOptions = (): void => {
    apiGetEnumsOptions({
      enumByParams: [
        'makeInvoiceStatus',
        'tradeStatus',
        'transportStatus',
        'deliveryTransportTimeType',
        'transportUpStatus',
        'transportErrorMessage',
      ],
    }).then((res) => {
      if (res.code === 0) {
        const result = res.data
        setSearchOptions(result)
      }
    })
  }

  const getSearchParams = () => {
    return formatParams(antdForm.getFieldsValue(), 'YYYY-MM-DD HH:mm:ss')
  }

  // 列表查询
  const onSearchBtn = (): void => {
    const paramsObj = getSearchParams()
    const { startTime, endTime, timeType } = paramsObj
    if (startTime || endTime) {
      if (!timeType) {
        message.warn('请选择时间类型！')
        return
      }
    }
    if (compareDate(paramsObj.startTime, paramsObj.endTime) === false) {
      message.warn('开始时间不能大于结束时间')
    } else {
      tableRef.current.initPagination()
    }
  }

  // 全部写入/取消
  const onAllWriteIn = (): void => {
    const tempFlag = !isAllSelect
    const paramsObj = getSearchParams()
    setIsAllSelect(tempFlag)
    setWriteLoading(true)
    apiWriteInAllData({
      ...paramsObj,
      deliveryId: detailId,
      type: 1,
    })
      .then((res) => {
        if (res.code === 0) {
          message.success(res.data.message)
          tableRef.current.setSelectedRowKeys([])
          getTableData()
        } else {
          setIsAllSelect(!tempFlag)
        }
      })
      .finally(() => {
        setWriteLoading(false)
      })
  }

  // 写入发票
  const onWriteInvoice = () => {
    if (tableRef.current.selectedRowKeys.length > 0) {
      setInvoiceLoading(true)
      apiWriteInInvoice({
        transportIds: tableRef.current.selectedRowKeys,
      })
        .then((res) => {
          if (res.code === 0) {
            message.success('写入成功')
            tableRef.current.setSelectedRowKeys([])
            getTableData()
          }
        })
        .finally(() => {
          setInvoiceLoading(false)
        })
    } else {
      message.warn('请选择要写入的数据')
    }
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    tableRef.current.initPagination()
  }

  // 返回上一页
  const goBack = (): void => {
    history.push(`/home/manifest/detail/${detailId}`)
  }

  // 统计已选项
  const onStatistics = () => {
    const selectedRowKeys = tableRef.current.selectedRowKeys
    if (selectedRowKeys.length > 0) {
      let realMineSendWeight = new bignumber(0)
      let realTransportWeight = new bignumber(0)
      let realPayCountAmount = new bignumber(0)
      tableData.forEach((val: any) => {
        if (selectedRowKeys.includes(val.transportId)) {
          realMineSendWeight = realMineSendWeight.plus(val.realMineSendWeight)
          realTransportWeight = realTransportWeight.plus(val.unloadingWeight)
          realPayCountAmount = realPayCountAmount.plus(val.realPayAmount)
        }
      })
      setStatistics({
        realMineSendWeight: realMineSendWeight.toFixed(2),
        realTransportWeight: realTransportWeight.toFixed(2),
        realPayCountAmount: realPayCountAmount.toFixed(2),
        transportCount: selectedRowKeys.length,
        invoiceAmount: statistics.invoiceAmount,
      })
    } else {
      setStatistics({ ...statisticsBackup })
    }
  }

  return (
    <div className='waybill-list-wrapper'>
      <div className='manifest-detail-nav'>
        <Button onClick={goBack} style={{ fontSize: '18px' }} type='text'>
          <ArrowLeftOutlined />
          <span>运单列表</span>
        </Button>
      </div>
      <div className='search-wrap'>
        <div className='search-item-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form1' onFinish={onSearchBtn}>
            <Form.Item colon={false} name='transportSn'>
              <Input allowClear placeholder='运单号' />
            </Form.Item>
            <Form.Item colon={false} name='vehicleNo'>
              <Input allowClear placeholder='车牌号' />
            </Form.Item>
            <Form.Item colon={false} name='paymentStatus'>
              <Select allowClear maxTagCount={1} mode='multiple' placeholder='支付状态(可多选)'>
                {searchOptions.tradeStatus
                  ? searchOptions.tradeStatus.map((val: EnumInterface) => (
                      <Option key={val.label} value={val.label}>
                        {val.text}
                      </Option>
                    ))
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='makeInvoiceStatus'>
              <Select allowClear maxTagCount={1} mode='multiple' placeholder='开票状态(可多选)'>
                {searchOptions.makeInvoiceStatus
                  ? searchOptions.makeInvoiceStatus.map((val: EnumInterface) => (
                      <Option key={val.label} value={val.label}>
                        {val.text}
                      </Option>
                    ))
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='timeType'>
              <Select allowClear placeholder='选择时间类型'>
                {searchOptions.deliveryTransportTimeType
                  ? searchOptions.deliveryTransportTimeType.map((val: EnumInterface) => (
                      <Option key={val.label} value={val.label}>
                        {val.text}
                      </Option>
                    ))
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
          <Button onClick={onSearchBtn} shape='round'>
            查询
          </Button>
        </div>
        <div className='search-item-wrap'>
          <Space>
            <AuthButton authKey='delivery_invoice' loading={writeLoading} onClick={onAllWriteIn} shape='round'>
              全部写入
            </AuthButton>
            <AuthButton
              authKey='delivery_invoice_store'
              loading={invoiceLoading}
              onClick={onWriteInvoice}
              shape='round'
            >
              <span>写入发票(金额 {statistics.invoiceAmount})</span>
            </AuthButton>
          </Space>
          <Button onClick={onRefresh} shape='round' type='primary'>
            刷新
          </Button>
        </div>
      </div>
      <div className='statistics-wrap'>
        <span className='statistics-item'>统计：运单总数：{statistics.transportCount}；</span>
        <span className='statistics-item'>矿发吨数：{statistics.realMineSendWeight}；</span>
        <span className='statistics-item'>实收吨数：{statistics.realTransportWeight}；</span>
        <span className='statistics-item'>已支付实付运费：{statistics.realPayCountAmount}；</span>
      </div>
      <div className='table-wrap _table-wrap'>
        <JwTable
          cRef={tableRef}
          dataSource={tableData}
          disabledKey='status'
          getDataSource={getTableData}
          idKey='transportId'
          loading={tableLoading}
          multipleSelection={true}
          onStatistics={onStatistics}
          tableHead={waybillListTableHead()}
          total={total}
        />
      </div>
    </div>
  )
}

const mapStateProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Waybill)
