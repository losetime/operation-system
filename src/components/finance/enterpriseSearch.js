import React, { useState, useEffect, useContext } from 'react'
import { apiGetConsignorList } from '@/service/api/information'
import { Input, Button, Table, Form } from 'antd'
import '@/style/finance/recharge.less'
import { withdrawHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams } from '@/utils/business'
import context from '@/store/context'

// 企业搜索
const EnterpriseSearch = () => {
  const { setShowSearch, setEnterpriseInfo } = useContext(context)
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
  const [activeRowIndex, setActiveRowIndex] = useState(-1)
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // table分页参数
  const [reqParams, setReqParams] = useState({
    pageNum: 1, // 当前页
    perPage: perPage, // 每页条数
  })

  useEffect(() => {
    setTableLoading(true)
    apiGetConsignorList(reqParams)
      .then((res) => {
        if (res.code === 0) {
          setTableData(res.data.listData)
          setTotal(res.data.count)
          setActiveRowIndex(-1)
        }
      })
      .finally(() => {
        setTableLoading(false)
      })
  }, [reqParams])

  useEffect(() => {
    if (tableData[activeRowIndex]) {
      setEnterpriseInfo({
        ...tableData[activeRowIndex],
        freightBalanceTemp: tableData[activeRowIndex].freightBalance,
        serviceBalanceTemp: tableData[activeRowIndex].serviceBalance,
      })
    }
  }, [activeRowIndex])

  // 列表查询
  const onSearchBtn = (values) => {
    let paramsObj = formatParams(values)
    setReqParams({ ...reqParams, ...paramsObj, pageNum: 1 })
  }

  // 监听表格
  const onTableChange = (pagination) => {
    setReqParams({ ...reqParams, pageNum: pagination.current })
  }

  const onNextBtn = () => {
    setShowSearch(false)
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

  return (
    <div className='search-enterprise-wrap'>
      <div className='search-form-wrap'>
        <Form
          {...layout}
          autoComplete='off'
          form={antdForm}
          layout={'inline'}
          name='enterprise-search-form-one'
          onFinish={onSearchBtn}
        >
          <Form.Item colon={false} name='shortCompanyName'>
            <Input allowClear placeholder='企业简称' />
          </Form.Item>
          <Form.Item colon={false} name='nameOrTel'>
            <Input allowClear placeholder='姓名/联系方式' />
          </Form.Item>
          <Form.Item className='search-btn'>
            <Button htmlType='submit' shape='round' type='primary'>
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className='table-wrap _table-wrap'>
        <Table
          columns={withdrawHead()}
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
          rowKey={(record) => record.consignorId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>
      <div className='handle-wrap'>
        <Button disabled={activeRowIndex === -1} onClick={onNextBtn} shape='round' type='primary'>
          下一步
        </Button>
      </div>
    </div>
  )
}

export default EnterpriseSearch
