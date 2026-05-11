# 蔬菜與海鮮行情資訊

一個使用 Vue 3、Vite 與 Tailwind CSS 製作的農漁產品行情查詢網站。網站串接農業部開放資料，提供當日蔬果與漁貨交易行情，並以可愛插畫風格的主題頁面呈現。

線上網站：[https://hsuchihting.github.io/vagetableAndSeafoodInfomation/](https://hsuchihting.github.io/vagetableAndSeafoodInfomation/)

## 功能特色

- 蔬果與漁貨分類切換
- 切換分類時同步更換 Header 主題插畫
- 蔬果使用綠色系，漁貨使用藍色系
- 依資料結構統一呈現品名、代碼、市場、日期、交易量與價格
- 支援關鍵字搜尋，可搜尋品名、代碼、市場、日期、價格與交易量
- 自動過濾休市資料
- 蔬果資料排除花卉交易類別
- 支援 GitHub Pages 自動部署

## 資料來源

本專案使用農業部資料開放平台 API：

- 農產品交易行情：`FarmTransData.aspx?IsTransData=1&UnitId=037`
- 漁產品交易行情：`FisheryProductsTransType`

API Base URL：

```txt
https://data.moa.gov.tw/api/v1
https://data.moa.gov.tw/Service/OpenData/FromM
```

資料會依今日日期查詢：

- 蔬果日期格式：民國年 `YYY.MM.DD`
- 漁貨日期格式：民國年 `YYYMMDD`

## 技術架構

- Vue 3
- Vite
- Tailwind CSS
- GitHub Actions
- GitHub Pages

## 開始開發

安裝依賴：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

預設本機網址：

```txt
http://127.0.0.1:3000/
```

建立正式版本：

```bash
npm run build
```

預覽正式版本：

```bash
npm run preview
```

## 專案結構

```txt
src/
  api/
    methods.js        # GET request helper，負責組 query string
    url.js            # 農業部 API endpoint
  components/
    Header.vue        # 依分類切換主題插畫
    InfoCard.vue      # 分類切換、搜尋與資料入口
    ProductGrid.vue   # 統一的行情卡片 layout
    FishComponent.vue
    VegetableComponent.vue
    Loading.vue
    Footer.vue
  composables/
    loading.js
  utils/
    marketData.js     # 資料正規化、日期格式化、搜尋與休市判斷
  App.vue
  main.js
  style.css
public/
  images/
    header-fish.png
    header-vegetables.png
```

## 部署方式

此專案部署到 GitHub Pages：

```txt
https://hsuchihting.github.io/vagetableAndSeafoodInfomation/
```

部署流程由 `.github/workflows/deploy-pages.yml` 負責：

1. push 到 `main`
2. GitHub Actions 執行 `npm ci`
3. 執行 `npm run build`
4. 將 `dist` 發佈到 `gh-pages` branch
5. GitHub Pages 從 `gh-pages` branch 發佈網站

Vite 已在 `vite.config.js` 設定 base path：

```js
base: '/vagetableAndSeafoodInfomation/'
```

## 備註

如果當日 API 回傳資料皆為休市，頁面會顯示「今日休市」。如果某分類沒有有效交易資料，搜尋與資料筆數也會同步顯示 0 筆。蔬果資料來源會回傳多個交易日期，前端會過濾為今日資料後再顯示。
