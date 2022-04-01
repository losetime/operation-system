import React, { useState, useEffect, useCallback, useRef } from 'react'
import { apiGetWaybillTableData, apiGetWaybillDetail, apiWaybillExport } from '@/service/api/operation'
import { apiGetEnumsOptions, apiUploadGovData } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import WaybillDetail from '@/components/operation/waybillDetail'
import PayAgain from '@/components/operation/payAgain'
import { wallbilTableHead } from '@/utils/tableHead'
import { Input, Select, Button, Form, DatePicker, Space, Popover, message } from 'antd'
import '@/style/operation/waybill.less'
import { formatParams, compareDate } from '@/utils/business'
import AuthButton from '@/components/common/authButton'
import JwTable from '@/components/common/jwTable'

const Waybill = (props) => {
  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const tableRef = useRef()
  const [antdForm] = Form.useForm()
  // 表格数据
  const [tableData, setTableData] = useState([])
  // 表格当前运单详情
  const [tableDetail, setTableDetail] = useState({})
  // 状态状态，支付状态，开票状态选项
  const [searchOptions, setSearchOptions] = useState({})
  // table数据总条数
  const [total, setTotal] = useState(0)
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  //数据统计
  const [countData, setCountData] = useState([])
  //更多条件查询按钮状态
  const [moreSearch, setMoreSearch] = useState(false)
  // 支付失败数据集合
  const [payFailList, setPayFailList] = useState([])

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取表格数据
  const getTableData = useCallback(() => {
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (paramsFilter(paramsObj)) {
      setTableLoading(true)
      apiGetWaybillTableData({
        ...paramsObj,
        ...tableRef.current.pagination,
      }).then((res) => {
        setTableLoading(false)
        if (res.code === 0) {
          let result = res.data
          setTotal(result.count)
          setTableData(result.listData)
          setCountData(result.countData)
        }
      })
    }
  }, [])

  // 列表查询参数过滤
  const paramsFilter = (paramsObj) => {
    const { upProvincialStatus, upSuideStatus, startTime, endTime, timeType } = paramsObj
    if (upProvincialStatus) {
      paramsObj.upProvincialStatus = Number(upProvincialStatus)
    }
    if (upSuideStatus) {
      paramsObj.upSuideStatus = Number(upSuideStatus)
    }
    if (startTime || endTime) {
      if (timeType) {
        paramsObj.timeType = Number(timeType)
      } else {
        message.warn('请选择时间类型')
        return false
      }
    }
    if (compareDate(startTime, endTime) === false) {
      message.warn('开始时间不能大于结束时间')
      return false
    }
    return true
  }

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 获取状态状态，支付状态，开票状态选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: [
        'makeInvoiceStatus',
        'tradeStatus',
        'transportStatus',
        'transportTimeType',
        'transportUpStatus',
        'transportErrorMessage',
        'suiDeCapitalFlow',
        'provincialCapitalFlow',
      ],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  // 查询
  const searchTable = () => {
    tableRef.current.setSelectedRowKeys([])
    tableRef.current.initPagination()
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    setMoreSearch(false)
    tableRef.current.initPagination()
  }

  // 查看
  const checkTableDetail = (record) => {
    apiGetWaybillDetail({ transportId: record.transportId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(result)
        props.actions.setWaybillDetailDialogStatus(true)
      }
    })
  }

  // 导出运单
  const onExportExcel = () => {
    let tempParams = formatParams(antdForm.getFieldsValue(), 'YYYY-MM-DD HH:mm:ss')
    if (tempParams.upProvincialStatus) {
      tempParams.upProvincialStatus = Number(tempParams.upProvincialStatus)
    }
    if (tempParams.upSuideStatus) {
      tempParams.upSuideStatus = Number(tempParams.upSuideStatus)
    }
    if (tempParams.startTime || tempParams.endTime) {
      if (tempParams.timeType) {
        tempParams.timeType = Number(tempParams.timeType)
      } else {
        message.warn('请选择时间类型')
        return
      }
    }
    apiWaybillExport(tempParams)
  }

  //控制是否有内容
  const onValuesChange = (changeFiles, allFiles) => {
    if (
      !allFiles.upProvincialStatus &&
      !allFiles.upSuideStatus &&
      !allFiles.transportErrorMessage &&
      !allFiles.suiDeCapitalFlow &&
      !allFiles.provincialCapitalFlow
    ) {
      setMoreSearch(false)
    } else {
      setMoreSearch(true)
    }
  }

  //上传绥德
  const uploadGovData = (type) => {
    const selectedRows = tableRef.current.selectedRows
    let transportSn = selectedRows.map((val) => val.transportSn)
    if (selectedRows.length > 0) {
      for (let i = 0; i < selectedRows.length; i++) {
        if (selectedRows[i].transportStatus !== 2) {
          message.warn('非完成运单无法上传')
          return
        } else if (selectedRows[i].tradeStatus !== 3) {
          message.warn('非支付完成运单无法上传')
          return
        }
      }
      if (type === 'sd_waybill') {
        uploadRequest(transportSn, 2, '运单已上传至绥德')
      }
      if (type === 'sd_water') {
        uploadRequest(transportSn, 3, '流水已上传至绥德')
      }
      if (type === 'st_waybill') {
        uploadRequest(transportSn, 5, '运单已上传至省厅')
      }
      if (type === 'st_water') {
        uploadRequest(transportSn, 6, '流水已上传至省厅')
      }
    } else {
      message.warn('请上传编号')
    }
  }

  // 上传数据请求
  const uploadRequest = (transportSn, transportType, msg) => {
    apiUploadGovData({ transportSn, transportType }).then((res) => {
      if (res.code === 0) {
        message.success(msg)
      }
    })
  }

  return (
    <div className='waybill-wrapper'>
      <div className='_search-handle-wrap'>
        <div className='search-handle-header-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='waybill-search-form-one'>
            <Form.Item colon={false} label='' name='transportNo'>
              <Input allowClear placeholder='运单/支付单/商户号' />
            </Form.Item>
            <Form.Item colon={false} label='' name='vehicleNo'>
              <Input allowClear placeholder='车牌号' />
            </Form.Item>
            <Form.Item colon={false} label='' name='nameOrTel'>
              <Input allowClear placeholder='司机姓名/联系方式' />
            </Form.Item>
            <Form.Item colon={false} label='' name='transportStatus'>
              <Select allowClear maxTagCount={1} mode='multiple' placeholder='运单状态(可多选)'>
                {searchOptions.transportStatus
                  ? searchOptions.transportStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} label='' name='tradeStatus'>
              <Select allowClear maxTagCount={1} mode='multiple' placeholder='支付状态(可多选)'>
                {searchOptions.tradeStatus
                  ? searchOptions.tradeStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} label='' name='makeInvoiceStatus'>
              <Select allowClear maxTagCount={1} mode='multiple' placeholder='开票状态(可多选)'>
                {searchOptions.makeInvoiceStatus
                  ? searchOptions.makeInvoiceStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className='search-handle-footer-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='waybill-search-form-two'>
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
                {searchOptions.transportTimeType
                  ? searchOptions.transportTimeType.map((val) => <Option key={val.label}>{val.text}</Option>)
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
          <Space className='handle-footer-wrap'>
            <Popover
              content={
                <Form
                  {...layout}
                  autoComplete='off'
                  form={antdForm}
                  layout={'inline'}
                  name='waybill-search-form-three'
                  onValuesChange={onValuesChange}
                >
                  <Form.Item colon={false} name='upProvincialStatus'>
                    <Select allowClear placeholder='省厅运单状态'>
                      {searchOptions.transportUpStatus
                        ? searchOptions.transportUpStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                        : []}
                    </Select>
                  </Form.Item>
                  <Form.Item colon={false} name='upSuideStatus'>
                    <Select allowClear placeholder='绥德运单状态'>
                      {searchOptions.transportUpStatus
                        ? searchOptions.transportUpStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                        : []}
                    </Select>
                  </Form.Item>
                  <Form.Item colon={false} name='provincialCapitalFlow'>
                    <Select allowClear placeholder='省厅流水状态'>
                      {searchOptions.provincialCapitalFlow
                        ? searchOptions.provincialCapitalFlow.map((val) => <Option key={val.label}>{val.text}</Option>)
                        : []}
                    </Select>
                  </Form.Item>
                  <Form.Item colon={false} name='suiDeCapitalFlow'>
                    <Select allowClear placeholder='绥德流水状态'>
                      {searchOptions.suiDeCapitalFlow
                        ? searchOptions.suiDeCapitalFlow.map((val) => <Option key={val.label}>{val.text}</Option>)
                        : []}
                    </Select>
                  </Form.Item>
                  <Form.Item colon={false} name='transportErrorMessage'>
                    <Select allowClear placeholder='预警状态'>
                      {searchOptions.transportErrorMessage
                        ? searchOptions.transportErrorMessage.map((val) => <Option key={val.label}>{val.text}</Option>)
                        : []}
                    </Select>
                  </Form.Item>
                </Form>
              }
              overlayStyle={{ width: '380px' }}
              placement='leftTop'
              title='按条件筛选'
              trigger='click'
            >
              <Button className={moreSearch ? 'moreSearch-have-btn' : 'moreSearch-btn'} size='small' type='link'>
                更多条件
              </Button>
            </Popover>
            <Button htmlType='submit' onClick={searchTable} shape='round'>
              查询
            </Button>
          </Space>
        </div>
        <div className='other-handle-wrap'>
          <Space size={20}>
            <AuthButton
              authKey='up_provincial'
              onClick={() => {
                uploadGovData('st_waybill')
              }}
              shape='round'
            >
              上传省厅运单
            </AuthButton>
            <AuthButton
              authKey='up_suide'
              onClick={() => {
                uploadGovData('sd_waybill')
              }}
              shape='round'
            >
              上传绥德运单
            </AuthButton>
            <AuthButton
              authKey='up_provincial'
              onClick={() => {
                uploadGovData('st_water')
              }}
              shape='round'
            >
              上传省厅流水
            </AuthButton>
            <AuthButton
              authKey='up_suide'
              onClick={() => {
                uploadGovData('sd_water')
              }}
              shape='round'
            >
              上传绥德流水
            </AuthButton>
          </Space>
          <Space size={20}>
            <AuthButton authKey='export' onClick={onExportExcel} shape='round'>
              导出
            </AuthButton>
            <Button onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </Space>
        </div>
      </div>
      <div className='statistics-wrap'>
        <span className='statistics-item'>统计：运单总数：{countData.transportCount}；</span>
        <span className='statistics-item'>矿发吨数：{countData.realMineSendWeight}；</span>
        <span className='statistics-item'>实收吨数：{countData.realTransportWeight}；</span>
        <span className='statistics-item'>实付运费：{countData.realPayAmount}；</span>
        <span className='statistics-item'>已支付运单数：{countData.realPayCount}；</span>
        <span className='statistics-item'>已支付实际运费：{countData.realPayCountAmount}；</span>
      </div>
      <div className='table-wrap _table-wrap'>
        <JwTable
          cRef={tableRef}
          dataSource={tableData}
          disabledKey='cacheStatus'
          getDataSource={getTableData}
          idKey='transportId'
          loading={tableLoading}
          multipleSelection={true}
          tableHead={wallbilTableHead(checkTableDetail)}
          total={total}
        />
      </div>
      <WaybillDetail
        getTableData={getTableData}
        setPayFailList={setPayFailList}
        tableDetail={tableDetail}
      ></WaybillDetail>

      <PayAgain getTableData={getTableData} payFailList={payFailList}></PayAgain>
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

export default connect(mapStateProps, mapDispatchToProps)(Waybill)
