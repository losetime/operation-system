import React, { useState, useEffect, Fragment } from 'react'
import { apiGetBankCardInfo, apiSaveBankCard } from '@/service/api/operation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/waybill.less'
import { Modal, Form, Input, Button, message, Tooltip } from 'antd'
import { backCardReg, IdNoReg } from '@/enums/regEnum'
import JwUpload from '@/components/common/jwUpload'
import WaybillMigrate from '@/components/operation/waybillMigrate'
import IconFont from '@/middleware/iconfont'
import AuthButton from '@/components/common/authButton'

const WaybillDetail = (props) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const [antdForm] = Form.useForm()
  const [finishLoading, setFinishLoading] = useState(false)
  const [tableDetail, setTableDetail] = useState({})
  const [waybillMigrateStatus, setWaybillMigrateStatus] = useState(false)

  useEffect(() => {
    setTableDetail({ ...props.tableDetail })
  }, [props.tableDetail])

  useEffect(() => {
    antdForm.setFieldsValue(tableDetail)
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

  // 关闭Modal
  const handleCancel = () => {
    props.actions.setWaybillDetailDialogStatus(false)
  }

  // 打开/关闭运单迁移Modal
  const openWaybillMigrateDialog = (status) => {
    setWaybillMigrateStatus(status)
  }

  return (
    <Fragment>
      {/* forceRender 预渲染 */}
      <Modal
        destroyOnClose
        footer={
          <Button key='取消' onClick={handleCancel}>
            取消
          </Button>
        }
        forceRender
        getContainer={false}
        maskClosable={false}
        onCancel={handleCancel}
        title='查看/修改'
        visible={props.detailDialogStatus}
        width={1000}
      >
        <div className='detail-dialog-wrap'>
          <div className='form-title'>
            <p>货单信息</p>
            <p className='info-status'>
              {tableDetail.dDeliverySn} | {tableDetail.dDataSource}
            </p>
          </div>
          <div className='waybill-info-wrap'>
            <Form {...layout} colon={false} form={antdForm} name='waybill-detail-form-one' preserve={false}>
              <Form.Item label='货物类型' name='dCargoTypeName' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='运费单价(元)' name='dFreightCost' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='详细分类' name='dGoodsName'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='允许货损(kg)' name='dAllowLoss' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='装货企业' name='dPackCompany' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='亏吨单价(元)' name='dLossCost' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='卸货企业' name='dUnloadCompany' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='扣吨(元)' name='dDeductionTon'>
                <Input disabled />
              </Form.Item>
            </Form>
          </div>

          <div className='form-title'>
            <p>磅单信息</p>
            <p className='info-status'>
              {tableDetail.transportSn} | {tableDetail.dataSourceName}
            </p>
          </div>
          <div className='waybill-info-wrap'>
            <Form {...layout} colon={false} form={antdForm} name='waybill-detail-form-two' preserve={false}>
              <Form.Item label='车牌号' name='vehicleNo' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='司机姓名' name='driverName'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='身份证号码' name='driverIdentityNo'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='联系方式' name='driverTel'>
                <Input disabled />
              </Form.Item>
              <div className='upload-image-wrap'>
                <JwUpload
                  editable={false}
                  fileKey={'packPoundListImage'}
                  handleType={props.type}
                  initFileUrl={tableDetail.packPoundListImage}
                  style={{ width: 460, height: 260 }}
                  title={'装货磅单'}
                ></JwUpload>
                <span className='tip-text'>货主可以上传和修改磅单图片</span>
              </div>
              <div className='upload-image-wrap'>
                <JwUpload
                  editable={false}
                  fileKey={'unloadPoundListImage'}
                  handleType={'edit'}
                  initFileUrl={tableDetail.unloadPoundListImage}
                  style={{ width: 460, height: 260 }}
                  title={'卸货磅单'}
                ></JwUpload>
                <span className='tip-text'>货主可以上传和修改磅单图片</span>
              </div>
              <Form.Item label='装货时间' name='upstreamLoadedA'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='卸货时间' name='unloadLoadedAt'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='装货净重(吨)'>
                <Form.Item name='realMineSendWeight' noStyle>
                  <Input disabled style={{ width: 120 }} />
                </Form.Item>
                <span style={{ float: 'right', marginTop: 5 }}>结算净重(吨)：{tableDetail.packPercentage}</span>
              </Form.Item>
              <Form.Item label='卸货净重(吨)'>
                <Form.Item name='unloadingWeight' noStyle>
                  <Input disabled style={{ width: 120 }} />
                </Form.Item>
                <span style={{ float: 'right', marginTop: 5 }}>结算净重(吨)：{tableDetail.unloadPercentage}</span>
              </Form.Item>
            </Form>
          </div>
          <div className='form-title'>
            <p>运费信息</p>
            <p className='info-status'>
              {tableDetail.tradeStatusName} | {tableDetail.freightCalcRule}
            </p>
          </div>
          <div className='waybill-info-wrap'>
            <Form
              {...layout}
              colon={false}
              form={antdForm}
              name='waybill-detail-form-three'
              onValuesChange={onValuesChange}
              preserve={false}
            >
              <Form.Item
                extra='=（装货净重 - 卸货净重 - 允许货损）* 亏吨单价'
                label='亏吨扣款(元)'
                name='lossDecreaseAmount'
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                extra={tableDetail.bankName}
                label='银行卡号'
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
                <Input disabled autoComplete='off' />
              </Form.Item>
              <Form.Item extra='= 结算净重 * 运价 - 亏吨扣款' label='计算运费(元)' name='realTransportFreight'>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label='持卡人'
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
                <Input disabled autoComplete='off' />
              </Form.Item>
              <Form.Item label='杂项费用(元)' name='miscellaneousExpenses'>
                <Input disabled />
              </Form.Item>
              <Form.Item
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
                <Input disabled placeholder='18位身份证号码' autoComplete='off' />
              </Form.Item>
              <Form.Item label='实付运费(元)' name='realPayAmount' rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item extra='= 计算运费 - 杂项费用' label='应付运费(元)' name='shouldPayAmount'>
                <Input disabled />
              </Form.Item>
              <Form.Item>
                <Tooltip placement='right' title='运单迁移'>
                  <span>
                    <AuthButton
                      authKey='transfer'
                      icon={
                        <IconFont
                          className='icon-wenjianjia'
                          onClick={() => {
                            openWaybillMigrateDialog(true)
                          }}
                          type='icon-wenjianjia1'
                        />
                      }
                      type='text'
                    />
                  </span>
                </Tooltip>
              </Form.Item>
              <Form.Item label='备注' name='remark'>
                <Input disabled />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
      <WaybillMigrate
        openWaybillMigrateDialog={openWaybillMigrateDialog}
        tableDetail={tableDetail}
        waybillMigrateStatus={waybillMigrateStatus}
      />
    </Fragment>
  )
}

const mapStateProps = (state) => {
  return {
    detailDialogStatus: state.waybillDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(WaybillDetail)
