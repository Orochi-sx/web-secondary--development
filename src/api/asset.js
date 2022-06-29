import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
  request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * 查询用户ID
 */
 export const queryUserId = () =>
 request.get(`/system/authority/user`, []);

/**
 * 查询资产
 */
 export const queryAssetById = (id, dataForm) =>
 request.post(`/asset/getAssetData?asset_id=${id}`, dataForm ? [dataForm] : []);

 /**
 * 已读未读
 */
export const updateReading = (dataId, reading) =>
request.get(`/updateData/update?dataId=${dataId}&reading=${reading}`);