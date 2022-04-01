import React, { useState, useEffect } from 'react'
import { apiAddVehicleInfo, apiSaveVehicleInfo, getVehicleOCRInfo } from '@/service/api/information'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/information/vehicle.less'
import { Modal, Form, Input, DatePicker, message, Button, Select, Divider, Space, Spin } from 'antd'
import JwUpload from '@/components/common/jwUpload'
import JwDatePicker from '@/components/common/jwDatePicker'
import { formatParams } from '@/utils/business'
import { vehicleDetailRules } from '@/validator/information'
import moment from 'moment'

const VehicleDetail = (props) => {
  const { Option } = Select
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const [antdForm] = Form.useForm()
  const [tableDetail, setTableDetail] = useState({})
  // 当前上传文件
  const [currentUploadFile, setCurrentUploadFile] = useState({})
  // 当前上传状态
  const [currentUploadStatus, setCurrentUploadStatus] = useState({})
  // 所有上传状态
  const [uploadStatusInfo, setUploadStatusInfo] = useState({})
  const [disabledEdit, setDisabledEdit] = useState(true)
  const [spinLoading, setSpinLoading] = useState(false)
  const [vehicleId, setVehicleId] = useState(-1)
  const searchOptions = props.searchOptions

  useEffect(() => {
    const { registrationDate, dateOfIssue, inspectionRecord, transportLicenseRechargeTime } = props.tableDetail
    setTableDetail({
      ...props.tableDetail,
      registrationDate: strConvertDate(registrationDate),
      dateOfIssue: strConvertDate(dateOfIssue),
      inspectionRecord: strConvertDate(inspectionRecord),
      transportLicenseRechargeTime: strConvertDate(transportLicenseRechargeTime),
    })
    if (props.type === 'add') {
      setDisabledEdit(false)
      setTableDetail({ ...tableDetail, status: '2' })
    } else {
      setDisabledEdit(true)
    }
    setVehicleId(props.vehicleId)
  }, [props.tableDetail])

  useEffect(() => {
    if (props.searchOptions.vehicleFication && props.type === 'edit' && props.vehicleDetailDialogStatus) {
      let filterList = props.searchOptions.vehicleFication.filter(
        (val) => val.label === Number(props.tableDetail.vehicleFication)
      )
      let tempValue = {}
      if (filterList.length <= 0) {
        if (isNaN(Number(props.tableDetail.vehicleType))) {
          tempValue = { vehicleFication: '3', vehicleType: '124' }
        } else {
          tempValue = { vehicleFication: '3' }
        }
      } else {
        if (isNaN(Number(props.tableDetail.vehicleType))) {
          tempValue = { vehicleType: '124' }
        }
      }
      setTableDetail({ ...tableDetail, ...tempValue })
    }
  }, [props.vehicleDetailDialogStatus])

  useEffect(() => {
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
    const regs = /^\d{4}年\d{2}月\d{2}日$/
    if (reg.test(str)) {
      return moment(str)
    } else if (str === '长期') {
      return str
    } else if (regs.test(str)) {
      return moment(str.slice(0, 4) + '-' + str.slice(5, 7) + '-' + str.slice(8, 10))
    } else {
      return null
    }
  }

  // 监听表单状态
  const onValuesChange = (changedFields) => {
    setTableDetail({ ...tableDetail, ...changedFields })
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

  useEffect(() => {}, [tableDetail])

  const getOCRDetail = (fileInfo, imageKey) => {
    if (imageKey === 'vehicleLicense' && fileInfo.vehicleLicense !== '' && !disabledEdit) {
      let ocrImageFiled = fileInfo.vehicleLicense
      setSpinLoading(true)
      getVehicleOCRInfo({ ocrImageFiled: ocrImageFiled, ocrImageType: '4' }).then((res) => {
        setSpinLoading(false)
        if (res.code === 0) {
          let result = res.data
          for (let { label, text } of searchOptions.vehicleType) {
            if (text === result.vehicleType) {
              result.vehicleType = label.toString()
            }
          }
          if (props.type === 'edit') {
            setTableDetail((val) => {
              return {
                ...val,
                vehicleLicense: ocrImageFiled,
                dateOfIssue: strConvertDate(result.issueDate),
                registrationDate: strConvertDate(result.registerDate),
                vin: result.vin,
                natureOfUse: result.natureOfUse,
                all: result.all,
                vehicleFication: '3',
                vehicleType: result.vehicleType,
              }
            })
          } else {
            setTableDetail((val) => {
              return {
                ...val,
                vehicleNo: result.vehicleNo,
                vehicleLicense: ocrImageFiled,
                dateOfIssue: strConvertDate(result.issueDate),
                registrationDate: strConvertDate(result.registerDate),
                vin: result.vin,
                natureOfUse: result.natureOfUse,
                all: result.all,
                vehicleFication: '3',
                vehicleType: result.vehicleType,
              }
            })
          }
        }
      })
    }
    if (imageKey === 'vehicleLicenseBack' && fileInfo.vehicleLicenseBack !== '' && !disabledEdit) {
      let ocrImageFiled = fileInfo.vehicleLicenseBack
      setSpinLoading(true)
      getVehicleOCRInfo({ ocrImageFiled: ocrImageFiled, ocrImageType: '5' }).then((res) => {
        setSpinLoading(false)
        if (res.code === 0) {
          let result = res.data
          setTableDetail((val) => {
            return {
              ...val,
              vehicleLicenseBack: ocrImageFiled,
              unladenMass: result.unladenMass,
              quasiTractiveMass: result.traction_mass,
              inspectionRecord: strConvertDate(result.inspectionRecord),
            }
          })
        }
      })
    }
    if (imageKey === 'transportLicense' && fileInfo.transportLicense !== '' && !disabledEdit) {
      let ocrImageFiled = fileInfo.transportLicense
      setSpinLoading(true)
      getVehicleOCRInfo({
        ocrImageFiled: ocrImageFiled,
        ocrImageType: '6',
      }).then((res) => {
        setSpinLoading(false)
        if (res.code === 0) {
          setTableDetail({
            ...tableDetail,
            transportLicense: ocrImageFiled,
            transportLicenseNo: res.data.transportLicenseNo,
            transportLicenseRechargeTime: strConvertDate(res.data.transportLicenseRechargeTime),
          })
        }
      })
    }
    if (imageKey === 'transportLicenseBack' && fileInfo.transportLicenseBack !== '' && !disabledEdit) {
      let ocrImageFiled = fileInfo.transportLicenseBack
      setSpinLoading(true)
      getVehicleOCRInfo({
        ocrImageFiled: ocrImageFiled,
        ocrImageType: '6',
      }).then((res) => {
        setSpinLoading(false)
        if (res.code === 0) {
          setTableDetail({
            ...tableDetail,
            transportLicenseBack: ocrImageFiled,
            transportLicenseNo: res.data.transportLicenseNo,
            transportLicenseRechargeTime: strConvertDate(res.data.transportLicenseRechargeTime),
          })
        }
      })
    }
    if (
      (imageKey === 'transportLicense' && fileInfo.transportLicense === '') ||
      (imageKey === 'transportLicenseBack' && fileInfo.transportLicenseBack === '')
    ) {
      setSpinLoading(true)
      if (fileInfo.transportLicense === '') {
        setCurrentUploadFile({ transportLicense: '' })
        setTableDetail({
          ...tableDetail,
          transportLicense: '',
          transportLicenseNo: '',
          transportLicenseRechargeTime: '',
        })
      }
      if (fileInfo.transportLicenseBack === '') {
        setCurrentUploadFile({ transportLicenseBack: '' })
        setTableDetail({
          ...tableDetail,
          transportLicenseBack: '',
          transportLicenseNo: '',
          transportLicenseRechargeTime: '',
        })
      }
      setSpinLoading(false)
    }
  }

  // 获取上传状态
  const getUploadStatus = (status, key) => {
    let uploadStatus = {}
    uploadStatus[key] = status
    setCurrentUploadStatus(uploadStatus)
  }

  // 修改
  const openEdit = () => {
    setDisabledEdit(false)
  }

  // 取消编辑
  const resetInfo = () => {
    setDisabledEdit(true)
    const { registrationDate, dateOfIssue, inspectionRecord, transportLicenseRechargeTime } = props.tableDetail
    setTableDetail({
      ...props.tableDetail,
      registrationDate: strConvertDate(registrationDate),
      dateOfIssue: strConvertDate(dateOfIssue),
      inspectionRecord: strConvertDate(inspectionRecord),
      transportLicenseRechargeTime: strConvertDate(transportLicenseRechargeTime),
    })
  }

  // 保存、取消事件
  const handleClose = () => {
    setTableDetail({ inspectionRecord: '' }) //数据重置
    setDisabledEdit(true)
    antdForm.resetFields() // 表单重置
    props.getTableData()
    props.actions.setVehicleDetailDialogStatus(false)
  }

  //新增保存
  const addHandle = () => {
    let paramsObj = formatConversion(formatParams(tableDetail))
    if (!paramsObj.vehicleLicense || !paramsObj.vehicleLicenseBack) {
      message.warn('请补全行驶证图片')
      return
    }
    if (checkInfo(paramsObj)) {
      antdForm
        .validateFields()
        .then(() => {
          apiAddVehicleInfo({ ...paramsObj }).then((res) => {
            if (res.code === 0) {
              handleClose()
            }
          })
        })
        .catch(() => {
          message.warn('行驶证内容输入错误，请检查')
        })
    } else {
      message.warn('请输入运输证信息')
    }
  }

  //修改保存
  const editHandle = () => {
    let paramsObj = formatConversion(formatParams(tableDetail))
    if (!paramsObj.vehicleLicense || !paramsObj.vehicleLicenseBack) {
      message.warn('请补全行驶证图片')
      return
    }
    if (paramsObj.vehicleNo) {
      delete paramsObj['vehicleNo']
    }
    if (checkInfo(paramsObj)) {
      antdForm
        .validateFields()
        .then(() => {
          apiSaveVehicleInfo({ ...paramsObj, vehicleId }).then((res) => {
            if (res.code === 0) {
              message.success('修改成功')
              handleClose()
            }
          })
        })
        .catch(() => {
          message.warn('行驶证内容输入错误，请检查')
        })
    } else {
      message.warn('请输入运输证信息')
    }
  }

  //数据校验
  const checkInfo = (paramsObj) => {
    const {
      transportLicense,
      transportLicenseBack,
      transportLicenseNo,
      transportLicenseRechargeTime,
      status,
    } = paramsObj
    if (!status) {
      return false
    }
    if (transportLicense) {
      if (!transportLicenseBack || !transportLicenseNo || !transportLicenseRechargeTime) {
        return false
      }
    } else {
      if (transportLicenseNo || transportLicenseRechargeTime || transportLicenseBack) {
        return false
      }
    }
    return true
  }

  //数据类型转化
  const formatConversion = (paramsObj) => {
    const { vehicleType, status, quasiTractiveMass, unladenMass, vehicleFication } = paramsObj
    if (status) {
      paramsObj.status = Number(status)
    }
    if (quasiTractiveMass) {
      paramsObj.quasiTractiveMass = Number(quasiTractiveMass)
    }
    if (unladenMass) {
      paramsObj.unladenMass = Number(unladenMass)
    }
    if (vehicleFication) {
      paramsObj.vehicleFication = Number(vehicleFication)
    }
    if (vehicleType) {
      paramsObj.vehicleType = Number(vehicleType)
    }
    return paramsObj
  }

  return (
    <Modal
      destroyOnClose
      footer={
        <Spin spinning={spinLoading} indicator={null}>
          <div className='vehicle-handle-btn'>
            {props.type === 'add' ? (
              <Button shape='round' onClick={addHandle} type='primary'>
                创建
              </Button>
            ) : disabledEdit ? (
              <Button shape='round' onClick={openEdit} type='primary'>
                修改
              </Button>
            ) : (
              <Space size={20}>
                <Button shape='round' onClick={resetInfo}>
                  取消
                </Button>
                <Button shape='round' onClick={editHandle} type='primary'>
                  保存
                </Button>
              </Space>
            )}
          </div>
        </Spin>
      }
      onCancel={handleClose}
      title={props.type === 'edit' ? '查看/修改' : '新增'}
      visible={props.vehicleDetailDialogStatus}
      width={1180}
    >
      <Spin spinning={spinLoading}>
        <div className='vehicle-detail-dialog-wrap'>
          <div className='vehicle-drivingLicense'>
            <div className='vehicle-drivingLicense-title'>
              <div className='drivingLicense-name'>行驶证</div>
              <div className='vehicle-status-source'>
                <p className='vehicle-source'>{props.type === 'add' ? '运营创建' : tableDetail.sourceName}</p>
                <div className='vehicle-status'>
                  <Form
                    {...layout}
                    autoComplete='off'
                    form={antdForm}
                    name='form0'
                    onValuesChange={onValuesChange}
                    initialValues={{ status: '2' }}
                  >
                    <Form.Item name='status'>
                      <Select disabled={disabledEdit}>
                        {searchOptions.vehicleStatus
                          ? searchOptions.vehicleStatus.map((val) => <Option key={val.label}>{val.text}</Option>)
                          : []}
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
            <div className='vehicle-drivingLicense-picture'>
              <JwUpload
                fileKey={'vehicleLicense'}
                getUploadStatus={getUploadStatus}
                handleType={props.type}
                initFileUrl={tableDetail.vehicleLicense}
                style={{ width: 520, height: 292 }}
                title={'行驶证(正页)'}
                editable={!disabledEdit}
                uploadCallbackAdd={uploadCallbackAdd}
                uploadCallbackEdit={uploadCallbackEdit}
              />
              <JwUpload
                fileKey={'vehicleLicenseBack'}
                getUploadStatus={getUploadStatus}
                handleType={props.type}
                initFileUrl={tableDetail.vehicleLicenseBack}
                style={{ width: 520, height: 292 }}
                title={'行驶证(副页)'}
                editable={!disabledEdit}
                uploadCallbackAdd={uploadCallbackAdd}
                uploadCallbackEdit={uploadCallbackEdit}
              />
            </div>
            <div className='vehicle-drivingLicense-content' id='vehicle-drivingLicense-content'>
              <Form {...layout} autoComplete='off' form={antdForm} name='form1' onValuesChange={onValuesChange}>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>车牌号</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='vehicleNo'
                  rules={vehicleDetailRules.vehicleNo}
                >
                  <Input disabled={props.type === 'edit'} placeholder='需与行驶证图片上车牌号一致' />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>准牵引总质量(kg)</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='quasiTractiveMass'
                  rules={vehicleDetailRules.quasiTractiveMass}
                >
                  <Input disabled={disabledEdit} placeholder='吨位/皮重 (kg)' />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>车牌类型</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='vehicleFication'
                  rules={[
                    {
                      required: true,
                      message: '请输入车牌类型',
                    },
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve()
                        }
                        let bool = false
                        for (let { label, text } of searchOptions.vehicleFication) {
                          if (label === Number(value)) {
                            bool = true
                          }
                        }
                        if (bool) {
                          return Promise.resolve()
                        } else {
                          return Promise.reject('车牌类型格式错误')
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    disabled={disabledEdit}
                    placeholder='车辆“型式认证”分类'
                    getPopupContainer={() => document.getElementById('vehicle-drivingLicense-content')}
                  >
                    {searchOptions.vehicleFication
                      ? searchOptions.vehicleFication.map((val) => <Option key={val.label}>{val.text}</Option>)
                      : []}
                  </Select>
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>所有人</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='all'
                  rules={vehicleDetailRules.all}
                >
                  <Input disabled={disabledEdit} placeholder='行驶证所有人' />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>使用性质</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='natureOfUse'
                  rules={vehicleDetailRules.natureOfUse}
                >
                  <Input disabled={disabledEdit} placeholder='行驶证使用性质' />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>发证机关</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='issuingAuthority'
                  rules={vehicleDetailRules.issuingAuthority}
                >
                  <Input disabled={disabledEdit} placeholder='行驶证发证机关' />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>车辆分类</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='vehicleType'
                  rules={[
                    {
                      required: true,
                      message: '请输入车辆分类',
                    },
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve()
                        }
                        let bool = false
                        for (let { label, text } of searchOptions.vehicleType) {
                          if (label === Number(value) || text.indexOf(value) >= 0) {
                            bool = true
                          }
                        }
                        if (bool) {
                          return Promise.resolve()
                        } else {
                          return Promise.reject('车辆分类格式错误')
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    disabled={disabledEdit}
                    placeholder='车牌“型式认证”大类'
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    getPopupContainer={() => document.getElementById('vehicle-drivingLicense-content')}
                  >
                    {searchOptions.vehicleType
                      ? searchOptions.vehicleType.map((val) => <Option key={val.label}>{val.text}</Option>)
                      : []}
                  </Select>
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>注册日期</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='registrationDate'
                  rules={vehicleDetailRules.registrationDate}
                >
                  <DatePicker
                    allowClear={false}
                    disabled={disabledEdit}
                    placeholder='请选择日期'
                    getPopupContainer={() => document.getElementById('vehicle-drivingLicense-content')}
                  />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>车辆识别代号</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='vin'
                  rules={vehicleDetailRules.vin}
                >
                  <Input disabled={disabledEdit} placeholder='车架号' />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>发证日期</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='dateOfIssue'
                  rules={vehicleDetailRules.dateOfIssue}
                >
                  <DatePicker
                    allowClear={false}
                    disabled={disabledEdit}
                    placeholder='请选择日期'
                    getPopupContainer={() => document.getElementById('vehicle-drivingLicense-content')}
                  />
                </Form.Item>
                <Form.Item
                  colon={false}
                  label={
                    <div className='item-label'>
                      <p>整备质量(kg)</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  name='unladenMass'
                  rules={vehicleDetailRules.unladenMass}
                >
                  <Input disabled={disabledEdit} placeholder='车辆整备质量 (kg)' />
                </Form.Item>
                <JwDatePicker
                  disabledEdit={disabledEdit}
                  formKey={'inspectionRecord'}
                  setTableDetail={setTableDetail}
                  tableDetail={tableDetail}
                  noStyle={false}
                  getPopupContainer={'vehicle-drivingLicense-content'}
                  label={
                    <div className='item-label'>
                      <p>有效期至</p>
                      <p className='item-label-symbol'>*</p>
                    </div>
                  }
                  rules={vehicleDetailRules.inspectionRecord}
                />
              </Form>
            </div>
          </div>
          <Divider className='divider-style' />
          <div className='vehicle-roadTransport'>
            <div className='roadTransport-title'>
              <p className='roadTransport-name'>运输证</p>
            </div>
            <div className='roadTransport-picture'>
              <JwUpload
                fileKey={'transportLicense'}
                getUploadStatus={getUploadStatus}
                handleType={props.type}
                initFileUrl={tableDetail.transportLicense}
                style={{ width: 520, height: 292 }}
                title={'运输证(正页)'}
                editable={!disabledEdit}
                deleteable={!disabledEdit}
                uploadCallbackAdd={uploadCallbackAdd}
                uploadCallbackEdit={uploadCallbackEdit}
              />
              <JwUpload
                fileKey={'transportLicenseBack'}
                getUploadStatus={getUploadStatus}
                handleType={props.type}
                initFileUrl={tableDetail.transportLicenseBack}
                style={{ width: 520, height: 292 }}
                title={'运输证(副页)'}
                editable={!disabledEdit}
                deleteable={!disabledEdit}
                uploadCallbackAdd={uploadCallbackAdd}
                uploadCallbackEdit={uploadCallbackEdit}
              />
            </div>
            <div className='roadTransport-content'>
              <Form {...layout} autoComplete='off' form={antdForm} name='form2' onValuesChange={onValuesChange}>
                <Form.Item
                  colon={false}
                  label='运输许可证号'
                  name='transportLicenseNo'
                  rules={vehicleDetailRules.transportLicenseNo}
                >
                  <Input disabled={disabledEdit} placeholder='需与运输证图片上的许可号一致' />
                </Form.Item>
                <Form.Item colon={false} label='发证日期' name='transportLicenseRechargeTime'>
                  <DatePicker
                    allowClear={false}
                    disabled={disabledEdit}
                    placeholder='请选择日期'
                    getPopupContainer={() => document.getElementById('vehicle-drivingLicense-content')}
                  />
                </Form.Item>
                <Form.Item colon={false} label='备注' name='remark' rules={vehicleDetailRules.remark}>
                  <Input disabled={disabledEdit} />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    vehicleDetailDialogStatus: state.vehicleDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(VehicleDetail)
