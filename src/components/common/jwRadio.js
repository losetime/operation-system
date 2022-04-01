import React, { useState, useEffect } from 'react'
import '@/style/common/jwRadio.less'
import IconFont from '@/middleware/iconfont'

const JwRadio = (props) => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(props.active)
  }, [props.active])

  const onRadioBtn = (value) => {
    if (props.isEdit !== false) {
      setActive(value)
      props.onChange(value)
    }
  }

  return props.options.map((val) => {
    return (
      <span
        className={
          active === val.value
            ? props.isEdit === false
              ? 'radio-btn-wrapper radio-btn-active_default'
              : 'radio-btn-wrapper radio-btn-active'
            : 'radio-btn-wrapper'
        }
        key={val.value}
        onClick={() => onRadioBtn(val.value)}
      >
        {val.label}
        {active === val.value ? (
          <i className='icon-font-wrap'>
            <IconFont
              style={{ fontSize: '20px' }}
              className={props.isEdit === false ? 'icon-font-disabled' : 'icon-font'}
              type='icon-duigou-011'
            />
          </i>
        ) : null}
      </span>
    )
  })
}

export default JwRadio
