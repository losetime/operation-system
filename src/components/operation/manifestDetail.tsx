import React, { FC, useState, useEffect, Fragment, ReactElement } from 'react'
import { apiGetManifestDetail } from '@/service/api/operation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import '@/style/operation/manifest.less'
import { Form, Input, Radio, Select, Button, Space } from 'antd'
import IconFont from '@/middleware/iconfont'
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { ManifestDetailInterface, MapInfoInterface } from '@/types/operation'
import { useHistory } from 'react-router-dom'
import AuthButton from '@/components/common/authButton'
import AmpDistrict from '@/components/common/amapDistrict'
import TmpDistrict from '@/components/common/tmapDistrict'
import { MAP_TYPE } from '@/enums/pluginEnum'
interface IProps {
  match: any
  actions: any
}

const ManifestDetail: FC<IProps> = ({ match, actions }): ReactElement => {
  const history = useHistory()
  const { Option } = Select
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  }
  const formRules = {
    rules: [{ required: true }],
  }

  const detailId = match.params.id
  const [antdForm1] = Form.useForm()
  const [antdForm2] = Form.useForm()
  const [antdForm3] = Form.useForm()
  const [tableDetail, setTableDetail] = useState<ManifestDetailInterface | any>({})
  const [mapInfo, setmapInfo] = useState<MapInfoInterface | any>({})

  useEffect(() => {
    apiGetManifestDetail({ deliveryId: detailId }).then((res) => {
      if (res.code === 0) {
        setTableDetail({
          ...res.data,
          allowLossT: Number(res.data.allowLoss) / 1000,
        })
      }
    })
  }, [])

  useEffect(() => {
    antdForm1.setFieldsValue({ ...tableDetail.pack })
    antdForm2.setFieldsValue({ ...tableDetail.unload })
    antdForm3.setFieldsValue({ ...tableDetail })
  }, [tableDetail])

  const openMap = (type: string): void => {
    if (type === 'pack') {
      setmapInfo({ ...tableDetail.pack, allowRange: tableDetail.allowRange })
    } else {
      setmapInfo({ ...tableDetail.unload })
    }
    actions.setAddressMapDialogStatus(true)
  }

  const goBack = (): void => {
    history.push('/home/manifest')
  }

  const goFreightRules = (): void => {
    history.push(`/home/manifest/freightRules/${detailId}`)
  }

  const goWaybillList = (): void => {
    history.push(`/home/manifest/waybill/${detailId}`)
  }

  const goAgreement = (): void => {
    history.push(`/home/manifest/manifestAgreement/${detailId}`)
  }

  return (
    <Fragment>
      <div className='manifest-detail-wrapper'>
        <div className='manifest-detail-nav'>
          <Button onClick={goBack} style={{ fontSize: '18px' }} type='text'>
            <ArrowLeftOutlined />
            <span>????????????</span>
          </Button>
        </div>
        <div className='manifest-detail-content'>
          <div className='manifest-handle'>
            <Select disabled style={{ width: 120 }} value={tableDetail.isRelease}>
              <Option value={1}>??????</Option>
              <Option value={2}>??????</Option>
            </Select>
          </div>
          <div className='form-title'>
            <span className='sub-title'>????????????</span>
            <span className='info-status'>
              {tableDetail.deliverySn} | {tableDetail.dataSource}
            </span>
          </div>
          <div className='manifest-address-wrap'>
            <Form {...layout} colon={false} form={antdForm1} name='form1'>
              <Form.Item label='??????????????????' name='company' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                extra={`????????????????????????????????????????????????${tableDetail.allowRange ? tableDetail.allowRange : '-'}?????????`}
                label='????????????'
                name='address'
                {...formRules}
              >
                <Input
                  onClick={() => {
                    openMap('pack')
                  }}
                  suffix={<IconFont style={{ fontSize: '18px' }} type='icon-dingwei' />}
                />
              </Form.Item>
              <Form.Item label='???????????????' name='contact' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='??????????????????' name='contactTel' {...formRules}>
                <Input disabled />
              </Form.Item>
            </Form>
            <Form {...layout} colon={false} form={antdForm2} name='form2'>
              <Form.Item label='??????????????????' name='company' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item extra={tableDetail.deliveryDistance} label='????????????' name='address' {...formRules}>
                <Input
                  onClick={() => {
                    openMap('unload')
                  }}
                  suffix={<IconFont style={{ fontSize: '18px' }} type='icon-dingwei' />}
                />
              </Form.Item>
              <Form.Item label='???????????????' name='contact' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='??????????????????' name='contactTel' {...formRules}>
                <Input disabled />
              </Form.Item>
            </Form>
          </div>

          <div className='form-title'>
            <span className='sub-title'>????????????</span>
          </div>
          <div className='manifest-info-wrap'>
            <Form {...layout} colon={false} form={antdForm3} name='form3'>
              <Form.Item label='???????????????' name='customerName'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='????????????(???)' name='freightCost' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='????????????' name='cargoTypeName' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='????????????(???/kg)' {...formRules}>
                <Form.Item name='allowLossT' noStyle>
                  <Input disabled style={{ width: 100 }} />
                </Form.Item>
                <span>&nbsp;???&nbsp;=&nbsp;</span>
                <Form.Item name='allowLoss' noStyle>
                  <Input disabled style={{ width: 100 }} />
                </Form.Item>
                <span>&nbsp;kg</span>
              </Form.Item>
              <Form.Item label='????????????' name='goodsName'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='????????????(???)' name='lossCost' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='???????????????' name='totalWeight' {...formRules}>
                <Input disabled />
              </Form.Item>
              <Form.Item label='????????????(???)' name='miscellaneousExpenses'>
                <Input disabled />
              </Form.Item>
              <Form.Item label='??????????????????' name='freightType' {...formRules}>
                <Radio.Group disabled>
                  <Radio value={1}>??????????????????</Radio>
                  <Radio value={2}>????????????????????????</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='????????????' name='deliveryExplain'>
                <Input disabled />
              </Form.Item>
            </Form>
          </div>
          <div className='title-nav-wrap'>
            <p>
              ????????????
              <Button onClick={goFreightRules} type='link'>
                <span>??????</span>
                <RightOutlined />
              </Button>
            </p>
          </div>
          <span className='title-agreement'>
            ???????????????????????????????????????????????????????????????
            <Button type='link' onClick={goAgreement}>
              ?????????????????????????????????????????????
            </Button>
            ????????????????????????????????????????????????????????????????????????????????????
          </span>
          <div className='title-nav-wrap'>
            <p>
              ????????????
              <AuthButton authKey='delivery_transport_list' onClick={goWaybillList} type='link'>
                <Space>
                  <span>??????</span>
                  <RightOutlined />
                </Space>
              </AuthButton>
            </p>
          </div>
        </div>
      </div>
      {String(MAP_TYPE) === 'AMap' ? (
        <AmpDistrict
          address={mapInfo.address}
          allowRange={mapInfo.allowRange}
          city={mapInfo.city}
          county={mapInfo.county}
          isEdit={false}
          latItude={mapInfo.latItude}
          longItude={mapInfo.longItude}
          province={mapInfo.province}
        />
      ) : (
        <TmpDistrict
          address={mapInfo.address}
          allowRange={mapInfo.allowRange}
          city={mapInfo.city}
          county={mapInfo.county}
          isEdit={false}
          latItude={mapInfo.latItude}
          longItude={mapInfo.longItude}
          province={mapInfo.province}
        />
      )}
    </Fragment>
  )
}

const mapStateProps = (state: any) => {
  return {
    detailDialogStatus: state.manifestDetailDialogStatus,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(ManifestDetail)
