import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Button, Form, Input, message, Modal, Space } from 'antd'
import '../../style/finance/payFailure.less'
import { apiGetBankCardInfo } from '@/service/api/common'
import { backCardReg, IdNoReg } from '@/enums/regEnum'
import { apiSaveBankCard } from '@/service/api/operation'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { connect } from 'react-redux'
import AuthButton from '@/components/common/authButton'

const PayFailureDetail = (props) => {
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 18 },
  }

  useImperativeHandle(props.cRef, () => ({
    setVisible,
  }))

  const [tableDetail, setTableDetail] = useState({ bankName: '' })
  const [disabledEdit, setDisableEdit] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTableDetail({ ...props.tableDetail })
  }, [props.tableDetail])

  useEffect(() => {
    antdForm.setFieldsValue(tableDetail) // 同步表单数据
  }, [tableDetail, antdForm])

  // 监听表单
  const onValuesChange = (changedFields, allFields) => {
    // 表单数据直接使用form.setFieldsValue(), 如果使用useState的set方法更新，数据已更新，但是表单不会重新渲染
    // 但是注意，表单更新的waybillDetail和useState里的waybillDetail并不是同一份数据，所以还是需要setWaybillDetail去更新实际的数据
    let key = Object.keys(changedFields)[0]
    switch (key) {
      case 'bankCardNo':
        getBankCardDetail(changedFields, allFields)
        // TODO 这块还没搞清楚为什么要加这一步，按照理解应该走的是useEffect，但是不加确实会有问题
        antdForm.setFieldsValue({ ...allFields })
        break
      case 'bankCardHolder':
        if (!tableDetail.cardHolderIdNo && tableDetail.driverName === changedFields.bankCardHolder) {
          setTableDetail({
            ...tableDetail,
            ...allFields,
            cardHolderIdNo: tableDetail.driverIdentityNo,
          })
        } else {
          setTableDetail({ ...tableDetail, ...changedFields })
        }
        break
      default:
        setTableDetail({ ...tableDetail, ...changedFields })
    }
  }

  const getBankCardDetail = (changedFields, allFields) => {
    if (changedFields.bankCardNo && backCardReg.test(changedFields.bankCardNo)) {
      apiGetBankCardInfo({
        bankCardNo: changedFields.bankCardNo,
      }).then((res) => {
        if (res.code === 0) {
          console.log(res.data)
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

  //编辑
  const onEdit = () => {
    setDisableEdit(false)
  }

  //取消
  const onResetInfo = () => {
    setTableDetail({ ...props.tableDetail })
    setDisableEdit(true)
  }

  //关闭页面
  const handleClose = () => {
    setDisableEdit(true)
    setVisible(false)
  }

  // 保存
  const onSaveInfo = () => {
    const { propsBankCardNo, propsBankCardHolder, propsCardHolderIdNo } = props.tableDetail
    const { bankCardNo, bankCardHolder, cardHolderIdNo } = tableDetail
    antdForm
      .validateFields()
      .then(() => {
        if (
          propsBankCardNo !== bankCardNo ||
          propsBankCardHolder !== bankCardHolder ||
          propsCardHolderIdNo !== cardHolderIdNo
        ) {
          apiSaveBankCard({
            transportId: tableDetail.transportId,
            bankNo: tableDetail.bankCardNo,
            bankCardHolder: tableDetail.bankCardHolder,
            cardHolderIdNo: tableDetail.cardHolderIdNo,
          }).then((res) => {
            if (res.code === 0) {
              setDisableEdit(true)
              props.getTableData()
            }
          })
        } else {
          setDisableEdit(true)
          props.getTableData()
        }
      })
      .catch(() => {
        message.warning('请检查输入内容')
      })
  }

  //重新支付
  const handlePayAgain = () => {
    props.setPayFailList([tableDetail])
    props.getTableData()
    setVisible(false)
    props.actions.setPayAgainDialogStatus(true)
  }

  return (
    <Modal
      destroyOnClose
      title='支付失败'
      visible={visible}
      width={1000}
      footer={
        <Space>
          {disabledEdit ? (
            <Button onClick={onEdit}>编辑</Button>
          ) : (
            <Space>
              <Button onClick={onResetInfo}>取消</Button>
              <Button onClick={onSaveInfo}>保存</Button>
            </Space>
          )}
          {!disabledEdit ? null : (
            <AuthButton authKey='pay_again' onClick={handlePayAgain} type='primary' disabled={!disabledEdit}>
              重新支付
            </AuthButton>
          )}
        </Space>
      }
      onCancel={handleClose}
    >
      <div className='payFailureDetail-wrapper'>
        <Form autoComplete='off' {...layout} name='payFailureForm' form={antdForm} onValuesChange={onValuesChange}>
          <Form.Item colon={false} label='车牌号' name='vehicleNo'>
            <Input disabled />
          </Form.Item>
          <Form.Item
            colon={false}
            extra={tableDetail.bankName}
            label={
              <div className='item-label'>
                <p>银行卡号</p>
                <p className='item-label-symbol'>*</p>
              </div>
            }
            name='bankCardNo'
            rules={[
              {
                required: true,
                message: '银行卡号不能为空',
              },
              {
                pattern: backCardReg,
                message: '请输入正确的银行卡号',
              },
            ]}
          >
            <Input disabled={disabledEdit} autoComplete='off' />
          </Form.Item>
          <Form.Item colon={false} label='身份证号码' name='driverIdentityNo'>
            <Input disabled />
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <div className='item-label'>
                <p>持卡人</p>
                <p className='item-label-symbol'>*</p>
              </div>
            }
            name='bankCardHolder'
            rules={[
              {
                required: true,
                message: '持卡人不能为空',
              },
              {
                max: 6,
                message: '姓名最大6个字符',
              },
              {
                min: 2,
                message: '姓名最少2个字符',
              },
            ]}
          >
            <Input disabled={disabledEdit} autoComplete='off' />
          </Form.Item>
          <Form.Item colon={false} label='司机姓名' name='driverName'>
            <Input disabled />
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <div className='item-label'>
                <p>持卡人身份证号</p>
                <p className='item-label-symbol'>*</p>
              </div>
            }
            name='cardHolderIdNo'
            rules={[
              {
                required: true,
                message: '持卡人身份证号不能为空',
              },
              {
                pattern: IdNoReg,
                message: '持卡人身份证号格式不正确',
              },
            ]}
          >
            <Input disabled={disabledEdit} placeholder='18位身份证号码' autoComplete='off' />
          </Form.Item>
          <Form.Item colon={false} label='联系方式' name='driverTel'>
            <Input disabled />
          </Form.Item>
        </Form>
      </div>
    </Modal>
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

export default connect(mapStateProps, mapDispatchToProps)(PayFailureDetail)
