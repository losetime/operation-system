import React, { useState, useEffect, useRef, useCallback } from 'react'
import { apiGetEnumsOptions } from '@/service/api/common'
import { apiGetRechargeList, apiRechargeEnum, apiRechargeListExport } from '@/service/api/finance'
import { Input, Button, Table, Form, Space, Select, message, DatePicker } from 'antd'
import '@/style/finance/recharge.less'
import { rechargeTableHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams, compareDate } from '@/utils/business'
import WithdrawDetail from '@/components/finance/withdrawDetail'
import RechargeDetail from '@/components/finance/rechargeDetail'
import AuthButton from '@/components/common/authButton'

const Recharge = () => {
  const { Option } = Select
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  // 表格数据
  const [tableData, setTableData] = useState([])
  const [statistics, setStatistics] = useState({})
  // table数据总条数
  const [total, setTotal] = useState(0)
  // table当前选中行索引
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  // table分页参数
  const [reqParams, setReqParams] = useState({
    pageNum: 1, // 当前页
    perPage: perPage, // 每页条数
  })
  // 认证状态选项
  const [selectOptions, setSelectOptions] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // 详情Id
  const [detailId, setDetailId] = useState(0)

  const withdrawDetailRef = useRef()

  const rechargeDetailRef = useRef()

  useEffect(() => {
    getSearchOptions()
  }, [])

  const getFundsList = useCallback(() => {
    setTableLoading(true)
    apiGetRechargeList(reqParams).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        setActiveRowIndex(-1)
        let result = res.data
        const { count, rechargeFreight, totalRecharge, invoiceTotal, listData } = result
        setTotal(count)
        setTableData(listData)
        setStatistics({ count, rechargeFreight, totalRecharge, invoiceTotal })
      }
    })
  }, [reqParams])

  // 获取表格数据
  useEffect(() => {
    getFundsList()
  }, [getFundsList])

  // 列表查询
  const onSearchBtn = (value) => {
    let paramsObj = formatParams(value, 'YYYY-MM-DD HH:mm:ss')
    if (!compareDate(paramsObj.createdAtStart, paramsObj.createdAtEnd)) {
      message.warn('开始时间不能大于结束时间')
    } else {
      setReqParams({ ...paramsObj, pageNum: 1, perPage: perPage })
    }
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    setReqParams({ pageNum: 1, perPage: perPage })
  }

  // 监听分页
  const onTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      // table排序
      let orderBy = {}
      orderBy[sorter.columnKey] = sorter.order.substring(0, sorter.order.indexOf('c') + 1)
      setReqParams({ ...reqParams, pageNum: pagination.current, orderBy })
    } else {
      setReqParams({ ...reqParams, pageNum: pagination.current })
    }
  }

  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['rechargeStatus'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        apiRechargeEnum().then((res) => {
          if (res.code === 0) {
            let enumResult = res.data
            setSelectOptions({ ...result, transactionType: enumResult })
          }
        })
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
    const withdrawEnum = [1, 2, 4, 8]
    const rechargeEnum = [3, 5, 10, 11, 12, 13]
    // 提现
    if (withdrawEnum.includes(record.rechargeTypeId)) {
      withdrawDetailRef.current.setVisible(true)
      withdrawDetailRef.current.setShowSearch(false)
      withdrawDetailRef.current.setIsModify(true)
    }
    // 充值
    else if (rechargeEnum.includes(record.rechargeTypeId) || record.dataSource === 1) {
      rechargeDetailRef.current.setVisible(true)
      rechargeDetailRef.current.setSource(record.dataSource)
      rechargeDetailRef.current.setShowSearch(false)
      rechargeDetailRef.current.setIsModify(true)
    }
    setDetailId(record.rechargeId)
  }

  // 导出
  const onExportHandle = () => {
    const tableParams = formatParams(antdForm.getFieldsValue(), 'YYYY-MM-DD HH:mm:ss')
    if (compareDate(tableParams.createdAtStart, tableParams.createdAtEnd)) {
      apiRechargeListExport(tableParams)
    } else {
      message.warning('开始时间不能大于结束时间')
    }
  }

  // 提现
  const openWithdraw = () => {
    withdrawDetailRef.current.setVisible(true)
  }

  // 充值
  const openRecharge = () => {
    rechargeDetailRef.current.setVisible(true)
  }

  return (
    <div className='recharge-wrapper'>
      <div className='search-handle-wrap'>
        <Form
          {...layout}
          autoComplete='off'
          form={antdForm}
          layout={'inline'}
          name='recharge-form-one'
          onFinish={onSearchBtn}
        >
          <Form.Item colon={false} name='rechargeSn'>
            <Input allowClear placeholder='交易单号' />
          </Form.Item>
          <Form.Item colon={false} name='shortCompanyName'>
            <Input allowClear placeholder='企业简称' />
          </Form.Item>
          <Form.Item colon={false} name='nameOrTel'>
            <Input allowClear placeholder='姓名/联系方式' />
          </Form.Item>
          <Form.Item colon={false} name='rechargeType'>
            <Select maxTagCount={1} mode='multiple' placeholder='交易类型(多选)' showArrow>
              {selectOptions.transactionType
                ? selectOptions.transactionType.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='rechargeStatus'>
            <Select maxTagCount={1} mode='multiple' placeholder='交易状态(多选)' showArrow>
              {selectOptions.rechargeStatus
                ? selectOptions.rechargeStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item colon={false} name='createdAtStart'>
            <DatePicker inputReadOnly placeholder='创建时间[起]' showTime />
          </Form.Item>
          <Form.Item colon={false} name='createdAtEnd'>
            <DatePicker inputReadOnly placeholder='创建时间[止]' showTime />
          </Form.Item>
          <Form.Item className='search-btn'>
            <Button htmlType='submit' shape='round'>
              查询
            </Button>
          </Form.Item>
        </Form>
        <div className='handle-wrap'>
          <Space>
            <AuthButton authKey='withdraw' onClick={openWithdraw} shape='round'>
              提现
            </AuthButton>
            <AuthButton authKey='recharge' onClick={openRecharge} shape='round'>
              充值
            </AuthButton>
          </Space>
          <Space>
            <AuthButton authKey='export' onClick={onExportHandle} shape='round'>
              导出
            </AuthButton>
            <Button onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </Space>
        </div>
      </div>
      <div className='table-statistics-wrap'>
        <span className='statistics-title'>统计：</span>
        <span className='statistics-title'>交易条数总计：{statistics.count}；</span>
        <span className='statistics-title'>充值运费总计：{statistics.rechargeFreight}；</span>
        <span className='statistics-title'>充值服务费总计：{statistics.totalRecharge}；</span>
        <span className='statistics-title'>开票扣费总计：{statistics.invoiceTotal}；</span>
      </div>
      <div className='table-wrap _table-wrap'>
        <Table
          columns={rechargeTableHead(checkTableDetail)}
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
          pagination={paginationObj(total, reqParams)}
          rowClassName={setTableRowStyle}
          rowKey={(record) => record.rechargeId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>

      <WithdrawDetail cRef={withdrawDetailRef} getTableData={getFundsList} rechargeId={detailId} />

      <RechargeDetail cRef={rechargeDetailRef} getTableData={getFundsList} rechargeId={detailId} />
    </div>
  )
}

export default Recharge
