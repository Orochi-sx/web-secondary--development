import request from "./request";

/**
 * 查询资产(新的)
 * @param {*} params
 */
export const getAssets = (cata, type, params2) =>
  request.post(`asset/queryList?cata=${cata}&type=${type}`, params2);

/**
 * 查询资产
 */
 export const queryAssetById = id =>
   request.post(`/asset/getAssetData?asset_id=${id}`, []);

  /**
 * 查询资产数据
 * @param {*} params
 */
export const queryDataSource = (id, params) =>
  request.post(`form/list/model/data/queryData?modelId=${id}`, params);

export const selectData = (id, params) =>
  request.post(`form/list/model/data/selectData?modelId=${id}`, params); 

export const removeData = (id, params) =>
  request.post(`form/list/model/data/removeData?modelId=${id}`, params); 

  export const verifyPassword = (params) =>
  request.post(`system/authority/verifyPassword`, params); 

