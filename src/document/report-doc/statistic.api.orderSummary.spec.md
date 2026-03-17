# 取得簡易營運報表

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/statistic/orderSummary`
- Method: `GET`
- remark: 回傳的是以日或以月合計的數值

## Request Query Parameters

```cmd
?start_date=20210101&end_date=20210131&store_ids=1,2,3&list_type=daily&return_type=page&page=1&size=20
```

## Request Query Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| list_type     | String   | 查詢類型，daily:每日，monthly:每月，依日期合計，依年月分組：daily_group_by_month |
| start_date   | String   | 查詢起始日期，YYYYMMDD，依年月合計：YYYYMM，依日期合計，依年月分組：YYYYMMDD |
| end_date     | String   | 查詢結束日期，YYYYMMDD，依日期合計：YYYYMMDD，與起始日期間隔不可超過12個月，依年月合計：YYYYMM，與起始年月間隔不可超過24個月，依日期合計，依年月分組：YYYYMMDD，與起始日期間隔不可超過12個月 |
| return_type | String   | 回傳類型，page:分頁，all:全部資料(預設) |
| page         | Number   | 當 return_type 為 page 時使用，頁碼，預設為 1 |
| size         | Number   | 當 return_type 為 page 時使用，每頁筆數為 10 |
| brand_ids  | Number  | (可選)品牌ID清單 |
| store_ids   | String  | (可選)門市ID 清單，逗號分隔|

## Response Body

### 依日期合計

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "meta": {
        "list_type": "daily",
        "return_type": "page",
        "page": 1,
        "size": 20,
        "total": 181,
        "count": 20,
        "start_date": "2021-01-01",
        "end_date": "2021-01-02",
        "brand_ids": null,
        "store_ids": null
    },
    "list": {
        "2021-01-01": {
            "date": "2021-01-01",
            "order_amount_accepted": 0,
            "order_money_accepted": 0,
            "order_amount_rejected": 0,
            "order_money_rejected": 0,
            "order_amount_takeout": 0,
            "order_amount_delivery": 0
        },
        "2021-01-02": {
            "date": "2021-01-02",
            "order_amount_accepted": 0,
            "order_money_accepted": 0,
            "order_amount_rejected": 0,
            "order_money_rejected": 0,
            "order_amount_takeout": 0,
            "order_amount_delivery": 0
        }
    }
}
```

### 依年月合計

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "meta": {
        "list_type": "monthly",
        "return_type": "all",
        "page": 1,
        "size": 2,
        "total": 2,
        "count": 2,
        "start_date": "2022-02",
        "end_date": "2022-03",
        "brand_ids": null,
        "store_ids": null
    },
    "list": {
        "2022-02": {
            "date": "2022-02",
            "order_amount_accepted": 180,
            "order_money_accepted": 29391,
            "order_amount_rejected": 193,
            "order_money_rejected": 18431,
            "order_amount_takeout": 317,
            "order_amount_delivery": 42
        },
        "2022-03": {
            "date": "2022-03",
            "order_amount_accepted": 529,
            "order_money_accepted": 121857,
            "order_amount_rejected": 507,
            "order_money_rejected": 85141,
            "order_amount_takeout": 898,
            "order_amount_delivery": 115
        }
    }
}
```

### 依日期合計，依年月分組

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "meta": {
        "list_type": "daily_group_by_month",
        "return_type": "all",
        "page": 1,
        "size": 0,
        "total": 0,
        "count": 2,
        "start_date": "2022-02-27",
        "end_date": "2022-03-02",
        "brand_ids": null,
        "store_ids": null
    },
    "list": {
        "2022-02": {
            "2022-02-27": {
                "date": "2022-02-27",
                "order_amount_accepted": 0,
                "order_money_accepted": 0,
                "order_amount_rejected": 0,
                "order_money_rejected": 0,
                "order_amount_takeout": 0,
                "order_amount_delivery": 0
            },
            "2022-02-28": {
                "date": "2022-02-28",
                "order_amount_accepted": 0,
                "order_money_accepted": 0,
                "order_amount_rejected": 0,
                "order_money_rejected": 0,
                "order_amount_takeout": 0,
                "order_amount_delivery": 0
            }
        },
        "2022-03": {
            "2022-03-01": {
                "date": "2022-03-01",
                "order_amount_accepted": 6,
                "order_money_accepted": 620,
                "order_amount_rejected": 8,
                "order_money_rejected": 3290,
                "order_amount_takeout": 13,
                "order_amount_delivery": 1
            },
            "2022-03-02": {
                "date": "2022-03-02",
                "order_amount_accepted": 28,
                "order_money_accepted": 5016,
                "order_amount_rejected": 37,
                "order_money_rejected": 10452,
                "order_amount_takeout": 57,
                "order_amount_delivery": 7
            }
        }
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
| meta                            | Object     | 回傳資料相關資訊                     |
| meta.list_type                  | String     | 查詢類型，daily:每日，monthly:每月，依日期合計，依年月分組：daily_group_by_month |
| meta.return_type                | String     | 回傳類型，page:分頁，all:全部資料(預設) |
| meta.page                       | Number     | 查詢頁數 |
| meta.size                       | Number     | 每頁筆數 |
| meta.total                      | Number     | 總筆數                               |
| meta.count                      | Number     | 本次回傳筆數                         |
| meta.start_date                 | String     | 查詢起始日期                         |
| meta.end_date                   | String     | 查詢結束日期                         |
| meta.brand_ids                  | String     | 查詢品牌ID清單，逗號分隔           |
| meta.store_ids                  | String     | 查詢門市ID清單，逗號分隔           |
| list                            | Object     | 報表資料清單                     |
| list.date                       | String     | 日期或年月                         |
| list.order_amount_accepted      | Number     | 已接單訂單總數量                     |
| list.order_money_accepted       | Number     | 已接單訂單總金額                    |
| list.order_amount_rejected      | Number     | 已拒單訂單總數量                     |
| list.order_money_rejected       | Number     | 已拒單訂單總金額                    |
| list.order_amount_takeout       | Number     | 外帶自取總數量                     |
| list.order_amount_delivery      | Number     | 外送外送總數量                    |
