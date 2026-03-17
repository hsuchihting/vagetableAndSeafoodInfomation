# 匯出簡易系統使用率報表

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/https://beta-nd-panel-api.nidin.shop/1.0/statistic/operateApiSummarySheets`
- Method: `GET`
- remark: 回傳的是以日或以月合計的數值

## Request Query Parameters

```cmd
?start_date=20220522&end_date=20220531&store_ids=1,2,3&list_type=daily
```

## Request Query Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| list_type     | String   | 查詢類型，daily:每日，monthly:每月，依日期合計，依年月分組：daily_group_by_month |
| start_date   | String   | 查詢起始日期，YYYYMMDD，依年月合計：YYYYMM，依日期合計，依年月分組：YYYYMMDD |
| end_date     | String   | 查詢結束日期，YYYYMMDD，依日期合計：YYYYMMDD，與起始日期間隔不可超過12個月，依年月合計：YYYYMM，與起始年月間隔不可超過24個月，依日期合計，依年月分組：YYYYMMDD，與起始日期間隔不可超過12個月 |
| brand_ids   | Number  | (可選)品牌ID清單，逗號分隔 |
| store_ids   | String  | (可選)門市ID 清單，逗號分隔|

## Response Body

```cmd
Content-Description →File Transfer
Content-Disposition →attachment; filename="OrderSummary_2021-10-20_170404.xlsx"
Content-Type →application/vnd.ms-excel
---Binary output buffer---
```

## Response Body description

| 欄位名稱                           | 類型       | 說明                                 |
| -------------------------------- | ---------- | ------------------------------------ |
| File           | buffer     | Content type in application/vnd.ms-excel                |
