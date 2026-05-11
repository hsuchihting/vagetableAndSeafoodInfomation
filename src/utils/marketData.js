const fieldAliases = {
  vegetable: {
    name: ['CropName', '作物名稱'],
    code: ['CropCode', '作物代號'],
  },
  fish: {
    name: ['SeafoodProdName', 'FishName', '魚貨名稱'],
    code: ['SeafoodProdCode', 'FishCode', '品種代碼'],
  },
  shared: {
    type: ['TcType', '種類代碼'],
    date: ['TransDate', 'transDate', '交易日期'],
    market: ['MarketName', 'marketName', '市場名稱'],
    upperPrice: ['Upper_Price', 'Upper_price', 'UpperPrice', '上價'],
    middlePrice: ['Middle_Price', 'Middle_price', 'MiddlePrice', '中價'],
    lowerPrice: ['Lower_Price', 'Lower_price', 'LowerPrice', '下價'],
    avgPrice: ['Avg_Price', 'Avg_price', 'AvgPrice', '平均價'],
    quantity: ['Trans_Quantity', 'Trans_quantity', 'TransQuantity', '交易量'],
  },
};

const getValue = (item, keys) => {
  const key = keys.find((field) => item[field] !== undefined && item[field] !== null);
  return key ? item[key] : '';
};

const hasValue = (value) => value !== undefined && value !== null && value !== '';

const displayValue = (value) => {
  return hasValue(value) ? value : '-';
};

const normalizeSearchText = (value) => {
  return String(value || '').trim().toLowerCase();
};

const productSearchFields = [
  'name',
  'code',
  'date',
  'market',
  'upperPrice',
  'middlePrice',
  'lowerPrice',
  'avgPrice',
  'quantity',
];

const shouldShowItem = (item, type) => {
  const aliases = fieldAliases[type];
  const name = getValue(item, aliases.name);
  const transType = getValue(item, fieldAliases.shared.type);

  if (name === '休市') return false;
  if (type === 'vegetable' && transType === 'N06') return false;

  return true;
};

const toGregorianYear = (year) => {
  const numericYear = Number(year);
  if (!Number.isFinite(numericYear)) return year;
  return numericYear < 1911 ? String(numericYear + 1911) : String(numericYear);
};

export const formatMarketDate = (dateValue) => {
  const date = String(dateValue || '').trim();
  if (!date) return '-';

  if (date.includes('.')) {
    const [year, month, day] = date.split('.');
    return `${toGregorianYear(year)}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  if (date.includes('-')) {
    const [year, month, day] = date.split('-');
    return `${toGregorianYear(year)}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  if (/^\d{7,8}$/.test(date)) {
    const yearLength = date.length === 8 ? 4 : 3;
    const year = date.slice(0, yearLength);
    const month = date.slice(yearLength, yearLength + 2);
    const day = date.slice(yearLength + 2, yearLength + 4);
    return `${toGregorianYear(year)}-${month}-${day}`;
  }

  return date;
};

export const normalizeMarketProducts = (items = [], type) => {
  const aliases = fieldAliases[type];

  return items.filter((item) => shouldShowItem(item, type)).map((item, index) => {
    const name = getValue(item, aliases.name);
    const code = getValue(item, aliases.code);
    const rawDate = getValue(item, fieldAliases.shared.date);
    const market = getValue(item, fieldAliases.shared.market);

    return {
      id: `${type}-${code || name || index}-${rawDate || index}-${index}`,
      name: name || '未命名品項',
      code: displayValue(code),
      date: formatMarketDate(rawDate),
      market: displayValue(market),
      upperPrice: displayValue(getValue(item, fieldAliases.shared.upperPrice)),
      middlePrice: displayValue(getValue(item, fieldAliases.shared.middlePrice)),
      lowerPrice: displayValue(getValue(item, fieldAliases.shared.lowerPrice)),
      avgPrice: displayValue(getValue(item, fieldAliases.shared.avgPrice)),
      quantity: getValue(item, fieldAliases.shared.quantity),
    };
  });
};

export const filterMarketProducts = (products = [], keyword = '') => {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) return products;

  return products.filter((product) => {
    return productSearchFields.some((field) => {
      return normalizeSearchText(product[field]).includes(normalizedKeyword);
    });
  });
};

export const isMarketClosed = (items = [], type) => {
  const aliases = fieldAliases[type];
  return items.length > 0 && items.every((item) => getValue(item, aliases.name) === '休市');
};
