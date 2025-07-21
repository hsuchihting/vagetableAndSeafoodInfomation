import { get } from './methods';

const baseUrl = 'https://data.moa.gov.tw/api/v1/';

// 漁產品交易
const fisheryProductsTransType = `${baseUrl}/FisheryProductsTransType`;
// 農產品交易
const AgriProductsTransType = `${baseUrl}/AgriProductsTransType`;

// 包裝 API 呼叫方法
export const getFisheryProducts = (params = {}) => {
  return get(fisheryProductsTransType, params);
};

export const getAgriProducts = (params = {}) => {
  return get(AgriProductsTransType, params);
};

