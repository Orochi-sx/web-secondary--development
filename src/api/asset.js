import request from "./request";

/**
 * 查询资产
 * @param id 资产ID
 */
export const queryAssetById = id =>
  request.post(`/asset/getAssetData?asset_id=${id}`, []);

/**
 * 查询验证码
 */
export const getAuthPic = () =>
  request.get(`system/authority/getAuthPic?module=loginPassword`, { responseType: 'arraybuffer' });

/**
 * 账号登录
 */
export const loginAccount = (code, dataForm) =>
  request.post(`system/authority/loginAccount4Application?authPicCode=${code}`, dataForm ? dataForm : []);

/**
 * 匿名登录
 */
export const loginAnonymous = (dataForm) =>
  request.post(`system/authority/loginAccountWithoutAuthPicCode`, dataForm)

/**
 * 查询路由
 */
export const queryAll = () => 
  request.get(`system/property/queryAll`);