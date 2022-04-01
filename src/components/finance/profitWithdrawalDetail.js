import React, { useState, useEffect } from 'react'
import { Button, DatePicker, Divider, Form, Input, message, Radio, Select, Space, Table } from 'antd'
import { ArrowLeftOutlined, ExclamationCircleTwoTone } from '@ant-design/icons'
import '../../style/finance/profitWithdrawalDetail.less'
import JwUpload from '@/components/common/jwUpload'
import { useHistory } from 'react-router-dom'
import { apiSaveProfitWithdrawalDetail, apiGetProfitWithdrawalDetail } from '@/service/api/finance'
import { profitWithdrawalDetailHead } from '@/utils/tableHead'
import { formatParams } from '@/utils/business'
import { apiGetBankCardInfo, apiGetEnumsOptions } from '@/service/api/common'
import { backCardReg, broughtAccount, digitalReg, IdNoReg } from '@/enums/regEnum'
import AuthButton from '@/components/common/authButton'
import moment from 'moment'

const ProfitWithdrawalDetail = (props) => {
  const { Option } = Select
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 18 },
  }

  const history = useHistory()
  const cashId = props.match.params.id
  const [tableDetail, setTableDetail] = useState({ bankName: '' })
  const [disabledEdit, setDisableEdit] = useState(true)
  // 当前上传文件
  const [currentUploadFile, setCurrentUploadFile] = useState({})
  // 当前上传状态
  const [currentUploadStatus, setCurrentUploadStatus] = useState({})
  // 所有上传状态
  const [uploadStatusInfo, setUploadStatusInfo] = useState({})
  // 认证状态选项
  const [searchOptions, setSearchOptions] = useState({})
  // //个人银行名称
  const [bankName, setBankName] = useState('')

  useEffect(() => {
    getProfitWithdrawalDetail()
  }, [])

  useEffect(() => {
    apiGetEnumsOptions({
      enumByParams: ['cashPayStatusMap'],
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setSearchOptions(result)
      }
    })
  }, [])

  useEffect(() => {
    antdForm.setFieldsValue(tableDetail) // 同步表单数据
    getBankName()
  }, [tableDetail, antdForm])

  useEffect(() => {
    setTableDetail({ ...tableDetail, ...currentUploadFile })
  }, [currentUploadFile])

  useEffect(() => {
    setUploadStatusInfo({ ...uploadStatusInfo, ...currentUploadStatus })
  }, [currentUploadStatus])

  const getProfitWithdrawalDetail = () => {
    apiGetProfitWithdrawalDetail({ cashId: cashId }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        if (result.cashPayStatus) {
          result.cashPayStatus = result.cashPayStatus.toString()
        }
        if (result.transferVoucherTime) {
          result.transferVoucherTime = moment(result.transferVoucherTime)
        }
        setTableDetail(result)
        antdForm.setFieldsValue(result)
      }
    })
  }

  //获取银行名称
  const getBankName = () => {
    if (tableDetail.cashBankNumber && tableDetail.cashType === 2 && backCardReg.test(tableDetail.cashBankNumber)) {
      apiGetBankCardInfo({
        bankCardNo: tableDetail.cashBankNumber,
      }).then((res) => {
        if (res.code === 0) {
          let result = res.data
          setBankName(result.bankName)
        }
      })
    } else {
      setBankName('')
    }
  }

  // 获取上传状态
  const getUploadStatus = (status, key) => {
    const uploadStatus = {}
    uploadStatus[key] = status
    setCurrentUploadStatus(uploadStatus)
  }

  // 图片上传Add回调函数
  const uploadCallbackAdd = (imageKey, imageUrl) => {
    const fileInfo = {}
    fileInfo[imageKey] = imageUrl
    setCurrentUploadFile(fileInfo)
  }

  // 图片上传Edit回调函数
  const uploadCallbackEdit = (imageKey, imageUrl) => {
    return new Promise((resolve) => {
      uploadCallbackAdd(imageKey, imageUrl)
      resolve(true)
    })
  }

  const onValuesChange = (changedValues) => {
    let key = Object.keys(changedValues)[0]
    if (key === 'cashBankNumber') {
      getBankCardDetail(changedValues)
    }
    setTableDetail({ ...tableDetail, ...changedValues })
  }

  const getBankCardDetail = (changedFields) => {
    if (changedFields.cashBankNumber && backCardReg.test(changedFields.cashBankNumber) && tableDetail.cashType === 2) {
      apiGetBankCardInfo({
        bankCardNo: changedFields.cashBankNumber,
      }).then((res) => {
        if (res.code === 0) {
          let result = res.data
          console.log(result)
          setTableDetail({
            ...tableDetail,
            cashBankNumber: changedFields.cashBankNumber,
            cashUserName: result.bankCardHolder,
            cashUserCard: result.cardHolderIdNo,
            bankName: result.bankName,
          })
        }
      })
    }
  }

  //编辑
  const onEdit = () => {
    setDisableEdit(false)
  }

  //保存
  const onSaveInfo = () => {
    const tempValue = formatParams(tableDetail, 'YYYY-MM-DD HH:mm:ss')
    const { cashType, cashPayStatus, cashId } = tempValue
    if (cashType) {
      tempValue.cashType = Number(cashType)
    }
    if (cashPayStatus) {
      tempValue.cashPayStatus = Number(cashPayStatus)
    }
    if (cashId) {
      tempValue.cashId = Number(cashId)
    }
    if (tempValue.listData) {
      delete tempValue['listData']
    }
    if (tempValue.differCount) {
      delete tempValue['differCount']
    }
    antdForm
      .validateFields()
      .then(() => {
        apiSaveProfitWithdrawalDetail({ ...tempValue }).then((res) => {
          if (res.code === 0) {
            message.success('保存成功')
            setDisableEdit(true)
            getProfitWithdrawalDetail()
          }
        })
      })
      .catch(() => {
        message.warn('内容输入错误，请检查')
      })
  }

  //返回上级
  const onBackProfitWithdrawal = () => {
    antdForm.resetFields('')
    history.push('/home/profitWithdrawal')
  }

  //取消
  const onResetInfo = () => {
    getProfitWithdrawalDetail()
    setDisableEdit(true)
  }

  return (
    <div className='profitWithdrawalDetail-wrapper'>
      <div className='jump-but'>
        <Button type='link' onClick={onBackProfitWithdrawal}>
          <ArrowLeftOutlined />
          利润详情
        </Button>
      </div>
      <div className='profitWithdrawalDetail-content-wrap'>
        <div className='profitDetails-wrap'>
          <Table
            columns={profitWithdrawalDetailHead}
            dataSource={tableDetail.listData}
            bordered={true}
            pagination={false}
            title={() => {
              return '原始利润详情'
            }}
          />
          <div className='table-statistic-wrap'>
            <p className='statistic-content'>
              申请提现利润总计（元）：<span className='statistic-content-value'>{tableDetail.differCount}</span>
            </p>
          </div>
        </div>

        <div className='withdrawalInfo-wrap'>
          <div className='info-title'>提现信息</div>
          <div className='info-content-wrap'>
            <Form
              autoComplete='off'
              {...layout}
              form={antdForm}
              name='form'
              onValuesChange={onValuesChange}
              initialValues={{ cashType: 1, cashPayStatus: '1' }}
            >
              <Form.Item
                colon={false}
                label='银行卡号 / 开户银行账号'
                name='cashBankNumber'
                rules={[
                  {
                    validator(_, value) {
                      if (value === '') {
                        return Promise.resolve()
                      }
                      if (tableDetail.cashType === 1) {
                        if (broughtAccount.test(value)) {
                          return Promise.resolve()
                        } else {
                          return Promise.reject('对公账户格式错误')
                        }
                      } else if (tableDetail.cashType === 2) {
                        if (backCardReg.test(value)) {
                          return Promise.resolve()
                        } else {
                          return Promise.reject('个人银行卡格式错误')
                        }
                      }
                    },
                  },
                ]}
                extra={bankName}
              >
                <Input disabled={disabledEdit} allowClear />
              </Form.Item>
              <Form.Item colon={false} label='提现方式' name='cashType'>
                <Radio.Group disabled={disabledEdit}>
                  <Radio value={1}>对公账户</Radio>
                  <Radio value={2}>个人银行卡</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                colon={false}
                label='持卡人姓名 / 公司名称'
                name='cashUserName'
                rules={[
                  {
                    min: 2,
                    message: '最少输入2位字符',
                  },
                  {
                    max: 15,
                    message: '最多输入15位字符',
                  },
                ]}
              >
                <Input disabled={disabledEdit} allowClear />
              </Form.Item>
              <Form.Item colon={false} label='转账凭证编号' name='transferVoucherNo'>
                <Input disabled={disabledEdit} allowClear />
              </Form.Item>
              <Form.Item
                colon={false}
                label={
                  <div className='item-label'>
                    <p>持卡人身份证号/</p>
                    <p>社会统一信用代码</p>
                  </div>
                }
                name='cashUserCard'
                rules={[
                  {
                    validator(_, value) {
                      if (value === '') {
                        return Promise.resolve()
                      }
                      if (tableDetail.cashType === 1) {
                        if (digitalReg.test(value) && value.length === 18) {
                          return Promise.resolve()
                        } else {
                          return Promise.reject('社会统一信用格式错误')
                        }
                      } else if (tableDetail.cashType === 2) {
                        if (IdNoReg.test(value)) {
                          return Promise.resolve()
                        } else {
                          return Promise.reject('身份证格式错误')
                        }
                      }
                    },
                  },
                ]}
              >
                <Input disabled={disabledEdit} allowClear />
              </Form.Item>
              <Form.Item colon={false} label='转账日期/利润提取时间' name='transferVoucherTime'>
                <DatePicker showTime disabled={disabledEdit} allowClear />
              </Form.Item>
              <div className='info-content-img'>
                <JwUpload
                  fileKey={'transferVoucherAddress'}
                  getUploadStatus={getUploadStatus}
                  handleType={'edit'}
                  initFileUrl={tableDetail.transferVoucherAddress}
                  uploadCallbackAdd={uploadCallbackAdd}
                  uploadCallbackEdit={uploadCallbackEdit}
                  style={{ width: 1090, height: 434 }}
                  title={'转账凭证'}
                  editable={!disabledEdit}
                  deleteable={!disabledEdit}
                  downloadable={true}
                />
              </div>
              <div className='status-indicators'>
                <div className='instructions-title'>
                  <ExclamationCircleTwoTone twoToneColor='#E39F64' className='icon-title' />
                  说明：如果转账成功，请将右侧的交易状态从“申请中”改为“交易成功”；支持反复更改，更改结果同步用户端。
                </div>
                <div className='transaction-status'>
                  <Form.Item name='cashPayStatus'>
                    <Select disabled={disabledEdit}>
                      {searchOptions.cashPayStatusMap
                        ? searchOptions.cashPayStatusMap.map((val) => <Option key={val.label}>{val.text}</Option>)
                        : []}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
            <div className='remarks-wrap'>
              <div className='info-title'>备注</div>
              <div className='remark-content'>
                <Form autoComplete='off' form={antdForm} name='formRemark' onValuesChange={onValuesChange}>
                  <Form.Item name='remark'>
                    <Input.TextArea
                      disabled={disabledEdit}
                      maxLength={150}
                      showCount
                      allowClear
                      placeholder='内部记录使用，填写的备注内容仅运营平台可见，用户是看不见的。'
                      autoSize={{ minRows: 3, maxRows: 3 }}
                    />
                  </Form.Item>
                </Form>
              </div>
            </div>
            <div className='edit-btn'>
              {disabledEdit ? (
                <AuthButton authKey='edit' shape='round' type='primary' onClick={onEdit}>
                  编辑
                </AuthButton>
              ) : (
                <Space size={20}>
                  <Button shape='round' onClick={onResetInfo}>
                    取消
                  </Button>
                  <Button shape='round' type='primary' onClick={onSaveInfo}>
                    保存
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </div>
        <div className='operation-instructions-wrap'>
          <div className='operation-instructions-title'>操作说明</div>
          <div className='instructions-divider'>
            <Divider />
          </div>
          <div className='operation-instructions-content'>
            <p className='instructions-title'>如果用户银行账号信息错误，如何处理？</p>
            <p className='instructions-content'>
              答：一般银行会核对账户信息，若转账时填写的信息错误导致转账失败，可联系用户获取正确的账户信息，并修正平台数据，此处修正数据将同步用户端。
            </p>
          </div>
          <div className='operation-instructions-content'>
            <p className='instructions-title'>转账凭证编号和转账凭证图片是必填吗？</p>
            <p className='instructions-content'>答：非必填，允许反复修改。</p>
          </div>
          <div className='operation-instructions-content'>
            <p className='instructions-title'>提现支持哪些银行卡？</p>
            <p className='instructions-content'>
              答：只支持在中国大陆开户的借记卡银行账号。 <br />
              （平台可以支持：建设银行、农业银行、兴业银行、民生银行、浦发银行、工商银行、招商银行、交通银行、广发银行、平安银行、光大银行、中国银行、中信银行、杭州银行、上海银行、宁波银行、邮储银行、华夏银行、网商银行等大部分银
              行的借记卡，具体请以页面显示为准。）
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfitWithdrawalDetail
