import React, { useState, useEffect, useCallback } from 'react'
import { apiGetBankCardList, apiGetBankCardDetail } from '@/service/api/information'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Input, Button, Table, Form } from 'antd'
import '@/style/information/bankCard.less'
import { bankCardTableHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams } from '@/utils/business'
import BankCardDetail from '@/components/information/bankCardDetail'

const BankCard = (props) => {
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
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    apiGetBankCardList(tableParams).then((res) => {
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
    setTableParams({ ...tableParams, ...paramsObj, pageNum: 1 })
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
    apiGetBankCardDetail({ bankCardId: record.bankCardId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(result)
        props.actions.setBankcardDetailDialogStatus(true)
      }
    })
  }

  return (
    <div className='bank-card-wrapper'>
      <div className='_search-handle-wrap'>
        <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='formBank' onFinish={onSearchBtn}>
          <Form.Item colon={false} name='bankCard'>
            <Input allowClear placeholder='银行卡号' />
          </Form.Item>
          <Form.Item colon={false} name='cardHolderIdNo'>
            <Input allowClear placeholder='持卡人身份证号' />
          </Form.Item>
          <Form.Item colon={false} name='nameOrTel'>
            <Input allowClear placeholder='姓名/联系方式' />
          </Form.Item>
          <Form.Item className='search-btn'>
            <Button htmlType='submit' shape='round'>
              查询
            </Button>
          </Form.Item>
        </Form>
        <div className='handle-wrap'>
          <Button onClick={onRefresh} shape='round' type='primary'>
            刷新
          </Button>
        </div>
      </div>

      <div className='table-wrap _table-wrap'>
        <Table
          columns={bankCardTableHead(checkTableDetail)}
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
          rowKey={(record) => record.bankCardId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>

      <BankCardDetail getTableData={getTableData} tableDetail={tableDetail}></BankCardDetail>
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

export default connect(mapStateProps, mapDispatchToProps)(BankCard)
