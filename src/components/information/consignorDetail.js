import React, { useState, useEffect, useRef } from 'react'
import {
  apiAddConsignorInfo,
  apiUpdateConsignorInfo,
  apiRefuseConsignorInfo,
  apiUpdateConsignorImage,
} from '@/service/api/information'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/information/consignor.less'
import { Modal, Form, Input, Radio, DatePicker, message } from 'antd'
import { consignorDetailRules } from '@/validator/information'
import JwUpload from '@/components/common/jwUpload'
import TmapDistrict from '@/components/common/tmapDistrict'
import AmapDistrict from '@/components/common/amapDistrict'
import ModalFooter from '@/components/common/modalFooter'
import JwDatePicker from '@/components/common/jwDatePicker'
import moment from 'moment'
import { MAP_TYPE } from '@/enums/pluginEnum'

const ConsignorDetail = (props) => {
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  }

  const childRef = useRef()
  const [antdForm] = Form.useForm()
  const [tableDetail, setTableDetail] = useState({
    businessCounterpart: '',
    tax: '',
    registerSource: 1,
  })
  // 当前上传文件
  const [currentUploadFile, setCurrentUploadFile] = useState({})
  // 当前上传状态
  const [currentUploadStatus, setCurrentUploadStatus] = useState({})
  // 所有上传状态
  const [uploadStatusInfo, setUploadStatusInfo] = useState({})
  const [disabledEdit, setDisabledEdit] = useState(true)
  const [verificationImage, setVerificationImage] = useState(false)

  useEffect(() => {
    if (props.type === 'add') {
      setDisabledEdit(false)
    } else {
      const { identityStart, identityEnd, businessStart, businessEnd } = props.tableDetail
      setTableDetail({
        ...props.tableDetail,
        identityStart: strConvertDate(identityStart),
        identityEnd: strConvertDate(identityEnd),
        businessStart: strConvertDate(businessStart),
        businessEnd: strConvertDate(businessEnd),
      })
      setDisabledEdit(true)
    }
  }, [props.tableDetail])

  useEffect(() => {
    const { businessLicense, consignorLicenses, consignorLicense } = tableDetail
    if (businessLicense && consignorLicenses && consignorLicense) {
      setVerificationImage(true)
    } else {
      setVerificationImage(false)
    }
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
      case 'identityStart':
        compareDate(allFields, 'identityStart', 'identityEnd', 'start')
        break
      case 'identityEnd':
        compareDate(allFields, 'identityStart', 'identityEnd', 'end')
        break
      case 'businessStart':
        compareDate(allFields, 'businessStart', 'businessEnd', 'start')
        break
      case 'businessEnd':
        compareDate(allFields, 'businessStart', 'businessEnd', 'end')
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

  // 打开地图dialog组件
  const openAmapDistrice = () => {
    props.actions.setAddressMapDialogStatus(true)
  }

  // 获取地图组件的值
  const getMapInfo = (mapInfo) => {
    if (mapInfo.latItude !== tableDetail.latItude || mapInfo.longItude !== tableDetail.longItude) {
      childRef.current.onFormChange()
    }
    setTableDetail({ ...tableDetail, ...mapInfo })
  }

  // 图片上传Add回调函数
  const uploadCallbackAdd = (imageKey, imageUrl) => {
    let fileInfo = {}
    fileInfo[imageKey] = imageUrl
    setCurrentUploadFile(fileInfo)
  }

  // 图片上传Edit回调函数
  const uploadCallbackEdit = (imageKey, imageUrl) => {
    const confirmParams = {
      consignorId: props.tableDetail.consignorId,
      keyValue: imageUrl, // 图片路径值
      keyUrl: imageKey, // 图片键值
    }
    return new Promise((resolve) => {
      apiUpdateConsignorImage(confirmParams).then((res) => {
        if (res.code === 0) {
          uploadCallbackAdd(imageKey, imageUrl)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
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
    const { identityStart, identityEnd, businessStart, businessEnd } = props.tableDetail
    const { businessLicense, consignorLicense, consignorLicenses } = tableDetail
    setTableDetail({
      ...props.tableDetail,
      businessLicense: businessLicense,
      consignorLicense: consignorLicense,
      consignorLicenses: consignorLicenses,
      identityStart: strConvertDate(identityStart),
      identityEnd: strConvertDate(identityEnd),
      businessStart: strConvertDate(businessStart),
      businessEnd: strConvertDate(businessEnd),
    })
  }

  // 关闭对话框
  const handleClose = () => {
    setTableDetail({
      identityEnd: '',
      businessEnd: '',
      registerSource: 1,
    }) //数据重置
    setDisabledEdit(true)
    antdForm.resetFields() // 表单重置
    props.actions.setConsignorDetailDialogStatus(false)
  }

  return (
    <Modal
      // 认证状态:1认证中/2认证成功/3认证失败
      cancelText='取消'
      destroyOnClose
      keyboard={false}
      footer={
        <ModalFooter
          antdForm={antdForm}
          cRef={childRef}
          disabledEdit={disabledEdit}
          getTableData={props.getTableData}
          handleClose={handleClose}
          httpKey={{
            add: apiAddConsignorInfo,
            edit: apiUpdateConsignorInfo,
            refuse: apiRefuseConsignorInfo,
          }}
          idKey={'consignorId'}
          openEdit={openEdit}
          reasonKey={'refuse'}
          resetInfo={resetInfo}
          status={tableDetail.consignorAuthenticationStatus}
          tableDetail={tableDetail}
          type={props.type}
          uploadStatusInfo={uploadStatusInfo}
          verificationImage={verificationImage}
        />
      }
      onCancel={handleClose}
      title={props.type === 'edit' ? '查看/修改' : '新增'}
      visible={props.consignorDetailDialogStatus}
      width={1000}
    >
      <div className='consignor-detail-dialog-wrap'>
        <div className='form-title'>
          <div className='form-title-content'>货主证件</div>
        </div>
        <div className='upload-image-wrap'>
          <JwUpload
            fileKey={'consignorLicense'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.consignorLicense}
            style={{ width: 450, height: 253 }}
            title={'身份证(正面)'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
          <JwUpload
            className='jw-upload-wrap'
            fileKey={'consignorLicenses'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.consignorLicenses}
            style={{ width: 450, height: 253 }}
            title={'身份证(背面)'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
          <JwUpload
            fileKey={'businessLicense'}
            getUploadStatus={getUploadStatus}
            handleType={props.type}
            initFileUrl={tableDetail.businessLicense}
            style={{ width: 450, height: 253 }}
            title={'营业执照'}
            uploadCallbackAdd={uploadCallbackAdd}
            uploadCallbackEdit={uploadCallbackEdit}
          />
        </div>
        <div className='form-title'>
          <div className='form-title-content'>货主信息</div>
          {props.type === 'edit' ? (
            <div
              className={
                props.tableDetail.consignorAuthenticationStatus === 2
                  ? 'authentication-success-status'
                  : 'authentication-error-status'
              }
            >
              {tableDetail.sourceName} | {tableDetail.consignorAuthenticationName}
            </div>
          ) : null}
        </div>
        <div className='consignor-info-wrap' id='consignor-info-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} name='form1' onValuesChange={onValuesChange}>
            <Form.Item
              colon={false}
              label='企业简称'
              name='shortCompanyName'
              rules={consignorDetailRules.shortCompanyName}
              validateFirst
            >
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item colon={false} label='用户类型' name='registerSource'>
              <Radio.Group disabled={disabledEdit}>
                <Radio value={1}>合伙人</Radio>
                <Radio value={4}>货主</Radio>
                <Radio value={3}>集运站</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item colon={false} label='联系人' name='contact' rules={consignorDetailRules.contact} validateFirst>
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item colon={false} label='社会信用代码' name='socialCode' rules={consignorDetailRules.socialCode}>
              <Input disabled={disabledEdit} />
            </Form.Item>

            <Form.Item colon={false} label='联系方式' name='contactTel' rules={consignorDetailRules.contactTel}>
              <Input disabled={props.type === 'edit' || disabledEdit} />
            </Form.Item>
            <Form.Item colon={false} label='营业期限'>
              <Form.Item name='businessStart' noStyle>
                <DatePicker
                  allowClear={false}
                  disabled={disabledEdit}
                  inputReadOnly
                  getPopupContainer={() => document.getElementById('consignor-info-wrap')}
                />
              </Form.Item>
              <span className='placeholder-span'>&nbsp;-&nbsp;</span>
              <JwDatePicker
                disabledEdit={disabledEdit}
                formKey={'businessEnd'}
                modalFooterRef={childRef}
                setTableDetail={setTableDetail}
                tableDetail={tableDetail}
                getPopupContainer={'consignor-info-wrap'}
              />
            </Form.Item>

            <Form.Item colon={false} label='详细地址' name='address' rules={consignorDetailRules.address}>
              <Input disabled={disabledEdit} onClick={openAmapDistrice} />
            </Form.Item>
            <Form.Item
              colon={false}
              label='法人身份证号码'
              name='consignorCode'
              rules={consignorDetailRules.consignorCode}
            >
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item
              colon={false}
              label='业务对接人'
              name='businessCounterpart'
              rules={consignorDetailRules.businessCounterpart}
            >
              <Input disabled={disabledEdit} />
            </Form.Item>
            <Form.Item colon={false} label='身份证有效期限'>
              <Form.Item name='identityStart' noStyle>
                <DatePicker
                  allowClear={false}
                  disabled={disabledEdit}
                  inputReadOnly
                  getPopupContainer={() => document.getElementById('consignor-info-wrap')}
                />
              </Form.Item>
              <span className='placeholder-span'>&nbsp;-&nbsp;</span>
              <JwDatePicker
                disabledEdit={disabledEdit}
                formKey={'identityEnd'}
                modalFooterRef={childRef}
                setTableDetail={setTableDetail}
                tableDetail={tableDetail}
                getPopupContainer={'consignor-info-wrap'}
              />
            </Form.Item>
            <Form.Item colon={false} label='服务费率' name='tax' rules={consignorDetailRules.tax}>
              <Input disabled={disabledEdit} suffix='%' />
            </Form.Item>
            <Form.Item colon={false} label='备注' name='refuseExplain' rules={consignorDetailRules.refuseExplain}>
              <Input disabled={disabledEdit} />
            </Form.Item>
          </Form>
        </div>
      </div>
      {MAP_TYPE === 'AMap' ? (
        <AmapDistrict
          address={tableDetail.address}
          city={tableDetail.city}
          county={tableDetail.county}
          getMapInfo={getMapInfo}
          latItude={tableDetail.latItude}
          longItude={tableDetail.longItude}
          province={tableDetail.province}
        />
      ) : (
        <TmapDistrict
          address={tableDetail.address}
          city={tableDetail.city}
          county={tableDetail.county}
          getMapInfo={getMapInfo}
          latItude={tableDetail.latItude}
          longItude={tableDetail.longItude}
          province={tableDetail.province}
        />
      )}
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    consignorDetailDialogStatus: state.consignorDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ConsignorDetail)
