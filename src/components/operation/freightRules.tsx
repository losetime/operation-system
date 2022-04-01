import React, { FC, useState, useEffect, Fragment, ReactElement } from 'react'
import { apiGetManifestDetail } from '@/service/api/operation'
import '@/style/operation/manifest.less'
import { Form, Input, Radio, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { ManifestDetailInterface } from '@/types/operation'
import { useHistory } from 'react-router-dom'

export interface IProps {
  match: any
  actions: any
}

const FreightRules: FC<IProps> = (props): ReactElement => {
  const history = useHistory()

  const detailId = props.match.params.id
  const [antdForm1] = Form.useForm()
  const [antdForm2] = Form.useForm()
  const [antdForm3] = Form.useForm()
  const [tableDetail, setTableDetail] = useState<ManifestDetailInterface | any>({})

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

  const goBack = (): void => {
    history.push(`/home/manifest/detail/${detailId}`)
  }

  return (
    <Fragment>
      <div className='manifest-detail-wrapper'>
        <div className='manifest-detail-nav'>
          <Button onClick={goBack} style={{ fontSize: '18px' }} type='text'>
            <ArrowLeftOutlined />
            <span>运费规则</span>
          </Button>
        </div>
        <div className='manifest-detail-content'>
          <div className='freight-rules-content-wrap'>
            <div className='content-item'>
              <div className='item-wrap'>
                <div className='item-title settlement-title'>装/卸货结算净重的计算规则？</div>
                <div className='options-wrap'>
                  <span className='required-icon'>*</span>
                  <span>装货结算净重 = 装货净重 x </span>
                  <Input disabled value={tableDetail.packPercentage} />
                  <span>%</span>
                </div>
                <div className='options-wrap'>
                  <span className='required-icon'>*</span>
                  <span>卸货结算净重 = 卸货净重 x </span>
                  <Input disabled value={tableDetail.unloadPercentage} />
                  <span>%</span>
                </div>
              </div>
              <div className='item-wrap'>
                <div className='item-title'>
                  <span>* </span>
                  <span>计算运费的时候以哪个“结算净重”为主？</span>
                </div>
                <div className='options-wrap'>
                  <Radio.Group value={tableDetail.freightCalcRule}>
                    <Radio value={1}>对比“装货结算净重”和“卸货结算净重”两个吨位，以最小值为准</Radio>
                    <Radio value={2}>只用“装货结算净重”来计算运费</Radio>
                    <Radio value={3}>只用“卸货结算净重”来计算运费</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className='content-item'>
              <div className='item-wrap'>
                <div className='item-title'>
                  <span>* </span>
                  <span>运输过程中因货损产生的亏吨费用，是否从运费中扣除？</span>
                </div>
                <div className='options-wrap'>
                  <Radio.Group value={tableDetail.isDeductionLoss}>
                    <Radio value={1}>是，从运费中扣除</Radio>
                    <Radio value={2}>否，不考虑货损</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className='item-wrap'>
                <div className='item-title'>
                  <span>* </span>
                  <span>亏吨费用的计算方式</span>
                </div>
                <div className='options-wrap'>
                  <Radio.Group value={tableDetail.lossCalcRule}>
                    <Radio value={2}>{'亏吨费用 = {超出允许货损部分（吨）} x 亏吨单价'}</Radio>
                    <span className='radio-tip'>（只扣除超出允许范围的货损费用）</span>
                    <Radio value={1}>亏吨费用 = 实际货损（吨）x 亏吨单价</Radio>
                    <span className='radio-tip'>（无论实际货损是否在允许货损的范围内，都按实际货损扣除费用）</span>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className='content-item'>
              <div className='item-wrap'>
                <div className='item-title'>
                  <span>* </span>
                  <span>计算运费数值的展示规则</span>
                </div>
                <div className='item-subtitle'>（按规则计算规则得出的运费，并非付给司机的实际费用）</div>
                <div className='options-wrap'>
                  <Radio.Group value={tableDetail.freightIgnoreZeroRule}>
                    <Radio value={1}>{'数值保留两位小数（例：42.525 -> 42.52）'}</Radio>
                    <Radio value={2}>{'只保留整数位，小数位四舍五入（例：42.525 -> 43）'}</Radio>
                    <Radio value={3}>{'只保留整数位，小数位全舍（例：42.525 -> 42）'}</Radio>
                    <Radio value={4}>{'数值个位抹零（例：42.525 -> 40）'}</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className='item-wrap'>
                <div className='item-title'>
                  <span>* </span>
                  <span>实付运费数值的展示规则</span>
                </div>
                <div className='item-subtitle'>（实际付给司机的费用）</div>
                <div className='options-wrap'>
                  <Radio.Group value={tableDetail.realPayedFreightRule}>
                    <Radio value={1}>{'数值保留两位小数（例：42.525 -> 42.52）'}</Radio>
                    <Radio value={2}>{'只保留整数位，小数位四舍五入（例：42.525 -> 43）'}</Radio>
                    <Radio value={3}>{'只保留整数位，小数位全舍（例：42.525 -> 42）'}</Radio>
                    <Radio value={4}>{'数值个位抹零（例：42.525 -> 40）'}</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default FreightRules
