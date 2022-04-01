import React, { useState, useEffect, useRef } from 'react'
import {
  apiAddDriverInfo,
  apiUpdateDriverInfo,
  apiRefuseDriverInfo,
  apiUpdateDriverImage,
  getVehicleOCRInfo,
} from '@/service/api/information'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/information/driver.less'
import { Modal, Form, Input, DatePicker, message } from 'antd'
import JwUpload from '@/components/common/jwUpload'
import { phoneReg, IdNoReg, driverNameReg } from '@/enums/regEnum'
import ModalFooter from '@/components/common/modalFooter'
import JwDatePicker from '@/components/common/jwDatePicker'
import moment from 'moment'

const DriverDetail = (props) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const childRef = useRef()
  const [antdForm] = Form.useForm()
  const [tableDetail, setTableDetail] = useState({})
  // 当前上传文件
  const [currentUploadFile, setCurrentUploadFile] = useState({})
  // 当前上传状态
  const [currentUploadStatus, setCurrentUploadStatus] = useState({})
  // 所有上传状态
  const [uploadStatusInfo, setUploadStatusInfo] = useState({})
  const [disabledEdit, setDisabledEdit] = useState(true)
  const [verificationImage, setVerificationImage] = useState(false)

  useEffect(() => {
    const { validFrom, validUntil, identityStart, identityEnd } = props.tableDetail
    setTableDetail({
      ...props.tableDetail,
      validFrom: strConvertDate(validFrom),
      validUntil: strConvertDate(validUntil),
      identityStart: strConvertDate(identityStart),
      identityEnd: strConvertDate(identityEnd),
    })
    if (props.type === 'add') {
      setDisabledEdit(false)
    } else {
      setDisabledEdit(true)
    }
  }, [props.tableDetail])

  useEffect(() => {
    // const { identityImageObverse, identityImageReverse, driverLicenseObverse, driverLicenseReverse } = tableDetail
    // if (identityImageObverse && identityImageReverse && driverLicenseObverse && driverLicenseReverse) {
    //   setVerificationImage(true)
    // } else {
    //   setVerificationImage(false)
    // }
    console.log(tableDetail)
    antdForm.setFieldsValue(tableDetail) // 同步表单数据
  }, [tableDetail, antdForm])

  useEffect(() => {
    setTableDetail({ ...tableDetail, ...currentUploadFile })
  }, [currentUploadFile])

  useEffect(() => {
    setUploadStatusInfo({ ...uploadStatusInfo, ...currentUploadStatus })
  }, [currentUploadStatus])

  // 转化字符串为moment对象
  const strConvertDate = (str) => {
    const reg = /^\d{4}-\d{2}-\d{2}$/
    if (reg.test(str)) {
      return moment(str)
    } else if (str === '长期') {
      return str
    } else {
      return null
    }
  }

  // 监听表单状态
  const onValuesChange = (changedFields, allFields) => {
    let key = Object.keys(changedFields)[0]
    switch (key) {
      case 'validFrom':
        compareDate(allFields, 'validFrom', 'validUntil', 'start')
        break
      case 'validUntil':
        compareDate(allFields, 'validFrom', 'validUntil', 'end')
        break
      case 'identityStart':
        compareDate(allFields, 'identityStart', 'identityEnd', 'start')
        break
      case 'identityEnd':
        compareDate(allFields, 'identityStart', 'identityEnd', 'end')
        break
    }
    setTableDetail({ ...tableDetail, ...changedFields })
    childRef.current.onFormChange()
  }

  // 时间比较
  const compareDate = (obj, startKey, endKey, current) => {
    if (obj[startKey] && obj[endKey]) {
      if (moment(obj[startKey]).diff(moment(obj[endKey])) >= 0) {
        message.warn('开始时间不能大于结束时间')
        if (current === 'start') {
          obj[startKey] = ''
        } else if (current === 'end') {
          obj[endKey] = ''
        }
      }
    }
  }

  // 图片上传Add回调函数
  const uploadCallbackAdd = (imageKey, imageUrl) => {
    let fileInfo = {}
    fileInfo[imageKey] = imageUrl
    setCurrentUploadFile(fileInfo)
    getOCRDetail(fileInfo, imageKey)
  }

  // 图片上传Edit回调函数
  const uploadCallbackEdit = (imageKey, imageUrl) => {
    return new Promise((resolve) => {
      uploadCallbackAdd(imageKey, imageUrl)
      resolve(true)
    })
  }

  // 获取上传状态
  const getUploadStatus = (status, key) => {
    let uploadStatus = {}
    uploadStatus[key] = status
    setCurrentUploadStatus(uploadStatus)
  }

  //OCR
  const getOCRDetail = (fileInfo, imageKey) => {
    if (imageKey === 'driverLicenseObverse' && fileInfo.driverLicenseObverse !== '') {
      let ocrImageFiled = fileInfo.driverLicenseObverse
      getVehicleOCRInfo({ ocrImageFiled: ocrImageFiled, ocrImageType: '3' }).then((res) => {
        if (res.code === 0) {
          let result = res.data
          setTableDetail((val) => {
            return {
              ...val,
              validFrom: strConvertDate(result.validFrom),
              validUntil: strConvertDate(result.validUntil),
            }
          })
        }
      })
    }
  }

  // 修改
  const openEdit = () => {
    setDisabledEdit(false)
  }

  // 取消编辑
  const resetInfo = () => {
    setDisabledEdit(true)
    const { validFrom, validUntil, identityStart, identityEnd } = props.tableDetail
    setTableDetail({
      ...props.tableDetail,
      validFrom: strConvertDate(validFrom),
      validUntil: strConvertDate(validUntil),
      identityStart: strConvertDate(identityStart),
      identityEnd: strConvertDate(identityEnd),
    })
  }

  // 取消事件
  const handleClose = () => {
    setTableDetail({
      validUntil: '',
      identityEnd: '',
    }) //数据重置
    setDisabledEdit(true)
    antdForm.resetFields() // 表单重置
    props.actions.setDriverDetailDialogStatus(false)
  }

  return (
    <Modal
      // 认证状态:1认证中/2认证成功/3认证失败
      destroyOnClose
      footer={
        <ModalFooter
          antdForm={antdForm}
          cRef={childRef}
          disabledEdit={disabledEdit}
          getTableData={props.getTableData}
          handleClose={handleClose}
          httpKey={{
            add: apiAddDriverInfo,
            edit: apiUpdateDriverInfo,
            refuse: apiRefuseDriverInfo,
          }}
          idKey={'transporterId'}
          openEdit={openEdit}
          reasonKey={'refuse'}
          resetInfo={resetInfo}
          status={tableDetail.transporterStatus}
          tableDetail={tableDetail}
          type={props.type}
          uploadStatusInfo={uploadStatusInfo}
          verificationImage={true}
        />
      }
      onCancel={handleClose}
      title={props.type === 'edit' ? '查看/修改' : '新增'}
      visible={props.driverDialogStatus}
      width={1000}
    >
      <div className='driver-detail-dialog-wrap'>
        <div className='form-title'>
          <div className='form-title-content'>司机证件</div>
        </div>
        <div className='upload-image-wrap'>
          <JwUpload
            fileKey={'identityImageObverse'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.identityImageObverse}
            style={{ width: 450, height: 253 }}
            title={'身份证(正面)'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
          <JwUpload
            className='jw-upload-wrap'
            fileKey={'identityImageReverse'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.identityImageReverse}
            style={{ width: 450, height: 253 }}
            title={'身份证(背面)'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
          <JwUpload
            fileKey={'driverLicenseObverse'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.driverLicenseObverse}
            style={{ width: 450, height: 253 }}
            title={'驾驶证(正面)'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
          <JwUpload
            fileKey={'driverLicenseReverse'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.driverLicenseReverse}
            style={{ width: 450, height: 253 }}
            title={'驾驶证(背面)'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
          <JwUpload
            editable={false}
            fileKey={'workLicenseObverse'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.workLicenseObverse}
            style={{ width: 450, height: 253 }}
            title={'从业资格证'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
        </div>
        <div className='form-title'>
          <div className='form-title-content'>司机信息</div>
          <div
            className={
              props.tableDetail.transporterStatus === 2
                ? 'authentication-success-status'
                : 'authentication-error-status'
            }
          >
            {tableDetail.registerSourceName} | {tableDetail.transporterName}
          </div>
        </div>
        <div className='form-content-wrap' id='form-content-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} name='form' onValuesChange={onValuesChange}>
            <Form.Item
              colon={false}
              label={
                <div className='item-label'>
                  <p>司机姓名</p>
                  <p className='item-label-symbol'>*</p>
                </div>
              }
              name='realName'
              rules={[
                {
                  required: true,
                  message: '请输入司机姓名',
                },
                {
                  pattern: driverNameReg,
                  message: '司机姓名只允许输入中文、英文和数字',
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
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item colon={false} label='驾驶证有效期限'>
              <Form.Item name='validFrom' noStyle>
                <DatePicker
                  allowClear={false}
                  disabled={disabledEdit}
                  inputReadOnly
                  getPopupContainer={() => document.getElementById('form-content-wrap')}
                />
              </Form.Item>
              <span className='placeholder-span'>&nbsp;-&nbsp;</span>
              <JwDatePicker
                disabledEdit={disabledEdit}
                formKey={'validUntil'}
                modalFooterRef={childRef}
                setTableDetail={setTableDetail}
                tableDetail={tableDetail}
                getPopupContainer={'form-content-wrap'}
              />
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <div className='item-label'>
                  <p>联系方式</p>
                  <p className='item-label-symbol'>*</p>
                </div>
              }
              name='contactTel'
              rules={[
                {
                  required: true,
                  message: '请输入联系方式',
                },
                {
                  pattern: phoneReg,
                  message: '手机号格式不正确',
                },
              ]}
            >
              <Input disabled={props.type === 'edit' || disabledEdit} />
            </Form.Item>
            <Form.Item colon={false} label='从业证有效期限'>
              <Form.Item name='contact3' noStyle>
                <DatePicker
                  allowClear={false}
                  disabled={disabledEdit}
                  inputReadOnly
                  getPopupContainer={() => document.getElementById('form-content-wrap')}
                />
              </Form.Item>
              <span className='placeholder-span'>&nbsp;-&nbsp;</span>
              <Form.Item name='contact4' noStyle>
                <DatePicker
                  allowClear={false}
                  disabled={disabledEdit}
                  inputReadOnly
                  getPopupContainer={() => document.getElementById('form-content-wrap')}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <div className='item-label'>
                  <p>身份证号码</p>
                  <p className='item-label-symbol'>*</p>
                </div>
              }
              name='identityNo'
              rules={[
                {
                  required: true,
                  message: '请输入身份证号码',
                },
                {
                  pattern: IdNoReg,
                  message: '身份证号码格式不正确',
                },
              ]}
            >
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item
              colon={false}
              label='备注'
              name='refuseExplain'
              rules={[
                {
                  max: 15,
                  message: '最多输入15个字符',
                },
              ]}
            >
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item colon={false} label='身份证有效期限'>
              <Form.Item name='identityStart' noStyle>
                <DatePicker
                  allowClear={false}
                  disabled={disabledEdit}
                  inputReadOnly
                  getPopupContainer={() => document.getElementById('form-content-wrap')}
                />
              </Form.Item>
              <span className='placeholder-span'>&nbsp;-&nbsp;</span>
              <JwDatePicker
                disabledEdit={disabledEdit}
                formKey={'identityEnd'}
                modalFooterRef={childRef}
                setTableDetail={setTableDetail}
                tableDetail={tableDetail}
                getPopupContainer={'form-content-wrap'}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    driverDialogStatus: state.driverDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(DriverDetail)
