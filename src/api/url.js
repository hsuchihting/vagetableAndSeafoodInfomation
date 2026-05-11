import { get } from './methods';

const baseUrl = 'https://data.moa.gov.tw/api/v1';
const openDataBaseUrl = 'https://data.moa.gov.tw/Service/OpenData/FromM';

/**
 * 農漁產品交易 API
 * @name FisheryProductsTransType - 漁產品交易類型
 * @name AgriProductsTransType - 農產品交易類型
 */
const fisheryProductsTransType = `${baseUrl}/FisheryProductsTransType`;
const farmTransData = `${openDataBaseUrl}/FarmTransData.aspx`;

/**
 * @name getFisheryProducts - 獲取漁產品交易數據
 * @param {Object} params - 查詢參數
 * @name getAgriProducts - 獲取農產品交易數據
 * @param {Object} params - 查詢參數
 */
export const getFisheryProducts = (params = {}) => {
  return get(fisheryProductsTransType, params);
};

export const getAgriProducts = () => {
  return get(farmTransData, {
    IsTransData: 1,
    UnitId: '037'
  });
};
