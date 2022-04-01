import React, { useState, useEffect } from 'react'
import { apiCallSecondPay } from '@/service/api/operation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/waybill.less'
import { Modal, Table, Form, Input, message, Spin, Space, Button } from 'antd'
import { payAgainResultHead } from '@/utils/tableHead'
import bignumber from 'bignumber.js'

const PayAgain = ({ payFailList, getTableData, payAgainDialogStatus, actions }) => {
  const [antdForm] = Form.useForm()
  // 支付table表头
  const payTableHead = [
    {
      title: '运单编号',
      dataIndex: 'transportSn',
      key: 'transportSn',
      width: 140,
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      width: 100,
    },
    {
      title: '司机姓名',
      key: 'driverName',
      dataIndex: 'driverName',
      width: 90,
    },
    {
      title: '司机手机',
      key: 'driverTel',
      dataIndex: 'driverTel',
      width: 120,
    },
    {
      title: '付款企业',
      key: 'createCompany',
      dataIndex: 'createCompany',
      width: 120,
    },
    {
      title: '银行名称',
      key: 'bankName',
      dataIndex: 'bankName',
      width: 120,
    },
    {
      title: '银行卡号',
      key: 'bankCardNo',
      dataIndex: 'bankCardNo',
      width: 150,
    },
    {
      title: '银行卡持卡人',
      key: 'bankCardHolder',
      dataIndex: 'bankCardHolder',
      width: 110,
    },
    {
      title: '持卡人身份证号',
      key: 'cardHolderIdNo',
      dataIndex: 'cardHolderIdNo',
      width: 140,
    },
    {
      title: '实付运费',
      key: 'realPayAmount',
      dataIndex: 'realPayAmount',
      width: 100,
    },
  ]

  const [payPassword, setPayPassword] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [payCount, setPayCount] = useState(0)
  const [realPayAmount, setRealPayAmount] = useState(0)
  const [payResult, setPayResult] = useState([])

  useEffect(() => {
    // 计算【交易合计笔数】和【交易合计金额】
    let tempPayCount = new bignumber(0)
    let tempRealPayAmount = new bignumber(0)
    for (let item of payFailList) {
      tempPayCount = tempPayCount.plus(new bignumber(item.payCount))
      tempRealPayAmount = tempRealPayAmount.plus(new bignumber(item.realPayAmount))
    }
    setPayCount(tempPayCount.toFixed(0))
    setRealPayAmount(tempRealPayAmount.toFixed(2))
  }, [payFailList])

  const handleCancel = () => {
    setPayResult([])
    antdForm.resetFields() // 密码框置空
    setPayPassword('')
    actions.setPayAgainDialogStatus(false)
    if (payResult.length > 0) {
      getTableData() // 刷新运单数据
    }
  }

  // 支付提交
  const handleOk = () => {
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        let payInfo = []
        for (let item of payFailList) {
          payInfo.push({
            transportId: item.transportId,
            bankCardNo: item.bankCardNo,
            bankCardHolder: item.bankCardHolder,
            cardHolderIdNo: item.cardHolderIdNo,
          })
        }
        apiCallSecondPay({
          listData: payInfo,
          payPassword: payPassword,
        })
          .then((res) => {
            if (res.code === 0) {
              setPayResult(res.data)
            }
          })
          .finally(() => {
            setConfirmLoading(false)
          })
      })
      .catch(() => {
        message.warn('密码输入有误')
      })
  }

  const onValuesChange = (changedFields) => {
    setPayPassword(changedFields.payPassword)
  }

  return (
    <Modal
      confirmLoading={confirmLoading}
      destroyOnClose
      footer={
        payResult.length <= 0 ? (
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type='primary' onClick={handleOk}>
              确认
            </Button>
          </Space>
        ) : (
          <Button type='primary' onClick={handleCancel}>
            确认
          </Button>
        )
      }
      onCancel={handleCancel}
      title={payResult.length <= 0 ? '支付' : '支付结果'}
      visible={payAgainDialogStatus}
      width={1180}
    >
      {payResult.length <= 0 ? (
        <div className='pay-again-dialog-wrap'>
          {confirmLoading ? (
            <div className='pay-again-loading'>
              <Spin size='large' />
            </div>
          ) : null}
          <div className='pay-title-wrap'>
            <p>支付明细</p>
            <p>说明：运费支付到银行卡将收取收款人手续费，不同银行手续费收取标准不同，具体以银行公示为准</p>
          </div>
          <div className='pay-table-wrap'>
            <Table
              columns={payTableHead}
              dataSource={payFailList}
              pagination={false}
              rowKey={(record) => record.transportSn}
              scroll={{ x: 'max-content' }}
              size='small'
            />
          </div>
          <div className='pay-info-wrap'>
            <span>交易合计笔数：{payCount}</span>
            <span>交易合计金额：{realPayAmount}</span>
          </div>
          <div className='pay-password-wrap'>
            <Form form={antdForm} initialValues={''} layout={'horizontal'} name='form' onValuesChange={onValuesChange}>
              <Form.Item
                colon={false}
                label=''
                name='payPassword'
                rules={[
                  {
                    required: true,
                    message: '支付密码不能为空',
                  },
                  {
                    max: 8,
                    message: '支付密码最长只能输入8位',
                  },
                ]}
              >
                <Input maxLength={8} placeholder='请核对信息无误后，输入支付密码' type='password' />
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <PayAgainResult payResult={payResult} />
      )}
    </Modal>
  )
}

const PayAgainResult = ({ payResult }) => {
  return (
    <div className='pay-again-result-wrapper'>
      <Table
        columns={payAgainResultHead}
        dataSource={payResult}
        pagination={false}
        rowKey={(record) => record.transportSn}
        scroll={{ x: 'max-content' }}
        size='small'
      />
    </div>
  )
}

const mapStateProps = (state) => {
  return {
    payAgainDialogStatus: state.payAgainDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(PayAgain)
