import React, { useState, useEffect, useCallback } from 'react'
import { apiGetConsignorList, apiGetConsignorDetail } from '@/service/api/information'
import { apiGetEnumsOptions } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Input, Select, Button, Table, Form, Space } from 'antd'
import '@/style/information/vehicle.less'
import { consignorTableHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams } from '@/utils/business'
import ConsignorDetail from '@/components/information/consignorDetail'
import AuthButton from '@/components/common/authButton'

const Consignor = (props) => {
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
    apiGetConsignorList(tableParams).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        setActiveRowIndex(-1)
        let result = res.data
        setTotal(result.count)
        setTableData(result.listData)
      }
    })
  }, [tableParams])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 列表查询
  const onSearchBtn = (value) => {
    let paramsObj = formatParams(value)
    setTableParams({ ...paramsObj, pageNum: 1, perPage: perPage })
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

  // 获取认证状态选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['consignorAuthenticationStatus', 'consignorAuthErrorMessage'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
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

  // 查看/修改
  const checkTableDetail = (record) => {
    setDialogType('edit')
    apiGetConsignorDetail({ consignorId: record.consignorId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(result)
        props.actions.setConsignorDetailDialogStatus(true)
      }
    })
  }

  // 新增
  const onAddBtn = () => {
    setTableDetail({ sourceName: '运营人员添加', registerSource: 1 }) // 将数据置空
    setDialogType('add') // 修改操作类型
    props.actions.setConsignorDetailDialogStatus(true) // 打开对话框
  }

  return (
    <div className='consignor-wrapper'>
      <div className='_search-handle-wrap'>
        <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form' onFinish={onSearchBtn}>
          <Form.Item colon={false} name='shortCompanyName'>
            <Input allowClear placeholder='企业简称' />
          </Form.Item>
          <Form.Item colon={false} name='nameOrTel'>
            <Input allowClear placeholder='姓名/联系方式' />
          </Form.Item>
          <Form.Item colon={false} name='consignorAuthenticationStatus'>
            <Select allowClear placeholder='认证状态'>
              {searchOptions.consignorAuthenticationStatus
                ? searchOptions.consignorAuthenticationStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='consignorAuthErrorMessage'>
            <Select allowClear placeholder='预警状态'>
              {searchOptions.consignorAuthErrorMessage
                ? searchOptions.consignorAuthErrorMessage.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item className='search-btn'>
            <Button htmlType='submit' shape='round'>
              查询
            </Button>
          </Form.Item>
        </Form>
        <Space size={20}>
          <AuthButton authKey='add' onClick={onAddBtn} shape='round'>
            新增
          </AuthButton>
          <Button onClick={onRefresh} shape='round' type='primary'>
            刷新
          </Button>
        </Space>
      </div>

      <div className='table-wrap _table-wrap'>
        <Table
          columns={consignorTableHead(checkTableDetail)}
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
          rowKey={(record) => record.consignorId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>

      <ConsignorDetail getTableData={getTableData} tableDetail={tableDetail} type={dialogType}></ConsignorDetail>
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

export default connect(mapStateProps, mapDispatchToProps)(Consignor)
