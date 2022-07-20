import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

export const queryPropertiesHistoryData = (query, params) =>
  request.post(`iot/device/queryPropertiesHistoryData?deviceId=${query.deviceId}&productId=${query.productId}&identifier=${query.identifier}`, params);

export const queryWarnPicture = params =>
  request.get(`iot/video/queryWarnPicture?deviceId=${params.deviceid}&eventId=${params.eventid}`);