import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  apiGetInvoiceApplyList,
  apiCancelInvoiceApply,
  apiGetInvoiceEnumerate,
  apiInvoiceApplyListExport,
} from '@/service/api/finance'
import { apiGetEnumsOptions } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { useHistory } from 'react-router-dom'
import { Input, Button, Form, Select, message, Modal, DatePicker, Space } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import '@/style/finance/invoiceApproval.less'
import { invoiceApprovalHead } from '@/utils/tableHead'
import { formatParams, compareDate } from '@/utils/business'
import ApplyCount from '@/components/finance/applyCount'
import AuthButton from '@/components/common/authButton'
import JwTable from '@/components/common/jwTable'

const InvoiceApproval = (props) => {
  const history = useHistory()
  const { confirm } = Modal
  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }
  const childRef = useRef()
  const [antdForm] = Form.useForm()
  // 表格数据
  const [tableData, setTableData] = useState([])
  // 统计信息
  const [statisticsInfo, setStatisticsInfo] = useState({})
  // table数据总条数
  const [total, setTotal] = useState(0)
  // 表格详情数据
  const [recordId, setRecordId] = useState(-1)
  // 认证状态选项
  const [searchOptions, setSearchOptions] = useState([])
  // 认证状态选项
  const [timeSearchOptions, setTimeSearchOptions] = useState([])
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  const [billingStatus, setBillingStatus] = useState(-1)

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    let paramsObj = transformSearch(formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss'))
    apiGetInvoiceApplyList({
      ...childRef.current.pagination,
      ...paramsObj,
    }).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        let result = res.data
        setTotal(result.count)
        setStatisticsInfo(result.countInfo)
        setTableData(result.listData)
      }
    })
    childRef.current.setSelectedRowKeys([])
  }, [antdForm])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  useEffect(() => {
    getSearchOptions()
  }, [])

  //查询条件转换
  const transformSearch = (paramsObj) => {
    if (paramsObj.upProvincialStatus) {
      paramsObj.upProvincialStatus = Number(paramsObj.upProvincialStatus)
    }
    if (paramsObj.upProvincialStatus) {
      paramsObj.upProvincialStatus = Number(paramsObj.upProvincialStatus)
    }
    if (paramsObj.startTime || paramsObj.endTime) {
      if (paramsObj.timeType) {
        paramsObj.timeType = Number(paramsObj.timeType)
      } else {
        message.warn('请选择时间类型')
        return
      }
    }
    return paramsObj
  }

  // 查询操作
  const searchHandle = () => {
    let formObj = formatParams(antdForm.getFieldsValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(formObj.startTime, formObj.endTime)) {
      childRef.current.initPagination()
    } else {
      message.warning('开始时间不能大于结束时间')
    }
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    childRef.current.initPagination()
  }

  // 获取开票状态选项
  const getSearchOptions = () => {
    apiGetInvoiceEnumerate().then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
    apiGetEnumsOptions({
      enumByParams: ['invoiceRecordTimeType'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTimeSearchOptions(result)
      }
    })
  }

  // 查看申请列表
  const checkInvoiceList = (val) => {
    setRecordId(val.billingRecordId)
    setBillingStatus(val.billingStatusName)
    props.actions.setApplyCountStatus(true)
  }

  // 确认开票信息
  const confirmInvoiceInfo = (val) => {
    history.push({
      pathname: `/home/confirmInvoiceInfo/${val.billingRecordId}/${val.number}`,
    })
  }

  // 取消开票
  const cancelInvoiceApply = (val) => {
    confirm({
      title: '操作提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要取消开票吗?',
      onOk() {
        apiCancelInvoiceApply({
          invoiceId: val.billingRecordId,
        }).then((res) => {
          if (res.code === 0) {
            message.success('操作成功')
            childRef.current.initPagination()
          }
        })
      },
    })
  }

  // 导出
  const onExportHandle = () => {
    const tableParams = formatParams(antdForm.getFieldsValue(), 'YYYY-MM-DD HH:mm:ss')
    if (tableParams.startTime || tableParams.endTime) {
      if (!tableParams.timeType) {
        message.warn('请选择时间类型')
        return
      } else {
        tableParams.timeType = Number(tableParams.timeType)
      }
    }
    if (compareDate(tableParams.startTime, tableParams.endTime)) {
      apiInvoiceApplyListExport(tableParams)
    } else {
      message.warning('开始时间不能大于结束时间')
    }
  }

  return (
    <div className='invoice-approval-wrapper'>
      <div className='_search-handle-wrap'>
        <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form'>
          <Form.Item colon={false} name='number'>
            <Input allowClear placeholder='编号' />
          </Form.Item>
          <Form.Item colon={false} name='invoiceNumber'>
            <Input allowClear placeholder='发票号码' />
          </Form.Item>
          <Form.Item colon={false} name='courierNumber'>
            <Input allowClear placeholder='快递单号' />
          </Form.Item>
          <Form.Item colon={false} name='invoiceTitle'>
            <Input allowClear placeholder='开票企业' />
          </Form.Item>
          <Form.Item colon={false} name='packCompany'>
            <Input allowClear placeholder='装货企业' />
          </Form.Item>
          <Form.Item colon={false} name='unloadCompany'>
            <Input allowClear placeholder='卸货企业' />
          </Form.Item>
          <Form.Item colon={false} name='billingStatus'>
            <Select allowClear placeholder='开票状态'>
              {searchOptions ? searchOptions.map((val) => <Option key={val.label}>{val.text}</Option>) : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='timeType'>
            <Select allowClear placeholder='时间类型'>
              {timeSearchOptions.invoiceRecordTimeType
                ? timeSearchOptions.invoiceRecordTimeType.map((val) => <Option key={val.label}>{val.text}</Option>)
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
        <div className='handle-wrap-btn'>
          <Button onClick={searchHandle} shape='round'>
            查询
          </Button>
          <Space size={20}>
            <AuthButton authKey='export' onClick={onExportHandle} shape='round'>
              导出
            </AuthButton>
            <Button onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </Space>
        </div>
      </div>
      <div className='statistics-wrap'>
        <span>统计：</span>
        <span>实际业务条数：{statisticsInfo.businessInvoice}；</span>
        <span>开具发票张数：{statisticsInfo.openInvoice}；</span>
        <span>结算吨位：{statisticsInfo.invoiceWeight}；</span>
        <span>实付运费：{statisticsInfo.invoiceAmount}；</span>
        <span>含税总价：{statisticsInfo.countAmount}；</span>
        <span>服务费：{statisticsInfo.taxAmount}；</span>
        <span>实际扣款：{statisticsInfo.realAmount}；</span>
        <span>货主利润：{statisticsInfo.differPrice}；</span>
      </div>
      <div className='table-wrap _table-wrap'>
        <JwTable
          cRef={childRef}
          dataSource={tableData}
          total={total}
          tableHead={invoiceApprovalHead(checkInvoiceList, confirmInvoiceInfo, cancelInvoiceApply)}
          idKey='billingRecordId'
          loading={tableLoading}
          multipleSelection={true}
          getDataSource={getTableData}
        />
      </div>

      <ApplyCount billingStatus={billingStatus} recordId={recordId}></ApplyCount>
    </div>
  )
}

const mapStateProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(InvoiceApproval)
