# 取得簡易系統使用率報表

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/statistic/operateApiSummary`
- Method: `GET`
- remark: 回傳的是以日或以月合計的數值

## Request Query Parameters

```cmd
?start_date=20220522&end_date=20220531&store_ids=1,2,3&list_type=daily&return_type=page&page=1&size=20
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
| brand_ids   | Number  | (可選)品牌ID清單 |
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
        "size": 10,
        "total": 10,
        "count": 10,
        "start_date": "2022-05-22",
        "end_date": "2022-05-31",
        "brand_ids": null,
        "store_ids": null
    },
    "list": {
        "2022-05-22": {
            "date": "2022-05-22",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05-23": {
            "date": "2022-05-23",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05-24": {
            "date": "2022-05-24",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05-25": {
            "date": "2022-05-25",
            "operate_api_order": 74,
            "operate_api_crm": 0,
            "operate_api_data": 3
        },
        "2022-05-26": {
            "date": "2022-05-26",
            "operate_api_order": 14,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05-27": {
            "date": "2022-05-27",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05-28": {
            "date": "2022-05-28",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05-29": {
            "date": "2022-05-29",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05-30": {
            "date": "2022-05-30",
            "operate_api_order": 54,
            "operate_api_crm": 0,
            "operate_api_data": 3
        },
        "2022-05-31": {
            "date": "2022-05-31",
            "operate_api_order": 97,
            "operate_api_crm": 0,
            "operate_api_data": 0
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
        "size": 10,
        "total": 5,
        "count": 5,
        "start_date": "2022-01",
        "end_date": "2022-05",
        "brand_ids": null,
        "store_ids": null
    },
    "list": {
        "2022-01": {
            "date": "2022-01",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-02": {
            "date": "2022-02",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-03": {
            "date": "2022-03",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-04": {
            "date": "2022-04",
            "operate_api_order": 0,
            "operate_api_crm": 0,
            "operate_api_data": 0
        },
        "2022-05": {
            "date": "2022-05",
            "operate_api_order": 239,
            "operate_api_crm": 0,
            "operate_api_data": 6
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
        "size": 10,
        "total": 0,
        "count": 2,
        "start_date": "2022-05-25",
        "end_date": "2022-06-01",
        "brand_ids": null,
        "store_ids": null
    },
    "list": {
        "2022-05": {
            "2022-05-25": {
                "date": "2022-05-25",
                "operate_api_order": 74,
                "operate_api_crm": 0,
                "operate_api_data": 3
            },
            "2022-05-26": {
                "date": "2022-05-26",
                "operate_api_order": 14,
                "operate_api_crm": 0,
                "operate_api_data": 0
            },
            "2022-05-27": {
                "date": "2022-05-27",
                "operate_api_order": 0,
                "operate_api_crm": 0,
                "operate_api_data": 0
            },
            "2022-05-28": {
                "date": "2022-05-28",
                "operate_api_order": 0,
                "operate_api_crm": 0,
                "operate_api_data": 0
            },
            "2022-05-29": {
                "date": "2022-05-29",
                "operate_api_order": 0,
                "operate_api_crm": 0,
                "operate_api_data": 0
            },
            "2022-05-30": {
                "date": "2022-05-30",
                "operate_api_order": 54,
                "operate_api_crm": 0,
                "operate_api_data": 3
            },
            "2022-05-31": {
                "date": "2022-05-31",
                "operate_api_order": 97,
                "operate_api_crm": 0,
                "operate_api_data": 0
            }
        },
        "2022-06": {
            "2022-06-01": {
                "date": "2022-06-01",
                "operate_api_order": 0,
                "operate_api_crm": 0,
                "operate_api_data": 0
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
