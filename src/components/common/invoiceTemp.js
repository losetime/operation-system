import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import '@/style/common/invoiceTemp.less'
import { CloseCircleOutlined } from '@ant-design/icons'
import { invoiceTemplateHead } from '@/utils/tableHead'
import { convertCurrency } from '@/utils/base'

const InvoiceTemp = (props) => {
  const [invoiceData, setInvoiceData] = useState({})

  useEffect(() => {
    if (props.invoiceData) {
      setInvoiceData(props.invoiceData)
    }
  }, [props.invoiceData])

  return (
    <div className='invoice-template-wrapper'>
      <div className='invoice-content-wrap'>
        <div className='content-purchases-unit-wrap'>
          <div className='purchases-unit-title'>购货单位</div>
          <div className='purchases-unit-info'>
            <p>
              <span>名&emsp;&emsp;&emsp;&emsp;称：</span>
              <span>{invoiceData.invoiceTitle}</span>
            </p>
            <p>
              <span>纳税人识别号：</span>
              <span>{invoiceData.invoiceConsignorCode}</span>
            </p>
            <p>
              <span>地址、&emsp;电话：</span>
              <span
                className={
                  invoiceData.invoiceAddress && invoiceData.invoiceAddress.length > 20
                    ? 'address-mini'
                    : 'address-normal'
                }
              >
                {invoiceData.invoiceAddress} {invoiceData.invoiceMobile}
              </span>
            </p>
            <p>
              <span>开户行及账号：</span>
              <span>
                {invoiceData.invoiceBankName} {invoiceData.invoiceBankNumber}
              </span>
            </p>
          </div>
          <div className='purchases-password-wrap'>
            <div className='password-title'>密码区</div>
            <div className='password-text'>{props.showTotal ? null : <span>预览页面</span>}</div>
          </div>
        </div>
        {invoiceData.goodsInfo && invoiceData.goodsInfo.length > 8 ? (
          <div className='table-header-wrap'>
            <div className='table-header-item'>
              <p className='header-one'>货物或应税劳务名称</p>
              <p className='header-specification'>规格型号</p>
              <p className='header-unit'>单位</p>
              <p className='header-two'>数量</p>
              <p className='header-two'>单价(不含税)</p>
              <p className='header-two'>金额(不含税)</p>
              <p className='header-two'>税率</p>
              <p className='header-two'>税额</p>
            </div>
            <div className='table-header-item'>
              <p className='header-one'>*详情见清单*</p>
              <p className='header-specification'></p>
              <p className='header-unit'>吨</p>
              <p className='header-two'>{invoiceData.goodsDetail.countNum}</p>
              <p className='header-two'>{invoiceData.goodsDetail.price}</p>
              <p className='header-two'>{invoiceData.goodsDetail.countAmount}</p>
              <p className='header-two'>{invoiceData.goodsDetail.tax}</p>
              <p className='header-two'>{invoiceData.goodsDetail.taxAmount}</p>
            </div>
          </div>
        ) : (
          <div className='invocie-temp-table-wrap'>
            <Table
              columns={invoiceTemplateHead()}
              dataSource={invoiceData.goodsInfo}
              pagination={false}
              rowKey={(record) => record.goodsId}
              size='small'
            />
          </div>
        )}
        <div className='total-wrap'>
          <div className='total-title'>合计</div>
          <div className='total-content-wrap'>
            {props.showTotal ? (
              <>
                <div className='amount-wrap'>金额：￥ {invoiceData.realInvoiceAmount}</div>
                <div className='tax-wrap'>税额：￥ {invoiceData.realInvoiceTaxAmount}</div>
              </>
            ) : null}
          </div>
        </div>
        <div className='price-tax-total-wrap'>
          <div className='price-tax-total-title'>价税合计(大写)</div>
          <div className='price-tax-content-wrap'>
            {props.showTotal ? (
              <>
                <div className='amount-wrap'>
                  <CloseCircleOutlined /> {convertCurrency(invoiceData.realInvoiceCountAmount)}
                </div>
                <div className='lower-case-wrap'>小写：￥ {invoiceData.realInvoiceCountAmount}</div>
              </>
            ) : null}
          </div>
        </div>
        <div className='content-purchases-unit-wrap'>
          <div className='purchases-unit-title'>销货单位</div>
          <div className='purchases-unit-info'>
            <p>
              <span>名&emsp;&emsp;&emsp;&emsp;称：</span>
              <span>{invoiceData.saleTitle}</span>
            </p>
            <p>
              <span>纳税人识别号：</span>
              <span>{invoiceData.saleConsignorCode}</span>
            </p>
            <p>
              <span>地址、&emsp;电话：</span>
              <span
                className={
                  invoiceData.saleAddress && invoiceData.saleAddress.length > 20 ? 'address-mini' : 'address-normal'
                }
              >
                {invoiceData.saleAddress} {invoiceData.saleMobile}
              </span>
            </p>
            <p>
              <span>开户行及账号：</span>
              <span>
                {invoiceData.saleBankName} {invoiceData.saleBankNumber}
              </span>
            </p>
          </div>
          <div className='remark-wrap'>
            <div className='remark-title'>备注</div>
            <div className='remark-text'>
              <p>装货企业：{invoiceData.startLocal}</p>
              <p>卸货企业：{invoiceData.endLocal}</p>
              <p>运距：{invoiceData.distance}</p>
              <p>货物信息：{invoiceData.goodsName}</p>
              <p>车辆信息：{invoiceData.carInfo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTemp
