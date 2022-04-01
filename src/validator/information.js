import {
  phoneReg,
  driverNameReg,
  socialCodeReg,
  IdNoReg,
  picensePlateReg,
  roadTransportPermitReg,
  numberReg,
  digitalReg2,
  noCharacter,
  taxNumberReg,
  fixedPhone,
} from '@/enums/regEnum'

//货主
export const consignorDetailRules = {
  shortCompanyName: [
    {
      required: true,
    },
    {
      pattern: driverNameReg,
      message: '企业简称只允许输入中文、英文和数字',
    },
    {
      min: 2,
      message: '最少输入2个字符',
    },
    {
      max: 6,
      message: '最多输入6个字符',
    },
  ],
  contact: [
    {
      required: true,
    },
    {
      pattern: driverNameReg,
      message: '联系人只允许输入中文、英文和数字',
    },
    {
      min: 2,
      message: '最少输入2个字符',
    },
    {
      max: 6,
      message: '最多只能输入6个字符',
    },
  ],
  socialCode: [
    {
      pattern: socialCodeReg,
      message: '社会信用代码格式错误',
    },
  ],
  contactTel: [
    {
      required: true,
    },
    {
      pattern: phoneReg,
      message: '手机号格式不正确',
    },
  ],
  address: [
    {
      required: true,
      message: '请选择详细地址',
    },
  ],
  consignorCode: [
    {
      pattern: IdNoReg,
      message: '身份证号码格式不正确',
    },
  ],
  businessCounterpart: [
    {
      max: 15,
      message: '最多只能输入15个字符',
    },
  ],
  tax: [
    () => ({
      validator(rule, value) {
        if (value) {
          if (Number(value) > 5.2) {
            return Promise.resolve()
          } else {
            return Promise.reject('服务费率不能小于等于5.20')
          }
        } else {
          return Promise.resolve()
        }
      },
    }),
    () => ({
      validator(rule, value) {
        if (value) {
          if (Number(value) < 100) {
            return Promise.resolve()
          } else {
            return Promise.reject('服务费率不能大于等于100')
          }
        } else {
          return Promise.resolve()
        }
      },
    }),
  ],
  refuseExplain: [
    {
      max: 15,
      message: '最多只能输入15个字符',
    },
  ],
}

export const vehicleDetailRules = {
  vehicleNo: [
    {
      required: true,
      message: '请输入车牌号',
    },
    {
      pattern: picensePlateReg,
      message: '请输入正确的车牌号',
    },
  ],
  quasiTractiveMass: [
    {
      required: true,
      message: '请输入准牵引总质量',
    },
    {
      pattern: numberReg,
      message: '最多输入2位小数',
    },
    {
      type: 'number',
      transform: (value) => {
        return Number(value)
      },
      max: 9999999.99,
      message: '输入数值不能超过9999999.99',
    },
    {
      type: 'number',
      transform: (value) => {
        return Number(value)
      },
      min: 0.01,
      message: '输入数值不能低于0.01',
    },
  ],
  all: [
    {
      required: true,
      message: '请输入所有人',
    },
    {
      max: 128,
      message: '长度最大为128位',
    },
    {
      pattern: noCharacter,
      message: '只能输入字母、数字、汉字',
    },
  ],
  natureOfUse: [
    {
      required: true,
      message: '请输入使用性质',
    },
    {
      max: 20,
      message: '长度最大为20位',
    },
    {
      pattern: noCharacter,
      message: '只能输入字母、数字、汉字',
    },
  ],
  issuingAuthority: [
    {
      required: true,
      message: '请输入发证机关',
    },
    {
      max: 128,
      message: '长度最大为128位',
    },
    {
      pattern: noCharacter,
      message: '只能输入字母、数字、汉字',
    },
  ],
  vin: [
    {
      required: true,
      message: '请输入车辆识别代号',
    },
    {
      max: 32,
      message: '长度最大为32位',
    },
    {
      pattern: digitalReg2,
      message: '只能输入字母、数字',
    },
  ],
  unladenMass: [
    {
      required: true,
      message: '请输入整备质量',
    },
    {
      pattern: numberReg,
      message: '最多输入2位小数',
    },
    {
      type: 'number',
      transform: (value) => {
        return Number(value)
      },
      max: 9999999.99,
      message: '输入数值不能超过9999999.99',
    },
    {
      type: 'number',
      transform: (value) => {
        return Number(value)
      },
      min: 0.01,
      message: '输入数值不能低于0.01',
    },
  ],
  dateOfIssue: [
    {
      required: true,
      message: '请输入发证日期',
    },
  ],
  registrationDate: [
    {
      required: true,
      message: '请输入注册日期',
    },
  ],
  inspectionRecord: [
    {
      required: true,
      message: '请输入有效期至',
    },
  ],
  transportLicenseNo: [
    {
      pattern: roadTransportPermitReg,
      message: '请输入正确的道路运输许可证',
    },
    {
      max: 18,
      message: '最多输入18个字符',
    },
    {
      min: 6,
      message: '最少输入6个字符',
    },
  ],
  remark: [{ max: 15, message: '最多只能输入15个字符' }],
}

export const invoicingDetailRules = {
  invoiceTitle: [
    {
      required: true,
      message: '请输入发票抬头',
    },
    {
      min: 1,
      message: '最少输入1个字符',
    },
    {
      max: 100,
      message: '最多输入100个字符',
    },
  ],
  invoiceConsignorCode: [
    { required: true, message: '请输入纳税人识别号' },
    {
      pattern: taxNumberReg,
      message: '纳税人识别号格式错误',
    },
  ],
  invoiceBankNumber: [
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
  invoiceBankName: [
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
  invoiceAddress: [
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
  invoiceMobile: [
    { required: true, message: '请输入企业电话' },
    {
      pattern: fixedPhone,
      message: '企业电话格式错误',
    },
    {
      min: 1,
      message: '最少输入1个字符',
    },
    {
      max: 20,
      message: '最多输入20个字符',
    },
  ],
  remarks: [
    {
      min: 1,
      message: '最少输入1个字符',
    },
    {
      max: 150,
      message: '最多输入150个字符',
    },
  ],
}
