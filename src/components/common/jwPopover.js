import React from 'react'
import { Alert, Popover } from 'antd'

// 预警提示内容
const PopoverContent = (props) => {
  return (
    <>
      {props.warnMessage.map((val, index) => (
        <div className='popover-item' key={index}>
          <Alert message={val} showIcon type='error' />
        </div>
      ))}
    </>
  )
}

const JwPopover = ({ label, status, message, record, eventHandle, messageType, payErrorStatus, payErrorMessage }) => {
  return messageType === 2 ? (
    <div style={{ display: 'flex' }}>
      {payErrorStatus ? (
        <Popover content={<PopoverContent warnMessage={payErrorMessage} />} placement='topLeft'>
          <img
            alt=''
            src={require('@/assets/images/payErrorWarning.svg')}
            style={{ width: 15 + 'px', marginRight: 5 + 'px' }}
          />
        </Popover>
      ) : (
        <span
          style={{
            display: 'inline-block',
            width: 15 + 'px',
            marginRight: 5 + 'px',
          }}
        />
      )}
      {status ? (
        <Popover content={<PopoverContent warnMessage={message} />} placement='topLeft'>
          <img
            alt=''
            src={require('@/assets/images/warning.svg')}
            style={{ width: 15 + 'px', marginRight: 5 + 'px' }}
          />
        </Popover>
      ) : (
        <span
          style={{
            display: 'inline-block',
            width: 15 + 'px',
            marginRight: 5 + 'px',
          }}
        />
      )}
      <span
        onClick={(e) => {
          eventHandle(record, e)
        }}
        style={{ color: '#5178DF', cursor: 'pointer' }}
      >
        {label}
      </span>
    </div>
  ) : (
    <div>
      {status ? (
        <div style={{ display: 'flex' }}>
          <Popover content={<PopoverContent warnMessage={message} />} placement='topLeft'>
            <img
              alt=''
              src={require('@/assets/images/warning.svg')}
              style={{ width: 15 + 'px', marginRight: 5 + 'px' }}
            />
          </Popover>
          <span
            onClick={(e) => {
              eventHandle(record, e)
            }}
            style={{ color: '#5178DF', cursor: 'pointer' }}
          >
            {label}
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <span
            style={{
              display: 'inline-block',
              width: 15 + 'px',
              marginRight: 5 + 'px',
            }}
          />
          <span
            onClick={(e) => {
              eventHandle(record, e)
            }}
            style={{ color: '#5178DF', cursor: 'pointer' }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  )
  // return status ? (
  //   <div style={{ display: 'flex' }}>
  //     <Popover content={<PopoverContent warnMessage={message} />} placement='topLeft'>
  //       <img alt='' src={require('@/assets/images/warning.svg')} style={{ width: 15 + 'px', marginRight: 5 + 'px' }} />
  //     </Popover>
  //     <span
  //       onClick={(e) => {
  //         eventHandle(record, e)
  //       }}
  //       style={{ color: '#5178DF', cursor: 'pointer' }}
  //     >
  //       {label}
  //     </span>
  //   </div>
  // ) : (
  //   <div style={{ display: 'flex' }}>
  //     <span
  //       style={{
  //         display: 'inline-block',
  //         width: 15 + 'px',
  //         marginRight: 5 + 'px',
  //       }}
  //     />
  //     <span
  //       onClick={(e) => {
  //         eventHandle(record, e)
  //       }}
  //       style={{ color: '#5178DF', cursor: 'pointer' }}
  //     >
  //       {label}
  //     </span>
  //   </div>
  // )
}

export default JwPopover
