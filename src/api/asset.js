import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const dsfReport = (params) => request.get(`/ElectricReport/dsfReport`, { params });
export const exportDsfReport = (params) => request.get(`/ElectricReport/exportDsfReport`, { params, responseType: "blob" });
