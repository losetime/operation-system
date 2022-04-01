import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { useHistory } from 'react-router-dom'
import { Input, Button, Table, Form, Space, message, Modal } from 'antd'
import { RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import '@/style/finance/confirmInvoiceInfo.less'
import { printInvoiceHead } from '@/utils/tableHead'
import PrintInvoice from '@/components/finance/printInvoice'
import ApplyCount from '@/components/finance/applyCount'
import Statement from '@/components/finance/statement'
import JwUpload from '@/components/common/jwUpload'
import AuthButton from '@/components/common/authButton'
import { convertCurrency } from '@/utils/base'
import { EditableRow } from '@/components/common/editTable'
import EditableCell from '@/components/common/editTable'
import bignumber from 'bignumber.js'
import { invoiceInfoRules, serviceChargeRules, invocieResultRules } from '@/validator/finance'
import {
  apiGetInvoiceApplyDetail,
  apiGetInvoiceSerivce,
  apiUpdateInvoiceEnterprise,
  apiUpdateServiceCharge,
  apiDeductServiceCharge,
  apiAbandonedInvoice,
  apiInvoiceFinished,
  apiUploadStatement,
  apiUpdateMailAddress,
  apiUpdateExpressNo,
  apiUpSuideData,
  apiPrintInvoice,
  apiPrintInvoiceAgain,
  apiDownloadInvoiceDetail,
  apiBatchDownload,
} from '@/service/api/finance'

const ConfirmInvoiceInfo = (props) => {
  const history = useHistory()
  const { confirm } = Modal
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  }
  const recordId = props.match.params.id
  const childRef = useRef()
  const invoiceTempRef = useRef()
  const [antdForm] = Form.useForm()
  const [antdForm2] = Form.useForm()
  const [antdForm3] = Form.useForm()
  // table当前选中行索引
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  // 表格详情数据
  const [tableDetail, setTableDetail] = useState({})
  // 开票状态
  const [invoiceStatus, setInvoiceStatus] = useState(1)
  // 开票企业信息
  const [invoiceEnterprise, setInvoiceEnterprise] = useState({})
  // 结算单统计
  const [invoiceStatistics, setInvoiceStatistics] = useState({})
  // 开票结算单信息
  const [invoiceStatement, setInvoiceStatement] = useState({})
  // 服务费确认信息
  const [serviceCharge, setServiceCharge] = useState({})
  // 开票结果信息
  const [invoiceResultInfo, setInvoiceResultInfo] = useState({})
  // 开票信息备份
  const [invoiceInfoBackUp, setInvoiceInfoBackUp] = useState({})
  // 表格数据加载状态
  const [tableLoading, setTableLoading] = useState(false)
  const [infoId, setInfoId] = useState(null)
  const [invoiceDetailIsEdit, setInvoiceDetailIsEdit] = useState(false)
  const [serviceChargeIsEdit, setServiceChargeIsEdit] = useState(false)
  const [mailAddressIsEdit, setMailAddressIsEdit] = useState(false)
  const [expressIsEdit, setExpressIsEdit] = useState(false)
  const [disabledConfirmUploadBtn, setDisabledConfirmUploadBtn] = useState(true)
  const [reqFlag, setReqFlag] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  //上传绥德
  const [upSelectDataId, setUpSelectData] = useState([])

  // 选择表格当前行
  const selectTableRow = (row, index) => {
    setActiveRowIndex(index)
  }

  // 设置表格样式
  const setTableRowStyle = (record, index) => {
    //record代表表格行的内容，index代表行索引
    //判断索引相等时添加行的高亮样式
    return index === activeRowIndex
      ? 'active-current-row editable-row'
      : index % 2 === 1
      ? 'row-zebra-crossing editable-row'
      : 'editable-row'
  }

  // 返回上一页
  const returnPrePage = () => {
    history.replace({
      pathname: '/home/invoiceApproval',
    })
  }

  // 判断发票状态是否是【确认中】或【待审核】
  const getInvoiceStatus = () => {
    if (invoiceStatus === 1 || invoiceStatus === 2) {
      return true
    } else {
      return false
    }
  }

  /**
   * 获取开票相关信息
   */
  const getConfirmInvoiceInfo = useCallback(() => {
    setTableLoading(true)
    apiGetInvoiceApplyDetail({
      invoiceId: recordId,
    }).then((res) => {
      setTableLoading(false)
      if (res.code === 0) {
        let result = res.data
        // 开票状态
        setInvoiceStatus(result.invoiceStatus)
        // 开票企业信息
        setInvoiceEnterprise(result.invoiceEnterprise)
        // 结算单统计
        setInvoiceStatistics(result.invoiceStatistics)
        // 开票结算单信息
        setInvoiceStatement(result.invoiceStatement)
        // 开票结果信息
        setInvoiceResultInfo(result.invoiceData)
        // 开票信息备份
        setInvoiceInfoBackUp(JSON.parse(JSON.stringify(result)))
      }
    })
    apiGetInvoiceSerivce({
      recordId: recordId,
    }).then((res) => {
      if (res.code === 0) {
        let result = res.data
        setTableDetail(res.data)
        // 服务费信息
        setServiceCharge({
          invoiceTax: result.invoiceTax,
          invoiceAmount: result.invoiceAmount,
          invoiceTaxAmount: result.invoiceTaxAmount,
          invoiceCountAmount: result.invoiceCountAmount,
        })
      }
    })
  }, [recordId])

  useEffect(() => {
    getConfirmInvoiceInfo()
  }, [getConfirmInvoiceInfo])

  /**
   * 确认开票信息逻辑
   */
  useEffect(() => {
    antdForm.setFieldsValue(invoiceEnterprise)
  }, [invoiceEnterprise, antdForm])

  // 监听开票信息Form
  const onInvoiceEnterpriseChange = (changedFields, allFields) => {
    setInvoiceEnterprise({ ...allFields })
  }

  // 修改开票信息
  const modifyInvoiceInfo = () => {
    antdForm
      .validateFields()
      .then(() => {
        apiUpdateInvoiceEnterprise({
          recordId: recordId,
          ...invoiceEnterprise,
        }).then((res) => {
          if (res.code === 0) {
            message.success('修改成功')
            setInvoiceDetailIsEdit(false)
            getConfirmInvoiceInfo()
          }
        })
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // 取消修改开票信息
  const cancelModifyInvoiceInfo = () => {
    antdForm.resetFields()
    setInvoiceEnterprise({ ...invoiceInfoBackUp.invoiceEnterprise })
    setInvoiceDetailIsEdit(false)
  }

  /**
   * 上传结算单逻辑
   */

  const onClearUpload = () => {
    setDisabledConfirmUploadBtn(true)
    childRef.current.clearUploadContent()
  }

  const confirmUpload = () => {
    childRef.current.confirmUpload()
  }

  // 编辑回调
  const uploadCallbackEdit = (key, info) => {
    const confirmParams = {
      invoiceId: recordId,
      imgName: info, // 图片路径值
    }
    return new Promise((resolve) => {
      apiUploadStatement(confirmParams).then((res) => {
        if (res.code === 0) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  // 获取上传状态
  const getUploadStatus = (info) => {
    if (info === 'start') {
      setDisabledConfirmUploadBtn(false)
    } else {
      setDisabledConfirmUploadBtn(true)
      getConfirmInvoiceInfo()
    }
  }

  /**
   * 服务费确认逻辑
   */

  useEffect(() => {
    antdForm2.setFieldsValue(serviceCharge)
  }, [serviceCharge, antdForm2])

  // 监听服务费确认Form
  const onServiceChange = (changedFields, allFields) => {
    const { invoiceCountAmount, invoiceTax } = allFields
    const key = Object.keys(changedFields)[0]
    if (key === 'invoiceTax' || key === 'invoiceCountAmount') {
      const invoiceTaxAmount = numberCalculation(invoiceCountAmount, invoiceTax)
      setServiceCharge({
        ...serviceCharge,
        ...changedFields,
        invoiceTaxAmount: invoiceTaxAmount,
      })
    } else {
      setServiceCharge({ ...serviceCharge, ...changedFields })
    }
  }

  // 服务费计算函数
  const numberCalculation = (invoiceCountAmount, invoiceTax) => {
    // 开票总金额
    let tempInvoiceCountAmount = invoiceCountAmount ? new bignumber(invoiceCountAmount) : new bignumber(0)
    // 税率
    let tempInvoiceTax = invoiceTax ? new bignumber(invoiceTax).dividedBy(new bignumber(100)) : new bignumber(0)
    // 运费总额
    // let tempInvoiceAmount = new bignumber(invoiceAmount)
    // 服务费的计算结果
    return tempInvoiceCountAmount.multipliedBy(tempInvoiceTax).toFixed(2)

    // 如果 开票总金额-运费总额-服务费小于等于0.02，则把服务费置为开票总金额-运费总额
    // if (tempInvoiceCountAmount.minus(tempInvoiceAmount).minus(calculationRusult).isLessThanOrEqualTo(0.02)) {
    //   calculationRusult = tempInvoiceCountAmount.minus(tempInvoiceAmount)
    //   return calculationRusult.toFixed(2).toString()
    // } else {
    //   return calculationRusult.toFixed(2).toString()
    // }
  }

  // 修改服务费
  const modifyServiceCharge = () => {
    antdForm2
      .validateFields()
      .then((values) => {
        apiUpdateServiceCharge({
          recordId: recordId,
          invoiceTaxAmount: values.invoiceTaxAmount,
          invoiceTax: values.invoiceTax,
          invoiceCountAmount: values.invoiceCountAmount,
        }).then((res) => {
          if (res.code === 0) {
            setServiceChargeIsEdit(false)
            message.success('修改成功')
            getConfirmInvoiceInfo()
          }
        })
      })
      .catch((error) => {
        message.warn('请完善信息后再提交')
        console.warn(error)
      })
  }

  // 取消修改服务费
  const cancelModifyServiceCharge = () => {
    setServiceCharge({
      invoiceTax: tableDetail.invoiceTax,
      invoiceAmount: tableDetail.invoiceAmount,
      invoiceTaxAmount: tableDetail.invoiceTaxAmount,
      invoiceCountAmount: tableDetail.invoiceCountAmount,
    })
    antdForm2.resetFields()
    setServiceChargeIsEdit(false)
  }

  // 确认并扣除服务费
  const confirmApply = () => {
    confirm({
      title: '操作提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定扣除服务费?',
      onOk() {
        apiDeductServiceCharge({
          recordId: recordId,
        }).then((res) => {
          if (res.code === 0) {
            message.success('操作成功')
            history.replace({
              pathname: '/home/invoiceApproval',
            })
          }
        })
      },
    })
  }

  // 发票废弃
  const abandonedInvoice = () => {
    confirm({
      title: '操作提示',
      icon: <ExclamationCircleOutlined />,
      content: <AbandonedConfirmContent />,
      onOk() {
        apiAbandonedInvoice({
          recordId: recordId,
        }).then((res) => {
          if (res.code === 0) {
            message.success('操作成功')
            getConfirmInvoiceInfo()
          }
        })
      },
      okText: '确认作废本次开票',
      width: 800,
    })
  }

  /**
   * 开具并打印
   */

  useEffect(() => {
    if (upSelectDataId.length > 0) {
      const data = 4
      apiUpSuideData({ transportSn: upSelectDataId, transportType: data }).then((res) => {
        if (res.code === 0) {
          message.success('已上传至绥德')
        }
      })
    }
  }, [upSelectDataId])

  // 判断发票号码是否完整
  useState(() => {
    if (tableDetail.info) {
      tableDetail.info.forEach((val) => {
        if (val.invioiceNumber === '') {
          setIsEmpty(true)
        }
      })
    }
  }, [tableDetail])

  //上传绥德
  const upSuideDate = (record) => {
    if (isNaN(record.invioiceNumber)) {
      message.warn('请填写发票号码')
      return
    }
    setUpSelectData([record.invioiceNumber])
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  // 批量下载
  const batchDownload = () => {
    apiBatchDownload({ recordId })
  }

  // 打开发票模板
  const openInvoiceTemp = (record) => {
    setInfoId(record.infoId)
    invoiceTempRef.current.handleOpen()
  }

  // 下载详单
  const downloadDetailList = (record) => {
    apiDownloadInvoiceDetail({ infoId: record.infoId })
  }

  // 保存发票号码
  const saveInvoiceNumber = (row) => {
    const newData = [...tableDetail.info]
    const index = newData.findIndex((item) => row.infoId === item.infoId)
    let promise = null
    if (row.invioiceNumber.trim() === '') {
      message.warning('发票号码不能为空')
    } else if (isNaN(Number(row.invioiceNumber))) {
      message.warning('发票号码必须是数字')
    } else if (row.invioiceNumber.length < 6 || row.invioiceNumber.length > 18) {
      message.warning('发票号码最少6位,最大18位')
    } else {
      newData.splice(index, 1, { ...row })
      setTableDetail({ ...tableDetail, info: newData })
      const params = {
        infoId: newData[index].infoId,
        invoiceCode: newData[index].invioiceCode,
        invoiceNumber: newData[index].invioiceNumber.trim(),
      }
      setReqFlag(true)
      if (newData[index].openNum === 0) {
        promise = apiPrintInvoice(params)
      } else {
        promise = apiPrintInvoiceAgain(params)
      }
      promise
        .then((res) => {
          if (res.code === 0) {
            message.success('操作成功')
            getConfirmInvoiceInfo()
          }
        })
        .finally(() => {
          setReqFlag(false)
        })
    }
  }

  // 开票成功
  const invoiceFinished = () => {
    apiInvoiceFinished({
      invoiceId: recordId,
    }).then((res) => {
      if (res.code === 0) {
        message.success('操作成功')
        getConfirmInvoiceInfo()
      }
    })
  }

  /**
   * 开票结果
   */

  useEffect(() => {
    antdForm3.setFieldsValue(invoiceResultInfo)
  }, [invoiceResultInfo, antdForm3])

  // 监听开票结果表单
  const onInvoiceResultInfoChange = (changedFields, allFields) => {
    setInvoiceResultInfo({ ...allFields })
  }

  // 修改邮寄地址
  const modifyMailAddress = () => {
    const { mailingAddress, addressee, contactTel } = invoiceResultInfo
    antdForm3
      .validateFields()
      .then(() => {
        apiUpdateMailAddress({
          recordId: recordId,
          mailingAddress: mailingAddress,
          addressee: addressee,
          contactTel: contactTel,
        }).then((res) => {
          if (res.code === 0) {
            message.success('修改成功')
            setMailAddressIsEdit(false)
            getConfirmInvoiceInfo()
          }
        })
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // 取消修改邮寄地址
  const cancelModifyMailAddress = () => {
    setMailAddressIsEdit(false)
    setInvoiceResultInfo({ ...invoiceInfoBackUp.invoiceData })
  }

  // 修改快递单号
  const modifyExpress = () => {
    antdForm3
      .validateFields()
      .then(() => {
        const { courierNumber, expressNotes } = invoiceResultInfo
        apiUpdateExpressNo({
          recordId: recordId,
          courierNumber: courierNumber,
          expressNotes: expressNotes,
        }).then((res) => {
          if (res.code === 0) {
            message.success('修改成功')
            setExpressIsEdit(false)
            getConfirmInvoiceInfo()
          }
        })
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // 取消修改快递单号
  const cancelModifyExpress = () => {
    setExpressIsEdit(false)
    setInvoiceResultInfo({ ...invoiceInfoBackUp.invoiceData })
  }

  return (
    <div className='confirm-invoice-info-wrapper'>
      <div className='tax-number-wrap'>
        <span className='tax-number'>{props.match.params.invoiceNumber}</span>
        <Button onClick={returnPrePage} shape='round' type='primary'>
          返回上一页
          <RightOutlined />
        </Button>
      </div>
      <div className='invoice-info-timeline-wrap'>
        <div className='invoice-wrap'>
          <div className='invoice-title-wrap'>
            <div className='invoice-title'>
              <p className='invoice-title-text'>确认开票信息</p>
              <p className='invoice-info-tip'>请仔细核对，若信息有误可“修改”内容，若确认无误将按此信息开票</p>
            </div>
          </div>
          <div className='invoice-form'>
            <Form
              {...layout}
              autoComplete='off'
              form={antdForm}
              labelAlign='left'
              name='enterpriseForm'
              onValuesChange={onInvoiceEnterpriseChange}
            >
              <Form.Item colon={false} label='发票抬头' name='invoiceTitle' rules={invoiceInfoRules.invoiceTitle}>
                <Input allowClear disabled={!invoiceDetailIsEdit} placeholder='发票抬头' />
              </Form.Item>
              <Form.Item colon={false} label='纳税人识别号' name='taxNumber' rules={invoiceInfoRules.taxNumber}>
                <Input allowClear disabled={!invoiceDetailIsEdit} placeholder='纳税人识别号' />
              </Form.Item>
              <Form.Item
                colon={false}
                label='开户银行账号'
                name='bankAccountNumber'
                rules={invoiceInfoRules.bankAccountNumber}
              >
                <Input allowClear disabled={!invoiceDetailIsEdit} placeholder='开户银行账号' />
              </Form.Item>
              <Form.Item colon={false} label='开户银行' name='bankOfDeposit' rules={invoiceInfoRules.bankOfDeposit}>
                <Input allowClear disabled={!invoiceDetailIsEdit} placeholder='开户银行' />
              </Form.Item>
              <Form.Item colon={false} label='企业地址' name='address' rules={invoiceInfoRules.address}>
                <Input allowClear disabled={!invoiceDetailIsEdit} placeholder='企业地址' />
              </Form.Item>
              <Form.Item
                colon={false}
                label='企业电话'
                name='enterpriseTelephone'
                rules={invoiceInfoRules.enterpriseTelephone}
              >
                <Input allowClear disabled={!invoiceDetailIsEdit} placeholder='企业电话' />
              </Form.Item>
            </Form>
          </div>
          <div className='handle-wrap'>
            {invoiceDetailIsEdit ? (
              <Space>
                <Button onClick={cancelModifyInvoiceInfo} shape='round'>
                  取消
                </Button>
                <AuthButton authKey='modify_invoice_info' onClick={modifyInvoiceInfo} shape='round' type='primary'>
                  保存
                </AuthButton>
              </Space>
            ) : getInvoiceStatus() ? (
              <AuthButton
                authKey='modify_invoice_info'
                onClick={() => {
                  setInvoiceDetailIsEdit(true)
                }}
                shape='round'
                type='primary'
              >
                修改
              </AuthButton>
            ) : null}
          </div>
        </div>
        <div className='invoice-wrap'>
          <div className='invoice-title-wrap'>
            <div className='invoice-title'>
              <p className='invoice-title-text'>确认结算单</p>
              <p className='invoice-info-tip'>
                结算单数据为票面数据，请仔细核对：站点、品名、日期、吨位、单价、金额等信息
              </p>
            </div>
          </div>
          <div>
            <Statement
              getInvoiceStatus={getInvoiceStatus}
              invoiceId={recordId}
              reacquireData={getConfirmInvoiceInfo}
              statementInfo={invoiceStatement}
              statisticsInfo={invoiceStatistics}
            />
          </div>
        </div>
        <div className='invoice-wrap'>
          <div className='invoice-title-wrap'>
            <div className='invoice-title'>
              <p className='invoice-title-text'>上传结算单</p>
              <p className='invoice-info-tip'>扫描盖章后的结算单，并上传至平台，等待平台开票</p>
            </div>
          </div>
          <div className='upload-wrap'>
            <JwUpload
              autoUpload={false}
              cRef={childRef}
              fileKey={'invoiceImage'}
              fileName={invoiceResultInfo.fileName}
              getUploadStatus={getUploadStatus}
              handleType={'edit'}
              initFileUrl={invoiceResultInfo.imagePass}
              showTools={false}
              style={{ width: 800, height: 450 }}
              title={'开票结算单'}
              uploadCallbackEdit={uploadCallbackEdit}
            ></JwUpload>
          </div>
          <div className='handle-wrap'>
            {getInvoiceStatus() ? (
              <Space>
                <Button onClick={onClearUpload} shape='round'>
                  清除
                </Button>
                <AuthButton
                  authKey='upload_statement'
                  disabled={disabledConfirmUploadBtn}
                  onClick={confirmUpload}
                  shape='round'
                  type='primary'
                >
                  确认上传
                </AuthButton>
              </Space>
            ) : null}
          </div>
        </div>
        <div className='invoice-wrap'>
          <div className='invoice-title-wrap'>
            <div className='invoice-title'>
              <p className='invoice-title-text'>服务费确认</p>
              <p className='invoice-info-tip'>
                服务费（元）＝ 含税总价（元） x 服务费率，计算并确认开票服务费后，将此次费用从货主余额中扣除
              </p>
            </div>
          </div>
          <div className='invoice-form'>
            <Form
              {...layout}
              autoComplete='off'
              form={antdForm2}
              labelAlign='left'
              name='form2'
              onValuesChange={onServiceChange}
            >
              <Form.Item
                colon={false}
                label='服务费率'
                name='invoiceTax'
                rules={serviceChargeRules.invoiceTax}
                validateFirst
              >
                <Input allowClear disabled={!serviceChargeIsEdit} placeholder='服务费率' suffix='%' />
              </Form.Item>
              <Form.Item
                className='rewrite-margin'
                colon={false}
                extra={convertCurrency(serviceCharge.invoiceCountAmount)}
                label='含税总价(元)'
                name='invoiceCountAmount'
                rules={serviceChargeRules.invoiceCountAmount}
                validateFirst
              >
                <Input allowClear disabled={!serviceChargeIsEdit} placeholder='含税总额(元)' />
              </Form.Item>
              <Form.Item
                className='rewrite-margin'
                colon={false}
                extra={convertCurrency(serviceCharge.invoiceAmount)}
                label='实付运费(元)'
                name='invoiceAmount'
              >
                <Input allowClear disabled placeholder='运费总额(元)' />
              </Form.Item>
              <Form.Item
                className='rewrite-margin'
                colon={false}
                extra={convertCurrency(serviceCharge.invoiceTaxAmount)}
                label='服务费(元)'
                name='invoiceTaxAmount'
                rules={serviceChargeRules.invoiceTaxAmount}
                validateFirst
              >
                <Input
                  allowClear
                  className='invoice-tax-amount'
                  disabled={!serviceChargeIsEdit}
                  placeholder='服务费(元)'
                />
              </Form.Item>
            </Form>
          </div>
          <div className={getInvoiceStatus() ? 'handle-wrap' : 'handle-start-wrap'}>
            {getInvoiceStatus() ? (
              serviceChargeIsEdit ? (
                <Space>
                  <Button onClick={cancelModifyServiceCharge} shape='round'>
                    取消
                  </Button>
                  <Button onClick={modifyServiceCharge} shape='round' type='primary'>
                    保存
                  </Button>
                </Space>
              ) : (
                <Space>
                  <AuthButton
                    authKey='modify_service_charge'
                    onClick={() => {
                      setServiceChargeIsEdit(true)
                    }}
                    shape='round'
                    type='primary'
                  >
                    修改
                  </AuthButton>
                  <AuthButton authKey='confirm_service_charge' onClick={confirmApply} shape='round' type='primary'>
                    确认并扣除服务费
                  </AuthButton>
                </Space>
              )
            ) : null}
            {invoiceStatus === 6 || invoiceStatus === 7 ? (
              <AuthButton authKey='invoice_cancel' onClick={abandonedInvoice} shape='round' type='primary'>
                本次开票作废
              </AuthButton>
            ) : null}
          </div>
        </div>
        <div className='invoice-wrap'>
          <div className='invoice-title-wrap'>
            <div className='invoice-title'>
              <p className='invoice-title-text'>开具并打印</p>
              <p className='invoice-info-tip'>下载XML导入金税盘中开具发票，并回填发票号码</p>
            </div>
            <div>
              {invoiceStatus === 6 || invoiceStatus === 7 ? (
                <AuthButton authKey='batch_download_xml' onClick={batchDownload} shape='round' type='primary'>
                  批量下载XML
                </AuthButton>
              ) : null}
            </div>
          </div>
          <div className='print-table-wrap'>
            <Table
              columns={printInvoiceHead(
                invoiceStatus,
                openInvoiceTemp,
                downloadDetailList,
                upSuideDate,
                saveInvoiceNumber
              )}
              components={components}
              dataSource={tableDetail.info}
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
              rowKey={(record) => record.infoId}
              scroll={{ x: 'max-content', y: true }}
              size='small'
            />
          </div>
          {invoiceStatus === 6 ? (
            <div className='handle-wrap'>
              <AuthButton
                authKey='invoice_success'
                disabled={isEmpty || reqFlag}
                onClick={invoiceFinished}
                shape='round'
                type='primary'
              >
                开票成功
              </AuthButton>
            </div>
          ) : null}
        </div>
        <div className='invoice-wrap'>
          <div className='invoice-title-wrap'>
            <div className='invoice-title'>
              <p className='invoice-title-text'>开票结果</p>
              <p className='invoice-info-tip'>请仔细核对填写发票邮寄地址，若信息有误可“修改”内容</p>
            </div>
          </div>
          <div className='invoice-form'>
            <Form
              autoComplete='off'
              form={antdForm3}
              labelAlign='left'
              name='form5'
              onValuesChange={onInvoiceResultInfoChange}
            >
              <Form.Item
                className='mailing-address'
                colon={false}
                label='邮寄地址'
                name='mailingAddress'
                rules={invocieResultRules.mailingAddress}
              >
                <Input allowClear disabled={!mailAddressIsEdit} placeholder='邮寄地址' />
              </Form.Item>
              <Form.Item colon={false} label='收件人' name='addressee' rules={invocieResultRules.addressee}>
                <Input allowClear disabled={!mailAddressIsEdit} placeholder='收件人' />
              </Form.Item>
              <Form.Item colon={false} label='联系方式' name='contactTel' rules={invocieResultRules.contactTel}>
                <Input allowClear disabled={!mailAddressIsEdit} placeholder='联系方式' />
              </Form.Item>
            </Form>
          </div>
          <div className='handle-wrap'>
            {invoiceStatus === 3 || invoiceStatus === 8 ? null : mailAddressIsEdit ? (
              <Space>
                <Button onClick={cancelModifyMailAddress} shape='round'>
                  取消
                </Button>
                <Button onClick={modifyMailAddress} shape='round' type='primary'>
                  保存
                </Button>
              </Space>
            ) : (
              <AuthButton
                authKey='modify_mail_address'
                onClick={() => {
                  setMailAddressIsEdit(true)
                }}
                shape='round'
                type='primary'
              >
                修改
              </AuthButton>
            )}
          </div>
        </div>
        <div className='invoice-wrap'>
          <div className='invoice-form'>
            <Form
              autoComplete='off'
              form={antdForm3}
              labelAlign='left'
              name='form6'
              onValuesChange={onInvoiceResultInfoChange}
            >
              <Form.Item
                className='mailing-address'
                colon={false}
                label='快递单号'
                name='courierNumber'
                rules={invocieResultRules.courierNumber}
              >
                <Input allowClear disabled={!expressIsEdit} placeholder='快递单号' />
              </Form.Item>
              <Form.Item
                className='mailing-address'
                colon={false}
                label='备注'
                name='expressNotes'
                rules={invocieResultRules.expressNotes}
              >
                <Input.TextArea allowClear disabled={!expressIsEdit} placeholder='备注' rows={4} />
              </Form.Item>
            </Form>
          </div>
          <div className='handle-wrap'>
            {invoiceStatus === 3 || invoiceStatus === 8 ? null : expressIsEdit ? (
              <Space>
                <Button onClick={cancelModifyExpress} shape='round'>
                  取消
                </Button>
                <Button onClick={modifyExpress} shape='round' type='primary'>
                  保存
                </Button>
              </Space>
            ) : (
              <AuthButton
                authKey='modify_express_no'
                onClick={() => {
                  setExpressIsEdit(true)
                }}
                shape='round'
                type='primary'
              >
                修改
              </AuthButton>
            )}
          </div>
        </div>
      </div>
      <PrintInvoice cRef={invoiceTempRef} handleType={'print'} infoId={infoId} reacquireData={getConfirmInvoiceInfo} />
      <ApplyCount eventHandle={getConfirmInvoiceInfo} invoiceStatus={invoiceStatus} recordId={recordId} />
    </div>
  )
}

const AbandonedConfirmContent = () => {
  return (
    <div className='abandoned-confirm-content'>
      <span className='title'>请阅读以下内容并思考是否要“作废”本次开票！</span>
      <span>1、若作废本次开票，本次扣除的服务费将会以充值的方式退还货主账户内；</span>
      <span>2、若作废本次开票，本次申请开票的所有运单的开票状态都将转为“未开票”状态；</span>
      <span>3、若作废本次开票，本条开票申请的状态将转为“作废”状态；</span>
      <span>4、若作废本次开票，本条开票所填写的所有发票单号将不可再重复填写；</span>
      <span>5、此操作不可逆，请谨慎！</span>
    </div>
  )
}

const mapStateProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ConfirmInvoiceInfo)
