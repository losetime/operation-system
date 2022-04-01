import { $http } from '../http/index'

import {
  GetVehicleListInterface,
  VehicleListExportInterface,
  GetVehicleDetailInterface,
  AddVehicleInfoInterface,
  SaveVehicleInfoInterface,
  RefuseVehicleAuditInterface,
  UpdateVehicleImageInfoInterface,
  OCRVehiclePicture,
  GetConsignorListInterface,
  GetConsignorDetailInterface,
  AddConsignorInfoInterface,
  UpdateConsignorInfoInterface,
  RefuseConsignorInfoInterface,
  UpdateConsignorImageInterface,
  GetDriverListInterface,
  GetDriverDetailInterface,
  AddDriverInfoInterface,
  UpdateDriverInfoInterface,
  RefuseDriverInfoInterface,
  UpdateDriverImageInterface,
  GetBankCardListInterface,
  GetBankCardDetailInterface,
  UpdateBankCardInfoInterface,
  GetContractListInterface,
  GetContractDetailInterface,
  DeleteContractInterface,
  TerminationContractInterface,
  EnableContractInterface,
  ContractFilesDownloadInterface,
  GetCarriageAgreementListInterface,
  GetCarriageAgreementDetailInterface,
  CarriageAgreementDownloadInterface,
  GetInvoicingListInterface,
  GetInvoicingDetailInterface,
  UpdateInvoicingDetailInterface,
} from '../types/information'

enum Api {
  getVehicleList = '/vehicle/index',
  vehicleListExport = '/vehicle/export',
  getVehicleDetail = '/vehicle/detail',
  addVehicleInfo = '/vehicle/store',
  saveVehicleInfo = '/vehicle/update',
  refuseVehicleAudit = '/vehicle/refuse',
  updateVehicleImageInfo = '/vehicle/imgUpload',
  ocrVehicleInfo = '/transport/driverOcrImage',

  getConsignorList = '/consignor/index',
  getConsignorDetail = '/consignor/detail',
  addConsignorInfo = '/consignor/store',
  updateConsignorInfo = '/consignor/update',
  refuseConsignorInfo = '/consignor/refuse',
  updateConsignorImageInfo = '/consignor/imgUpload',

  getDriverList = '/driver/index',
  getDriverDetail = '/driver/detail',
  addDriverInfo = '/driver/store',
  updateDriverInfo = '/driver/update',
  refuseDriverInfo = '/driver/refuse',
  updateDriverImage = '/driver/imgUpload',

  getBankCardList = '/bank/index',
  getBankCardDetail = '/bank/detail',
  updateBankCardInfo = '/bank/update',

  getContractList = '/transport/contractList',
  getContractDetail = '/transport/contractShow',
  deleteContract = '/transport/contractDel',
  terminationContract = '/transport/contractEnd',
  enableContract = '/transport/contractStore',
  contractFilesDownload = '/transport/contractdowload',

  getCarriageAgreementList = '/agreement/index',
  getCarriageAgreementDetail = '/agreement/show',
  carriageAgreementDownload = '/agreement/export',

  getInvoicingList = '/information/index',
  getInvoicingDetail = '/information/show',
  UpdateInvoicingDetail = '/information/save',
}

/**
 * @description: 车辆信息列表
 */
export function apiGetVehicleList(params: GetVehicleListInterface): Promise<any> {
  return $http.request({
    url: Api.getVehicleList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 车辆信息列表导出
 */
export function apiVehicleListExport(params: VehicleListExportInterface): Promise<any> {
  return $http.request({
    url: Api.vehicleListExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 车辆信息详情
 */
export function apiGetVehicleDetail(params: GetVehicleDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getVehicleDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 车辆信息新增
 */
export function apiAddVehicleInfo(params: AddVehicleInfoInterface): Promise<any> {
  return $http.request({
    url: Api.addVehicleInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 车辆信息更新
 */
export function apiSaveVehicleInfo(params: SaveVehicleInfoInterface): Promise<any> {
  return $http.request({
    url: Api.saveVehicleInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 车辆信息审核拒绝
 */
export function apiRefuseVehicleAudit(params: RefuseVehicleAuditInterface): Promise<any> {
  return $http.request({
    url: Api.refuseVehicleAudit,
    method: 'POST',
    params,
  })
}

/**
 * @description: 更新车辆图片信息
 */
export function apiUpdateVehicleImageInfo(params: UpdateVehicleImageInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateVehicleImageInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: OCR识别图片
 */
export function getVehicleOCRInfo(params: OCRVehiclePicture): Promise<any> {
  return $http.request({
    url: Api.ocrVehicleInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 货主信息列表
 */
export function apiGetConsignorList(params: GetConsignorListInterface): Promise<any> {
  return $http.request({
    url: Api.getConsignorList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 货主信息详情
 */
export function apiGetConsignorDetail(params: GetConsignorDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getConsignorDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 货主信息新增
 */
export function apiAddConsignorInfo(params: AddConsignorInfoInterface): Promise<any> {
  return $http.request({
    url: Api.addConsignorInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 货主信息更新
 */
export function apiUpdateConsignorInfo(params: UpdateConsignorInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateConsignorInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 货主信息拒绝
 */
export function apiRefuseConsignorInfo(params: RefuseConsignorInfoInterface): Promise<any> {
  return $http.request({
    url: Api.refuseConsignorInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 货主信息图片更新
 */
export function apiUpdateConsignorImage(params: UpdateConsignorImageInterface): Promise<any> {
  return $http.request({
    url: Api.updateConsignorImageInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 司机信息列表
 */
export function apiGetDriverList(params: GetDriverListInterface): Promise<any> {
  return $http.request({
    url: Api.getDriverList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 司机信息详情
 */
export function apiGetDriverDetail(params: GetDriverDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getDriverDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 司机信息新增
 */
export function apiAddDriverInfo(params: AddDriverInfoInterface): Promise<any> {
  return $http.request({
    url: Api.addDriverInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 司机信息更新
 */
export function apiUpdateDriverInfo(params: UpdateDriverInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateDriverInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 司机信息拒绝
 */
export function apiRefuseDriverInfo(params: RefuseDriverInfoInterface): Promise<any> {
  return $http.request({
    url: Api.refuseDriverInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 司机信息图片更新
 */
export function apiUpdateDriverImage(params: UpdateDriverImageInterface): Promise<any> {
  return $http.request({
    url: Api.updateDriverImage,
    method: 'POST',
    params,
  })
}

/**
 * @description: 银行卡信息列表
 */
export function apiGetBankCardList(params: GetBankCardListInterface): Promise<any> {
  return $http.request({
    url: Api.getBankCardList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 银行卡信息详情
 */
export function apiGetBankCardDetail(params: GetBankCardDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getBankCardDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 银行卡信息更新
 */
export function apiUpdateBankCardInfo(params: UpdateBankCardInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateBankCardInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: 托运合同列表
 */
export function apiGetContractList(params: GetContractListInterface): Promise<any> {
  return $http.request({
    url: Api.getContractList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 托运合同详情
 */
export function apiGetContractDetail(params: GetContractDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getContractDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 托运合同删除
 */
export function apiDeleteContract(params: DeleteContractInterface): Promise<any> {
  return $http.request({
    url: Api.deleteContract,
    method: 'POST',
    params,
  })
}

/**
 * @description: 托运合同终止
 */
export function apiTerminationContract(params: TerminationContractInterface): Promise<any> {
  return $http.request({
    url: Api.terminationContract,
    method: 'POST',
    params,
  })
}

/**
 * @description: 托运合同启用
 */
export function apiEnableContract(params: EnableContractInterface): Promise<any> {
  return $http.request({
    url: Api.enableContract,
    method: 'POST',
    params,
  })
}

/**
 * @description: 合同文件下载
 */
export function apiContractFilesDownload(params: ContractFilesDownloadInterface): Promise<any> {
  return $http.request({
    url: Api.contractFilesDownload,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 获取承运协议列表
 */
export function apiGetCarriageAgreementList(params: GetCarriageAgreementListInterface): Promise<any> {
  return $http.request({
    url: Api.getCarriageAgreementList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取承运协议详情
 */
export function apiGetCarriageAgreementDetail(params: GetCarriageAgreementDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getCarriageAgreementDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 承运协议导出
 */
export function apiCarriageAgreementDownload(params: CarriageAgreementDownloadInterface): Promise<any> {
  return $http.request({
    url: Api.carriageAgreementDownload,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: 获取开票信息列表
 */
export function apiGetInvoicingList(params: GetInvoicingListInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicingList,
    method: 'POST',
    params,
  })
}

/**
 * @description: 获取开票信息详情
 */
export function apiGetInvoicingDetail(params: GetInvoicingDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicingDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: 更新开票信息详情
 */
export function UpdateGetInvoicingDetail(params: UpdateInvoicingDetailInterface): Promise<any> {
  return $http.request({
    url: Api.UpdateInvoicingDetail,
    method: 'POST',
    params,
  })
}
