import React from 'react'
import { Space, Button, Popover } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import JwPopover from '@/components/common/jwPopover'
import AuthButton from '@/components/common/authButton'
import AuthSwitch from '@/components/common/authSwitch'
const buttonStyle = { fontSize: '12px' }

// 运单表头
export const wallbilTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: <div style={{ margin: ' 0 0 0 40px' }}>运单编号</div>,
      dataIndex: 'transportSn',
      key: 'transportSn',
      fixed: 'left',
      width: 180,
      render: (text, record) => (
        <JwPopover
          eventHandle={checkTableDetail}
          label={record.transportSn}
          message={record.warnMessage}
          record={record}
          status={record.warnStatus}
          messageType={2}
          payErrorStatus={record.payErrorStatus}
          payErrorMessage={record.payErrorMessage}
        />
      ),
    },
    {
      title: '支付状态',
      key: 'tradeStatus',
      dataIndex: 'tradeStatusName',
      width: 120,
      sorter: true,
    },
    {
      title: '装货企业',
      key: 'packCompany',
      dataIndex: 'packCompany',
      width: 150,
    },
    {
      title: '卸货企业',
      key: 'unloadCompany',
      dataIndex: 'unloadCompany',
      width: 150,
    },
    {
      title: '行驶距离(KM)',
      key: 'deliveryDistance',
      dataIndex: 'deliveryDistance',
      width: 150,
      sorter: true,
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      width: 120,
      sorter: true,
    },
    {
      title: '司机姓名',
      key: 'driverName',
      dataIndex: 'driverName',
      width: 100,
    },
    {
      title: '联系方式',
      key: 'driverTel',
      dataIndex: 'driverTel',
      width: 120,
    },
    {
      title: '身份证号',
      key: 'driverIdentityNo',
      dataIndex: 'driverIdentityNo',
      width: 150,
    },
    {
      title: '运单状态',
      key: 'transportStatus',
      dataIndex: 'transportStatusName',
      width: 100,
      sorter: true,
    },
    {
      title: '运价(元/吨)',
      key: 'freightCost',
      dataIndex: 'freightCost',
      width: 120,
    },
    {
      title: '装货时间',
      key: 'upstreamLoadedAt',
      dataIndex: 'upstreamLoadedAt',
      width: 160,
      sorter: true,
    },
    {
      title: '装货净重(吨)',
      key: 'realMineSendWeight',
      dataIndex: 'realMineSendWeight',
      width: 150,
    },
    {
      title: '卸货时间',
      key: 'scanningTime',
      dataIndex: 'scanningTime',
      width: 160,
      sorter: true,
    },
    {
      title: '卸货净重',
      key: 'unloadingWeight',
      dataIndex: 'unloadingWeight',
      width: 150,
    },
    {
      title: '货损(吨)',
      key: 'lossWeight',
      dataIndex: 'lossWeight',
      width: 150,
      sorter: true,
    },
    {
      title: '允许货损(公斤/车)',
      key: 'allowLoss',
      dataIndex: 'allowLoss',
      width: 150,
    },
    {
      title: '亏吨单价(元)',
      key: 'lossCost',
      dataIndex: 'lossCost',
      width: 150,
    },
    {
      title: '应付运费(元)',
      key: 'shouldPayAmount',
      dataIndex: 'shouldPayAmount',
      width: 150,
    },
    {
      title: '亏吨扣款(元)',
      key: 'lossDecreaseAmount',
      dataIndex: 'lossDecreaseAmount',
      width: 150,
    },
    {
      title: '杂项(元)',
      key: 'miscellaneousExpenses',
      dataIndex: 'miscellaneousExpenses',
      width: 150,
    },
    {
      title: '油费金额(元)',
      key: 'oilFeeAmount',
      dataIndex: 'oilFeeAmount',
      width: 150,
    },
    {
      title: '计算运费(元)',
      key: 'realTransportFreight',
      dataIndex: 'realTransportFreight',
      width: 150,
    },
    {
      title: '运单创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 150,
      sorter: true,
    },
    {
      title: '运单创建人',
      key: 'createUserName',
      dataIndex: 'createUserName',
      width: 150,
    },
    {
      title: '支付单编号',
      key: 'cashStatementSn',
      dataIndex: 'cashStatementSn',
      width: 160,
    },
    {
      title: '商户订单号',
      key: 'orderSn',
      dataIndex: 'orderSn',
      width: 160,
    },
    {
      title: '支付单类型',
      key: 'payTypeName',
      dataIndex: 'payTypeName',
      width: 120,
    },
    {
      title: '发起支付时间',
      key: 'payedAt',
      dataIndex: 'payedAt',
      width: 150,
      sorter: true,
    },
    {
      title: '支付到账时间',
      key: 'finishedAt',
      dataIndex: 'finishedAt',
      width: 150,
    },
    {
      title: '开票状态',
      key: 'makeInvoiceStatusName',
      dataIndex: 'makeInvoiceStatusName',
      width: 100,
    },
    {
      title: '运单来源',
      key: 'dataSourceName',
      dataIndex: 'dataSourceName',
      width: 150,
    },
    {
      title: '运单创建企业',
      dataIndex: 'createCompany',
      key: 'createCompany',
      width: 150,
      sorter: true,
    },
    {
      title: '银行名称',
      key: 'bankName',
      dataIndex: 'bankName',
      width: 150,
    },
    {
      title: '银行卡号',
      key: 'bankCardNo',
      dataIndex: 'bankCardNo',
      width: 180,
    },
    {
      title: '银行持卡人',
      key: 'bankCardHolder',
      dataIndex: 'bankCardHolder',
      width: 150,
    },
    {
      title: '持卡人身份证号',
      key: 'cardHolderIdNo',
      dataIndex: 'cardHolderIdNo',
      width: 150,
    },
    {
      title: '实付运费',
      key: 'realPayAmount',
      dataIndex: 'realPayAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '省厅运单上传状态',
      key: 'upProvincialStatusName',
      dataIndex: 'upProvincialStatusName',
      width: 150,
    },
    {
      title: '绥德运单上传状态',
      key: 'upSuideStatusName',
      dataIndex: 'upSuideStatusName',
      width: 150,
    },
    {
      title: '省厅流水上传状态',
      key: 'provincialCapitalFlow',
      dataIndex: 'provincialCapitalFlow',
      width: 150,
    },
    {
      title: '绥德流水上传状态',
      key: 'suiDeCapitalFlow',
      dataIndex: 'suiDeCapitalFlow',
      width: 150,
    },
  ]
}

// 重新支付结果
export const payAgainResultHead = [
  {
    title: '运单编号',
    key: 'transportSn',
    dataIndex: 'transportSn',
    width: 160,
  },
  {
    title: '车牌号',
    key: 'vehicleNo',
    dataIndex: 'vehicleNo',
    width: 160,
  },
  {
    title: '司机姓名',
    key: 'driverName',
    dataIndex: 'driverName',
    width: 160,
  },
  {
    title: '司机手机',
    key: 'driverTel',
    dataIndex: 'driverTel',
    width: 160,
  },
  {
    title: '实付运费',
    key: 'realPayAmount',
    dataIndex: 'realPayAmount',
    width: 160,
  },
  {
    title: '支付结果',
    key: 'message',
    dataIndex: 'message',
  },
]

// 货单表头
export const manifestTableHead = (openFreightInvoiceDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '货单号',
      key: 'deliverySn',
      render: (text, record) => (
        <span
          onClick={() => {
            openFreightInvoiceDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.deliverySn}
        </span>
      ),
      fixed: 'left',
      width: 160,
    },
    {
      title: '装货企业',
      dataIndex: 'packCompany',
      key: 'packCompany',
      width: 120,
    },
    {
      title: '卸货企业',
      dataIndex: 'unloadCompany',
      key: 'unloadCompany',
      width: 120,
    },
    {
      title: '货单开放状态',
      key: 'isReleaseName',
      dataIndex: 'isReleaseName',
      width: 100,
    },
    {
      title: '货源创建企业',
      key: 'createUserName',
      dataIndex: 'createUserName',
      width: 120,
    },
    {
      title: '运费单价(元)',
      key: 'freightCost',
      dataIndex: 'freightCost',
      width: 120,
    },
    {
      title: '货物类型',
      key: 'cargoTypeName',
      dataIndex: 'cargoTypeName',
      width: 100,
    },
    {
      title: '货单创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 160,
    },
    {
      title: '总运单数',
      key: 'transportCount',
      dataIndex: 'transportCount',
      width: 100,
    },
    {
      title: '已支付运单数',
      key: 'payCount',
      dataIndex: 'payCount',
      width: 150,
    },
    {
      title: '已支付实付运费',
      key: 'payCountAmount',
      dataIndex: 'payCountAmount',
      width: 160,
    },
    {
      title: '已开票运单数',
      key: 'invoiceCount',
      dataIndex: 'invoiceCount',
      width: 160,
    },
    {
      title: '已开票实付运费',
      key: 'invoiceAmount',
      dataIndex: 'invoiceAmount',
      width: 160,
    },
  ]
}

// 货单详情的运单表头
export const waybillListTableHead = () => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '运单编号',
      dataIndex: 'transportSn',
      key: 'transportSn',
      fixed: 'left',
      width: 170,
    },
    {
      title: '支付状态',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      width: 120,
    },
    {
      title: '开票状态',
      key: 'makeInvoiceStatus',
      dataIndex: 'makeInvoiceStatus',
      width: 100,
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      width: 120,
    },
    {
      title: '司机姓名',
      key: 'driverName',
      dataIndex: 'driverName',
      width: 100,
    },
    {
      title: '联系方式',
      key: 'driverTel',
      dataIndex: 'driverTel',
      width: 120,
    },
    {
      title: '装货时间',
      key: 'upstreamLoadedAt',
      dataIndex: 'upstreamLoadedAt',
      width: 160,
    },
    {
      title: '装货净重(吨)',
      key: 'realMineSendWeight',
      dataIndex: 'realMineSendWeight',
      width: 150,
    },
    {
      title: '卸货时间',
      key: 'scanningTime',
      dataIndex: 'scanningTime',
      width: 160,
    },
    {
      title: '卸货净重',
      key: 'unloadingWeight',
      dataIndex: 'unloadingWeight',
      width: 150,
    },
    {
      title: '实付运费',
      key: 'realPayAmount',
      dataIndex: 'realPayAmount',
      width: 150,
    },
    {
      title: '运单创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 180,
    },
    {
      title: '支付到账时间',
      key: 'platformPayedAt',
      dataIndex: 'platformPayedAt',
      width: 180,
    },
  ]
}

// 车辆信息表头
export const vehicleTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: <div style={{ margin: ' 0 0 0 15px' }}>车牌号</div>,
      key: 'vehicleNo',
      fixed: 'left',
      render: (text, record) => (
        <JwPopover
          eventHandle={checkTableDetail}
          label={record.vehicleNo}
          message={record.warnMessage}
          record={record}
          status={record.warnStatus}
        />
      ),
      width: 120,
    },
    {
      title: '认证状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 100,
    },
    {
      title: '运输许可证号',
      dataIndex: 'transportLicenseNo',
      key: 'transportLicenseNo',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 210,
    },
    {
      title: '来源',
      key: 'source',
      dataIndex: 'source',
      width: 100,
    },
    {
      title: '审核时间',
      key: 'trailTime',
      dataIndex: 'trailTime',
      width: 150,
    },
    {
      title: '审核操作人',
      key: 'trailUser',
      dataIndex: 'trailUser',
      width: 100,
    },
    {
      title: 'ETC备案状态',
      key: 'vehicleRecordStatus',
      dataIndex: 'vehicleRecordStatus',
      width: 180,
    },
    {
      title: '备案时间',
      key: 'vehicleRecordTime',
      dataIndex: 'vehicleRecordTime',
      width: 150,
    },
    {
      title: '车牌类型',
      key: 'vehicleFicationName',
      dataIndex: 'vehicleFicationName',
      width: 120,
    },
    {
      title: '使用性质',
      key: 'natureOfUse',
      dataIndex: 'natureOfUse',
      width: 100,
    },
    {
      title: '车辆分类',
      key: 'vehicleTypeName',
      dataIndex: 'vehicleTypeName',
      width: 150,
    },
    {
      title: '车辆识别代号',
      key: 'vin',
      dataIndex: 'vin',
      width: 160,
    },
    {
      title: '整备质量(kg)',
      key: 'unladenMass',
      dataIndex: 'unladenMass',
      width: 90,
    },
    {
      title: '准牵引总重量(kg)',
      key: 'quasiTractiveMass',
      dataIndex: 'quasiTractiveMass',
      width: 120,
    },
    {
      title: '所有人',
      key: 'all',
      dataIndex: 'all',
      width: 250,
    },
    {
      title: '发证机关',
      key: 'issuingAuthority',
      dataIndex: 'issuingAuthority',
      width: 270,
    },
    {
      title: '注册日期',
      key: 'registrationDate',
      dataIndex: 'registrationDate',
      width: 120,
    },
    {
      title: '发证日期',
      key: 'dateOfIssue',
      dataIndex: 'dateOfIssue',
      width: 120,
    },
    {
      title: '有效期至',
      key: 'inspectionRecord',
      dataIndex: 'inspectionRecord',
      width: 120,
    },
    {
      title: '车牌颜色',
      key: 'vehicleColor',
      dataIndex: 'vehicleColor',
      width: 100,
    },
    {
      title: '车辆类型',
      key: 'vehicleEtcType',
      dataIndex: 'vehicleEtcType',
      width: 100,
    },
    {
      title: '省厅上传状态',
      key: 'upProvincialStatusName',
      dataIndex: 'upProvincialStatusName',
      width: 120,
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      width: 200,
    },
  ]
}

// 货主信息管理表头
export const consignorTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: <div style={{ margin: ' 0 0 0 15px' }}>企业简称</div>,
      key: 'shortCompanyName',
      fixed: 'left',
      render: (text, record) => (
        <JwPopover
          eventHandle={checkTableDetail}
          label={record.shortCompanyName}
          message={record.warnMessage}
          record={record}
          status={record.warnStatus}
        />
      ),
      width: 160,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'contactTel',
      key: 'contactTel',
      width: 150,
    },
    {
      title: '用户类型',
      key: 'role',
      dataIndex: 'role',
      width: 150,
    },
    {
      title: '服务费率(%)',
      key: 'tax',
      dataIndex: 'tax',
      width: 150,
    },
    {
      title: '运费余额(元)',
      key: 'remainingSum',
      dataIndex: 'remainingSum',
      width: 150,
    },
    {
      title: '服务费余额(元)',
      key: 'serviceBalance',
      dataIndex: 'serviceBalance',
      width: 150,
    },
    {
      title: '业务对接人',
      key: 'businessCounterpart',
      dataIndex: 'businessCounterpart',
      width: 150,
    },
    {
      title: '认证状态',
      key: 'consignorAuthenticationName',
      dataIndex: 'consignorAuthenticationName',
      width: 150,
    },
    {
      title: '来源',
      key: 'sourceName',
      dataIndex: 'sourceName',
      width: 200,
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 200,
    },
    {
      title: '审核时间',
      key: 'trailTime',
      dataIndex: 'trailTime',
      width: 200,
    },
    {
      title: '审核操作人',
      key: 'trailUser',
      dataIndex: 'trailUser',
      width: 200,
    },
    {
      title: '备注',
      key: 'refuseExplain',
      dataIndex: 'refuseExplain',
      width: 200,
    },
  ]
}

// 司机信息管理表头
export const driverTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: <div style={{ margin: ' 0 0 0 15px' }}>联系电话</div>,
      key: 'contactTel',
      fixed: 'left',
      render: (text, record) => (
        <JwPopover
          eventHandle={checkTableDetail}
          label={record.contactTel}
          message={record.warnMessage}
          record={record}
          status={record.warnStatus}
        />
      ),
      width: 160,
    },
    {
      title: '司机姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 100,
    },
    {
      title: '身份证号码',
      dataIndex: 'identityNo',
      key: 'identityNo',
      width: 150,
    },
    {
      title: '角色',
      key: 'RoleName',
      dataIndex: 'RoleName',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '来源',
      key: 'registerSourceName',
      dataIndex: 'registerSourceName',
      width: 150,
    },
    {
      title: '认证状态',
      key: 'transporterAuthenticationName',
      dataIndex: 'transporterAuthenticationName',
      width: 150,
    },
    {
      title: '审核时间',
      key: 'trailTime',
      dataIndex: 'trailTime',
      width: 200,
    },
    {
      title: '审核操作人',
      key: 'trailUser',
      dataIndex: 'trailUser',
      width: 200,
    },
    {
      title: '省厅上传状态',
      key: 'upProvincialStatusName',
      dataIndex: 'upProvincialStatusName',
      width: 200,
    },
    {
      title: '备注',
      key: 'refuseExplain',
      dataIndex: 'refuseExplain',
      width: 200,
    },
  ]
}

//充值
export const rechargeTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '交易单号',
      key: 'rechargeSn',
      fixed: 'left',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.rechargeSn}
        </span>
      ),
      width: 160,
    },
    {
      title: '企业简称',
      dataIndex: 'shortCompanyName',
      key: 'shortCompanyName',
      width: 100,
    },
    {
      title: '交易类型',
      dataIndex: 'rechargeType',
      key: 'rechargeType',
      width: 100,
    },
    {
      title: '收入金额(元)',
      dataIndex: 'incomeAmount',
      key: 'incomeAmount',
      width: 100,
    },
    {
      title: '支出金额(元)',
      dataIndex: 'expenditureAmount',
      key: 'expenditureAmount',
      width: 100,
    },
    {
      title: '运费余额(元)',
      dataIndex: 'freightBalance',
      key: 'freightBalance',
      width: 100,
    },
    {
      title: '服务费余额(元)',
      dataIndex: 'serviceBalance',
      key: 'serviceBalance',
      width: 100,
    },
    {
      title: '交易状态',
      dataIndex: 'rechargeStatusName',
      key: 'rechargeStatusName',
      width: 100,
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 140,
    },
    {
      title: '企业联系人',
      key: 'contact',
      dataIndex: 'contact',
      width: 90,
    },
    {
      title: '联系方式',
      key: 'contactTel',
      dataIndex: 'contactTel',
      width: 100,
    },
    {
      title: '来源',
      key: 'dataSourceName',
      dataIndex: 'dataSourceName',
      width: 80,
    },
    {
      title: '审核操作人',
      dataIndex: 'adminRealName',
      key: 'adminRealName',
      width: 90,
    },
    {
      title: '备注',
      key: 'failedExplain',
      render: (text, record) => (
        <span>
          {record.failedExplain.length > 10 ? record.failedExplain.substr(0, 10) + '...' : record.failedExplain}
        </span>
      ),
      width: 180,
    },
  ]
}

// 银行卡信息管理表头
export const bankCardTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '银行卡号',
      key: 'bankCardNo',
      fixed: 'left',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.bankCardNo}
        </span>
      ),
      width: 160,
    },
    {
      title: '开户银行',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 120,
    },
    {
      title: '持卡人姓名',
      dataIndex: 'bankCardHolder',
      key: 'bankCardHolder',
      width: 100,
    },
    {
      title: '持卡人身份证号',
      dataIndex: 'cardHolderIdNo',
      key: 'cardHolderIdNo',
      width: 150,
    },
    {
      title: '司机姓名',
      key: 'realName',
      dataIndex: 'realName',
      width: 100,
    },
    {
      title: '联系电话',
      key: 'contactTel',
      dataIndex: 'contactTel',
      width: 140,
    },
    {
      title: '操作时间',
      key: 'trailTime',
      dataIndex: 'trailTime',
      width: 150,
    },
    {
      title: '操作人',
      key: 'trailUser',
      dataIndex: 'trailUser',
      width: 150,
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      width: 200,
    },
  ]
}

// 托运合同管理表头
export const contractTableHead = (handleContract) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: <div style={{ margin: ' 0 0 0 15px' }}>合同号</div>,
      dataIndex: 'contractSn',
      fixed: 'left',
      render: (text, record) => (
        <JwPopover
          eventHandle={handleContract}
          label={record.contractSn}
          message={['合同即将到期，请及时处理']}
          record={record}
          status={record.earlyWarning === 2}
        />
      ),
      width: 160,
    },
    {
      title: '发起企业',
      dataIndex: 'creatCompany',
      key: 'creatCompany',
      width: 160,
    },
    {
      title: '甲方名称',
      dataIndex: 'createRealCompany',
      key: 'createRealCompany',
      width: 160,
    },
    {
      title: '合同状态',
      dataIndex: 'contractStatusName',
      key: 'contractStatusName',
      width: 160,
    },
    {
      title: '生效日期',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
    },
    {
      title: '有效期至',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
    },
    {
      title: '绥德上传状态',
      key: 'upSuideStatusName',
      dataIndex: 'upSuideStatusName',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (text, record) => (
        <>
          {record.contractStatus === 1 ? (
            <Button
              onClick={(e) => {
                handleContract(record, e)
              }}
              style={{ padding: '0' }}
              type='link'
            >
              处理
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                handleContract(record, e)
              }}
              style={{ padding: '0' }}
              type='link'
            >
              查看
            </Button>
          )}
        </>
      ),
      width: 100,
    },
  ]
}

// 开票信息管理
export const invoicingHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '纳税人识别号',
      key: 'invoiceConsignorCode',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.invoiceConsignorCode}
        </span>
      ),
      width: 160,
    },
    {
      title: '发票抬头',
      dataIndex: 'invoiceTitle',
      key: 'invoiceTitle',
      width: 160,
    },
    {
      title: '开户银行账号',
      dataIndex: 'invoiceBankNumber',
      key: 'invoiceBankNumber',
      width: 160,
    },
    {
      title: '开户银行',
      dataIndex: 'invoiceBankName',
      key: 'invoiceBankName',
      width: 160,
    },
    {
      title: '企业电话',
      dataIndex: 'invoiceMobile',
      key: 'invoiceMobile',
      width: 160,
    },
    {
      title: '企业地址',
      dataIndex: 'invoiceAddress',
      key: 'invoiceAddress',
      width: 160,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 160,
    },
    {
      title: '审核时间',
      dataIndex: 'reviewAt',
      key: 'reviewAt',
      width: 160,
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 160,
    },
  ]
}

// 货主开票审批
export const invoiceApprovalHead = (checkInvoiceList, confirmInvoiceInfo, cancelInvoiceApply) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
      fixed: 'left',
      width: 120,
    },
    {
      title: '申请条数',
      key: 'numberOfApplications',
      dataIndex: 'numberOfApplications',
      render: (text, record) => (
        <Button
          onClick={() => {
            checkInvoiceList(record)
          }}
          style={buttonStyle}
          type='link'
        >
          {record.numberOfApplications}
        </Button>
      ),
      width: 80,
    },
    {
      title: '开票状态',
      dataIndex: 'billingStatus',
      key: 'billingStatus',
      width: 100,
    },
    {
      title: '开票企业',
      dataIndex: 'invoiceTitle',
      key: 'invoiceTitle',
      width: 150,
    },
    {
      title: '结算日期',
      dataIndex: 'startToEndTime',
      key: 'startToEndTime',
      width: 180,
    },
    {
      title: '服务费率(%)',
      dataIndex: 'invoiceTax',
      key: 'invoiceTax',
      width: 120,
    },
    {
      title: '装货企业',
      dataIndex: 'packAddress',
      key: 'packAddress',
      width: 180,
    },
    {
      title: '卸货企业',
      dataIndex: 'unloadAddress',
      key: 'unloadAddress',
      width: 180,
    },
    {
      title: '结算吨位',
      dataIndex: 'settlementQuantity',
      key: 'settlementQuantity',
      width: 100,
    },
    {
      title: '实付运费(元)',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      width: 100,
    },
    {
      title: '含税总价(元)',
      key: 'totalTax',
      dataIndex: 'totalTax',
      width: 100,
    },
    {
      title: '服务费(元)',
      key: 'taxAmount',
      dataIndex: 'taxAmount',
      width: 100,
    },
    {
      title: '实际扣款(元)',
      key: 'realAmount',
      dataIndex: 'realAmount',
      width: 100,
    },
    {
      title: '货主利润(元)',
      key: 'differPrice',
      dataIndex: 'differPrice',
      width: 100,
    },
    {
      title: '申请时间',
      dataIndex: 'applicationTime',
      key: 'applicationTime',
      width: 180,
    },
    {
      title: '开票成功时间',
      dataIndex: 'successTime',
      key: 'successTime',
      width: 180,
    },
    {
      title: '快递单号',
      key: 'courierNumber',
      dataIndex: 'courierNumber',
      width: 160,
    },
    {
      title: '邮寄地址',
      key: 'mailingAddress',
      dataIndex: 'mailingAddress',
      width: 180,
    },
    {
      title: '收件人',
      key: 'addressee',
      dataIndex: 'addressee',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              confirmInvoiceInfo(record)
            }}
            style={buttonStyle}
            type='link'
          >
            确认开票信息
          </Button>
          {record.billingStatus === '确认中' || record.billingStatus === '待审核' ? (
            <Button
              onClick={() => {
                cancelInvoiceApply(record)
              }}
              style={buttonStyle}
              type='link'
            >
              取消开票
            </Button>
          ) : null}
        </Space>
      ),
      width: 150,
    },
  ]
}

// 申请条数
export const applyCountHead = [
  {
    title: '序号',
    render: (text, record, index) => `${index + 1}`,
    fixed: 'left',
    width: 50,
  },
  {
    title: '运单编号',
    dataIndex: 'transportSn',
    key: 'transportSn',
    fixed: 'left',
    width: 160,
  },
  {
    title: '车牌号',
    dataIndex: 'vehicleNo',
    key: 'vehicleNo',
    width: 150,
  },
  {
    title: '司机姓名',
    dataIndex: 'driverName',
    key: 'driverName',
    width: 150,
  },
  {
    title: '司机手机',
    key: 'driverTel',
    dataIndex: 'driverTel',
    width: 150,
  },
  {
    title: '运价(元/吨)',
    key: 'freightTost',
    dataIndex: 'freightTost',
    width: 150,
  },
  {
    title: '装货时间',
    key: 'upstreamLoadedAt',
    dataIndex: 'upstreamLoadedAt',
    width: 150,
  },
  {
    title: '卸货时间',
    key: 'downstreamVehicleWeightedAt',
    dataIndex: 'downstreamVehicleWeightedAt',
    width: 200,
  },
  {
    title: '支付时间',
    key: 'payedAt',
    dataIndex: 'payedAt',
    width: 200,
  },
  {
    title: '装货区域',
    key: 'packAddress',
    dataIndex: 'packAddress',
    width: 350,
  },
  {
    title: '卸货区域',
    key: 'unloadAddress',
    dataIndex: 'unloadAddress',
    width: 350,
  },
  {
    title: '实付运费',
    key: 'realPayAmount',
    dataIndex: 'realPayAmount',
    width: 200,
  },
]

// 打印发票
export const printInvoiceHead = (
  invoiceStatus,
  openInvoiceTemp,
  downloadDetailList,
  upSuideDate,
  saveInvoiceNumber
) => {
  const columns = [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      width: 50,
    },
    {
      title: '装货企业',
      dataIndex: 'placeOfOrigin',
      key: 'placeOfOrigin',
      width: 180,
    },
    {
      title: '卸货企业',
      dataIndex: 'destination',
      key: 'destination',
      width: 180,
    },
    {
      title: '发票号码',
      dataIndex: 'invioiceNumber',
      key: 'invioiceNumber',
      editable: true,
      width: 120,
    },
    {
      title: '货物类型',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 120,
    },
    {
      title: '数量(吨)',
      dataIndex: 'invoiceWeight',
      key: 'invoiceWeight',
      width: 100,
    },
    {
      title: '含税总价(元)',
      key: 'realInvoiceCountAmount',
      dataIndex: 'realInvoiceCountAmount',
      width: 140,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (text, record) => (
        <>
          <AuthButton
            authKey='up_suide'
            className='operate-btn'
            disabled={invoiceStatus === 3 || invoiceStatus === 8}
            onClick={() => {
              upSuideDate(record)
            }}
            style={{ paddingLeft: '0' }}
            type='link'
          >
            上传绥德
          </AuthButton>
          {record.openNum === 0 ? (
            <Button
              disabled={!(invoiceStatus === 6)}
              onClick={() => {
                openInvoiceTemp(record)
              }}
              style={{ paddingLeft: '0' }}
              type='link'
            >
              开具并打印
            </Button>
          ) : (
            <Button
              onClick={() => {
                openInvoiceTemp(record)
              }}
              style={{ paddingLeft: '0' }}
              type='link'
            >
              查看
            </Button>
          )}
          <AuthButton
            authKey='download_detail_info'
            onClick={() => {
              downloadDetailList(record)
            }}
            style={{ paddingLeft: '0' }}
            type='link'
          >
            下载详单
          </AuthButton>
        </>
      ),
      width: 140,
    },
  ]
  return columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: saveInvoiceNumber,
      }),
    }
  })
}

// 发票模板
export const invoiceTemplateHead = () => {
  return [
    {
      title: '货物或应税劳务名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      align: 'center',
      className: 'column-item',
    },
    {
      title: '规格型号',
      dataIndex: 'model',
      key: 'model',
      width: 120,
      align: 'left',
      className: 'column-item',
    },
    {
      title: '单位',
      dataIndex: 'company',
      key: 'company',
      width: 80,
      align: 'left',
      className: 'column-item',
    },
    {
      title: '数量',
      key: 'num',
      dataIndex: 'num',
      width: 120,
      align: 'left',
      className: 'column-item',
    },
    {
      title: '单价(不含税)',
      key: 'price',
      dataIndex: 'price',
      width: 141,
      align: 'center',
      className: 'column-item',
    },
    {
      title: '金额(不含税)',
      key: 'countAmount',
      dataIndex: 'countAmount',
      width: 100,
      align: 'right',
      className: 'column-item',
    },
    {
      title: '税率',
      key: 'tax',
      dataIndex: 'tax',
      width: 80,
      align: 'center',
      className: 'column-item',
    },
    {
      title: '税额',
      key: 'taxAmount',
      dataIndex: 'taxAmount',
      width: 100,
      align: 'right',
    },
  ]
}

// 货主搜索列表
export const withdrawHead = () => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      width: 50,
    },
    {
      title: '企业简称',
      dataIndex: 'shortCompanyName',
      key: 'shortCompanyName',
      width: 180,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'contactTel',
      key: 'contactTel',
      width: 120,
    },
    {
      title: '服务费率',
      dataIndex: 'tax',
      key: 'tax',
      width: 120,
    },
    {
      title: '运费余额',
      dataIndex: 'freightBalance',
      key: 'freightBalance',
      width: 120,
    },
    {
      title: '服务费余额',
      dataIndex: 'serviceBalance',
      key: 'serviceBalance',
      width: 120,
    },
  ]
}

// 权限用户列表
export const usersHead = (
  checkTableDetail,
  editAuthDetail,
  isDisableAccount,
  restorePassword,
  setPopoverStatus,
  cancelPopover,
  switchLoading,
  popoverVisible
) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '登录手机号',
      key: 'adminMobile',
      fixed: 'left',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.adminMobile}
        </span>
      ),
      width: 120,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'isDisabledName',
      key: 'isDisabledName',
      width: 120,
    },
    {
      title: '所属部门',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '最后修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (text, record, index) => (
        <Space>
          <Button
            onClick={() => {
              editAuthDetail(record)
            }}
            size='small'
            type='text'
          >
            权限
          </Button>
          <Popover
            content={
              <div className='users-popover-wrap'>
                <div className='users-header'>
                  <span>更多操作</span>
                  <CloseOutlined
                    onClick={() => {
                      cancelPopover(index)
                    }}
                  />
                </div>
                <div className='users-content'>
                  <span>是否禁用账号</span>
                  <AuthSwitch
                    authKey='disable_account'
                    checked={!record.isDisabled}
                    checkedChildren='是'
                    loading={switchLoading}
                    onChange={(bool) => {
                      isDisableAccount(!bool, record)
                    }}
                    unCheckedChildren='否'
                  />
                </div>
                <AuthButton
                  authKey='init_password'
                  className='users-content restore-password'
                  onClick={() => {
                    restorePassword(record)
                  }}
                  size='small'
                  type='text'
                >
                  恢复初始密码
                </AuthButton>
              </div>
            }
            overlayClassName='users-popover-wrapper'
            placement='topRight'
            trigger='click'
            visible={popoverVisible[index]}
          >
            <Button
              onClick={() => {
                setPopoverStatus(index)
              }}
              size='small'
              type='text'
            >
              更多
            </Button>
          </Popover>
        </Space>
      ),
      width: 120,
    },
  ]
}

// 咨询表头
export const consultingTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '咨询编号',
      key: 'consultSn',
      fixed: 'left',
      width: 120,
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.consultSn}
        </span>
      ),
    },
    {
      title: '咨询号码',
      key: 'recordMobile',
      dataIndex: 'recordMobile',
      width: 100,
    },
    {
      title: '咨询者',
      key: 'recordName',
      dataIndex: 'recordName',
      width: 80,
    },
    {
      title: '咨询类型',
      key: 'consultTypeName',
      dataIndex: 'consultTypeName',
      width: 80,
    },
    {
      title: '咨询状态',
      key: 'consultStatusName',
      dataIndex: 'consultStatusName',
      width: 80,
    },
    {
      title: '主题',
      key: 'consultTitle',
      width: 120,
      render: (text, record) => (
        <span className='consult-title'>
          {record.consultTitle.length > 10 ? record.consultTitle.substring(0, 10) + '...' : record.consultTitle}
        </span>
      ),
    },
    {
      title: '记录人',
      key: 'createName',
      dataIndex: 'createName',
      width: 80,
    },
    {
      title: '记录时间',
      key: 'recordTime',
      dataIndex: 'recordTime',
      width: 120,
    },
  ]
}

//货运发票表头
export const freightInvoiceTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '运单编号',
      key: 'orderSn',
      fixed: 'left',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.orderSn}
        </span>
      ),
      width: 120,
    },
    {
      title: '备案状态',
      dataIndex: 'vehicleRecordStatus',
      key: 'vehicleRecordStatus',
      width: 80,
    },
    {
      title: '备案时间',
      dataIndex: 'vehicleRecordTime',
      key: 'vehicleRecordTime',
      width: 150,
    },
    {
      title: 'ETC开票状态',
      key: 'etcInvoiceStatus',
      dataIndex: 'etcInvoiceStatus',
      width: 100,
    },
    {
      title: 'ETC开票时间',
      key: 'etcInvoiceTime',
      dataIndex: 'etcInvoiceTime',
      width: 150,
    },
    {
      title: 'ETC交易票数',
      key: 'etcOpenCount',
      dataIndex: 'etcOpenCount',
      width: 100,
    },
    {
      title: 'ETC发票金额',
      key: 'etcPayAmount',
      dataIndex: 'etcPayAmount',
      width: 100,
    },
    {
      title: 'ETC发票税额',
      key: 'etcTaxAmount',
      dataIndex: 'etcTaxAmount',
      width: 100,
    },
    {
      title: '车牌号',
      key: 'vehicleSn',
      dataIndex: 'vehicleSn',
      width: 90,
    },
    {
      title: '车牌颜色',
      key: 'vehicleColor',
      dataIndex: 'vehicleColor',
      width: 80,
    },
    {
      title: '车辆类型',
      key: 'vehicleType',
      dataIndex: 'vehicleType',
      width: 90,
    },
    {
      title: '司机姓名',
      key: 'driverName',
      dataIndex: 'driverName',
      width: 80,
    },
    {
      title: '联系方式',
      key: 'driverMobile',
      dataIndex: 'driverMobile',
      width: 120,
    },
    {
      title: '运单状态',
      key: 'transportStatus',
      dataIndex: 'transportStatus',
      width: 80,
    },
    {
      title: '运单创建企业',
      key: 'createCompany',
      dataIndex: 'createCompany',
      width: 120,
    },
    {
      title: '装货企业',
      key: 'packCompany',
      dataIndex: 'packCompany',
      width: 120,
    },
    {
      title: '装货地址',
      key: 'packAddress',
      dataIndex: 'packAddress',
      width: 220,
    },
    {
      title: '装货时间',
      key: 'packAt',
      dataIndex: 'packAt',
      width: 150,
    },
    {
      title: '卸货企业',
      key: 'unloadCompany',
      dataIndex: 'unloadCompany',
      width: 120,
    },
    {
      title: '卸货地址',
      key: 'unloadAddress',
      dataIndex: 'unloadAddress',
      width: 220,
    },
    {
      title: '卸货时间',
      key: 'unloadAt',
      dataIndex: 'unloadAt',
      width: 150,
    },
    {
      title: '行驶距离',
      key: 'transportDistance',
      dataIndex: 'transportDistance',
      width: 80,
    },
    {
      title: '支付状态',
      key: 'payStatus',
      dataIndex: 'payStatus',
      width: 80,
    },
    {
      title: '支付时间',
      key: 'payAt',
      dataIndex: 'payAt',
      width: 150,
    },
    {
      title: '实付运费',
      key: 'payAmount',
      dataIndex: 'payAmount',
      width: 80,
    },
  ]
}

//货运详情表头
export const freightDetailTableHead = () => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '交易编号',
      key: 'invoiceSn',
      dataIndex: 'invoiceSn',
      fixed: 'left',
      width: 170,
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleSn',
      key: 'vehicleSn',
      width: 90,
    },
    {
      title: '发票代码',
      dataIndex: 'invoiceCode',
      key: 'invoiceCode',
      width: 110,
    },
    {
      title: '发票号码',
      key: 'invoiceNumber',
      dataIndex: 'invoiceNumber',
      width: 80,
    },
    {
      title: '开具时间',
      key: 'invoiceTime',
      dataIndex: 'invoiceTime',
      width: 150,
    },
    {
      title: '价税合计',
      key: 'invoiceCountAmount',
      dataIndex: 'invoiceCountAmount',
      width: 90,
    },
    {
      title: '税额',
      key: 'taxAmount',
      dataIndex: 'taxAmount',
      width: 70,
    },
    {
      title: '税率',
      key: 'tax',
      dataIndex: 'tax',
      width: 70,
    },
    {
      title: '交易时间',
      key: 'invoiceAmountTime',
      dataIndex: 'invoiceAmountTime',
      width: 150,
    },
    {
      title: '入口收费站',
      key: 'packChargeName',
      dataIndex: 'packChargeName',
      width: 180,
    },
    {
      title: '出口收费站',
      key: 'unloadChargeName',
      dataIndex: 'unloadChargeName',
      width: 180,
    },
  ]
}

//货运发票表头
export const carriageAgreementTableHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '联系电话',
      key: 'driverTel',
      fixed: 'left',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.driverTel}
        </span>
      ),
      width: 100,
    },
    {
      title: '司机姓名',
      dataIndex: 'driverName',
      key: 'driverName',
      width: 80,
    },
    {
      title: '认证状态',
      dataIndex: 'driverStatus',
      key: 'driverStatus',
      width: 80,
    },
    {
      title: '签订状态',
      dataIndex: 'agreementStatus',
      key: 'agreementStatus',
      width: 80,
    },
    {
      title: '身份证号码',
      dataIndex: 'idCard',
      key: 'idCard',
      width: 100,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 80,
    },
    {
      title: '签订日期',
      dataIndex: 'agreementTime',
      key: 'agreementTime',
      width: 130,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
  ]
}

//利润提现
export const profitWithdrawalHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '交易单号',
      key: 'cashSn',
      fixed: 'left',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.cashSn}
        </span>
      ),
      width: 150,
    },
    {
      title: '企业简称',
      dataIndex: 'consignorShortName',
      key: 'consignorShortName',
      width: 100,
    },
    {
      title: '交易类型',
      dataIndex: 'transactionTypename',
      key: 'transactionTypename',
      width: 80,
    },
    {
      title: '利润（元）',
      dataIndex: 'cashAmount',
      key: 'cashAmount',
      width: 80,
    },
    {
      title: '利润提取状态',
      dataIndex: 'cashStatus',
      key: 'cashStatus',
      width: 100,
    },
    {
      title: '利润提取时间',
      dataIndex: 'transferVoucherTime',
      key: 'transferVoucherTime',
      width: 180,
    },
    {
      title: '交易状态',
      dataIndex: 'cashPayStatusName',
      key: 'cashPayStatusName',
      width: 80,
    },
    {
      title: '提现方式',
      dataIndex: 'cashTypeName',
      key: 'cashTypeName',
      width: 100,
    },
    {
      title: '银行卡号 / 开户银行账号',
      dataIndex: 'cashBankNumber',
      key: 'cashBankNumber',
      width: 160,
    },
    {
      title: '持卡人姓名 / 公司名称',
      dataIndex: 'cashUserName',
      key: 'cashUserName',
      width: 140,
    },
    {
      title: '持卡人身份证号 / 社会统一信用代码',
      dataIndex: 'cashUserCard',
      key: 'cashUserCard',
      width: 210,
    },
    {
      title: '审核操作人',
      dataIndex: 'trailUser',
      key: 'trailUser',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 400,
    },
  ]
}

//利润提现详情
export const profitWithdrawalDetailHead = [
  {
    title: '序号',
    render: (text, record, index) => `${index + 1}`,
    fixed: 'left',
    width: 60,
  },
  {
    title: '利润生成时间 / 开票成功时间',
    key: 'invoiceSuccessTime',
    dataIndex: 'invoiceSuccessTime',
    width: 200,
  },
  {
    title: '利润所属单号',
    key: 'invoiceSn',
    dataIndex: 'invoiceSn',
    width: 160,
  },
  {
    title: '服务费率(%)',
    key: 'invoiceTax',
    dataIndex: 'invoiceTax',
    width: 100,
  },
  {
    title: '实付运费(元)',
    key: 'invoiceAmount',
    dataIndex: 'invoiceAmount',
    width: 100,
  },
  {
    title: '含税总价(元)',
    key: 'invoiceCountAmount',
    dataIndex: 'invoiceCountAmount',
    width: 100,
  },
  {
    title: '利润(元)',
    key: 'differ',
    dataIndex: 'differ',
    width: 80,
  },
]

// 支付失败
export const payFailureHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: <div style={{ margin: ' 0 0 0 15px' }}>运单编号</div>,
      dataIndex: 'transportSn',
      key: 'transportSn',
      fixed: 'left',
      width: 170,
      render: (text, record) => (
        <JwPopover
          eventHandle={checkTableDetail}
          label={record.transportSn}
          message={record.warnMessage}
          record={record}
          status={record.warnStatus}
        />
      ),
    },
    {
      title: '商户订单号',
      key: 'orderSn',
      dataIndex: 'orderSn',
      width: 160,
    },
    {
      title: '支付状态',
      key: 'tradeStatus',
      dataIndex: 'tradeStatusName',
      width: 120,
    },
    {
      title: '装货企业',
      key: 'packCompany',
      dataIndex: 'packCompany',
      width: 150,
    },
    {
      title: '卸货企业',
      key: 'unloadCompany',
      dataIndex: 'unloadCompany',
      width: 150,
    },
    {
      title: '车牌号',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      width: 120,
      sorter: true,
    },
    {
      title: '司机姓名',
      key: 'driverName',
      dataIndex: 'driverName',
      width: 100,
    },
    {
      title: '联系方式',
      key: 'driverTel',
      dataIndex: 'driverTel',
      width: 120,
    },
    {
      title: '身份证号',
      key: 'driverIdentityNo',
      dataIndex: 'driverIdentityNo',
      width: 150,
    },
    {
      title: '支付单类型',
      key: 'payTypeName',
      dataIndex: 'payTypeName',
      width: 120,
    },
    {
      title: '发起支付时间',
      key: 'payedAt',
      dataIndex: 'payedAt',
      width: 150,
      sorter: true,
    },
    {
      title: '支付到账时间',
      key: 'finishedAt',
      dataIndex: 'finishedAt',
      width: 150,
    },
    {
      title: '运单来源',
      key: 'dataSourceName',
      dataIndex: 'dataSourceName',
      width: 150,
    },
    {
      title: '运单创建企业',
      dataIndex: 'createCompany',
      key: 'createCompany',
      width: 150,
      sorter: true,
    },
    {
      title: '银行名称',
      key: 'bankName',
      dataIndex: 'bankName',
      width: 150,
    },
    {
      title: '银行卡号',
      key: 'bankCardNo',
      dataIndex: 'bankCardNo',
      width: 180,
    },
    {
      title: '银行持卡人',
      key: 'bankCardHolder',
      dataIndex: 'bankCardHolder',
      width: 150,
    },
    {
      title: '持卡人身份证号',
      key: 'cardHolderIdNo',
      dataIndex: 'cardHolderIdNo',
      width: 150,
    },
    {
      title: '实付运费',
      key: 'realPayAmount',
      dataIndex: 'realPayAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '支付失败原因',
      key: 'failedContent',
      dataIndex: 'failedContent',
      width: 150,
    },
  ]
}

//油票抵扣
export const oilTicketDeductionHead = (checkTableDetail) => {
  return [
    {
      title: '序号',
      render: (text, record, index) => `${index + 1}`,
      fixed: 'left',
      width: 50,
    },
    {
      title: '交易单号',
      key: 'stampTransactionSn',
      fixed: 'left',
      render: (text, record) => (
        <span
          onClick={() => {
            checkTableDetail(record)
          }}
          style={{ color: '#5178DF', cursor: 'pointer' }}
        >
          {record.stampTransactionSn}
        </span>
      ),
      width: 150,
    },
    {
      title: '交易类型',
      dataIndex: 'stampTypeName',
      key: 'stampTypeName',
      width: 90,
    },
    {
      title: '企业简称',
      dataIndex: 'shortCompany',
      key: 'shortCompany',
      width: 110,
    },
    {
      title: '申请时间',
      dataIndex: 'stampTime',
      key: 'stampTime',
      width: 180,
    },
    {
      title: '总票面额（元）',
      dataIndex: 'stampAmount',
      key: 'stampAmount',
      width: 110,
    },
    {
      title: '实际抵扣金额（元）',
      dataIndex: 'stampRealAmount',
      key: 'stampRealAmount',
      width: 140,
    },
    {
      title: '物流单号',
      dataIndex: 'stampSn',
      key: 'stampSn',
      width: 120,
    },
    {
      title: '物流公司',
      dataIndex: 'stampCompany',
      key: 'stampCompany',
      width: 100,
    },
    {
      title: '寄件人联系电话',
      dataIndex: 'stampMobile',
      key: 'stampMobile',
      width: 120,
    },
    {
      title: '审核操作人',
      dataIndex: 'trailUserId',
      key: 'trailUserId',
      width: 90,
    },
    {
      title: '审核时间',
      dataIndex: 'trailTime',
      key: 'trailTime',
      width: 180,
    },
  ]
}
