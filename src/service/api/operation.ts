import { $http } from '../http/index'

import {
  GetWaybillTableDataInterface,
  WaybillExportInterface,
  GetWaybillDetailInterface,
  GetBankCardInfoInterface,
  MigrateWaybillInterface,
  SaveBankCardInterface,
  CallSecondPayInterface,
  GetManifestTableDataInterface,
  GetManifestDetailInterface,
  ManifestExportInterface,
  WriteInAllDataInterface,
  WriteInInvoiceInterface,
  GetWaybillListInterface,
  GetConsultingIndexInterface,
  ConsultingExportInterface,
  AddConsultingInfoInterface,
  ModifyConsultingInfoInterface,
  GetConsultingDetailInterface,
  AddConsultTypeInterface,
  DelConsultTypeInterface,
  DelConsultInfoInterface,
  GetFreightTableDataInterface,
  FreightInvoiceExportInterface,
  GetFreightDetailInterface,
  ImportVehicleInfoInterface,
  ImportETCInfoInterface,
  ImportETCDetailInterface,
  GetManifestAgreement,
} from '../types/operation'

enum Api {
  getWaybillTableData = '/transport/index',
  waybillExport = '/transport/transportExport',
  getWaybillDetail = '/transport/show',
  getBankCardInfo = '/transport/checkBank',
  saveBankCard = '/transport/saveBankData',
  migrateWaybill = '/transport/transportTransfer',
  callSecondPay = '/transport/payAgain',

  getManifestTableData = '/transport/deliveryIndex',
  getManifestDetail = '/transport/deliveryDetail',
  manifestExport = '/transport/deliveryExport',
  getWaybillList = '/transport/deliveryTransportList',
  writeInAllData = '/transport/deliveryInvoice',
  writeInInvoice = '/transport/deliveryInvoiceStore',
  getManifestAgreement = '/delivery/deliverySecretsInfo',

  getConsultingIndex = '/consult/index',
  consultingExport = '/consult/export',
  addConsultingInfo = '/consult/store',
  modifyConsultingInfo = '/consult/save',
  getConsultingDetail = '/consult/detail',
  getConsultTypeIndex = '/consult/consultTypeIndex',
  addConsultType = '/consult/consultTypeStore',
  delConsultType = '/consult/consultTypeDel',
  delConsultInfo = '/consult/del',

  getFreightTableData = '/transportInvoice/index',
  freightInvoiceExport = '/transportInvoice/export',
  getFreightDetail = '/transportInvoice/detail',
  importVehicleInfo = '/transportInvoice/importCarRecord',
  importETCInfo = '/transportInvoice/importEtcOpenInfo',
  importETCDetail = '/transportInvoice/importEtcInvoiceInfo',
}

/**
 * @description: ????????????
 */
export function apiGetWaybillTableData(params: GetWaybillTableDataInterface): Promise<any> {
  return $http.request({
    url: Api.getWaybillTableData,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiWaybillExport(params: WaybillExportInterface): Promise<any> {
  return $http.request({
    url: Api.waybillExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: ????????????
 */
export function apiGetWaybillDetail(params: GetWaybillDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getWaybillDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????
 */
export function apiGetBankCardInfo(params: GetBankCardInfoInterface): Promise<any> {
  return $http.request({
    url: Api.getBankCardInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiMigrateWaybill(params: MigrateWaybillInterface): Promise<any> {
  return $http.request({
    url: Api.migrateWaybill,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????????????????
 */
export function apiSaveBankCard(params: SaveBankCardInterface): Promise<any> {
  return $http.request({
    url: Api.saveBankCard,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiCallSecondPay(params: CallSecondPayInterface): Promise<any> {
  return $http.request({
    url: Api.callSecondPay,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiGetManifestTableData(params: GetManifestTableDataInterface): Promise<any> {
  return $http.request({
    url: Api.getManifestTableData,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiGetManifestDetail(params: GetManifestDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getManifestDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ???????????????????????????
 */
export function apiGetWaybillList(params: GetWaybillListInterface): Promise<any> {
  return $http.request({
    url: Api.getWaybillList,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????/??????
 */
export function apiWriteInAllData(params: WriteInAllDataInterface): Promise<any> {
  return $http.request({
    url: Api.writeInAllData,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiWriteInInvoice(params: WriteInInvoiceInterface): Promise<any> {
  return $http.request({
    url: Api.writeInInvoice,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiManifestExport(params: ManifestExportInterface): Promise<any> {
  return $http.request({
    url: Api.manifestExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: ??????????????????
 */
export function getManifestAgreement(params: GetManifestAgreement): Promise<any> {
  return $http.request({
    url: Api.getManifestAgreement,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiGetConsultingIndex(params: GetConsultingIndexInterface): Promise<any> {
  return $http.request({
    url: Api.getConsultingIndex,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiConsultingExport(params: ConsultingExportInterface): Promise<any> {
  return $http.request({
    url: Api.consultingExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: ????????????
 */
export function apiAddConsultingInfo(params: AddConsultingInfoInterface): Promise<any> {
  return $http.request({
    url: Api.addConsultingInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiModifyConsultingInfo(params: ModifyConsultingInfoInterface): Promise<any> {
  return $http.request({
    url: Api.modifyConsultingInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????
 */
export function apiGetConsultingDetail(params: GetConsultingDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getConsultingDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetConsultTypeIndex(): Promise<any> {
  return $http.request({
    url: Api.getConsultTypeIndex,
    method: 'POST',
  })
}

/**
 * @description: ??????????????????
 */
export function apiAddConsultType(params: AddConsultTypeInterface): Promise<any> {
  return $http.request({
    url: Api.addConsultType,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiDelConsultType(params: DelConsultTypeInterface): Promise<any> {
  return $http.request({
    url: Api.delConsultType,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiDelConsultInfo(params: DelConsultInfoInterface): Promise<any> {
  return $http.request({
    url: Api.delConsultInfo,
    method: 'POST',
    params,
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetFreightTableData(params: GetFreightTableDataInterface): Promise<any> {
  return $http.request({
    url: Api.getFreightTableData,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiFreightInvoiceExport(params: FreightInvoiceExportInterface): Promise<any> {
  return $http.request({
    url: Api.freightInvoiceExport,
    method: 'POST',
    params,
    responseType: 'blob',
  })
}

/**
 * @description: ??????????????????
 */
export function apiGetFreightDetail(params: GetFreightDetailInterface): Promise<any> {
  return $http.request({
    url: Api.getFreightDetail,
    method: 'POST',
    params,
  })
}

/**
 * @description: ????????????????????????
 */
export function apiImportVehicleInfo(params: ImportVehicleInfoInterface): Promise<any> {
  return $http.uploadFiles(
    {
      url: Api.importVehicleInfo,
      method: 'POST',
    },
    params
  )
}

/**
 * @description: ??????ETC????????????
 */
export function apiImportETCInfo(params: ImportETCInfoInterface): Promise<any> {
  return $http.uploadFiles(
    {
      url: Api.importETCInfo,
      method: 'POST',
    },
    params
  )
}

/**
 * @description: ??????ETC????????????
 */
export function apiImportETCDetail(params: ImportETCDetailInterface): Promise<any> {
  return $http.uploadFiles(
    {
      url: Api.importETCDetail,
      method: 'POST',
    },
    params
  )
}
