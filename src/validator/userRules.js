import { phoneReg, driverNameReg } from '@/enums/regEnum'

const userRules = {
  realName: [
    {
      required: true,
    },
    {
      pattern: driverNameReg,
      message: '姓名不能包含特殊字符',
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
  roleId: [
    {
      required: true,
    },
  ],
  mobile: [
    {
      required: true,
    },
    {
      pattern: phoneReg,
      message: '手机号格式错误',
    },
  ],
  remark: [
    {
      max: 15,
      message: '最多输入15个字符',
    },
  ],
}

export default userRules
