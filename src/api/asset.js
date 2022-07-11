import request from "./request";

/**
 * 请求资产 支持条件查询
 */
 export const queryAssetById = (id, dataForm) =>
    request.post(`/asset/getAssetData?asset_id=${id}`, dataForm ? dataForm : []);
