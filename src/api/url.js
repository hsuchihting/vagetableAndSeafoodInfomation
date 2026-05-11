import { get } from './methods';

const openDataBaseUrl = 'https://data.moa.gov.tw/Service/OpenData/FromM';

/**
 * 農漁產品交易 API
 * @name AquaticTransData - 漁產品交易資料
 * @name FarmTransData - 農產品交易資料
 */
const aquaticTransData = `${openDataBaseUrl}/AquaticTransData.aspx`;
const farmTransData = `${openDataBaseUrl}/FarmTransData.aspx`;

/**
 * @name getFisheryProducts - 獲取漁產品交易數據
 * @param {Object} params - 查詢參數
 * @name getAgriProducts - 獲取農產品交易數據
 * @param {Object} params - 查詢參數
 */
export const getFisheryProducts = () => {
  return get(aquaticTransData, {
    IsTransData: 1,
    UnitId: '039'
  });
};

export const getAgriProducts = () => {
  return get(farmTransData, {
    IsTransData: 1,
    UnitId: '037'
  });
};
