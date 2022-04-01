/**
 * @description: 车辆信息列表
 */
export interface GetVehicleListInterface {
  pageNum: number
  perPage: number
  transportLicenseNo?: string
  upProvincialStatus?: number
  vehicleErrorMessage?: string
  vehicleNo?: string
  vehicleStatus?: string
}

/**
 * @description: 车辆信息列表导出
 */
export interface VehicleListExportInterface {
  transportLicenseNo?: string
  upProvincialStatus?: number
  vehicleErrorMessage?: string
  vehicleNo?: string
  vehicleStatus?: string
}

/**
 * @description: 车辆信息详情
 */
export interface GetVehicleDetailInterface {
  vehicleId: number
}

/**
 * @description: 车辆信息新增
 */
export interface AddVehicleInfoInterface {
  vehicleNo: string
  vehicleLicense: string
  transportLicense: string
  transportLicenseNo: string
  remark: string
  vehicleType: number
  natureOfUse: string
  vehicleFication: number
  vin: string
  unladenMass: number
  quasiTractiveMass: number
  all: string
  issuingAuthority: string
  registrationDate: string
  status: number
  transportLicenseRechargeTime: string
  dateOfIssue: string
  inspectionRecord: string
}

/**
 * @description: 车辆信息更新
 */
export interface SaveVehicleInfoInterface {
  vehicleLicense: string
  transportLicense: string
  transportLicenseNo: string
  remark: string
  vehicleType: number
  natureOfUse: string
  vehicleFication: number
  vin: string
  unladenMass: number
  quasiTractiveMass: number
  all: string
  issuingAuthority: string
  registrationDate: string
  status: number
  vehicleId: string
  transportLicenseRechargeTime: string
  dateOfIssue: string
  inspectionRecord: string
}

/**
 * @description: 车辆信息审核拒绝
 */
export interface RefuseVehicleAuditInterface {
  refuse: string
  vehicleId: number
}

/**
 * @description: 更新车辆图片信息
 */
export interface UpdateVehicleImageInfoInterface {
  vehicleId: number
  keyValue: string
  keyUrl: string
}

/**
 * @description: OCR识别图片
 */
export interface OCRVehiclePicture {
  ocrImageFiled: string
  ocrImageType: string
}

/**
 * @description: 货主信息列表
 */
export interface GetConsignorListInterface {
  pageNum: number
  perPage: number
  consignorAuthErrorMessage?: string
  consignorAuthenticationStatus?: string
  nameOrTel?: string
  shortCompanyName?: string
}

/**
 * @description: 货主信息详情
 */
export interface GetConsignorDetailInterface {
  consignorId: number
}

/**
 * @description: 货主信息新增
 */
export interface AddConsignorInfoInterface {
  address: string
  businessCounterpart?: string
  businessEnd?: string
  businessStart?: string
  city: string
  consignorCode?: string
  consignorLicense: string
  consignorLicenses: string
  businessLicense: string
  contact: string
  contactTel: string
  county: string
  identityEnd?: string
  identityStart?: string
  latItude: string
  longItude: string
  province: string
  refuseExplain?: string
  registerSource: number
  shortCompanyName: string
  socialCode?: string
  tax?: string
}

/**
 * @description: 货主信息更新
 */
export interface UpdateConsignorInfoInterface {
  address: string
  businessCounterpart?: string
  businessEnd?: string
  businessLicense: string
  businessStart?: string
  city: string
  consignorCode?: string
  consignorId: number
  consignorLicense: string
  consignorLicenses: string
  contact: string
  contactTel: string
  county: string
  identityEnd?: string
  identityStart?: string
  latItude: string
  longItude: string
  province: string
  refuseExplain?: string
  registerSource: number
  shortCompanyName: string
  socialCode?: string
  tax?: string
}

/**
 * @description: 货主信息拒绝
 */
export interface RefuseConsignorInfoInterface {
  refuse: string
  consignorId: number
}

/**
 * @description: 货主信息图片更新
 */
export interface UpdateConsignorImageInterface {
  consignorId: number
  keyValue: string
  keyUrl: string
}

/**
 * @description: 司机信息列表
 */
export interface GetDriverListInterface {
  pageNum: number
  perPage: number
  authenticationStatus?: string
  driverAuthErrorMessage?: string
  identityNo?: string
  nameOrTel?: string
  tailEndTime?: string
  tailStartTime?: string
  timeType?: string
  upProvincialStatus?: string
}

/**
 * @description: 司机信息详情
 */
export interface GetDriverDetailInterface {
  transporterId: number
}

/**
 * @description: 司机信息新增
 */
export interface AddDriverInfoInterface {
  contactTel: string
  driverLicenseObverse: string
  identityEnd?: string
  identityImageObverse: string
  identityImageReverse: string
  identityNo: string
  identityStart?: string
  realName: string
  refuseExplain?: string
  validFrom?: string
  validUntil?: string
}

/**
 * @description: 司机信息更新
 */
export interface UpdateDriverInfoInterface {
  transporterId: number
  contactTel: string
  driverLicenseObverse: string
  identityEnd?: string
  identityImageObverse: string
  identityImageReverse: string
  identityNo: string
  identityStart?: string
  realName: string
  refuseExplain?: string
  validFrom?: string
  validUntil?: string
}

/**
 * @description: 司机信息拒绝
 */
export interface RefuseDriverInfoInterface {
  refuse: string
  transporterId: number
}

/**
 * @description: 司机信息图片更新
 */
export interface UpdateDriverImageInterface {
  transporterId: number
  keyValue: string
  keyUrl: string
}

/**
 * @description: 银行卡信息列表
 */
export interface GetBankCardListInterface {
  pageNum: number
  perPage: number
  bankCard?: string
  nameOrTel?: string
}

/**
 * @description: 银行卡信息详情
 */
export interface GetBankCardDetailInterface {
  bankCardId: number
}

/**
 * @description: 银行卡信息更新
 */
export interface UpdateBankCardInfoInterface {
  bankCardHolder: string
  bankCardId: number
  bankCardNo: string
  bankName: string
}

/**
 * @description: 托运合同列表
 */
export interface GetContractListInterface {
  pageNum: number
  perPage: number
  contactSn?: string
  contactStatus?: string
  creatCompany?: string
  createRealCompany?: string
  upSuideStatus?: number
}

/**
 * @description: 托运合同详情
 */
export interface GetContractDetailInterface {
  contractId: number
}

/**
 * @description: 托运合同删除
 */
export interface DeleteContractInterface {
  contractId: number
}

/**
 * @description: 托运合同终止
 */
export interface TerminationContractInterface {
  contractId: number
}

/**
 * @description: 托运合同启用
 */
export interface EnableContractInterface {
  contractContent: Array<ContractContentInterface>
  contractId: number
  contractSn: string
  contractTerm: string
  packCompany: string
  packContent: string
  packMobile: string
  price: string | number
  startTime: string
  unloadCompany: string
  unloadContent: string
  unloadMobile: string
  weight: string | number
}

export interface ContractContentInterface {
  fileName: string
  filePath: string
}

/**
 * @description: 合同文件下载
 */
export interface ContractFilesDownloadInterface {
  contractId: number
}

/**
 * @description: 获取承运协议列表
 */
export interface GetCarriageAgreementListInterface {
  pageNum: number
  perPage: number
  agreementStatus?: string
  driverStatus?: string
  endTime?: string
  idCard?: string
  nameOrTel?: string
  startTime?: string
  timeType?: number
}

/**
 * @description: 获取承运协议详情
 */
export interface GetCarriageAgreementDetailInterface {
  driverId: number
}

export interface CarriageAgreementDownloadInterface {
  agreementStatus?: string
  driverStatus?: string
  endTime?: string
  idCard?: string
  nameOrTel?: string
  startTime?: string
  timeType?: number
}

/**
 * @description: 获取开票信息列表
 */
export interface GetInvoicingListInterface {
  pageNum: number
  perPage: number
  invoiceConsignorCode?: string
  invoiceBankNumber?: string
  invoiceTitle?: string
  timeType?: number
  startTime?: string
  endTime?: string
}

/**
 * @description: 获取开票信息详情
 */
export interface GetInvoicingDetailInterface {
  invoicingId: number
}

/**
 * @description: 更新开票信息详情
 */
export interface UpdateInvoicingDetailInterface {
  invoicingId: number
  invoiceTitle: string
  invoiceConsignorCode: string
  invoiceBankNumber: string
  invoiceBankName: string
  invoiceAddress: string
  invoiceMobile: string
  remarks: string
  fileList: Array<string>
}
