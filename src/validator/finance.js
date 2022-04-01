import { phoneReg, taxNumberReg, fixedPhone, numberReg } from '@/enums/regEnum'

// 确认开票审批-> 确认开票信息
export const invoiceInfoRules = {
  invoiceTitle: [
    { required: true, message: '请输入发票抬头' },
    { min: 1, max: 100, message: '字符长度在1到100位之间' },
  ],
  taxNumber: [
    { required: true, message: '请输入纳税人识别号' },
    { pattern: taxNumberReg, message: '纳税人识别号有误' },
  ],
  bankAccountNumber: [
    { required: true, message: '请输入开户银行账号' },
    {
      min: 6,
      message: '最少输入6个字符',
    },
    {
      max: 30,
      message: '最多输入30个字符',
    },
  ],
  bankOfDeposit: [
    { required: true, message: '请输入银行开户行' },
    {
      min: 1,
      message: '最少输入1个字符',
    },
    {
      max: 100,
      message: '最多输入100个字符',
    },
  ],
  address: [
    { required: true, message: '请输入企业地址' },
    {
      min: 1,
      message: '最少输入1个字符',
    },
    {
      max: 150,
      message: '最多输入150个字符',
    },
  ],
  enterpriseTelephone: [
    { required: true, message: '请输入企业电话' },
    () => ({
      validator(rule, value) {
        if (value) {
          if (phoneReg.test(value) || fixedPhone.test(value)) {
            return Promise.resolve()
          }
          return Promise.reject('企业电话格式错误')
        }
        return Promise.resolve()
      },
    }),
    {
      min: 1,
      message: '最少输入1个字符',
    },
    {
      max: 20,
      message: '最多输入20个字符',
    },
  ],
}

// 确认开票审批-> 服务费确认
export const serviceChargeRules = {
  invoiceTax: [
    {
      required: true,
      message: '请输入服务费率',
    },
    {
      type: 'number',
      transform(value) {
        if (value) {
          return Number(value)
        }
      },
      message: '服务费率格式错误',
    },
    () => ({
      validator(rule, value) {
        if (value.includes('.')) {
          if (value.split('.')[1].length < 1) {
            return Promise.reject('输入格式错误')
          } else if (value.split('.')[1].length > 2) {
            return Promise.reject('只允许最多两位小数')
          }
        }
        return Promise.resolve()
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) <= 100) {
          return Promise.resolve()
        }
        return Promise.reject('服务费率最大允许输入100')
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) >= 0.01) {
          return Promise.resolve()
        }
        return Promise.reject('服务费率最小允许输入0.01')
      },
    }),
  ],
  invoiceTaxAmount: [
    {
      required: true,
      message: '请输入服务费',
    },
    {
      type: 'number',
      transform(value) {
        if (value) {
          return Number(value)
        }
      },
      message: '服务费格式错误',
    },
    () => ({
      validator(rule, value) {
        if (value.includes('.')) {
          if (value.split('.')[1].length < 1) {
            return Promise.reject('输入格式错误')
          } else if (value.split('.')[1].length > 2) {
            return Promise.reject('只允许最多两位小数')
          }
        }
        return Promise.resolve()
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) <= 10000000) {
          return Promise.resolve()
        }
        return Promise.reject('服务费最大允许输入10000000')
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) >= 0.01) {
          return Promise.resolve()
        }
        return Promise.reject('服务费最小允许输入0.01')
      },
    }),
  ],
  invoiceCountAmount: [
    {
      required: true,
      message: '请输入开票总金额',
    },
    {
      type: 'number',
      transform(value) {
        if (value) {
          return Number(value)
        }
      },
      message: '只允许输入数字',
    },
    () => ({
      validator(rule, value) {
        if (value.includes('.')) {
          if (value.split('.')[1].length < 1) {
            return Promise.reject('输入格式错误')
          } else if (value.split('.')[1].length > 2) {
            return Promise.reject('只允许最多两位小数')
          }
        }
        return Promise.resolve()
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) <= 99999999) {
          return Promise.resolve()
        }
        return Promise.reject('最大允许输入99999999')
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) >= 0.01) {
          return Promise.resolve()
        }
        return Promise.reject('最小允许输入0.01')
      },
    }),
  ],
}

// 确认开票审批-> 开票结果
export const invocieResultRules = {
  mailingAddress: [
    {
      max: 250,
      message: '字符长度最多250位',
    },
  ],
  addressee: [
    {
      max: 6,
      message: '字符长度最多6位',
    },
  ],
  contactTel: [
    () => ({
      validator(rule, value) {
        if (value) {
          if (phoneReg.test(value) || fixedPhone.test(value)) {
            return Promise.resolve()
          }
          return Promise.reject('联系方式不正确')
        }
        return Promise.resolve()
      },
    }),
  ],
  courierNumber: [
    {
      max: 50,
      message: '字符长度最多50位',
    },
  ],
  expressNotes: [
    {
      max: 5000,
      message: '字符长度最多5000位',
    },
  ],
}

// 资金详情表单
export const fundsDetailRules = {
  transactionType: [{ required: true, message: '请选择交易类型' }],
  rechargeAmount: [
    { required: true, message: '请输入交易金额' },
    () => ({
      validator(rule, value) {
        if (numberReg.test(value)) {
          return Promise.resolve()
        }
        return Promise.reject('交易金额必须为数字，且最多保留两位小数')
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) > 0) {
          return Promise.resolve()
        }
        return Promise.reject('交易金额必须大于0')
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) <= 99999999.99) {
          return Promise.resolve()
        }
        return Promise.reject('交易金额必须小于等于99999999.99')
      },
    }),
  ],
  failedExplain: [
    () => ({
      validator(rule, value) {
        if (value) {
          if (value.length > 15) {
            return Promise.reject('备注最多允许输入15个字符')
          }
          return Promise.resolve()
        }
        return Promise.resolve()
      },
    }),
  ],
  failedExplain2: [
    () => ({
      validator(rule, value) {
        if (value) {
          if (value.length > 150) {
            return Promise.reject('备注最多允许输入150个字符')
          }
          return Promise.resolve()
        }
        return Promise.resolve()
      },
    }),
  ],
}

// 结算单详情编辑
export const statementRules = {
  placeOfOrigin: [
    {
      required: true,
      message: '请输入装货企业',
    },
    {
      max: 35,
      message: '字符长度最多35位',
    },
  ],
  destination: [
    {
      required: true,
      message: '请输入卸货企业',
    },
    {
      max: 35,
      message: '字符长度最多35位',
    },
  ],
  productName: [
    {
      required: true,
      message: '请输入品名',
    },
    {
      max: 35,
      message: '字符长度最多35位',
    },
  ],
  settlementQuantity: [
    {
      required: true,
      message: '请输入结算吨位',
    },
    {
      type: 'number',
      transform(value) {
        if (value) {
          return Number(value)
        }
      },
      message: '只允许输入数字',
    },
    () => ({
      validator(rule, value) {
        if (Number(value) >= 1) {
          return Promise.resolve()
        }
        return Promise.reject('结算吨位必须大于等于1')
      },
    }),
    () => ({
      validator(rule, value) {
        if (numberReg.test(value)) {
          return Promise.resolve()
        }
        return Promise.reject('只允许保留两位小数')
      },
    }),
  ],
  distance: [
    {
      required: true,
      message: '请输入运距',
    },
    {
      type: 'number',
      transform(value) {
        if (value) {
          return Number(value)
        }
      },
      message: '只允许输入数字',
    },
    () => ({
      validator(rule, value) {
        if (Number(value) >= 0) {
          return Promise.resolve()
        }
        return Promise.reject('运距必须大于等于0')
      },
    }),
    () => ({
      validator(rule, value) {
        if (Number(value) <= 9999.99) {
          return Promise.resolve()
        }
        return Promise.reject('运距必须小于等于9999.99km')
      },
    }),
    () => ({
      validator(rule, value) {
        if (numberReg.test(value)) {
          return Promise.resolve()
        }
        return Promise.reject('只允许保留两位小数')
      },
    }),
  ],
  unitPrice: [
    {
      required: true,
      message: '请输入单价',
    },
    {
      type: 'number',
      transform(value) {
        if (value) {
          return Number(value)
        }
      },
      message: '只允许输入数字',
    },
    () => ({
      validator(rule, value) {
        if (Number(value) >= 1) {
          return Promise.resolve()
        }
        return Promise.reject('单价必须大于等于1')
      },
    }),
    () => ({
      validator(rule, value) {
        if (numberReg.test(value)) {
          return Promise.resolve()
        }
        return Promise.reject('只允许保留两位小数')
      },
    }),
  ],
  totalTax: [
    {
      required: true,
      message: '请输入含税总价',
    },
    {
      type: 'number',
      transform(value) {
        if (value) {
          return Number(value)
        }
      },
      message: '只允许输入数字',
    },
    () => ({
      validator(rule, value) {
        if (Number(value) >= 1) {
          return Promise.resolve()
        }
        return Promise.reject('含税总额必须大于等于1')
      },
    }),
    () => ({
      validator(rule, value) {
        if (numberReg.test(value)) {
          return Promise.resolve()
        }
        return Promise.reject('只允许保留两位小数')
      },
    }),
  ],
  client: [
    {
      required: true,
      message: '请输入委托方',
    },
    {
      max: 100,
      message: '字符长度最多100位',
    },
  ],
  confirmationDate: [
    {
      required: true,
      message: '请选择日期',
    },
  ],
  confirmationSignature: [
    {
      max: 35,
      message: '字符长度最多35位',
    },
  ],
}
