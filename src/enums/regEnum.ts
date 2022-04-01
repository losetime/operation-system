// 车牌号
export const picensePlateReg = /^[粤浙京沪川津渝鄂赣冀蒙鲁苏辽吉皖湘黑琼贵桂云藏陕甘宁青豫闽新晋][A-Z][ABCDEFGHJKLMNPQRSTUVWXYZ0123456789]{5,6}$/

// 手机号码
export const phoneReg = /^[1]\d{10}$/

// 座机号码
export const fixedPhone = /^0\d{2,3}-\d{7,8}$/

// 密码
export const passwordReg = /^[\u4E00-\u9FA5]+$/

// 身份证号码
export const IdNoReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/

// 社会信用代码
export const socialCodeReg = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g

// 道路运输许可证
export const roadTransportPermitReg = /^[0-9A-Z]*$/

// 银行卡校验
export const backCardReg = /^([1-9]{1})(\d{15}|\d{18})$/

// 去除字符串前后空格
export const spaceReg = /\s+/g

//发票代码
export const invoiceNumber = /^[0-9]{10,18}$/

//发票NO
export const invoiceNO = /^[0-9]{6,18}$/

// 司机姓名不能包含特殊字符
export const driverNameReg = /^[\u4E00-\u9FA5|a-z|A-Z|0-9]*$/g

// 验证数字且最多包含两位小数
export const numberReg = /^(([0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/

// 验证1-100的整数
export const integerReg = /^([1-9]\d?|100)$/

// 验证数字和字母
export const digitalReg = /^[A-Z|0-9]*$/

// 纳税人识别号
export const taxNumberReg = /^[0-9A-Z]{15,20}$/

//银行卡持卡人姓名
export const cardholderName = /^[\u4E00-\u9FA5|a-z|A-Z|0-9]*$/g

//不能是支付
export const noCharacter = /^[\u4E00-\u9FA5|a-z|A-Z|0-9]*$/g

// 验证数字和字母
export const digitalReg2 = /^[A-Z|a-z|0-9]*$/

//初步对公账号
export const broughtAccount = /^[0-9]{12,25}$/
