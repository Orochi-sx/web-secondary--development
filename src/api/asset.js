import request from "./request";

/**
 * 查询资产
 */
export const queryAssetById = (id, dataForm) =>
 request.post(`/asset/getAssetData?asset_id=${id}`, dataForm ? dataForm : []);
