import React, { FC, ReactElement, ReactText, useState, useEffect, useImperativeHandle } from 'react'
import { Table } from 'antd'

interface IProps {
  cRef?: any
  dataSource: any // 数据源
  total: any // 数据总数
  tableHead: any // 表头
  idKey: string // 详情Id
  perPage?: number // 每页多少条
  loading: boolean // loading状态
  disabledKey?: string // 禁用选择的key值
  multipleSelection?: boolean //是否多选
  getDataSource: any
  onStatistics?: () => void
}

const JwTable: FC<IProps> = ({
  cRef,
  dataSource,
  total,
  tableHead,
  idKey,
  perPage = 20,
  loading = false,
  disabledKey,
  multipleSelection = false,
  getDataSource,
  onStatistics,
}): ReactElement => {
  useImperativeHandle(cRef, () => ({
    pagination,
    initPagination,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRows,
  }))

  const [pagination, setPagination] = useState({
    pageNum: 1, // 当前页
    perPage: perPage,
    orderBy: {},
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([])
  const [selectedRows, setSelectedRows] = useState<ReactText[]>([])

  // 根据分页状态重新获取表格数据
  useEffect(() => {
    getDataSource()
  }, [pagination])

  // 根据key值拿取详情数据
  useEffect(() => {
    const tempSelectedRows = []
    for (const item of dataSource) {
      if (selectedRowKeys.find((val) => val === item[idKey])) {
        tempSelectedRows.push(item)
      }
    }
    setSelectedRows(tempSelectedRows)
  }, [selectedRowKeys])

  // 统计
  useEffect(() => {
    if (typeof onStatistics === 'function') {
      onStatistics()
    }
  }, [selectedRowKeys])

  // 监听表格
  const onTableChange = (paginationObj: any, _filters: any, sorter: any) => {
    const orderBy: any = {}
    if (sorter.order) {
      // table排序
      orderBy[sorter.columnKey] = sorter.order.substring(0, sorter.order.indexOf('c') + 1)
    }
    setPagination({ ...pagination, pageNum: paginationObj.current, orderBy })
  }

  // 初始化分页
  const initPagination = (): void => {
    setPagination({ ...pagination, pageNum: 1, orderBy: {} })
    setSelectedRowKeys([])
  }

  // 点击表格当前行
  const selectTableRow = (row: any) => {
    if (!multipleSelection) {
      setSelectedRowKeys([row[idKey]])
      return
    }
    const currentIndex = selectedRowKeys.findIndex((value) => value === row[idKey])
    const tempSelected = [...selectedRowKeys]
    if (currentIndex === -1) {
      if (disabledKey) {
        if (!row[disabledKey]) {
          tempSelected.push(row[idKey])
        }
      } else {
        tempSelected.push(row[idKey])
      }
    } else {
      tempSelected.splice(currentIndex, 1)
    }
    setSelectedRowKeys(tempSelected)
  }

  // 点击checkbox选择当前行
  const onSelectChange = (selectedRowKeys: React.Key[]): void => {
    setSelectedRowKeys(selectedRowKeys)
  }

  // 选择框的默认属性配置
  const getCheckboxProps = (record: any) => ({
    disabled: disabledKey ? record[disabledKey] : false,
  })

  // 设置表格样式
  const setTableRowStyle = (record: any, index: number) => {
    // console.log(record, index)
    // record代表表格行的内容，index代表行索引
    // 判断索引相等时添加行的高亮样式
    return selectedRowKeys.includes(record[idKey]) ? 'active-current-row' : index % 2 === 1 ? 'row-zebra-crossing' : ''
  }

  return (
    <Table
      columns={tableHead}
      dataSource={dataSource}
      loading={loading}
      onChange={onTableChange}
      onRow={(record) => {
        return {
          onClick: () => {
            selectTableRow(record)
          },
        }
      }}
      pagination={{
        size: 'default',
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: () => `共${total}条`,
        pageSize: perPage,
        current: pagination.pageNum,
        total: total,
      }}
      rowClassName={setTableRowStyle}
      rowKey={(record) => record[idKey]}
      rowSelection={
        multipleSelection
          ? {
              selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: getCheckboxProps,
            }
          : undefined
      }
      scroll={{ x: 'max-content', y: 'max-content' }}
      size='small'
    />
  )
}

export default JwTable
