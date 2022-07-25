import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);
// 查询设备信息
export const queryDeviceModelData = (params) => request.get(`/iot/device/queryDeviceModelData`, {params});
// 查询设备照片
export const queryWarnPicture = (params) => request.get(`/iot/video/queryWarnPicture`, {params});
