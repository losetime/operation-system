import React, { FC, ReactElement, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Switch } from 'antd'

interface IProps {
  authKey: string
  disabled: boolean
  checked: boolean
  checkedChildren: string
  unCheckedChildren: string
  activeMenu: string | any
  operationAuth: any[]
  loading: boolean
  onChange: () => void
}

const AuthButton: FC<IProps> = ({
  authKey,
  disabled,
  checked,
  checkedChildren,
  unCheckedChildren,
  activeMenu,
  operationAuth,
  loading,
  onChange,
}): ReactElement => {
  const [authDisabled, setAuthDisabled] = useState(false)

  useEffect(() => {
    if (operationAuth[activeMenu]) {
      if (operationAuth[activeMenu][authKey]) {
        setAuthDisabled(false)
      } else {
        setAuthDisabled(true)
      }
    } else {
      setAuthDisabled(false)
    }
  }, [operationAuth])

  return (
    <Switch
      checked={checked}
      checkedChildren={checkedChildren}
      disabled={authDisabled || disabled}
      loading={loading}
      onChange={onChange}
      unCheckedChildren={unCheckedChildren}
    />
  )
}

const mapStateProps = (state: any) => {
  return {
    activeMenu: state.activeMenu,
    operationAuth: state.authInfo.operationAuth,
  }
}

export default connect(mapStateProps, null)(AuthButton)
