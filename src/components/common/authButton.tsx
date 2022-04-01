import React, { FC, ReactElement, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'

interface IProps {
  children?: string | ReactElement
  className?: string
  style?: any
  type?: string | any
  shape?: string | any
  size?: string | any
  icon?: ReactElement
  authKey?: string
  disabled?: boolean
  activeMenu?: string | any
  operationAuth?: any
  loading?: boolean
  onClick?: () => void
}

const AuthButton: FC<IProps> = ({
  children,
  className,
  style,
  type,
  shape,
  size,
  icon,
  authKey,
  disabled,
  activeMenu,
  operationAuth,
  loading,
  onClick,
}): ReactElement => {
  const [authDisabled, setAuthDisabled] = useState(false)

  useEffect(() => {
    try {
      if (operationAuth[activeMenu][authKey as string]) {
        setAuthDisabled(false)
      } else {
        setAuthDisabled(true)
      }
    } catch (error) {
      setAuthDisabled(true)
      console.error('权限请求出错：', error)
    }
  }, [operationAuth])

  return (
    <Button
      className={className}
      disabled={authDisabled ? true : disabled ? true : false}
      icon={icon}
      loading={loading}
      onClick={onClick}
      shape={shape}
      size={size}
      style={style}
      type={type}
    >
      {children}
    </Button>
  )
}

const mapStateProps = (state: any) => {
  return {
    activeMenu: state.activeMenu,
    operationAuth: state.authInfo.operationAuth,
  }
}

export default connect(mapStateProps, null)(AuthButton)
