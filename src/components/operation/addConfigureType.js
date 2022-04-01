import React, { useState } from 'react'
import { apiAddConsultType, apiDelConsultType } from '@/service/api/operation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/consulting.less'
import { Modal, Form, Input, message, Button, Space } from 'antd'

const AddConfigureType = (props) => {
  const [antdForm] = Form.useForm()
  const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  }

  const [typeValue, setTypeValue] = useState({})

  //保存按钮事件
  const handleOk = () => {
    antdForm
      .validateFields()
      .then(() => {
        if (props.type === 'edit') {
          apiAddConsultType({ ...typeValue }).then((res) => {
            if (res.code === 0) {
              message.success('添加成功')
              props.getConsultType()
              antdForm.resetFields() // 表单重置
            }
          })
        }
      })
      .catch(() => {
        message.warn('输入内容错误，请检查')
      })
  }

  //监听表单状态
  const onValuesChange = (changedFields, allFields) => {
    setTypeValue({ ...typeValue, ...allFields })
  }

  //取消按钮事件
  const handleCancel = () => {
    antdForm.resetFields() // 表单重置
    props.actions.setConfigureTypeDetailDialogStatus(false)
  }

  const deleteType = (typeID) => {
    apiDelConsultType({ consultTypeId: typeID }).then((res) => {
      if (res.code === 0) {
        message.success('删除成功')
        props.getConsultType()
      }
    })
  }

  return (
    <Modal
      centered
      footer={null}
      okText={'保存'}
      onCancel={handleCancel}
      onOk={handleOk}
      title='配置类型'
      visible={props.configureTypeDetailDialogStatus}
      width={860}
    >
      <div className='configureType-detail-dialog-wrap'>
        <div className='configureType-title-wrap'>
          <Form {...layout} autoComplete='off' form={antdForm} name='form' onValuesChange={onValuesChange}>
            <Form.Item
              colon={false}
              label='新添加类型'
              name='consultTypeName'
              rules={[
                {
                  required: true,
                },
                {
                  min: 2,
                  message: '类型最少输入2个字符',
                },
                {
                  max: 6,
                  message: '类型最多输入6个字符',
                },
              ]}
            >
              <Input allowClear placeholder='写下新的类型枚举，操作保存即可' />
            </Form.Item>
          </Form>
        </div>
        <div className='configureType-content-wrap'>
          <div className='form-title-wrap'>
            <span className='form-title-text'>现有类型</span>
          </div>
          <div className='form-content-wrap'>
            {props.consultTypeOption
              ? props.consultTypeOption.map((val) => (
                  <div className='form-content-wrap-text' key={val.consultTypeId}>
                    <span className='form-content-title-text'>{val.consultTypeName}</span>
                    <Button
                      className='form-content-title-btn'
                      onClick={() => {
                        deleteType(val.consultTypeId)
                      }}
                      type='text'
                    >
                      删除字段
                    </Button>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className='configureType-footer-btn'>
          <Space size={20}>
            <Button onClick={handleCancel}>取消</Button>
            <Button onClick={handleOk} type='primary'>
              保存
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  )
}

const mapStateProps = (state) => {
  return {
    configureTypeDetailDialogStatus: state.configureTypeDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(AddConfigureType)
