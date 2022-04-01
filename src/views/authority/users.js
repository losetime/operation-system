import React, { useState, useEffect, useCallback } from 'react'
import { getUsersList, disableAccount, restoreInitialPassword } from '@/service/api/authority'
import { apiGetEnumsOptions } from '@/service/api/common'
import { Input, Button, Table, Form, Select, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import '@/style/authority/users.less'
import { usersHead } from '@/utils/tableHead'
import { perPage } from '@/enums/common'
import { paginationObj, formatParams } from '@/utils/business'
import UserDetail from '@/components/authority/userDetail'
import AuthDetail from '@/components/authority/authDetail'
import AuthButton from '@/components/common/authButton'

const Users = () => {
  const { Option } = Select
  const { confirm } = Modal
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
  // select选项
  const [searchOptions, setSearchOptions] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // 新增用户弹框状态
  const [userDetailModalStatus, setUserDetailModalStatus] = useState(false)
  // 权限弹框状态
  const [authDetailModalStatus, setAuthDetailModalStatus] = useState(false)
  // 禁用/打开账号
  const [switchLoading, setSwitchLoading] = useState(false)
  // 更多Popover
  const [popoverVisible, setPopoverVisible] = useState([])
  // 表格详情数据
  const [tableDetail, setTableDetail] = useState({})
  // 表格详情Id
  const [userId, setUserId] = useState(-1)
  // 表格操作类型
  const [handleType, setHandleType] = useState('')

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    getUsersList(tableParams).then((res) => {
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

  useEffect(() => {
    let visible = []
    if (popoverVisible.length <= 0) {
      tableData.forEach(() => {
        visible.push(false)
      })
      setPopoverVisible(visible)
    }
  }, [tableData])

  useEffect(() => {
    getSearchOptions()
  }, [])

  // 列表查询
  const onSearchBtn = (value) => {
    let paramsObj = formatParams(value)
    setTableParams({ ...tableParams, ...paramsObj, pageNum: 1 })
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    setTableParams({ pageNum: 1, perPage: perPage })
    const tempPopoverVisible = [...popoverVisible]
    const index = tempPopoverVisible.findIndex(function (value) {
      return value === true
    })
    tempPopoverVisible[index] = false
    setPopoverVisible(tempPopoverVisible)
  }

  // 监听表格
  const onTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      // table排序
      let orderBy = {}
      orderBy[sorter.columnKey] = sorter.order.substring(0, sorter.order.indexOf('c') + 1)
      setTableParams({ ...tableParams, pageNum: pagination.current, orderBy })
    } else {
      setTableParams({ ...tableParams, pageNum: pagination.current })
    }
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

  // 获取用户状态选项
  const getSearchOptions = () => {
    apiGetEnumsOptions({
      enumByParams: ['adminUserIsDisable'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }

  // 是否禁用账号
  const isDisableAccount = (bool, record) => {
    setSwitchLoading(true)
    disableAccount({
      userId: record.adminUserId,
    }).then((res) => {
      setSwitchLoading(false)
      if (res.code === 0) {
        getTableData()
        message.success('操作成功')
      }
    })
  }

  // 恢复初始密码
  const restorePassword = (record) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要恢复初始密码？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      zIndex: 2000,
      onOk() {
        restoreInitialPassword({
          userId: record.adminUserId,
        }).then((res) => {
          if (res.code === 0) {
            message.success('操作成功')
          }
        })
      },
    })
  }

  // 更多Popover
  const setPopoverStatus = (index) => {
    let visible = [...popoverVisible]
    visible.forEach((val, index) => (visible[index] = false))
    visible[index] = !visible[index]
    setPopoverVisible(visible)
  }

  // 关闭Popover
  const cancelPopover = (index) => {
    let visible = [...popoverVisible]
    visible[index] = !visible[index]
    setPopoverVisible(visible)
  }

  // 打开用户详情
  const openUserDetail = () => {
    setHandleType('add')
    setUserDetailModalStatus(true)
  }

  // 查看/修改用户
  const checkTableDetail = (record) => {
    const { adminUserId, realName, roleId, adminMobile, remark } = record
    setTableDetail({
      userId: adminUserId,
      realName: realName,
      roleId: roleId,
      mobile: adminMobile,
      remark: remark,
    })
    setHandleType('edit')
    setUserDetailModalStatus(true)
  }

  // 关闭用户详情
  const closeUserDetailModal = () => {
    setUserDetailModalStatus(false)
  }

  // 打开权限详情
  const editAuthDetail = (record) => {
    const { adminUserId } = record
    setUserId(adminUserId)
    setAuthDetailModalStatus(true)
  }

  // 关闭权限详情
  const closeAuthDetailModal = () => {
    setAuthDetailModalStatus(false)
  }

  return (
    <div className='users-wrapper'>
      <div className='_search-handle-wrap'>
        <Form {...layout} autoComplete='off' form={antdForm} layout={'inline'} name='form' onFinish={onSearchBtn}>
          <Form.Item colon={false} name='nameOrTel'>
            <Input allowClear placeholder='姓名/登录手机号' />
          </Form.Item>
          <Form.Item colon={false} name='isDisabled'>
            <Select allowClear placeholder='状态'>
              {searchOptions.adminUserIsDisable
                ? searchOptions.adminUserIsDisable.map((val) => <Option key={val.label}> {val.text} </Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item className='search-btn'>
            <Button htmlType='submit' shape='round'>
              查询
            </Button>
          </Form.Item>
        </Form>
        <div className='handle-wrap'>
          <AuthButton authKey='add' onClick={openUserDetail} shape='round'>
            新增
          </AuthButton>
          <Button onClick={onRefresh} shape='round' type='primary'>
            刷新
          </Button>
        </div>
      </div>

      <div className='table-wrap _table-wrap'>
        <Table
          columns={usersHead(
            checkTableDetail,
            editAuthDetail,
            isDisableAccount,
            restorePassword,
            setPopoverStatus,
            cancelPopover,
            switchLoading,
            popoverVisible
          )}
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
          rowKey={(record) => record.adminUserId}
          scroll={{ x: 'max-content', y: true }}
          size='small'
        />
      </div>

      <UserDetail
        closeModal={closeUserDetailModal}
        getTableData={getTableData}
        handleType={handleType}
        modalStatus={userDetailModalStatus}
        onRefresh={onRefresh}
        tableDetail={tableDetail}
      ></UserDetail>

      <AuthDetail
        closeModal={closeAuthDetailModal}
        getTableData={getTableData}
        modalStatus={authDetailModalStatus}
        onRefresh={onRefresh}
        userId={userId}
      ></AuthDetail>
    </div>
  )
}

export default Users
