import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);
/**
 * 登出
 * @returns 
 */
export const logout = () =>
  request.get(`/system/authority/logout`);
