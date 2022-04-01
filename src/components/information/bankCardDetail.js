import React, { useState, useEffect } from 'react'
import { apiUpdateBankCardInfo } from '@/service/api/information'
import { apiGetBankCardInfo } from '@/service/api/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/information/bankCard.less'
import { Modal, Form, Input, message } from 'antd'
import { backCardReg, cardholderName, IdNoReg } from '@/enums/regEnum'
import AuthButton from '@/components/common/authButton'

const BankCardDetail = (props) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const [antdForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [tableDetail, setTableDetail] = useState({})

  useEffect(() => {
    setTableDetail({ ...props.tableDetail })
  }, [props.tableDetail])

  useEffect(() => {
    antdForm.setFieldsValue(tableDetail) // 同步表单数据
  }, [tableDetail, antdForm])

  // 保存按钮事件
  const handleOk = () => {
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        apiUpdateBankCardInfo({ ...tableDetail }).then((res) => {
          setConfirmLoading(false)
          if (res.code === 0) {
            requestHandle('修改成功')
          }
        })
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // 编辑请求后的处理
  const requestHandle = (msg) => {
    props.getTableData({ pageNum: 1, perPage: 20 }) // 更新父组件列表
    message.success(msg)
    props.actions.setBankcardDetailDialogStatus(false)
  }

  // 取消事件
  const handleCancel = () => {
    setTableDetail({}) //数据重置
    antdForm.resetFields() // 表单重置
    props.actions.setBankcardDetailDialogStatus(false)
  }

  // 监听表单状态
  //bankCardNo银行卡   bankCardHolder持卡人   cardHolderIdNo身份证
  const onValuesChange = (changedFields, allFields) => {
    let key = Object.keys(changedFields)[0]
    switch (key) {
      case 'bankCardNo':
        getBankCardDetail(changedFields, allFields)
        break
      case 'bankCardHolder':
        if (tableDetail.realName === changedFields.bankCardHolder && !tableDetail.cardHolderIdNo) {
          setTableDetail({
            ...tableDetail,
            ...allFields,
            cardHolderIdNo: tableDetail.identityNo,
          })
        } else {
          setTableDetail({ ...tableDetail, bankCardHolder: allFields.bankCardHolder })
        }
        break
      default:
        setTableDetail({ ...tableDetail, ...allFields })
    }
  }

  const getBankCardDetail = (changedFields, allFields) => {
    if (changedFields.bankCardNo && backCardReg.test(changedFields.bankCardNo)) {
      apiGetBankCardInfo({
        bankCardNo: changedFields.bankCardNo,
      }).then((res) => {
        if (res.code === 0) {
          let tempValue = allFields
          tempValue.bankName = res.data.bankName
          if (res.data.bankCardHolder) {
            tempValue.bankCardHolder = res.data.bankCardHolder
          }
          if (res.data.cardHolderIdNo) {
            tempValue.cardHolderIdNo = res.data.cardHolderIdNo
          }
          setTableDetail({ ...tableDetail, ...tempValue })
        } else {
          setTableDetail({ ...tableDetail, ...allFields, bankName: '' })
        }
      })
    }
  }

  return (
    <Modal
      cancelText='取消'
      destroyOnClose
      footer={
        <AuthButton authKey='pass' loading={confirmLoading} onClick={handleOk} type='primary'>
          保存
        </AuthButton>
      }
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={handleCancel}
      title='查看/修改'
      visible={props.bankcardDetailDialogStatus}
      width={500}
    >
      <div className='bankcard-detail-dialog-wrap'>
        <div className='form-content-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} name='form1' onValuesChange={onValuesChange}>
            <Form.Item
              colon={false}
              label='银行卡号'
              name='bankCardNo'
              rules={[
                {
                  required: true,
                },
                {
                  pattern: backCardReg,
                  message: '银行卡号格式不正确',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              colon={false}
              label='开户银行'
              name='bankName'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              colon={false}
              label='持卡人姓名'
              name='bankCardHolder'
              rules={[
                {
                  required: true,
                },
                {
                  pattern: cardholderName,
                  message: '持卡人名字格式不正确',
                },
                {
                  min: 2,
                  message: '最少输入2个字符',
                },
                {
                  max: 6,
                  message: '最多输入6个字符',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              colon={false}
              label='持卡人身份证号'
              name='cardHolderIdNo'
              rules={[
                {
                  required: true,
                },
                {
                  pattern: IdNoReg,
                  message: '持卡人身份证号格式不正确',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
const mapStateProps = (state) => {
  return {
    bankcardDetailDialogStatus: state.bankcardDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(BankCardDetail)
