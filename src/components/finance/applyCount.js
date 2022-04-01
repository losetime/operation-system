import React, { useState, useEffect, useCallback } from 'react'
import { apiGetApplyTransportList, apiRemoveWayBill } from '@/service/api/finance'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Input, Button, Table, Form, Modal, message } from 'antd'
import '@/style/finance/invoiceApproval.less'
import { applyCountHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams } from '@/utils/business'

const ApplyCount = (props) => {
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
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  const [activeRecord, setActiveRecord] = useState({})

  // 获取表格数据
  const getTableData = useCallback(() => {
    if (tableParams.recordId === -1 || tableParams.recordId === undefined) return
    setTableLoading(true)
    apiGetApplyTransportList(tableParams).then((res) => {
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
    setTableParams({ ...tableParams, recordId: props.recordId })
  }, [props.recordId, props.invoiceStatus])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 列表查询
  const onSearchBtn = (value) => {
    let paramsObj = formatParams(value)
    setTableParams({ ...tableParams, ...paramsObj, pageNum: 1 })
  }

  // 移除所选运单
  const removeWayBill = () => {
    apiRemoveWayBill({
      logId: [activeRecord.logId],
    }).then((res) => {
      if (res.code === 0) {
        message.success('移除成功')
        setTableParams({ ...tableParams, pageNum: 1 })
        if (props.eventHandle) {
          props.eventHandle()
        }
      }
    })
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    setTableParams({ pageNum: 1, perPage: perPage, recordId: props.recordId })
  }

  // 监听表格
  const onTableChange = (pagination) => {
    setTableParams({ ...tableParams, pageNum: pagination.current })
  }

  // 取消事件
  const handleCancel = () => {
    props.actions.setApplyCountStatus(false)
  }

  // 选择表格当前行
  const selectTableRow = (row, index) => {
    setActiveRowIndex(index)
    setActiveRecord(row)
  }

  // 设置表格样式
  const setTableRowStyle = (record, index) => {
    //record代表表格行的内容，index代表行索引
    //判断索引相等时添加行的高亮样式
    return index === activeRowIndex ? 'active-current-row' : index % 2 === 1 ? 'row-zebra-crossing' : ''
  }

  return (
    <Modal
      destroyOnClose
      footer={null}
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={handleCancel}
      title='申请条数'
      visible={props.applyCountDialogStatus}
      width={1180}
    >
      <div className='apply-count-wrapper'>
        <div className='_search-handle-wrap'>
          <Form
            {...layout}
            autoComplete='off'
            form={antdForm}
            layout={'inline'}
            name='applyCountForm'
            onFinish={onSearchBtn}
          >
            <Form.Item colon={false} name='vehicleNo'>
              <Input allowClear placeholder='车牌号' />
            </Form.Item>
            <Form.Item colon={false} name='transportSn'>
              <Input allowClear placeholder='运单编号' />
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
          <div className='handle-wrap'>
            <Button
              className='search-btn'
              disabled={props.billingStatus > 5 || props.invoiceStatus > 5 ? true : false}
              onClick={removeWayBill}
              shape='round'
              type='primary'
            >
              移除
            </Button>
            <Button className='search-btn' onClick={onRefresh} shape='round' type='primary'>
              刷新
            </Button>
          </div>
        </div>

        <div className='_table-wrap'>
          <Table
            columns={applyCountHead}
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
            rowKey={(record) => record.transportSn}
            scroll={{ x: 'max-content', y: true }}
            size='small'
          />
        </div>
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    applyCountDialogStatus: state.applyCountDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ApplyCount)
