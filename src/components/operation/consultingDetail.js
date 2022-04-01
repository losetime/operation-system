import React, { useState, useEffect } from 'react'
import { apiAddConsultingInfo, apiModifyConsultingInfo } from '@/service/api/operation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/consulting.less'
import { Modal, Form, Input, DatePicker, message, Select, Radio, Button, Space } from 'antd'
import { phoneReg } from '@/enums/regEnum'
import moment from 'moment'
import AuthButton from '@/components/common/authButton'

const ConsultingDetail = (props) => {
  const { Option } = Select
  const [antdForm] = Form.useForm()
  const headLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  }
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }
  //咨询详情
  const [consultDetail, setConsultDetail] = useState({})
  //是否可编辑
  const [disabledEdit, setDisabledEdit] = useState(true)
  //记录人
  const [createName, setCreateName] = useState({})

  useEffect(() => {
    let tempConsultDetail = { ...props.tableDetail }
    if (Number(props.tableDetail.consultType) === 0) {
      tempConsultDetail.consultType = ''
    }
    setConsultDetail(paramsConversion(tempConsultDetail, 'date'))
  }, [props.tableDetail])

  useEffect(() => {
    antdForm.setFieldsValue(consultDetail) // 同步表单数据
  }, [consultDetail, antdForm])

  useEffect(() => {
    if (props.consultingDetailDialogStatus) {
      if (props.type === 'add') {
        setDisabledEdit(false)
      } else {
        setDisabledEdit(true)
      }
      // 初始化记录人
      setCreateName(props.userInfo.userName)
    }
  }, [props.consultingDetailDialogStatus])

  // 时间格式转换
  const paramsConversion = (obj, type) => {
    let reqParams = { ...obj }
    for (let key in reqParams) {
      if (key === 'recordTime') {
        if (type === 'string') {
          if (reqParams[key]) {
            reqParams[key] = reqParams[key].format('YYYY-MM-DD HH:mm:ss')
          }
        } else {
          if (reqParams[key]) {
            reqParams[key] = moment(reqParams[key], 'YYYY-MM-DD HH:mm:ss')
          }
        }
      }
    }
    return reqParams
  }

  //保存咨询记录
  const addHandle = () => {
    antdForm
      .validateFields()
      .then(() => {
        let tempConsultDetail = { ...consultDetail }
        if (tempConsultDetail.consultType === '') {
          tempConsultDetail.consultType = 0
        }
        apiAddConsultingInfo({
          ...tempConsultDetail,
          consultType: Number(tempConsultDetail.consultType),
        }).then((res) => {
          if (res.code === 0) {
            props.getTableData({ pageNum: 1, perPage: 20 })
            handleCancel('添加信息成功')
          }
        })
      })
      .catch(() => {
        message.warn('输入内容错误，请检查')
      })
  }

  //修改
  const openEdit = () => {
    setDisabledEdit(false)
  }

  //修改后保存按钮
  const ModifyEdit = () => {
    antdForm
      .validateFields()
      .then(() => {
        apiModifyConsultingInfo({
          ...consultDetail,
          consultType: Number(consultDetail.consultType),
        }).then((res) => {
          if (res.code === 0) {
            props.getTableData({ pageNum: 1, perPage: 20 })
            handleCancel('处理成功')
          }
        })
      })
      .catch(() => {
        message.warn('输入内容错误，请检查')
      })
  }

  const handleCancel = (msg) => {
    if (msg) message.success(msg)
    setConsultDetail({}) //数据重置
    antdForm.resetFields() // 表单重置
    props.actions.setConsultingDetailDialogStatus(false)
  }

  //监听表单状态
  const onValuesChange = (changedFields, allFields) => {
    setConsultDetail({ ...consultDetail, ...allFields })
  }

  //取消编辑
  const resetInfo = () => {
    antdForm.resetFields() // 表单重置
    let tempConsultDetail = { ...props.tableDetail }
    if (Number(props.tableDetail.consultType) === 0) {
      tempConsultDetail.consultType = ''
    }
    setConsultDetail(paramsConversion(tempConsultDetail, 'date'))
    setDisabledEdit(true)
  }

  return (
    <Modal
      cancelText='取消'
      destroyOnClose
      footer={null}
      forceRender
      getContainer={false}
      maskClosable={false}
      onCancel={() => {
        handleCancel()
      }}
      title={'咨询记录'}
      visible={props.consultingDetailDialogStatus}
      width={860}
    >
      <div className='consulting-detail-dialog-wrap'>
        {props.type === 'edit' ? (
          <div className='form-title-wrap'>{props.tableDetail.consultSn}</div>
        ) : (
          <div className='form-title-no-wrap' />
        )}
        <div className='form-header-wrap'>
          <Form
            {...headLayout}
            autoComplete='off'
            form={antdForm}
            initialValues={{ consultContract: '' }}
            name='form1'
            onValuesChange={onValuesChange}
          >
            <Form.Item
              colon={false}
              label='主题'
              name='consultTitle'
              rules={[
                {
                  required: true,
                },
                {
                  max: 200,
                  message: '最大字数不能超过200字',
                },
              ]}
              validateFirst
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 3 }}
                disabled={disabledEdit}
                placeholder='一句话描述咨询主题，字数≤200字'
              />
            </Form.Item>
            <Form.Item
              colon={false}
              label='详细描述'
              name='consultContract'
              rules={[
                {
                  max: 500,
                  message: '最大字数不能超过500字',
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 10, maxRows: 10 }}
                disabled={disabledEdit}
                placeholder='可详细记录事件过程，字数≤500字'
              />
            </Form.Item>
          </Form>
        </div>
        <div className='form-content-wrap'>
          <Form
            {...layout}
            autoComplete='off'
            form={antdForm}
            initialValues={{
              consultStatus: 2,
              recordName: '',
              consultType: '',
              recordMobile: '',
              createName: '',
              recordTime: '',
            }}
            name='form2'
            onValuesChange={onValuesChange}
          >
            <Form.Item
              colon={false}
              label='咨询者'
              name='recordName'
              rules={[
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
              <Input allowClear disabled={disabledEdit} placeholder='2-6个字符' />
            </Form.Item>
            <Form.Item colon={false} label='咨询类型' name='consultType'>
              <Select allowClear disabled={disabledEdit} placeholder='建议与意见'>
                {props.consultTypeOption
                  ? props.consultTypeOption.map((val) => <Option key={val.consultTypeId}>{val.consultTypeName}</Option>)
                  : []}
              </Select>
            </Form.Item>
            <Form.Item
              colon={false}
              label='咨询号码'
              name='recordMobile'
              rules={[
                {
                  pattern: phoneReg,
                  message: '手机号格式不正确',
                },
              ]}
            >
              <Input allowClear disabled={disabledEdit} placeholder='11位数字，且开头为1' />
            </Form.Item>
            <Form.Item colon={false} label='咨询状态' name='consultStatus'>
              <Radio.Group disabled={disabledEdit} value={2}>
                <Radio value={1}>完结</Radio>
                <Radio value={2}>待跟进</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item colon={false} label='记录人' name='createName'>
              <Input disabled placeholder={createName} />
            </Form.Item>
            <Form.Item colon={false} label='记录时间' name='recordTime'>
              <DatePicker
                allowClear
                disabled={disabledEdit}
                placeholder={moment().format('YYYY-MM-DD HH:mm:ss')}
                showTime
              />
            </Form.Item>
          </Form>
        </div>
        <div className='form-content-btn'>
          {props.type === 'add' ? (
            <AuthButton authKey='add' onClick={addHandle}>
              保存
            </AuthButton>
          ) : disabledEdit ? (
            <Button onClick={openEdit}>修改</Button>
          ) : (
            <Space size={20}>
              <Button onClick={resetInfo}>取消</Button>
              <AuthButton authKey='add' onClick={ModifyEdit}>
                保存
              </AuthButton>
            </Space>
          )}
        </div>
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    consultingDetailDialogStatus: state.consultingDetailDialogStatus,
    userInfo: state.userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ConsultingDetail)
