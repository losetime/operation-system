import React, { useState, useEffect, useRef, useContext } from 'react'
import { Input, Form } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'

const EditableContext = React.createContext()

export const EditableRow = ({ ...props }) => {
  const [antdForm] = Form.useForm()
  return (
    <Form component={false} form={antdForm}>
      <EditableContext.Provider value={antdForm}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  activeMenu,
  operationAuth,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef()
  const antdForm = useContext(EditableContext)

  const [authDisabled, setAuthDisabled] = useState(false)

  useEffect(() => {
    if (operationAuth[activeMenu]) {
      if (operationAuth[activeMenu]['modify_invoice_number']) {
        setAuthDisabled(false)
      } else {
        setAuthDisabled(true)
      }
    } else {
      setAuthDisabled(false)
    }
  }, [operationAuth])

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    antdForm.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await antdForm.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item name={dataIndex} style={{ margin: 0 }}>
        <Input disabled={authDisabled} onBlur={save} onPressEnter={save} ref={inputRef} />
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const mapStateProps = (state) => {
  return {
    activeMenu: state.activeMenu,
    operationAuth: state.authInfo.operationAuth,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(EditableCell)
