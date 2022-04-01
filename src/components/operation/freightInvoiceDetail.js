import React, { useState, useEffect } from 'react'
import { apiGetFreightDetail } from '@/service/api/operation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/freightInvoice.less'
import { Modal, Table } from 'antd'
import { freightDetailTableHead } from '@/utils/tableHead'

const FreightInvoiceDetail = (props) => {
  // 表格数据
  const [tableData, setTableData] = useState([])
  // table当前选中行索引
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    if (props.invoiceId === '') {
      setTableData([])
    } else {
      setTableLoading(true)
      apiGetFreightDetail({ invoiceId: props.invoiceId }).then((res) => {
        setTableLoading(false)
        if (res.code === 0) {
          setActiveRowIndex(-1)
          let result = res.data
          setTableData(result)
        }
      })
    }
  }, [props.freightInvoiceDetailDialogStatus, props.invoiceId])

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

  const handleCancel = () => {
    props.actions.setFreightInvoiceDetailDialogStatus(false)
  }

  return (
    <Modal
      footer={null}
      onCancel={handleCancel}
      title='运单ETC详情'
      visible={props.freightInvoiceDetailDialogStatus}
      width={1200}
    >
      <div className='_table-wrap'>
        <Table
          bordered
          columns={freightDetailTableHead()}
          dataSource={tableData}
          loading={tableLoading}
          onRow={(record, index) => {
            return {
              onClick: () => {
                selectTableRow(record, index)
              },
            }
          }}
          pagination={false}
          rowClassName={setTableRowStyle}
          scroll={{ y: true }}
          size='small'
        />
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    freightInvoiceDetailDialogStatus: state.freightInvoiceDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(FreightInvoiceDetail)
