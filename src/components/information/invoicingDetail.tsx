import React, { FC, ReactElement, useState, useEffect, useRef } from 'react'
import { apiGetInvoicingDetail, UpdateGetInvoicingDetail } from '@/service/api/information'
import '@/style/information/invoicing.less'
import { Modal, Form, Input, Button, message, Space } from 'antd'
import JwUpload from '@/components/common/jwUpload'
import { invoicingDetailRules } from '@/validator/information'
import AuthButton from '@/components/common/authButton'
import { getOperationAuth } from '@/utils/auth'

interface IProps {
  modalVisible: boolean
  detailId: number
  getTableData: () => void
  setModalVisible: (t: boolean) => void
}
const InvoicingDetail: FC<IProps> = ({ modalVisible, detailId, getTableData, setModalVisible }): ReactElement => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 20 },
  }
  const { TextArea } = Input

  const [antdForm] = Form.useForm()
  const childRef = useRef<any>()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [tableDetail, setTableDetail] = useState<any>({})
  const [tableDetailCopy, setTableDetailCopy] = useState<any>({})
  const [disabledEdit, setDisabledEdit] = useState<boolean>(true)
  const [deleteable, setDeleteable] = useState<boolean>(false)

  useEffect(() => {
    if (modalVisible) {
      getDetailInfo()
    }
  }, [modalVisible])

  useEffect(() => {
    antdForm.setFieldsValue({ ...tableDetail }) // 同步表单数据
  }, [tableDetail])

  // 监听表单状态
  const onValuesChange = (changedFields: any) => {
    setTableDetail({ ...tableDetail, ...changedFields })
  }

  // 获取合同详情
  const getDetailInfo = () => {
    apiGetInvoicingDetail({
      invoicingId: detailId,
    }).then((res) => {
      if (res.code === 0) {
        const result = res.data
        setTableDetail(JSON.parse(JSON.stringify(result)))
        setTableDetailCopy(JSON.parse(JSON.stringify(result)))
      }
    })
  }

  // 文件上传Add回调函数
  const uploadCallbackAdd = (_imageKey: string, imageUrl: string) => {
    const fileList = tableDetail.fileList
    fileList.push(imageUrl)
    setTableDetail({ ...tableDetail, fileList })
    childRef.current.clearUploadContent()
  }

  // 文件上传Edit回调函数
  const uploadCallbackEdit = (imageKey: string, imageUrl: string) => {
    return new Promise((resolve) => {
      const fileList = tableDetail.fileList
      const index = Number(imageKey.substr(imageKey.length - 1, 1))
      // 如果imageUrl为空，则说明是删除文件
      if (imageUrl) {
        fileList.splice(index, 1, imageUrl)
      } else {
        fileList.splice(index, 1)
      }
      setTableDetail({ ...tableDetail, fileList })
      resolve(true)
    })
  }

  // 保存编辑
  const handleSave = () => {
    antdForm
      .validateFields()
      .then(() => {
        setConfirmLoading(true)
        UpdateGetInvoicingDetail(tableDetail).then((res: any) => {
          setConfirmLoading(false)
          if (res.code === 0) {
            message.success('保存成功')
            getTableData()
            closeDetailModal()
          }
        })
      })
      .catch(() => {
        message.warn('请完善信息后再提交')
      })
  }

  // 取消编辑
  const handleCancel = () => {
    setTableDetail({ ...tableDetailCopy }) //数据重置
    antdForm.resetFields() // 表单重置
    setDisabledEdit(true)
    setDeleteable(false)
  }

  const closeDetailModal = () => {
    setDisabledEdit(true)
    setDeleteable(false)
    setTableDetail({}) //数据重置
    antdForm.resetFields() // 表单重置
    setModalVisible(false)
  }

  return (
    <Modal
      destroyOnClose
      footer={
        <div className='dialog-footer-wrap'>
          {disabledEdit ? (
            <AuthButton
              authKey='save'
              onClick={() => {
                setDisabledEdit(false)
                setDeleteable(true)
              }}
              type='primary'
            >
              修改
            </AuthButton>
          ) : (
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <AuthButton authKey='save' loading={confirmLoading} onClick={handleSave} type='primary'>
                保存
              </AuthButton>
            </Space>
          )}
        </div>
      }
      onCancel={closeDetailModal}
      title='查看/修改'
      visible={modalVisible}
      width={1000}
    >
      <div className='invoicing-detail-dialog-wrap'>
        <div className='detail-title-wrap'>
          <p className='title-text'>开票信息</p>
          <p className='contract-status'>
            {tableDetail.contractSn ? `${tableDetail.contractSn} | ` : ''}
            {tableDetail.contractStatusName}
          </p>
        </div>
        <div className='form-content-wrap'>
          <Form
            {...layout}
            autoComplete='off'
            colon={false}
            form={antdForm}
            labelAlign='left'
            name='contract-detail-form-one'
            onValuesChange={onValuesChange}
          >
            <Form.Item label='发票抬头' name='invoiceTitle' rules={invoicingDetailRules.invoiceTitle}>
              <Input disabled={disabledEdit} />
            </Form.Item>

            <Form.Item
              label='纳税人识别号'
              name='invoiceConsignorCode'
              rules={invoicingDetailRules.invoiceConsignorCode}
            >
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item label='开户银行账号' name='invoiceBankNumber' rules={invoicingDetailRules.invoiceBankNumber}>
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item label='开户银行' name='invoiceBankName' rules={invoicingDetailRules.invoiceBankName}>
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item label='企业地址' name='invoiceAddress' rules={invoicingDetailRules.invoiceAddress}>
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item label='企业电话' name='invoiceMobile' rules={invoicingDetailRules.invoiceMobile}>
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item label='备注' name='remarks' className='text-area-form' rules={invoicingDetailRules.remarks}>
              <TextArea disabled={disabledEdit} rows={4} allowClear />
            </Form.Item>
          </Form>
        </div>
        <div className='detail-title-wrap'>
          <p className='title-text'>附件上传</p>
        </div>
        {tableDetail.fileList ? (
          <div
            className={tableDetail.fileList.length % 3 > 0 ? 'detail-content-wrap more-content' : 'detail-content-wrap'}
          >
            {tableDetail.fileList.map((val: string, index: number) => (
              <div key={index}>
                <JwUpload
                  fileKey={`invoicing${index}`}
                  cRef={childRef}
                  downloadable={getOperationAuth('download')}
                  editable={!disabledEdit}
                  deleteable={deleteable}
                  handleType={'edit'}
                  initFileUrl={val}
                  style={{ width: 300, height: 180 }}
                  title={`附件${index + 1}`}
                  uploadCallbackEdit={uploadCallbackEdit}
                />
              </div>
            ))}
            {tableDetail.fileList.length < 5 ? (
              <JwUpload
                fileKey={'invoicing'}
                cRef={childRef}
                editable={!disabledEdit}
                handleType={'add'}
                initFileUrl={''}
                style={{ width: 300, height: 180 }}
                title={'新增附件'}
                uploadCallbackAdd={uploadCallbackAdd}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

export default InvoicingDetail
