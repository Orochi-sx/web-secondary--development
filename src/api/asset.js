import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const carbonAssetReport = (params) => request.get(`/ElectricReport/carbonAssetReport`, { params });
export const exportCarbonAssetReport = (params) => request.get(`/ElectricReport/exportCarbonAssetReport`, { params, responseType: "blob" });
