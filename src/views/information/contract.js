import React, { useState, useEffect, useCallback, useRef } from 'react'
import { apiGetContractList } from '@/service/api/information'
import { apiGetEnumsOptions, apiUploadGovData } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Input, Button, Form, Select, message, Space } from 'antd'
import '@/style/information/contract.less'
import { contractTableHead } from '@/utils/tableHead'
import { formatParams } from '@/utils/business'
import ContractDetail from '@/components/information/contractDetail'
import AuthButton from '@/components/common/authButton'
import JwTable from '@/components/common/jwTable'

const Contract = () => {
  const { Option } = Select
  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  const childRef = useRef()
  const [antdForm] = Form.useForm()
  // 表格数据
  const [tableData, setTableData] = useState([])
  // table数据总条数
  const [total, setTotal] = useState(0)
  // 合同状态枚举
  const [contractStatusOptions, setContractStatusOptions] = useState([])
  // 表格详情数据
  const [currentRowId, setCurrentRowId] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  // 合同详情状态
  const [contractDialogStatus, setContractDialogStatus] = useState(false)

  // 获取表格数据
  const getTableData = useCallback(() => {
    setTableLoading(true)
    let paramsObj = transformSearch(formatParams(antdForm.getFieldValue()))
    apiGetContractList({ ...childRef.current.pagination, ...paramsObj }).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        let result = res.data
        setTotal(result.count)
        setTableData(result.listData)
      }
    })
    childRef.current.setSelectedRowKeys([])
  }, [antdForm])

  useEffect(() => {
    getEnumerateInfo()
  }, [])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 获取枚举
  const getEnumerateInfo = () => {
    apiGetEnumsOptions({
      enumByParams: ['contractStatus', 'transportUpStatus'],
    }).then((res) => {
      if (res.code === 0) {
        setContractStatusOptions(res.data)
      }
    })
  }

  //查询条件转换
  const transformSearch = (paramsObj) => {
    if (paramsObj.upSuideStatus) {
      paramsObj.upSuideStatus = Number(paramsObj.upSuideStatus)
    }
    if (paramsObj.upProvincialStatus) {
      paramsObj.upProvincialStatus = Number(paramsObj.upProvincialStatus)
    }
    return paramsObj
  }

  // 列表查询
  const onSearchBtn = () => {
    childRef.current.initPagination()
  }

  // 刷新
  const onRefresh = () => {
    antdForm.resetFields()
    childRef.current.initPagination()
  }

  // 处理合同/查看合同
  const handleContract = (record) => {
    setCurrentRowId(record.contractId)
    setContractDialogStatus(true)
  }

  // 关闭合同详情
  const closeDetailDialog = () => {
    setContractDialogStatus(false)
  }

  //上传绥德
  const upDataSuide = () => {
    let temporaryUpload = childRef.current.selectedRows
    let data = 1
    if (temporaryUpload.length > 0) {
      for (let i = 0; i < temporaryUpload.length; i++) {
        if (temporaryUpload[i].contractStatus !== 2) {
          message.warn('非履行中合同无法上传')
          return
        }
      }
      let contractSnArr = temporaryUpload.map((val) => val.contractSn)
      apiUploadGovData({
        transportSn: contractSnArr,
        transportType: data,
      }).then((res) => {
        if (res.code === 0) {
          message.success('已上传至绥德')
          getTableData()
        }
      })
    } else {
      message.warn('请上传编号')
    }
  }

  return (
    <div className='contract-wrapper'>
      <div className='_search-handle-wrap'>
        <Form
          {...layout}
          autoComplete='off'
          colon={false}
          form={antdForm}
          layout={'inline'}
          name='contract-form-one'
          onFinish={onSearchBtn}
        >
          <Form.Item name='contactSn'>
            <Input allowClear placeholder='合同号' />
          </Form.Item>
          <Form.Item name='creatCompany'>
            <Input allowClear placeholder='发起企业' />
          </Form.Item>
          <Form.Item name='createRealCompany'>
            <Input allowClear placeholder='甲方名称' />
          </Form.Item>
          <Form.Item name='contactStatus'>
            <Select allowClear placeholder='合同状态'>
              {contractStatusOptions.contractStatus
                ? contractStatusOptions.contractStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Form.Item name='upSuideStatus'>
            <Select allowClear placeholder='绥德上传状态'>
              {contractStatusOptions.transportUpStatus
                ? contractStatusOptions.transportUpStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                : []}
            </Select>
          </Form.Item>
          <Button htmlType='submit' shape='round'>
            查询
          </Button>
        </Form>
        <Space size={20}>
          <AuthButton authKey='up_suide' onClick={upDataSuide} shape='round'>
            上传绥德
          </AuthButton>
          <Button onClick={onRefresh} shape='round' type='primary'>
            刷新
          </Button>
        </Space>
      </div>

      <div className='table-wrap _table-wrap'>
        <JwTable
          cRef={childRef}
          dataSource={tableData}
          getDataSource={getTableData}
          idKey='contractId'
          loading={tableLoading}
          multipleSelection={true}
          tableHead={contractTableHead(handleContract)}
          total={total}
        />
      </div>

      <ContractDetail
        closeDetailDialog={closeDetailDialog}
        contractDialogStatus={contractDialogStatus}
        contractId={currentRowId}
        contractStatusOptions={contractStatusOptions}
        getTableData={getTableData}
      ></ContractDetail>
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

export default connect(mapStateProps, mapDispatchToProps)(Contract)
