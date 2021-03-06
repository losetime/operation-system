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
 * @description: ??????????????????
 */
export function apiGetVehicleList(params: GetVehicleListInterface): Promise<any> {
  return $http.request({
    url: Api.getVehicleList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
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
 * @description: ??????????????????
 */
export function apiGetVehicleDetail(params: GetVehicleDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getVehicleDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiAddVehicleInfo(params: AddVehicleInfoInterface): Promise<any> {
  return $http.request({
    url: Api.addVehicleInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiSaveVehicleInfo(params: SaveVehicleInfoInterface): Promise<any> {
  return $http.request({
    url: Api.saveVehicleInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiRefuseVehicleAudit(params: RefuseVehicleAuditInterface): Promise<any> {
  return $http.request({
    url: Api.refuseVehicleAudit,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiUpdateVehicleImageInfo(params: UpdateVehicleImageInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateVehicleImageInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: OCR????????????
 */
export function getVehicleOCRInfo(params: OCRVehiclePicture): Promise<any> {
  return $http.request({
    url: Api.ocrVehicleInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetConsignorList(params: GetConsignorListInterface): Promise<any> {
  return $http.request({
    url: Api.getConsignorList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetConsignorDetail(params: GetConsignorDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getConsignorDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiAddConsignorInfo(params: AddConsignorInfoInterface): Promise<any> {
  return $http.request({
    url: Api.addConsignorInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiUpdateConsignorInfo(params: UpdateConsignorInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateConsignorInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiRefuseConsignorInfo(params: RefuseConsignorInfoInterface): Promise<any> {
  return $http.request({
    url: Api.refuseConsignorInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiUpdateConsignorImage(params: UpdateConsignorImageInterface): Promise<any> {
  return $http.request({
    url: Api.updateConsignorImageInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetDriverList(params: GetDriverListInterface): Promise<any> {
  return $http.request({
    url: Api.getDriverList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetDriverDetail(params: GetDriverDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getDriverDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiAddDriverInfo(params: AddDriverInfoInterface): Promise<any> {
  return $http.request({
    url: Api.addDriverInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiUpdateDriverInfo(params: UpdateDriverInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateDriverInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiRefuseDriverInfo(params: RefuseDriverInfoInterface): Promise<any> {
  return $http.request({
    url: Api.refuseDriverInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiUpdateDriverImage(params: UpdateDriverImageInterface): Promise<any> {
  return $http.request({
    url: Api.updateDriverImage,
    method: 'POST',
    params,
  })
}

/**
 * @description: ?????????????????????
 */
export function apiGetBankCardList(params: GetBankCardListInterface): Promise<any> {
  return $http.request({
    url: Api.getBankCardList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ?????????????????????
 */
export function apiGetBankCardDetail(params: GetBankCardDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getBankCardDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ?????????????????????
 */
export function apiUpdateBankCardInfo(params: UpdateBankCardInfoInterface): Promise<any> {
  return $http.request({
    url: Api.updateBankCardInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetContractList(params: GetContractListInterface): Promise<any> {
  return $http.request({
    url: Api.getContractList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetContractDetail(params: GetContractDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getContractDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiDeleteContract(params: DeleteContractInterface): Promise<any> {
  return $http.request({
    url: Api.deleteContract,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiTerminationContract(params: TerminationContractInterface): Promise<any> {
  return $http.request({
    url: Api.terminationContract,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiEnableContract(params: EnableContractInterface): Promise<any> {
  return $http.request({
    url: Api.enableContract,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
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
 * @description: ????????????????????????
 */
export function apiGetCarriageAgreementList(params: GetCarriageAgreementListInterface): Promise<any> {
  return $http.request({
    url: Api.getCarriageAgreementList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiGetCarriageAgreementDetail(params: GetCarriageAgreementDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getCarriageAgreementDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
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
 * @description: ????????????????????????
 */
export function apiGetInvoicingList(params: GetInvoicingListInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicingList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiGetInvoicingDetail(params: GetInvoicingDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getInvoicingDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function UpdateGetInvoicingDetail(params: UpdateInvoicingDetailInterface): Promise<any> {
  return $http.request({
    url: Api.UpdateInvoicingDetail,
    method: 'POST',
    params,
  })
}
