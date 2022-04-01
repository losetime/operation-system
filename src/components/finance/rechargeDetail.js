import React, { useState, useEffect, useImperativeHandle, useContext } from 'react'
import {
  apiGetRechargeDetails,
  apiGetRechargeTrail,
  apiAddRechargeLicense,
  apiAddRechargeStore,
  apiRefuseRechargeRefuse,
  apiRechargeReceipts,
} from '@/service/api/finance'
import { Input, Button, Form, Modal, message, Space } from 'antd'
import '@/style/finance/recharge.less'
import { convertCurrency } from '@/utils/base'
import JwUpload from '@/components/common/jwUpload'
import bignumber from 'bignumber.js'
import { fundsDetailRules } from '@/validator/finance'
import EnterpriseSearch from './enterpriseSearch'
import context from '@/store/context'
import JwRadio from '@/components/common/jwRadio'
import { rechargeEnum, advanceFundEnum, advanceFundEnum2, advanceFundEnum3 } from '@/enums/financeEnum'
import AuthButton from '@/components/common/authButton'
import copy from 'copy-to-clipboard'

const RechargeDetail = (props) => {
  const [visible, setVisible] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [enterpriseInfo, setEnterpriseInfo] = useState({})
  // 是否是修改操作
  const [isModify, setIsModify] = useState(false)
  // 来源，1为【App发起】
  const [source, setSource] = useState(null)

  useImperativeHandle(props.cRef, () => ({
    setVisible,
    setShowSearch,
    setIsModify,
    setSource,
  }))

  useEffect(() => {
    if (visible && isModify) {
      apiGetRechargeDetails({ rechargeId: props.rechargeId }).then((res) => {
        if (res.code === 0) {
          setEnterpriseInfo(res.data)
        }
      })
    }
  }, [visible, isModify])

  // 取消事件
  const handleCancel = () => {
    props.getTableData()
    setEnterpriseInfo({})
    setSource(null)
    setShowSearch(true)
    setIsModify(false)
    setVisible(false)
  }

  return (
    <Modal
      destroyOnClose
      footer={null}
      onCancel={handleCancel}
      title={isModify ? '充值详情' : '充值'}
      visible={visible}
      width={1000}
    >
      <div className='withdraw-wrapper'>
        <context.Provider
          value={{
            setShowSearch,
            enterpriseInfo,
            setEnterpriseInfo,
            isModify,
            handleCancel,
            source,
          }}
        >
          {showSearch ? <EnterpriseSearch /> : <Recharge />}
        </context.Provider>
      </div>
    </Modal>
  )
}

// 提现详情
const Recharge = () => {
  const { setShowSearch, enterpriseInfo, isModify, handleCancel, source } = useContext(context)
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const { TextArea } = Input
  const [antdForm] = Form.useForm()

  const [loading, setLoading] = useState(false)
  // 表单是否可编辑
  const [editable, setEditable] = useState(true)
  // 上传操作类型
  const [uploadType, setUploadType] = useState('add')
  // 上传文件状态
  const [uploadStatus, setUploadStatus] = useState('')
  // 交易类型
  const [transactionType, setTransactionType] = useState('5')
  // 表单数据备份
  const [enterpriseInfoBackup, setEnterpriseInfoBackup] = useState({})

  useEffect(() => {
    if (isModify) {
      setEditable(false)
      setUploadType('edit')
    } else {
      setEditable(true)
      setUploadType('add')
    }
  }, [isModify])

  useEffect(() => {
    setEnterpriseInfoBackup({ ...enterpriseInfo })
    if (isModify) {
      setTransactionType(enterpriseInfo.rechargeType)
    }
  }, [enterpriseInfo])

  useEffect(() => {
    console.log(enterpriseInfoBackup)
    antdForm.setFieldsValue({ ...enterpriseInfoBackup })
  }, [enterpriseInfoBackup])

  useEffect(() => {
    if (enterpriseInfoBackup.rechargeAmount) {
      calculationAmount(enterpriseInfoBackup)
    }
  }, [transactionType])

  const onValuesChange = (changedFields, allFields) => {
    const key = Object.keys(changedFields)[0]
    if (key === 'rechargeAmount') {
      calculationAmount(allFields)
    } else {
      setEnterpriseInfoBackup({ ...enterpriseInfoBackup, ...changedFields })
    }
  }

  // 计算充值金额
  const calculationAmount = (obj) => {
    const tempInfo = { ...obj }
    if (['5', '10', '12'].includes(transactionType)) {
      setEnterpriseInfoBackup({
        ...enterpriseInfoBackup,
        ...tempInfo,
        rechargeFreight: tempInfo.rechargeAmount,
      })
    } else if (['3', '11', '13'].includes(transactionType)) {
      setEnterpriseInfoBackup({
        ...enterpriseInfoBackup,
        ...tempInfo,
        rechargeAmountFreeze: tempInfo.rechargeAmount,
      })
    } else if (transactionType === '9') {
      const rechargeAmount = new bignumber(tempInfo.rechargeAmount)
      const tax = new bignumber(tempInfo.tax.split('%')[0]).div(new bignumber(100))
      const rechargeAmountFreeze = rechargeAmount.multipliedBy(tax).toFixed(2)
      const rechargeFreight = rechargeAmount.minus(rechargeAmountFreeze).toFixed(2)
      if (isNaN(rechargeAmountFreeze) && isNaN(rechargeFreight)) {
        setEnterpriseInfoBackup({
          ...enterpriseInfoBackup,
          ...tempInfo,
          rechargeAmountFreeze: '',
          rechargeFreight: '',
        })
      } else {
        setEnterpriseInfoBackup({
          ...enterpriseInfoBackup,
          ...tempInfo,
          rechargeAmountFreeze: rechargeAmountFreeze,
          rechargeFreight: rechargeFreight,
        })
      }
    }
  }

  const onPreviousBtn = () => {
    setShowSearch(true)
  }

  const onRadioBtn = (val) => {
    setTransactionType(val)
  }

  // 取消修改
  const cancelModify = () => {
    setEnterpriseInfoBackup({ ...enterpriseInfo })
    setEditable(false)
  }

  // 获取文件上传状态
  const getUploadStatus = (val) => {
    setUploadStatus(val)
  }

  // 图片上传Add回调函数
  const uploadCallbackAdd = (imageKey, imageUrl) => {
    let fileInfo = {}
    fileInfo[imageKey] = imageUrl
    setEnterpriseInfoBackup({ ...enterpriseInfoBackup, ...fileInfo })
  }

  // 图片上传Edit回调函数
  const uploadCallbackEdit = (imageKey, imageUrl) => {
    const confirmParams = {
      rechargeId: enterpriseInfoBackup.rechargeId,
      rechargeLicense: imageUrl, // 图片路径值
    }
    uploadCallbackAdd(imageKey, imageUrl)
    return new Promise((resolve) => {
      apiAddRechargeLicense(confirmParams).then((res) => {
        if (res.code === 0) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  // 创建充值
  const handleWithdraw = () => {
    antdForm
      .validateFields()
      .then(() => {
        if (uploadStatus === 'start') {
          message.warning('图片正在上传，请稍等...')
          return
        }
        setLoading(true)
        const { failedExplain, rechargeAmount, userId, rechargeLicense } = enterpriseInfoBackup
        apiAddRechargeStore({
          userId,
          failedExplain,
          rechargeAmount,
          rechargeType: transactionType,
          rechargeLicense,
        })
          .then((res) => {
            if (res.code === 0) {
              message.success('操作成功')
              handleCancel()
            }
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch(() => {
        message.warning('请检查输入内容')
      })
  }

  // 申请通过
  const handlePass = () => {
    antdForm
      .validateFields()
      .then(() => {
        if (uploadStatus === 'start') {
          message.warning('图片正在上传，请稍等...')
          return
        }
        const { rechargeId, failedExplain } = enterpriseInfoBackup
        // APP交易类型默认为0
        if (transactionType === '0') {
          message.warning('请选择交易方式')
          return
        }
        setLoading(true)
        apiGetRechargeTrail({
          rechargeId,
          failedExplain,
          rechargeType: transactionType,
        })
          .then((res) => {
            if (res.code === 0) {
              message.success('操作成功')
              handleCancel()
            }
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch(() => {
        message.warning('请检查输入内容')
      })
  }

  // 取消申请
  const cancelApplication = () => {
    const { failedExplain, rechargeId } = enterpriseInfoBackup
    apiRefuseRechargeRefuse({
      rechargeId,
      failedExplain,
    }).then((res) => {
      if (res.code === 0) {
        message.success('操作成功')
        handleCancel()
      }
    })
  }

  // 编辑充值
  const editDetail = () => {
    antdForm
      .validateFields()
      .then(() => {
        if (uploadStatus === 'start') {
          message.warning('图片正在上传，请稍等...')
          return
        }
        const { failedExplain, rechargeId } = enterpriseInfoBackup
        setLoading(true)
        apiGetRechargeTrail({
          rechargeId,
          failedExplain,
        })
          .then((res) => {
            if (res.code === 0) {
              message.success('操作成功')
              handleCancel()
            }
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch(() => {
        message.warning('请检查输入内容')
      })
  }

  // 充值回款
  const handleRechargeReceipts = () => {
    antdForm
      .validateFields()
      .then(() => {
        if (uploadStatus === 'start') {
          message.warning('图片正在上传，请稍等...')
          return
        }
        const { failedExplain, rechargeId } = enterpriseInfoBackup
        setLoading(true)
        apiRechargeReceipts({
          rechargeId,
          failedExplain,
        })
          .then((res) => {
            if (res.code === 0) {
              message.success('操作成功')
              handleCancel()
            }
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch(() => {
        message.warning('请检查输入内容')
      })
  }

  // 复制
  const onCopy = () => {
    let rechargeTypeName = ''
    const {
      contact,
      shortCompanyName,
      createdAt,
      contactTel,
      rechargeAmount,
      rechargeSn,
      rechargeType,
    } = enterpriseInfo
    if (rechargeType === '5') {
      rechargeTypeName = '充值-运费'
    }
    if (rechargeType === '3') {
      rechargeTypeName = '充值-服务费'
    }
    let copyContent =
      '交易成功！交易内容：' +
      shortCompanyName +
      '（' +
      contact +
      '  ' +
      contactTel +
      '）' +
      createdAt +
      '  ' +
      rechargeTypeName +
      '  ' +
      rechargeAmount +
      '元\r\n交易单号：' +
      rechargeSn
    copy(copyContent)
    message.success('复制成功')
  }

  return (
    <div className='withdraw-detail-wrap'>
      {isModify ? (
        <div className='copy-btn'>
          <Button onClick={onCopy} type='link'>
            复制交易内容
          </Button>
        </div>
      ) : null}
      {isModify ? null : (
        <div className='handle-wrap'>
          <Button onClick={onPreviousBtn} shape='round'>
            上一步
          </Button>
        </div>
      )}
      <div className='withdraw-detail-title'>
        <div className='title-text'>账户信息</div>
        {isModify ? (
          <div
            className={
              enterpriseInfoBackup.rechargeStatus === 2 ? 'transaction-status-success' : 'transaction-status-error'
            }
          >
            <span>{enterpriseInfoBackup.rechargeSn}</span>
            <span>{enterpriseInfoBackup.dataSourceName}</span>
            <span>{enterpriseInfoBackup.rechargeStatusName}</span>
          </div>
        ) : null}
      </div>
      <div className='detail-form-wrap'>
        <Form
          {...layout}
          autoComplete='off'
          form={antdForm}
          name='recharge-detail-form-one'
          onValuesChange={onValuesChange}
        >
          <Form.Item colon={false} label='企业简称' name='shortCompanyName'>
            <Input allowClear disabled placeholder='请输入内容' />
          </Form.Item>
          <Form.Item colon={false} label='运费余额(元)' name='freightBalance'>
            <Input allowClear disabled placeholder='请输入内容' />
          </Form.Item>
          <Form.Item colon={false} label='联系人' name='contact'>
            <Input allowClear disabled placeholder='请输入内容' />
          </Form.Item>
          <Form.Item colon={false} label='服务费余额(元)' name='serviceBalance'>
            <Input allowClear disabled placeholder='请输入内容' />
          </Form.Item>
          <Form.Item colon={false} label='联系方式' name='contactTel'>
            <Input allowClear disabled placeholder='请输入内容' />
          </Form.Item>
          <Form.Item colon={false} label='服务费率' name='tax'>
            <Input allowClear disabled placeholder='请输入内容' />
          </Form.Item>
        </Form>
      </div>
      <div className='withdraw-detail-title'>
        <div className='title-text'>交易方式</div>
      </div>
      <div className='recharge-detail-choice-transaction-mode'>
        <div className='mode-item'>
          <JwRadio
            active={transactionType}
            isEdit={source === 1 && enterpriseInfoBackup.rechargeStatus === 1 ? true : !isModify}
            onChange={(val) => onRadioBtn(val)}
            options={rechargeEnum}
          />
        </div>
        <div className='mode-item custom-style'>
          <JwRadio
            active={transactionType}
            isEdit={source === 1 && enterpriseInfoBackup.rechargeStatus === 1 ? true : !isModify}
            onChange={(val) => onRadioBtn(val)}
            options={
              transactionType === '12'
                ? advanceFundEnum2
                : transactionType === '13'
                ? advanceFundEnum3
                : advanceFundEnum
            }
          />
        </div>
      </div>
      <div className='detail-form-wrap'>
        <Form
          {...layout}
          autoComplete='off'
          form={antdForm}
          name='recharge-detail-form-two'
          onValuesChange={onValuesChange}
        >
          <Form.Item
            colon={false}
            extra={enterpriseInfoBackup.rechargeAmount ? convertCurrency(enterpriseInfoBackup.rechargeAmount) : ''}
            label='交易金额(元)'
            name='rechargeAmount'
            rules={fundsDetailRules.rechargeAmount}
            validateFirst
          >
            <Input allowClear disabled={isModify} placeholder='请输入内容' />
          </Form.Item>
          {['5', '9', '10', '12'].includes(transactionType) ? (
            <Form.Item
              colon={false}
              extra={enterpriseInfoBackup.rechargeFreight ? convertCurrency(enterpriseInfoBackup.rechargeFreight) : ''}
              label={['5', '9'].includes(transactionType) ? '充值运费(元)' : '垫资运费(元)'}
              name='rechargeFreight'
            >
              <Input allowClear disabled placeholder='请输入内容' />
            </Form.Item>
          ) : null}
          {['3', '11', '13'].includes(transactionType) ? (
            <Form.Item
              colon={false}
              extra={
                enterpriseInfoBackup.rechargeAmountFreeze
                  ? convertCurrency(enterpriseInfoBackup.rechargeAmountFreeze)
                  : ''
              }
              label={['3'].includes(transactionType) ? '充值服务费(元)' : '垫资服务费(元)'}
              name='rechargeAmountFreeze'
            >
              <Input allowClear disabled placeholder='请输入内容' />
            </Form.Item>
          ) : null}
          {['10', '11', '12', '13'].includes(transactionType) ? (
            <Form.Item
              className='text-area-form'
              colon={false}
              label='备注'
              name='failedExplain'
              rules={fundsDetailRules.failedExplain2}
            >
              <TextArea rows={4} allowClear disabled={!editable} placeholder='请输入内容' />
            </Form.Item>
          ) : (
            <Form.Item colon={false} label='备注' name='failedExplain' rules={fundsDetailRules.failedExplain}>
              <Input allowClear disabled={!editable} placeholder='请输入内容' />
            </Form.Item>
          )}
          {transactionType === '9' ? (
            <Form.Item
              colon={false}
              extra={
                enterpriseInfoBackup.rechargeAmountFreeze
                  ? convertCurrency(enterpriseInfoBackup.rechargeAmountFreeze)
                  : ''
              }
              label='充值服务费(元)'
              name='rechargeAmountFreeze'
            >
              <Input allowClear disabled placeholder='请输入内容' />
            </Form.Item>
          ) : null}
        </Form>
      </div>
      {['10', '11', '12', '13'].includes(transactionType) && !isModify ? null : (
        <div className='upload-wrap'>
          <JwUpload
            deleteable={['12', '13'].includes(transactionType) ? false : true}
            fileKey={'rechargeLicense'}
            getUploadStatus={getUploadStatus}
            handleType={uploadType}
            initFileUrl={enterpriseInfoBackup.rechargeLicense}
            style={{ width: 850, height: 400 }}
            title={'充值凭证'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          ></JwUpload>
        </div>
      )}
      <div className='withdraw-handle-wrap'>
        {source === 1 ? (
          <Space>
            {enterpriseInfoBackup.rechargeStatus === 1 ? (
              <AuthButton authKey='cancelApplication' onClick={cancelApplication} shape='round'>
                取消申请
              </AuthButton>
            ) : null}
            {editable ? (
              <Button onClick={cancelModify} shape='round'>
                取消
              </Button>
            ) : (
              <AuthButton authKey='pass' onClick={() => setEditable(true)} shape='round' type='primary'>
                修改
              </AuthButton>
            )}
            <AuthButton authKey='pass' loading={loading} onClick={handlePass} shape='round' type='primary'>
              通过
            </AuthButton>
          </Space>
        ) : isModify ? (
          editable ? (
            <Space>
              <Button onClick={cancelModify} shape='round'>
                取消
              </Button>
              <AuthButton authKey='pass' loading={loading} onClick={editDetail} shape='round' type='primary'>
                保存
              </AuthButton>
            </Space>
          ) : (
            <Space>
              {['10', '11'].includes(transactionType) ? (
                <AuthButton
                  authKey='payment'
                  onClick={handleRechargeReceipts}
                  disabled={enterpriseInfoBackup.rechargeLicense ? false : true}
                  shape='round'
                  type='primary'
                  className='receipts-btn'
                >
                  回款
                </AuthButton>
              ) : null}
              <AuthButton authKey='pass' onClick={() => setEditable(true)} shape='round' type='primary'>
                修改
              </AuthButton>
            </Space>
          )
        ) : (
          <Button loading={loading} onClick={handleWithdraw} shape='round' type='primary'>
            确认
          </Button>
        )}
      </div>
    </div>
  )
}

export default RechargeDetail
