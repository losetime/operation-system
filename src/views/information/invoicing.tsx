import React, { FC, ReactElement, useState, useEffect, useCallback, useRef } from 'react'
import { apiGetInvoicingList } from '@/service/api/information'
import { apiGetEnumsOptions } from '@/service/api/common'
import { Input, Select, Button, Form, DatePicker, message } from 'antd'
import '@/style/information/invoicing.less'
import { invoicingHead } from '@/utils/tableHead'
import { formatParams, compareDate } from '@/utils/business'
import InvoicingDetail from '@/components/information/invoicingDetail'
import JwTable from '@/components/common/jwTable'

const Invoicing: FC = (): ReactElement => {
  const { Option } = Select
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const childRef = useRef<any>()
  // 表格数据
  const [tableData, setTableData] = useState([])
  // table数据总条数
  const [total, setTotal] = useState(0)
  // 表格详情数据
  const [currentRowId, setCurrentRowId] = useState(0)
  // 认证状态选项
  const [searchOptions, setSearchOptions] = useState<any>({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    const paramsObj = transformSearch(formatParams(antdForm.getFieldsValue(), 'YYYY-MM-DD HH:mm:ss'))
    apiGetInvoicingList({ ...childRef.current.pagination, ...paramsObj }).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        const result = res.data
        setTotal(result.count)
        setTableData(result.listData)
      }
    })
    childRef.current.setSelectedRowKeys([])
  }, [antdForm])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  //查询条件转换
  const transformSearch = (paramsObj: any) => {
    if (paramsObj.upProvincialStatus) {
      paramsObj.upProvincialStatus = Number(paramsObj.upProvincialStatus)
    }
    if (paramsObj.upProvincialStatus) {
      paramsObj.upProvincialStatus = Number(paramsObj.upProvincialStatus)
    }
    if (paramsObj.tailStartTime || paramsObj.tailEndTime) {
      if (paramsObj.timeType) {
        paramsObj.timeType = Number(paramsObj.timeType)
      } else {
        message.warn('请选择时间类型')
        return
      }
    }
    return paramsObj
  }

  // 列表查询
  const onSearchBtn = () => {
    const paramsObj = formatParams(antdForm.getFieldsValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(paramsObj.tailStartTime, paramsObj.tailEndTime) === false) {
      message.warn('开始时间不能大于结束时间')
    } else {
      childRef.current.initPagination()
    }
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    childRef.current.initPagination()
  }

  // 获取时间类型枚举
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['invoicingTimeType'],
    }).then((res) => {
      if (res.code === 0) {
        const result = res.data
        setSearchOptions(result)
      }
    })
  }

  // 查看/修改
  const checkTableDetail = (record: any) => {
    setCurrentRowId(record.invoicingId)
    setModalVisible(true)
  }

  return (
    <div className='invoicing-wrapper'>
      <div className='search-wrap'>
        <div className='search-form-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='invoicing-form-one'>
            <Form.Item colon={false} name='invoiceConsignorCode'>
              <Input allowClear placeholder='纳税人识别号' />
            </Form.Item>
            <Form.Item colon={false} name='invoiceBankNumber'>
              <Input allowClear placeholder='开户银行账号' />
            </Form.Item>
            <Form.Item colon={false} name='invoiceTitle'>
              <Input allowClear placeholder='发票抬头' />
            </Form.Item>
            <Form.Item colon={false} name='timeType'>
              <Select allowClear placeholder='时间类型'>
                {searchOptions.invoicingTimeType
                  ? searchOptions.invoicingTimeType.map((val: any) => (
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
            <Form.Item colon={false}>
              <Button onClick={onSearchBtn} shape='round'>
                查询
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className='search-handle-wrap'>
          <Button onClick={onRefresh} shape='round' type='primary'>
            刷新
          </Button>
        </div>
      </div>
      <div className='table-wrap _table-wrap'>
        <JwTable
          cRef={childRef}
          dataSource={tableData}
          getDataSource={getTableData}
          idKey='invoicingId'
          loading={tableLoading}
          tableHead={invoicingHead(checkTableDetail)}
          total={total}
        />
      </div>

      <InvoicingDetail
        detailId={currentRowId}
        getTableData={getTableData}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
      />
    </div>
  )
}

export default Invoicing
