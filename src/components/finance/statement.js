import React, { useState, useEffect, useRef } from 'react'
import { apiDownloadStatementInfo } from '@/service/api/finance'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '@/store/actions'
import { Button, Space, Table } from 'antd'
import '@/style/finance/confirmInvoiceInfo.less'
import PreviewInvoice from '@/components/finance/previewInvoice'
import StatementEdit from '@/components/finance/statementEdit'
import AuthButton from '@/components/common/authButton'
import bignumber from 'bignumber.js'

const Statement = (props) => {
  const [statementInfo, setStatementInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [waybillTotal, setWaybillTotal] = useState(0)
  const [settlementTotal, setSettlementTotal] = useState(0)
  const [taxTotal, setTaxTotal] = useState(0)
  const [manifestLength, setManifestLength] = useState(0)
  const invoiceTempRef = useRef()
  const statementEditRef = useRef()

  useEffect(() => {
    setStatementInfo(JSON.parse(JSON.stringify(props.statementInfo)))
  }, [props.statementInfo])

  useEffect(() => {
    if (statementInfo.manifest) {
      totalCalculate()
      constructData()
      setManifestLength(statementInfo.manifest.length)
    }
  }, [statementInfo, waybillTotal, settlementTotal, taxTotal])

  const totalCalculate = () => {
    let waybillCount = new bignumber(0)
    let settlement = new bignumber(0)
    let tax = new bignumber(0)
    statementInfo.manifest.forEach((item) => {
      waybillCount = waybillCount.plus(new bignumber(item.transportCount))
      settlement = settlement.plus(new bignumber(item.settlementQuantity))
      tax = tax.plus(new bignumber(item.totalTax))
    })
    setWaybillTotal(waybillCount.toFixed(0))
    setSettlementTotal(settlement.toFixed(2))
    setTaxTotal(tax.toFixed(2))
  }

  // 监听修改结算单按钮
  const onModifyStatementBtn = () => {
    statementEditRef.current.setModalVisible(true)
  }

  // 查看申请列表
  const checkInvoiceList = () => {
    props.actions.setApplyCountStatus(true)
  }

  // 下载结算单
  const downloadStatement = () => {
    apiDownloadStatementInfo({ invoiceId: props.invoiceId })
  }

  // 发票预览
  const previewInvoice = () => {
    invoiceTempRef.current.handleOpen(true)
  }

  const renderContent1 = (value, row, index) => {
    if (index === manifestLength + 1 || index === manifestLength + 2) {
      return {
        children: <span>{value}</span>,
        props: {
          colSpan: 0,
        },
      }
    } else {
      return <span>{value}</span>
    }
  }

  const renderContent2 = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    }
    if (index === manifestLength || index === manifestLength + 1 || index === manifestLength + 2) {
      obj.props.colSpan = 0
    }
    return obj
  }

  const columns = [
    {
      title: '装货企业',
      dataIndex: 'placeOfOrigin',
      align: 'center',
      render: (text, row, index) => {
        if (index === manifestLength) {
          return {
            children: <span>{text}</span>,
            props: {
              colSpan: 2,
            },
          }
        } else if (index === manifestLength + 1) {
          return {
            children: <span>{text}</span>,
            props: {
              colSpan: 2,
            },
          }
        } else if (index === manifestLength + 2) {
          return {
            children: (
              <div className='col-wrap'>
                <div className='item-wrap'>
                  <span>受托方：</span>
                  {text.client}
                </div>
                <div className='item-wrap'>
                  <span>确认签章：</span>
                  {text.confirmationSignature}
                </div>
                <div className='item-wrap'>
                  <span>日期：</span>
                  {text.confirmationDate}
                </div>
              </div>
            ),
            props: {
              colSpan: 5,
            },
          }
        } else {
          return <span>{text}</span>
        }
      },
      width: 200,
    },
    {
      title: '卸货企业',
      dataIndex: 'destination',
      align: 'center',
      render: renderContent2,
      width: 200,
    },
    {
      title: '运距(KM)',
      dataIndex: 'distance',
      align: 'center',
      render: (text, row, index) => {
        if (index === manifestLength) {
          return {
            children: <span>{text}</span>,
            props: {
              colSpan: 4,
            },
          }
        } else if (index === manifestLength + 1) {
          return {
            children: <span>{text}</span>,
            props: {
              colSpan: 8,
            },
          }
        } else if (index === manifestLength + 2) {
          return {
            children: <span>{text}</span>,
            props: {
              colSpan: 0,
            },
          }
        } else {
          return <span>{text}</span>
        }
      },
      width: 100,
    },
    {
      title: '品名',
      dataIndex: 'productName',
      align: 'center',
      render: renderContent2,
    },
    {
      title: '项目',
      dataIndex: 'project',
      align: 'center',
      render: renderContent2,
    },
    {
      title: '结算日期',
      dataIndex: 'period',
      align: 'center',
      render: (text, row, index) => {
        if (index === manifestLength || index === manifestLength + 1) {
          return {
            props: {
              colSpan: 0,
            },
          }
        } else if (index === manifestLength + 2) {
          return {
            children: (
              <div className='col-wrap'>
                <div className='item-wrap'>
                  <span>委托方：</span>
                  {text.client}
                </div>
                <div className='item-wrap'>
                  <span>确认签章：</span>
                  {text.confirmationSignature}
                </div>
                <div className='item-wrap'>
                  <span>日期：</span>
                  {text.confirmationDate}
                </div>
              </div>
            ),
            props: {
              colSpan: 5,
            },
          }
        } else {
          return <span>{text}</span>
        }
      },
      width: 220,
    },
    {
      title: '运单条数',
      dataIndex: 'transportCount',
      align: 'center',
      render: renderContent1,
      width: 120,
    },
    {
      title: '结算吨位',
      dataIndex: 'settlementQuantity',
      align: 'center',
      render: renderContent1,
      width: 120,
    },
    {
      title: '单价(元)',
      dataIndex: 'unitPrice',
      align: 'center',
      render: renderContent1,
      width: 120,
    },
    {
      title: '含税总价(元)',
      dataIndex: 'totalTax',
      align: 'center',
      render: renderContent1,
      width: 120,
    },
  ]

  // 构建表格数据
  const constructData = () => {
    let tableDataTemp = statementInfo.manifest.map((item, index) => {
      return {
        key: index,
        placeOfOrigin: item.placeOfOrigin,
        destination: item.destination,
        distance: item.distance,
        productName: item.productName,
        project: item.project,
        period: `${item.startTime} 至 ${item.endTime}`,
        transportCount: item.transportCount,
        settlementQuantity: item.settlementQuantity,
        unitPrice: item.unitPrice,
        totalTax: item.totalTax,
      }
    })

    tableDataTemp = [
      ...tableDataTemp,
      {
        key: tableDataTemp.length,
        placeOfOrigin: '合计',
        transportCount: waybillTotal,
        settlementQuantity: settlementTotal,
        unitPrice: '-',
        totalTax: taxTotal,
      },
      {
        key: tableDataTemp.length + 1,
        placeOfOrigin: '发票备注栏填写信息',
        distance: statementInfo.invoiceRemark,
      },
      {
        key: tableDataTemp.length + 2,
        placeOfOrigin: {
          client: statementInfo.carrier,
          confirmationSignature: '',
          confirmationDate: statementInfo.confirmationDate,
        },
        period: {
          client: statementInfo.client,
          confirmationSignature: statementInfo.confirmationSignature,
          confirmationDate: statementInfo.confirmationDate,
        },
      },
    ]

    setTableData(tableDataTemp)
  }

  return (
    <>
      <div className='statement-wrapper'>
        <div className='statistics-wrap'>
          <div className='statistics-text'>
            <span>已选择运单数量：{props.statisticsInfo.transportCount}；</span>
            <span>矿发吨数：{props.statisticsInfo.realMineSendWeight}；</span>
            <span>实收吨数：{props.statisticsInfo.realTransportWeight}；</span>
            <span>实付运费：{props.statisticsInfo.realPayAmount}；</span>
          </div>
          <div>
            <Button onClick={checkInvoiceList} shape='round'>
              查看运单详情
            </Button>
          </div>
        </div>
        <div className='table-wrapper'>
          <Table bordered columns={columns} dataSource={tableData} pagination={false} />
        </div>
        <div className='table-handle'>
          {props.getInvoiceStatus() ? (
            <Space>
              <Button onClick={onModifyStatementBtn} shape='round' type='primary'>
                修改
              </Button>
              <Button onClick={downloadStatement} shape='round' type='primary'>
                下载结算单
              </Button>
              <Button onClick={previewInvoice} shape='round' type='primary'>
                发票预览
              </Button>
            </Space>
          ) : (
            <Space>
              {props.getInvoiceStatus() ? (
                <AuthButton authKey='modify_statement' onClick={onModifyStatementBtn} shape='round' type='primary'>
                  修改
                </AuthButton>
              ) : null}
              <AuthButton authKey='download_statement' onClick={downloadStatement} shape='round' type='primary'>
                下载结算单
              </AuthButton>
              <AuthButton authKey='preview' onClick={previewInvoice} shape='round' type='primary'>
                发票预览
              </AuthButton>
            </Space>
          )}
        </div>
      </div>

      <StatementEdit
        cRef={statementEditRef}
        dataSource={statementInfo}
        invoiceId={props.invoiceId}
        reacquireData={props.reacquireData}
      />

      <PreviewInvoice
        cRef={invoiceTempRef}
        manifestList={statementInfo.manifest ? statementInfo.manifest : []}
        recordId={props.invoiceId}
      />
    </>
  )
}

const mapStateProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateProps, mapDispatchToProps)(Statement)
