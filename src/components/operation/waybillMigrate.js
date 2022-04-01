import React, { useState } from 'react'
import { apiMigrateWaybill } from '@/service/api/operation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/waybill.less'
import { Modal, Form, Input, Button, message } from 'antd'
import { digitalReg } from '@/enums/regEnum'

const WaybillMigrate = (props) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const [antdForm] = Form.useForm()
  const [finishLoading, setFinishLoading] = useState(false)
  const [manifsetNo, setManifsetNo] = useState('')

  // 迁入货单号
  const onManifestNoChange = (changedFields) => {
    setManifsetNo(changedFields.manifsetNo)
  }

  // 运单迁移操作
  const handleOk = () => {
    if (props.tableDetail.makeInvoiceStatus === 3) {
      message.success('运单已开票，不可迁移')
      return
    }
    antdForm
      .validateFields()
      .then(() => {
        setFinishLoading(true)
        apiMigrateWaybill({
          deliverySn: manifsetNo,
          transportId: props.tableDetail.transportId,
        }).then((res) => {
          if (res.code === 0) {
            message.success('运单迁移成功')
          }
          setFinishLoading(false)
          handleCancel()
        })
      })
      .catch(() => {
        message.warning('请检查输入内容')
      })
  }

  const handleCancel = () => {
    setManifsetNo('')
    antdForm.resetFields()
    props.openWaybillMigrateDialog(false)
  }

  return (
    <Modal
      destroyOnClose
      footer={[
        <Button key='确认迁移' loading={finishLoading} onClick={handleOk} type='primary'>
          确认迁移
        </Button>,
      ]}
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={handleCancel}
      title='运单迁移'
      visible={props.waybillMigrateStatus}
      width={600}
    >
      <div className='waybill-migrate-dialog-wrap'>
        <Form
          {...layout}
          colon={false}
          form={antdForm}
          name='waybill-migrate-form-one'
          onValuesChange={onManifestNoChange}
          preserve={false}
        >
          <Form.Item
            extra='输入迁入货单号码，确认提交后，运单将迁至指定货单内'
            label='迁入货单号'
            name='manifsetNo'
            rules={[
              { required: true, message: '请输入迁入货单号' },
              {
                pattern: digitalReg,
                message: '只允许输入数字和大写字母',
              },
            ]}
          >
            <Input autoComplete='off' />
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

export default connect(mapStateProps, mapDispatchToProps)(WaybillMigrate)
