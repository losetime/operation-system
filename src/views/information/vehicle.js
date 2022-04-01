import React, { useState, useEffect, useCallback, useRef } from 'react'
import { apiGetVehicleList, apiGetVehicleDetail, apiVehicleListExport } from '@/service/api/information'
import { apiGetEnumsOptions, apiUploadGovData } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import VehicleDetail from '@/components/information/vehicleDetail'
import { vehicleTableHead } from '@/utils/tableHead'
import { formatParams, compareDate } from '@/utils/business'
import { Input, Select, Button, Form, message, DatePicker, Space } from 'antd'
import '@/style/information/vehicle.less'
import AuthButton from '@/components/common/authButton'
import JwTable from '@/components/common/jwTable'

const Vehicle = (props) => {
  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }
  const childRef = useRef()
  const [antdForm] = Form.useForm()
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
  const [vehicleId, setVehicleId] = useState(-1)
  useEffect(() => {
    getSearchOptions()
  }, [])

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    let paramsObj = transformSearch(formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss'))
    apiGetVehicleList({ ...childRef.current.pagination, ...paramsObj }).then((res) => {
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

  // 列表查询
  const onSearchBtn = () => {
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(paramsObj.startTime, paramsObj.endTime) === false) {
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

  // 获取认证状态。上传状态
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: [
        'vehicleStatus',
        'transportUpStatus',
        'vehicleTimeType',
        'vehicleRecordStatus',
        'vehicleErrorMessage',
        'vehicleType',
        'vehicleFication',
      ],
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
    setVehicleId(record.vehicleId)
    apiGetVehicleDetail({ vehicleId: record.vehicleId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(result)
        props.actions.setVehicleDetailDialogStatus(true)
      }
    })
  }

  // 新增
  const onAddBtn = () => {
    setTableDetail({}) // 将数据置空
    setDialogType('add') // 修改操作类型
    props.actions.setVehicleDetailDialogStatus(true) // 打开对话框
  }

  //上传省厅
  const upDataProvincial = () => {
    let temporaryUpload = childRef.current.selectedRows
    let data = 8
    if (temporaryUpload.length > 0) {
      for (let i = 0; i < temporaryUpload.length; i++) {
        if (temporaryUpload[i].status !== 2) {
          message.warn('非认证通过车辆无法上传')
          return
        }
      }
      let vehicleNoArr = temporaryUpload.map((val) => val.vehicleNo)
      apiUploadGovData({ transportSn: vehicleNoArr, transportType: data }).then((res) => {
        if (res.code === 0) {
          message.success('已上传至省厅')
          getTableData()
        }
      })
    } else {
      message.warn('请上传编号')
    }
  }

  //导出
  const exportInfo = () => {
    let exportObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (exportObj.startTime || exportObj.endTime) {
      if (exportObj.timeType) {
        exportObj.timeType = Number(exportObj.timeType)
      } else {
        message.warn('请选择时间类型')
        return
      }
    }
    if (exportObj.upProvincialStatus) {
      exportObj.upProvincialStatus = Number(exportObj.upProvincialStatus)
    }
    if (compareDate(exportObj.startTime, exportObj.endTime)) {
      apiVehicleListExport(exportObj)
    } else {
      message.warn('开始时间不能大于结束时间')
    }
  }

  return (
    <div className='vehicle-wrapper'>
      <div className='_search-handle-wrap'>
        <div className='search-handle-wrap-top'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='vehicleForm1'>
            <Form.Item colon={false} name='vehicleNo'>
              <Input allowClear placeholder='车牌号' />
            </Form.Item>
            <Form.Item colon={false} name='transportLicenseNo'>
              <Input allowClear placeholder='运输许可证号' />
            </Form.Item>
            <Form.Item colon={false} name='vehicleStatus'>
              <Select allowClear placeholder='认证状态'>
                {searchOptions.vehicleStatus
                  ? searchOptions.vehicleStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='vehicleRecordStatus'>
              <Select allowClear placeholder='ETC备案状态'>
                {searchOptions.vehicleRecordStatus
                  ? searchOptions.vehicleRecordStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item colon={false} name='vehicleErrorMessage'>
              <Select allowClear placeholder='预警状态'>
                {searchOptions.vehicleErrorMessage
                  ? searchOptions.vehicleErrorMessage.map((val) => <Option key={val.label}>{val.text}</Option>)
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
            <Form.Item colon={false} name='timeType'>
              <Select allowClear placeholder='时间类型'>
                {searchOptions.vehicleTimeType
                  ? searchOptions.vehicleTimeType.map((val) => <Option key={val.label}>{val.text}</Option>)
                  : []}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className='search-handle-wrap-bottom'>
          <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='vehicleForm2'>
            <Form.Item colon={false} name='startTime'>
              <DatePicker allowClear placeholder='开始时间' showTime />
            </Form.Item>
            <Form.Item colon={false} name='endTime'>
              <DatePicker allowClear placeholder='结束时间' showTime />
            </Form.Item>
            <Form.Item>
              <Button onClick={onSearchBtn} shape='round'>
                查询
              </Button>
            </Form.Item>
          </Form>
          <Space size={20}>
            <AuthButton authKey='add' onClick={onAddBtn} shape='round'>
              新增
            </AuthButton>
            <AuthButton authKey='up_provincial' onClick={upDataProvincial} shape='round'>
              上传省厅
            </AuthButton>
            <AuthButton authKey='export' onClick={exportInfo} shape='round'>
              导出
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
          idKey='vehicleId'
          loading={tableLoading}
          multipleSelection={true}
          tableHead={vehicleTableHead(checkTableDetail)}
          total={total}
        />
      </div>

      <VehicleDetail
        getTableData={getTableData}
        tableDetail={tableDetail}
        vehicleId={vehicleId}
        type={dialogType}
        searchOptions={searchOptions}
      ></VehicleDetail>
    </div>
  )
}

const mapStateProps = (state) => {
  return {
    vehicleDetailDialogStatus: state.vehicleDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Vehicle)
