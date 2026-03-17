# 取得營運分析趨勢

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/trend`
- Method: `GET`

## Request Query Parameters

```cmd
brand_id=1&store_id=0&order_src_type=1
```

## Request Query Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| brand_id       | Number   | (可選)品牌ID |
| store_id       | Number   | (可選)門市ID |
| order_src_type | Number   | (可選)訂單來源類型，1:平台，2.專屬，3:平台 LIFF，4:專屬 LIFF，5:街口APP，6:你訂APP |

## Response Body

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 1,
    "trend": {
        "start_date": "2023-12-03",
        "end_date": "2024-01-01",
        "compare_day": 30,
        "compare_start_date": "2023-11-03",
        "compare_end_date": "2023-12-02",
        "current": [
            {
                "date": "2023-12-03",
                "total_order_money": 272,
                "total_order_amount": 3
            },
            {
                "date": "2023-12-04",
                "total_order_money": 4984,
                "total_order_amount": 32
            },
            {
                "date": "2023-12-05",
                "total_order_money": 82916,
                "total_order_amount": 77
            },           
        ],
        "compare": [
            {
                "date": "2023-11-03",
                "total_order_money": 1052,
                "total_order_amount": 19
            },
            {
                "date": "2023-11-04",
                "total_order_money": 54760,
                "total_order_amount": 2
            },          
        ]
    }
}
```

## Response Body description

| 欄位名稱                           | 類型       | 說明                                 |
| -------------------------------- | ---------- | ------------------------------------ |
| status                          | Number     | 狀態碼                               |
| message                         | String     | 回應訊息                             |
| description                     | String     | 回應描述                             |
| token_need_replace              | Number     | 是否需要更換Token，1:是，0:否          |
| trend                           | Object     | 營運分析趨勢資料                     |
| trend.start_date                | String     | 查詢起始日期                         |
| trend.end_date                  | String     | 查詢結束日期                         |
| trend.compare_day               | Number     | 比較天數 （前Ｎ天）                   |
| trend.compare_start_date       | String     | 比較起始日期                         |
| trend.compare_end_date         | String     | 比較結束日期                         |
| trend.current                   | Array      | 當前趨勢資料                         |
| trend.current[].date            | String     | 日期                                 |
| trend.current[].total_order_money | Number   | 該日總訂單金額                     |
| trend.current[].total_order_amount | Number  | 該日總訂單筆數                     |
| trend.compare                   | Array      | 比較趨勢資料                         |
| trend.compare[].date            | String     | 日期                                 |
| trend.compare[].total_order_money | Number   | 該日總訂單金額                     |
| trend.compare[].total_order_amount | Number  | 該日總訂單筆數                     |