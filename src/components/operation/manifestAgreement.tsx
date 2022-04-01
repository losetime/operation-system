import React, { FC, useEffect, Fragment, ReactElement, useState } from 'react'
import { getManifestAgreement } from '@/service/api/operation'
import '@/style/operation/manifest.less'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

export interface IProps {
  match: any
  actions: any
}

const ManifestAgreement: FC<IProps> = (props): ReactElement => {
  const history = useHistory()

  const detailId = props.match.params.id
  const [agreementDetail, setAgreementDetail] = useState('')

  useEffect(() => {
    getManifestAgreement({ deliveryId: detailId }).then((res) => {
      if (res.code === 0) {
        const result = res.data
        setAgreementDetail(result)
      }
    })
  }, [])

  const goBack = (): void => {
    history.push(`/home/manifest/detail/${detailId}`)
  }

  return (
    <Fragment>
      <div className='manifest-agreement-wrapper'>
        <div className='manifest-agreement-nav'>
          <Button onClick={goBack} style={{ fontSize: '18px' }} type='text'>
            <ArrowLeftOutlined />
            <span>货当当平台货物托运服务协议</span>
          </Button>
        </div>
        <div className='manifest-agreement-content'>
          <div className='agreement-title'>
            <p>货当当平台货物托运服务协议</p>
          </div>
          <div className='agreement-content' dangerouslySetInnerHTML={{ __html: agreementDetail }} />
        </div>
      </div>
    </Fragment>
  )
}

export default ManifestAgreement
