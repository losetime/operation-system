import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Input, Button, Table, Form, Space, message } from 'antd'
import '@/style/finance/payFailure.less'
import { payFailureHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams } from '@/utils/business'
import { apiPayFailureExport } from '@/service/api/finance'
import AuthButton from '@/components/common/authButton'
import { apiGetWaybillDetail, apiGetWaybillTableData } from '@/service/api/operation'
import PayFailureDetail from '@/components/finance/payFailureDetail'
import PayAgain from '@/components/operation/payAgain'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { connect } from 'react-redux'

const PayFailure = (props) => {
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }
  const payFailureRef = useRef()

  // 表格数据
  const [tableData, setTableData] = useState([])
  // 表格当前运单详情
  const [tableDetail, setTableDetail] = useState({})
  // table数据总条数
  const [total, setTotal] = useState(0)
  // table分页参数
  const [tableParams, setTableParams] = useState({
    pageNum: 1, // 当前页
    perPage: perPage, // 每页条数
  })
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  //统计数据
  const [statisticData, setStatisticData] = useState({})
  // 支付失败数据集合
  const [payFailList, setPayFailList] = useState([])

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const disabledKey = 'cacheStatus'

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    apiGetWaybillTableData({ ...tableParams, tradeStatus: [4] }).then((res) => {
      setTableLoading(false)
      setSelectedRowKeys([])
      if (res.code === 0) {
        let result = res.data
        setTotal(result.count)
        setTableData(result.listData)
        setStatisticData(result.countData)
      }
    })
  }, [tableParams])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 根据key值拿取详情数据
  useEffect(() => {
    const tempSelectedRows = []
    for (const item of tableData) {
      if (selectedRowKeys.find((val) => val === item['transportId'])) {
        tempSelectedRows.push(item)
      }
    }
    setSelectedRows(tempSelectedRows)
  }, [selectedRowKeys])

  const onSearchBtn = () => {
    let paramsObj = formatParams(antdForm.getFieldValue())
    setTableParams({ ...paramsObj, pageNum: 1, perPage: perPage })
  }

  //刷新
  const onRefresh = () => {
    antdForm.resetFields()
    setTableParams({ pageNum: 1, perPage: perPage })
    setSelectedRowKeys([])
  }

  // 监听表格
  const onTableChange = (pagination) => {
    setTableParams({ ...tableParams, pageNum: pagination.current })
  }

  // 点击表格当前行
  const selectTableRow = (row) => {
    const currentIndex = selectedRowKeys.findIndex((value) => value === row['transportId'])
    const tempSelected = [...selectedRowKeys]
    if (currentIndex === -1) {
      if (disabledKey) {
        if (!row[disabledKey]) {
          tempSelected.push(row['transportId'])
        }
      } else {
        tempSelected.push(row['transportId'])
      }
    } else {
      tempSelected.splice(currentIndex, 1)
    }
    setSelectedRowKeys(tempSelected)
  }

  // 点击checkbox选择当前行
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  // 选择框的默认属性配置
  const getCheckboxProps = (record) => ({
    disabled: disabledKey ? record[disabledKey] : false,
  })

  // 设置表格样式
  const setTableRowStyle = (record, index) => {
    // record代表表格行的内容，index代表行索引
    // 判断索引相等时添加行的高亮样式
    return selectedRowKeys.includes(record['transportId'])
      ? 'active-current-row'
      : index % 2 === 1
      ? 'row-zebra-crossing'
      : ''
  }

  //进入详情
  const checkTableDetail = (record) => {
    apiGetWaybillDetail({ transportId: record.transportId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(result)
        payFailureRef.current.setVisible(true)
      }
    })
  }

  // 重新支付
  const onPayAgain = () => {
    if (selectedRows.length > 0) {
      let filterPayFail = []
      for (let item of selectedRows) {
        if (item.tradeStatus === 4) {
          filterPayFail.push(item)
        }
      }
      setPayFailList(filterPayFail)
      if (filterPayFail.length > 0) {
        props.actions.setPayAgainDialogStatus(true)
      } else {
        message.warn('所选数据不符合条件')
      }
    } else {
      message.warn('请选择数据')
    }
  }

  //导出
  const onExportBtn = () => {
    let paramsObj = formatParams(antdForm.getFieldValue())
    apiPayFailureExport({ ...paramsObj, tradeStatus: [4] })
  }

  return (
    <div className='payFailure-wrapper'>
      <div className='_search-handle-wrap'>
        <div className='search-handle-wrap'>
          <Form {...layout} form={antdForm} name='form' layout={'inline'} autoComplete='off'>
            <Form.Item name='transportNo'>
              <Input allowClear placeholder='运单/商户号' />
            </Form.Item>
            <Form.Item name='vehicleNo'>
              <Input allowClear placeholder='车牌号' />
            </Form.Item>
            <Form.Item name='nameOrTel'>
              <Input allowClear placeholder='司机姓名/联系方式' />
            </Form.Item>
            <Form.Item>
              <Button shape='round' onClick={onSearchBtn}>
                查询
              </Button>
            </Form.Item>
          </Form>
          <div className='search-handle-btn'>
            <Space size={20}>
              <AuthButton authKey='pay_again' className='handle-left-wrap' onClick={onPayAgain} shape='round'>
                重新支付
              </AuthButton>
              <AuthButton authKey='export' shape='round' onClick={onExportBtn}>
                导出
              </AuthButton>
              <Button shape='round' type='primary' onClick={onRefresh}>
                刷新
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div className='statistics-wrap'>
        <span>
          <span>统计：运单条数：{statisticData.transportCount}；</span>
          <span>实付运费：{statisticData.realPayAmount}；</span>
        </span>
      </div>

      <div className='table-wrap _table-wrap'>
        <Table
          columns={payFailureHead(checkTableDetail)}
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
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps,
          }}
          rowKey={(record) => record.transportId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>
      <PayFailureDetail
        cRef={payFailureRef}
        tableDetail={tableDetail}
        getTableData={getTableData}
        setPayFailList={setPayFailList}
      />

      <PayAgain getTableData={getTableData} payFailList={payFailList} />
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

export default connect(mapStateProps, mapDispatchToProps)(PayFailure)
