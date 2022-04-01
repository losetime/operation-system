import React, { useState, useEffect, useCallback, useRef } from 'react'
import { apiGetDriverList, apiGetDriverDetail } from '@/service/api/information'
import { apiGetEnumsOptions, apiUploadGovData } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Input, Select, Button, Form, DatePicker, message, Space } from 'antd'
import '@/style/information/driver.less'
import { driverTableHead } from '@/utils/tableHead'
import { formatParams, compareDate } from '@/utils/business'
import DriverDetail from '@/components/information/driverDetail'
import JwTable from '@/components/common/jwTable'
import AuthButton from '@/components/common/authButton'

const Driver = (props) => {
  const { Option } = Select
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const childRef = useRef()
  // 表格数据
  const [tableData, setTableData] = useState([])
  // table数据总条数
  const [total, setTotal] = useState(0)
  // 表格详情数据
  const [tableDetail, setTableDetail] = useState({})
  // 认证状态选项
  const [searchOptions, setSearchOptions] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // dialog类型
  const [dialogType, setDialogType] = useState('add')

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    let paramsObj = transformSearch(formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss'))
    apiGetDriverList({ ...childRef.current.pagination, ...paramsObj }).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        let result = res.data
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
  const transformSearch = (paramsObj) => {
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
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
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

  // 获取司机认证状态选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['authenticationStatus', 'transportUpStatus', 'driverTimeType', 'driverAuthErrorMessage'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  // 查看/修改
  const checkTableDetail = (record) => {
    setDialogType('edit')
    apiGetDriverDetail({ transporterId: record.transporterId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(result)
        props.actions.setDriverDetailDialogStatus(true)
      }
    })
  }

  // 新增
  const onAddBtn = () => {
    setTableDetail({}) // 将数据置空
    setDialogType('add') // 修改操作类型
    props.actions.setDriverDetailDialogStatus(true) // 打开对话框
  }

  //上传省厅
  const upDataProvincial = () => {
    let temporaryUpload = childRef.current.selectedRows
    let data = 7
    if (temporaryUpload.length > 0) {
      for (let i = 0; i < temporaryUpload.length; i++) {
        if (temporaryUpload[i].transporterAuthenticationStatus !== 2) {
          message.warn('非认证通过司机无法上传')
          return
        }
      }
      let userIdArr = temporaryUpload.map((val) => val.userId)
      apiUploadGovData({ transportSn: userIdArr, transportType: data }).then((res) => {
        if (res.code === 0) {
          message.success('已上传至省厅')
          getTableData()
        }
      })
    } else {
      message.warn('请上传编号')
    }
  }

  return (
    <div className='driver-wrapper'>
      <div className='_search-handle-wrap'>
        <div className='search-handle-wrap-top'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form1'>
            <Form.Item colon={false} name='nameOrTel'>
              <Input allowClear placeholder='姓名/联系方式' />
            </Form.Item>
            <Form.Item colon={false} name='identityNo'>
              <Input allowClear placeholder='身份证号' />
            </Form.Item>
            <Form.Item colon={false} name='authenticationStatus'>
              <Select allowClear placeholder='认证状态'>
                {searchOptions.authenticationStatus
                  ? searchOptions.authenticationStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='upProvincialStatus'>
              <Select allowClear placeholder='省厅上传状态'>
                {searchOptions.transportUpStatus
                  ? searchOptions.transportUpStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='driverAuthErrorMessage'>
              <Select allowClear placeholder='预警状态'>
                {searchOptions.driverAuthErrorMessage
                  ? searchOptions.driverAuthErrorMessage.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='timeType'>
              <Select allowClear placeholder='时间类型'>
                {searchOptions.driverTimeType
                  ? searchOptions.driverTimeType.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='tailStartTime'>
              <DatePicker allowClear placeholder='开始时间' showTime />
            </Form.Item>
          </Form>
        </div>
        <div className='search-handle-wrap-bottom'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form2'>
            <Form.Item colon={false} name='tailEndTime'>
              <DatePicker allowClear placeholder='结束时间' showTime />
            </Form.Item>
            <AuthButton authKey='add' onClick={onSearchBtn} shape='round'>
              查询
            </AuthButton>
          </Form>
          <Space size={20}>
            <Button onClick={onAddBtn} shape='round'>
              新增
            </Button>
            <AuthButton authKey='up_provincial' onClick={upDataProvincial} shape='round'>
              上传省厅
            </AuthButton>
            <Button onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </Space>
        </div>
      </div>
      <div className='table-wrap _table-wrap'>
        <JwTable
          cRef={childRef}
          dataSource={tableData}
          getDataSource={getTableData}
          idKey='userId'
          loading={tableLoading}
          multipleSelection={true}
          tableHead={driverTableHead(checkTableDetail)}
          total={total}
        />
      </div>

      <DriverDetail getTableData={getTableData} tableDetail={tableDetail} type={dialogType}></DriverDetail>
    </div>
  )
}

const mapStateProps = (state) => {
  return {
    driverDetailDialogStatus: state.driverDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Driver)
