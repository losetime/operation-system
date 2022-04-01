import React, { useState, useEffect, useImperativeHandle, useContext } from 'react'
import { apiGetRechargeDetails, apiAddRechargeStore } from '@/service/api/finance'
import { Input, Button, Form, Modal, message } from 'antd'
import '@/style/finance/recharge.less'
import { convertCurrency } from '@/utils/base'
import { fundsDetailRules } from '@/validator/finance'
import EnterpriseSearch from './enterpriseSearch'
import context from '@/store/context'
import JwRadio from '@/components/common/jwRadio'
import { withdrawEnum } from '@/enums/financeEnum'
import bigNumber from 'bignumber.js'
import copy from 'copy-to-clipboard'

const WithdrawDetail = (props) => {
  const [visible, setVisible] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [enterpriseInfo, setEnterpriseInfo] = useState({})
  // 是否是修改操作
  const [isModify, setIsModify] = useState(false)

  useImperativeHandle(props.cRef, () => ({
    setVisible,
    setShowSearch,
    setIsModify,
  }))

  useEffect(() => {
    if (visible && isModify) {
      apiGetRechargeDetails({ rechargeId: props.rechargeId }).then((res) => {
        if (res.code === 0) {
          const result = res.data
          setEnterpriseInfo(result)
        }
      })
    }
  }, [visible, isModify])

  // 取消事件
  const handleCancel = () => {
    props.getTableData()
    setEnterpriseInfo({})
    setShowSearch(true)
    setIsModify(false)
    setVisible(false)
  }

  return (
    <Modal
      destroyOnClose
      footer={null}
      onCancel={handleCancel}
      title={isModify ? '提现详情' : '提现'}
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
          }}
        >
          {showSearch ? <EnterpriseSearch /> : <Withdraw />}
        </context.Provider>
      </div>
    </Modal>
  )
}

// 提现详情
const Withdraw = () => {
  const { setShowSearch, enterpriseInfo, isModify, handleCancel } = useContext(context)
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const [antdForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  // 表单数据备份
  const [enterpriseInfoBackup, setEnterpriseInfoBackup] = useState({})
  // 交易类型
  const [transactionType, setTransactionType] = useState('8')

  useEffect(() => {
    setEnterpriseInfoBackup({ ...enterpriseInfo })
    if (isModify) {
      setTransactionType(enterpriseInfo.rechargeType)
    }
  }, [enterpriseInfo])

  useEffect(() => {
    antdForm.setFieldsValue({ ...enterpriseInfoBackup })
  }, [enterpriseInfoBackup])

  useEffect(() => {
    if (!isModify) {
      setEnterpriseInfoBackup({ ...enterpriseInfo, rechargeAmount: '' })
    }
  }, [transactionType])

  const onRadioBtn = (val) => {
    setTransactionType(val)
  }

  const onValuesChange = (changedFields, allFields) => {
    const freightBalance = new bigNumber(allFields.freightBalance)
    const serviceBalance = new bigNumber(allFields.serviceBalance)
    const rechargeAmount = new bigNumber(allFields.rechargeAmount ? allFields.rechargeAmount : 0)
    if (transactionType === '6') {
      const freightBalanceTemp = freightBalance.minus(rechargeAmount).toFixed(2)
      setEnterpriseInfoBackup({ ...enterpriseInfoBackup, ...changedFields, freightBalanceTemp })
    } else if (transactionType === '7') {
      const serviceBalanceTemp = serviceBalance.minus(rechargeAmount).toFixed(2)
      setEnterpriseInfoBackup({ ...enterpriseInfoBackup, ...changedFields, serviceBalanceTemp })
    } else {
      setEnterpriseInfoBackup({ ...enterpriseInfoBackup, ...changedFields })
    }
  }

  const onPreviousBtn = () => {
    setShowSearch(true)
  }

  // 创建提现
  const handleWithdraw = () => {
    antdForm
      .validateFields()
      .then(() => {
        const { freightBalance, serviceBalance, rechargeAmount, rechargeAmountFreeze, userId } = enterpriseInfoBackup
        switch (transactionType) {
          case '8':
            if (Number(rechargeAmount) > Number(freightBalance)) {
              message.warning('提现运费不能大于运费余额')
              return
            }
            break
          case '4':
            if (Number(rechargeAmount) > Number(serviceBalance)) {
              message.warning('提现服务费不能大于服务费余额')
              return
            }
            break
          case '1':
            if (Number(rechargeAmount) > Number(freightBalance)) {
              message.warning('提现运费不能大于运费余额')
              return
            }
            if (Number(rechargeAmountFreeze) > Number(serviceBalance)) {
              message.warning('提现服务费不能大于服务费余额')
              return
            }
            break
          case '6':
            if (Number(rechargeAmount) > Number(freightBalance)) {
              message.warning('转入服务费不能大于运费余额')
              return
            }
            break
          case '7':
            if (Number(rechargeAmount) > Number(serviceBalance)) {
              message.warning('转入运费不能大于服务费余额')
              return
            }
            break
        }
        setLoading(true)
        apiAddRechargeStore({
          userId,
          rechargeAmount,
          rechargeAmountFreeze,
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
    if (rechargeType === '8') {
      rechargeTypeName = '提现-运费'
    }
    if (rechargeType === '4') {
      rechargeTypeName = '提现-服务费'
    }
    if (rechargeType === '2') {
      rechargeTypeName = '开票扣税'
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
          name='withdraw-detail-form-one'
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
      <div className='withdraw-detail-choice-transaction-mode'>
        <JwRadio
          active={transactionType}
          isEdit={!isModify}
          onChange={(val) => onRadioBtn(val)}
          options={isModify ? withdrawEnum : withdrawEnum.filter((val) => val.value !== '2')}
        />
      </div>
      <div className='detail-form-wrap'>
        <Form
          {...layout}
          autoComplete='off'
          form={antdForm}
          name='withdraw-detail-form-two'
          onValuesChange={onValuesChange}
        >
          {transactionType === '8' || transactionType === '1' ? (
            <Form.Item
              colon={false}
              extra={convertCurrency(enterpriseInfoBackup.rechargeAmount)}
              label='提现运费(元)'
              name='rechargeAmount'
              rules={fundsDetailRules.rechargeAmount}
              validateFirst
            >
              <Input allowClear disabled={isModify} placeholder='请输入内容' />
            </Form.Item>
          ) : null}
          {transactionType === '4' ? (
            <Form.Item
              colon={false}
              extra={convertCurrency(enterpriseInfoBackup.rechargeAmount)}
              label='提现服务费(元)'
              name='rechargeAmount'
              rules={fundsDetailRules.rechargeAmount}
              validateFirst
            >
              <Input allowClear disabled={isModify} placeholder='请输入内容' />
            </Form.Item>
          ) : null}
          {transactionType === '1' ? (
            <Form.Item
              colon={false}
              extra={convertCurrency(enterpriseInfoBackup.rechargeAmountFreeze)}
              label='提现服务费(元)'
              name='rechargeAmountFreeze'
              rules={fundsDetailRules.rechargeAmount}
              validateFirst
            >
              <Input allowClear disabled={isModify} placeholder='请输入内容' />
            </Form.Item>
          ) : null}
          {transactionType === '6' ? (
            <>
              <Form.Item
                colon={false}
                extra={convertCurrency(enterpriseInfoBackup.freightBalanceTemp)}
                label='运费余额(元)'
                name='freightBalanceTemp'
                validateFirst
              >
                <Input disabled placeholder='请输入内容' />
              </Form.Item>
              <Form.Item
                colon={false}
                extra={convertCurrency(enterpriseInfoBackup.rechargeAmount)}
                label='转入服务费(元)'
                name='rechargeAmount'
                rules={fundsDetailRules.rechargeAmount}
                validateFirst
              >
                <Input allowClear disabled={isModify} placeholder='请输入内容' />
              </Form.Item>
            </>
          ) : null}
          {transactionType === '7' ? (
            <>
              <Form.Item
                colon={false}
                extra={convertCurrency(enterpriseInfoBackup.serviceBalanceTemp)}
                label='服务费余额(元)'
                name='serviceBalanceTemp'
                validateFirst
              >
                <Input disabled placeholder='请输入内容' />
              </Form.Item>
              <Form.Item
                colon={false}
                extra={convertCurrency(enterpriseInfoBackup.rechargeAmount)}
                label='转入运费(元)'
                name='rechargeAmount'
                rules={fundsDetailRules.rechargeAmount}
                validateFirst
              >
                <Input allowClear disabled={isModify} placeholder='请输入内容' />
              </Form.Item>
            </>
          ) : null}
          {transactionType === '2' ? (
            <Form.Item
              colon={false}
              extra={convertCurrency(enterpriseInfoBackup.rechargeAmount)}
              label='扣除服务费'
              name='rechargeAmount'
              rules={fundsDetailRules.rechargeAmount}
              validateFirst
            >
              <Input allowClear disabled={isModify} placeholder='请输入内容' />
            </Form.Item>
          ) : null}
        </Form>
      </div>
      <div className='withdraw-tip'>说明：1.提现金额必须小于等于可提现金额；2.提现后金额将原路返还至充值账户</div>
      <div className='withdraw-handle-wrap'>
        {isModify ? (
          <Button onClick={handleCancel} shape='round'>
            关闭
          </Button>
        ) : (
          <Button loading={loading} onClick={handleWithdraw} shape='round' type='primary'>
            确认提现
          </Button>
        )}
      </div>
    </div>
  )
}

export default WithdrawDetail
