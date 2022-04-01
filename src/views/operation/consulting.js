import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  apiGetConsultingIndex,
  apiGetConsultingDetail,
  apiGetConsultTypeIndex,
  apiDelConsultInfo,
  apiConsultingExport,
} from '@/service/api/operation'
import { apiGetEnumsOptions } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Input, Select, Button, Form, DatePicker, message } from 'antd'
import '@/style/operation/consulting.less'
import { consultingTableHead } from '@/utils/tableHead'
import { formatParams, compareDate } from '@/utils/business'
import ConsultingDetail from '@/components/operation/consultingDetail'
import AddConfigureType from '@/components/operation/addConfigureType'
import AuthButton from '@/components/common/authButton'
import JwTable from '@/components/common/jwTable'

const Consulting = (props) => {
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
  //获取查询状态
  const [searchOptions, setSearchOptions] = useState({})
  // 表格详情数据
  const [tableDetail, setTableDetail] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // dialog类型
  const [dialogType, setDialogType] = useState('add')
  //配置类型
  const [consultType, setConsultType] = useState([])
  //统计数据
  const [statisticalData, SetStatisticalData] = useState([])

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    apiGetConsultingIndex({
      ...childRef.current.pagination,
      ...paramsObj,
    }).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        let result = res.data
        setTotal(result.count)
        setTableData(result.listData)
        SetStatisticalData(result.countData)
      }
    })
    childRef.current.setSelectedRowKeys([])
  }, [antdForm])

  //获取配置类型
  const getConsultType = useCallback(() => {
    setTableLoading(true)
    apiGetConsultTypeIndex().then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        let result = res.data
        setConsultType(result)
      }
    })
  }, [])

  //获取咨询类型状态
  const getSearchOptions = () => {
    apiGetEnumsOptions({ enumByParams: ['consultStatus'] }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  useEffect(() => {
    getTableData()
  }, [getTableData])

  useEffect(() => {
    getSearchOptions()
    getConsultType()
  }, [])

  // 列表查询
  const onSearchBtn = () => {
    let paramsObj = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(paramsObj.startTime, paramsObj.entTime) === false) {
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

  //查看修改-获取咨询详情
  const checkTableDetail = (record) => {
    setDialogType('edit')
    apiGetConsultingDetail({ consultId: record.consultId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail({
          ...result,
          consultType: result.consultType.toString(),
        })
        props.actions.setConsultingDetailDialogStatus(true)
      }
    })
  }

  // 新建咨询
  const onAddBtn = () => {
    setDialogType('add') // 修改操作类型
    props.actions.setConsultingDetailDialogStatus(true) // 打开对话框
  }

  //查看配置类型
  const onAddTypeBtn = () => {
    setDialogType('edit')
    props.actions.setConfigureTypeDetailDialogStatus(true)
  }

  //删除
  const deleteTableDate = () => {
    let deleteData = childRef.current.selectedRowKeys
    if (deleteData.length > 0) {
      apiDelConsultInfo({ consultId: deleteData }).then((res) => {
        if (res.code === 0) {
          message.success('删除成功')
          childRef.current.initPagination()
        }
      })
    } else {
      message.warn('请选择数据')
    }
  }

  //导出
  const exportTableDate = () => {
    let tempParams = formatParams(antdForm.getFieldValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(tempParams.startTime, tempParams.endTime) === false) {
      message.warn('开始时间不能大于结束时间')
    }
    apiConsultingExport(tempParams)
  }

  return (
    <div className='consulting-wrapper'>
      <div className='_search-handle-wrap'>
        <div className='search-header-handle-wrap'>
          <div className='search-header-left'>
            <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form'>
              <Form.Item colon={false} name='consultSn'>
                <Input allowClear placeholder='咨询编号' />
              </Form.Item>
              <Form.Item colon={false} name='nameOrMobile'>
                <Input allowClear placeholder='咨询号码/咨询者' />
              </Form.Item>
              <Form.Item colon={false} name='consultType'>
                <Select allowClear placeholder='咨询类型'>
                  {consultType
                    ? consultType.map((val) => <Option key={val.consultTypeId}> {val.consultTypeName} </Option>)
                    : []}
                </Select>
              </Form.Item>
              <Form.Item colon={false} name='consultStatus'>
                <Select allowClear placeholder='咨询状态'>
                  {searchOptions.consultStatus
                    ? searchOptions.consultStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                    : []}
                </Select>
              </Form.Item>
              <Form.Item colon={false} name='startTime'>
                <DatePicker allowClear placeholder='记录时间[起]' showTime />
              </Form.Item>
              <Form.Item colon={false} name='entTime'>
                <DatePicker allowClear placeholder='记录时间[止]' showTime />
              </Form.Item>
            </Form>
          </div>
          <div>
            <Button onClick={onSearchBtn} shape='round'>
              查询
            </Button>
          </div>
        </div>
        <div className='search-footer-handle-wrap'>
          <div>
            <AuthButton authKey='delete_consult' className='handle-btn' onClick={deleteTableDate} shape='round'>
              删除
            </AuthButton>
            <AuthButton authKey='setType' className='handle-btn' onClick={onAddTypeBtn} shape='round'>
              配置类型
            </AuthButton>
            <AuthButton authKey='add' className='handle-btn' onClick={onAddBtn} shape='round'>
              新增咨询
            </AuthButton>
          </div>
          <div className='search-footer-right-wrap'>
            <AuthButton authKey='export' className='handle-btn' onClick={exportTableDate} shape='round'>
              导出
            </AuthButton>
            <Button onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </div>
        </div>
      </div>
      <div className='table-statistics-wrap'>
        <span className='statistics-title'>统计：咨询条数：{statisticalData.count}；</span>
        <span className='statistics-title'>完结条数：{statisticalData.endCount}；</span>
        <span className='statistics-title'>待跟进条数：{statisticalData.followedCount}；</span>
      </div>
      <div className='table-wrap _table-wrap'>
        <JwTable
          cRef={childRef}
          dataSource={tableData}
          total={total}
          tableHead={consultingTableHead(checkTableDetail)}
          idKey='consultId'
          loading={tableLoading}
          multipleSelection={true}
          getDataSource={getTableData}
        />
      </div>

      <ConsultingDetail
        consultTypeOption={consultType}
        getTableData={getTableData}
        tableDetail={tableDetail}
        type={dialogType}
      ></ConsultingDetail>
      <AddConfigureType
        consultTypeOption={consultType}
        getConsultType={getConsultType}
        type={dialogType}
      ></AddConfigureType>
    </div>
  )
}

const mapStateProps = (state) => {
  return {
    rechargeDetailDialogStatus: state.rechargeDetailDialogStatus,
    token: state.userInfo.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Consulting)
