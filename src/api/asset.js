import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = (id) => request.post(`/asset/getAssetData?asset_id=${id}`, []);
// 导出
export const queryExport= (data,message) => request.post(`/bhxq/export?condition=${message}`, [...data.tableHead],{ responseType: "blob" });
// 下拉列表
export const queryColumns = (params) => request.get(`/bhxq/queryColumns`, { params });
// 查询结果列表
export const queryResultList = (data,message,pageSize,pageNum) => request.post(`/bhxq/query?condition=${message}&pageSize=${pageSize}&pageNum=${pageNum}`, [...data.tableHead] );
