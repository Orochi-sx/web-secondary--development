import request from "./request";

/**
 * 查询资产
 * @param data 资产ID
 */
export const queryAssetById = data =>
  request.post(`/boxianyuan/queryTbSample`, data);

/**
 * 新增节点
 * @param { assetId, name, parentId, id, tierName }
 */
export const createTbSample = data =>
request.post(`/boxianyuan/createTbSample`, data);

/**
 * 修改节点
 * @param { assetId, name, id }
 */
 export const updateTbSample = data =>
 request.post(`/boxianyuan/updateTbSample`, data);

 /**
 * 删除节点
 * @param { assetId, id }
 */
export const deleteTbSample = data =>
request.post(`/boxianyuan/deleteTbSample`, data);