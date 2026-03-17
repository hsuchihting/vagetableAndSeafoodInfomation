# 取得會員卡的指定商品贈點活動列表

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/group/:group_id/pointProductBonus/list`
- Method：GET

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| group_id | Number | 會員卡 ID |

## Request Query Parameter
|欄位｜類型｜敘述｜
|----|----|----|
| page | Number | 頁碼，預設為 1 |
| size | Number | 每頁筆數，預設為 10，，size range: 1-50 |
| status | String | 活動狀態： ‘ongoing’： 進行中, 'waiting': 尚未開始 , ‘ended’ 已結束, 'disabled': 暫停 |
| name | String | <optional> 活動名稱 （模糊比對）｜
| start_time | String | <optional> 活動開始時間（範圍搜尋-開始）格式：YYYY-MM-DD HH:mm:ss |
| end_time | String | <optional> 活動開始時間（範圍搜尋-結束）格式：YYYY-MM-DD HH:mm:ss |
| sort | String | <optional> 排序依據，格式為 `欄位_排序方式`，例如 `start_time_desc`（預設為 `created_at_desc`） |

## Response example

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "meta": {
        "page": 1,
        "size": 20,
        "total_rows": 1,
        "total_pages": 1
    },
    "list": {
        "68": {
            "id": 68,
            "name": "每週一、二、三、五買2份小豬堡套餐送1點",
            "description": null,
            "trigger_type": 1,
            "activity_type": 3,
            "brand_id": 121,
            "store_id": 0,
            "usage_type": 1,
            "membership_score_mode": 2,
            "check_method": 1,
            "expire_mode": 0,
            "valid_days": 1,
            "point_expire_time": "2030-12-31 23:59:59",
            "rule_expire_time": null,
            "start_time": "2029-01-01 00:00:00",
            "end_time": "2030-12-31 23:59:59",
            "weight": 1,
            "point_id": 41,
            "amount": 1,
            "max_apply_times": 0,
            "multiplier": 1,
            "rounding_type": 3,
            "condition_list": [
                {
                    "id": 65,
                    "rule_id": 68,
                    "name": "指定商品累積滿2件",
                    "src_type": 9,
                    "src_id": null,
                    "unit_type": 1,
                    "operator": 2,
                    "operand": 2
                }
            ],
            "condition_text_list": [
                "滿指定商品數量 - 2件"
            ],
            "range_list": {
                "38": {
                    "id": 38,
                    "rule_id": 68,
                    "range_id": 39,
                    "is_exclude": 0,
                    "usage_type": 1,
                    "usage_id": 121
                },
                "39": {
                    "id": 39,
                    "rule_id": 68,
                    "range_id": 39,
                    "is_exclude": 1,
                    "usage_type": 2,
                    "usage_id": 332
                }
            },
            "membership_range_list": {
                "42": {
                    "id": 42,
                    "rule_id": 68,
                    "range_id": 42,
                    "is_exclude": 0,
                    "usage_type": 1,
                    "usage_id": 43
                }
            },
            "interval_range_list": {
                "5": {
                    "id": 5,
                    "rule_id": 68,
                    "range_id": 3,
                    "is_exclude": 0,
                    "usage_type": 2,
                    "usage_date": null,
                    "usage_day": 2
                },
                "6": {
                    "id": 6,
                    "rule_id": 68,
                    "range_id": 3,
                    "is_exclude": 0,
                    "usage_type": 2,
                    "usage_date": null,
                    "usage_day": 3
                },
                "7": {
                    "id": 7,
                    "rule_id": 68,
                    "range_id": 3,
                    "is_exclude": 0,
                    "usage_type": 2,
                    "usage_date": null,
                    "usage_day": 4
                },
                "8": {
                    "id": 8,
                    "rule_id": 68,
                    "range_id": 3,
                    "is_exclude": 0,
                    "usage_type": 2,
                    "usage_date": null,
                    "usage_day": 6
                }
            },
            "product_range_list": {
                "3": {
                    "id": 3,
                    "rule_id": 68,
                    "range_id": 3,
                    "is_exclude": 0,
                    "usage_type": 3,
                    "usage_vendor_custom_id": "NidingK7aDcp3bF",
                    "product_name": "小豬堡套餐"
                },
                "4": {
                    "id": 4,
                    "rule_id": 68,
                    "range_id": 3,
                    "is_exclude": 0,
                    "usage_type": 3,
                    "usage_vendor_custom_id": "NidinbZMPSRQqI",
                    "product_name": "小豬堡套餐"
                }
            },
            "order_usage_list": [],
            "related_brand_ids": {
                "121": 121
            },
            "related_store_ids": {
                "332": 332
            },
            "range": {
                "allow": {
                    "brand_id": [
                        121
                    ],
                    "store_id": []
                },
                "deny": {
                    "brand_id": [],
                    "store_id": [
                        332
                    ]
                }
            },
            "membership_range": {
                "allow": {
                    "group_id": [
                        43
                    ],
                    "membership_id": []
                },
                "deny": {
                    "group_id": [],
                    "membership_id": []
                }
            },
            "interval_range": {
                "allow": {
                    "daily": [],
                    "date": [],
                    "weekday": [
                        2,
                        3,
                        4,
                        6
                    ],
                    "monthday": []
                },
                "deny": {
                    "daily": [],
                    "date": [],
                    "weekday": [],
                    "monthday": []
                }
            },
            "product_range": {
                "allow": {
                    "product": [],
                    "package": [
                        "NidingK7aDcp3bF",
                        "NidinbZMPSRQqI"
                    ]
                },
                "deny": {
                    "product": [],
                    "package": []
                },
                "product_name_map": [],
                "package_name_map": {
                    "NidingK7aDcp3bF": "小豬堡套餐",
                    "NidinbZMPSRQqI": "小豬堡套餐"
                }
            },
            "order_usage_range": {
                "allow": {
                    "order_type": [],
                    "delivery_type": [],
                    "trade_type": []
                },
                "deny": {
                    "order_type": [],
                    "delivery_type": [],
                    "trade_type": []
                }
            }
        }
    },
    "brand_name_map": {
        "121": "Alice 咖啡"
    },
    "store_name_map": {
        "332": "總店"
    }
}
```

## Response fields description

|欄位｜類型｜敘述｜
|----|----|----|
| status | Number | 回應狀態碼 |
| message | String | 回應訊息 |
| description | String | 回應描述訊息 |
| token_need_replace | Number | 是否需要更換 Token，1: 是，0: 否 |
| meta | Object | 分頁資訊 |
| meta.page | Number | 頁碼 |
| meta.size | Number | 每頁筆數 |
| meta.total_rows | Number | 總筆數 |
| meta.total_pages | Number | 總頁數 |
| list | Array | 活動列表，以活動 ID 為 key |
| list[].id | Number | 活動 ID |
| list[].name | String | 活動名稱 |
| list[].description | String | 活動描述 |
| list[].trigger_type | Number | 觸發類型，1: 訂單，2: 邀請獎勵，3: 索取代碼 |
| list[].activity_type | Number | 活動類型，1: 基本規則，2:加碼規則（取最優），3: 加碼規則（全觸發）|
| list[].brand_id | Number | 活動適用品牌 ID |
| list[].store_id | Number | 活動適用門市 ID，0 代表全門市 |
| list[].usage_type | Number | 活動適用範圍使用類型，0: 平台，1: 品牌，2: 門市 |
| list[].membership_score_mode | Number | 會員積分模式，1: 點數+積分，2: 純點數，3: 純積分 |
| list[].check_method | Number | 活動檢核方式，1: 所有條件皆須符合，2: 任一條件符合即可 |
| list[].expire_mode | Number | 活動過期模式，0: 無效期, 1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使用 rule_expire_time |
| list[].valid_days | Number | 可使用天數 |
| list[].point_expire_time | String | 點數過期時間（格式：YYYY-MM-DD HH:mm:ss） |
| list[].rule_expire_time | String | 規則指定點數到期時間（格式：YYYY-MM-DD HH:mm:ss） |
| list[].start_time | String | 活動開始時間 （格式：YYYY-MM-DD HH:mm:ss） |
| list[].end_time | String | 活動結束時間 （格式：YYYY-MM-DD HH:mm:ss） |
| list[].weight | Number | 活動權重，數字越大優先級越高 |
| list[].point_id | Number | 點數 ID |
| list[].amount | Number | 每組贈送點數數量 |
| list[].max_apply_times | Number | 最高贈送組數， 0 代表無限制 |
| list[].multiplier | Number | 贈送倍數，預設為 1，當 multiplier 大於 1 時，代表贈送點數為 amount 的 multiplier 倍 |
| list[].rounding_type | Number | 贈送點數四捨五入方式，1: 無條件進位，2: 無條件捨去，3: 四捨五入 |
| list[].condition_list | Array | 活動條件列表 |
| list[].condition_list[].id | Number | 活動條件 ID |
| list[].condition_list[].name | String | 活動條件名稱 |
| list[].condition_list[].src_type | Number | 活動條件來源類型，1：註冊，2：登入，3：訂單金額，4：訂單數量，5：訂單商品數，6：取得點數量，7：使用點數量，8：取得積分數量，9：填妥會員資料，10：加入官方帳號｜
| list[].condition_list[].src_id | Number | 檢查目標 ID |
| list[].condition_list[].unit_type | Number | 計算來源單位，1: 累積，2: 存在一筆，3: 每一筆 |
| list[].condition_list[].operator | Number | 檢核運算子，1：大於，2：大於等於，3：小於，4：小於等於，5：等於，6：不等於 |
| list[].condition_list[].operand | Number | 目標值 |
| list[].condition_text_list | Array | 活動條件文字描述列表 |
| list[].range | Object | 適用門市範圍 |
| list[].range.allow | Object | 活動適用門市範圍-允許 |
| list[].range.allow.brand_id | Array | 活動適用品牌 ID 列表 |
| list[].range.allow.store_id | Array | 活動適用門市 ID 列表 |
| list[].range.deny | Object | 活動適用門市範圍-排除 |
| list[].range.deny.brand_id | Array | 活動不適用品牌 ID 列表 |
| list[].range.deny.store_id | Array | 活動不適用門市 ID 列表 |
| list[].membership_range | Object | 適用會員範圍 |
| list[].membership_range.allow | Object | 活動適用會員範圍-允許 |
| list[].membership_range.allow.group_id | Array | 活動適用會員卡 ID 列表 |
| list[].membership_range.allow.membership_id | Array | 活動適用會員等級 ID 列表 |
| list[].membership_range.deny | Object | 活動適用會員範圍-排除 |
| list[].membership_range.deny.group_id | Array | 活動不適用會員卡 ID 列表 |
| list[].membership_range.deny.membership_id | Array | 活動不適用會員等級 ID 列表 |
| list[].interval_range | Object | 活動適用時間範圍 |
| list[].interval_range.allow | Object | 活動適用時間範圍-允許 |
| list[].interval_range.allow.daily | Array | 每日(有0的值代表指定)，活動適用每日時間範圍列表（格式：HH:mm:ss） |
| list[].interval_range.allow.date | Array | 活動適用特定日期列表（格式：YYYY-MM-DD） |
| list[].interval_range.allow.weekday | Array | 每週第N天(1:週日 ~ 7:週六)｜
| list[].interval_range.allow.monthday | Array | 每月第N天(1~31) |
| list[].interval_range.deny | Object | 活動適用時間範圍-排除 |
| list[].interval_range.deny.daily | Array | 每日(有0的值代表指定)，活動不適用每日時間範圍列表（格式：HH:mm:ss） |
| list[].interval_range.deny.date | Array | 活動不適用特定日期列表（格式：YYYY-MM-DD） |
| list[].interval_range.deny.weekday | Array | 活動不適用每週第N天(1:週日 ~ 7:週六) |
| list[].interval_range.deny.monthday | Array | 活動不適用每月第N天(1~31) |
| list[].product_range | Object | 活動適用商品範圍 |
| list[].product_range.allow | Object | 活動適用商品範圍-允許 |
| list[].product_range.allow.product | Array | 活動適用商品料號 |
| list[].product_range.allow.package | Array | 活動適用套餐料號 |
| list[].product_range.deny | Object | 活動適用商品範圍-排除 |
| list[].product_range.deny.product | Array | 活動不適用商品料號 |
| list[].product_range.deny.package | Array | 活動不適用套餐料號 |
| list[].product_range.product_name_map | Object | 商品名稱對照表(Key是vendor_custom_id) |
| list[].product_range.package_name_map | Object | 套餐名稱對照表(Key是vendor_custom_id) |
| list[].order_usage_range | Object | 指定訂單類型範圍 |
| list[].order_usage_range.allow | Object | 活動適用訂單類型範圍-允許 |
| list[].order_usage_range.allow.order_type | Array | 活動適用訂單類型列表 |
| list[].order_usage_range.allow.delivery_type | Array | 活動適用取餐類型列表 |
| list[].order_usage_range.allow.trade_type | Array | 活動適用付款類型列表 |
| list[].order_usage_range.deny | Object | 活動適用訂單類型範圍-排除 |
| list[].order_usage_range.deny.order_type | Array | 活動不適用訂單類型列表 |
| list[].order_usage_range.deny.delivery_type | Array | 活動不適用取餐類型列表 |
| list[].order_usage_range.deny.trade_type | Array | 活動不適用付款類型列表 |
| brand_name_map | Object | 品牌名稱對照表，key 是品牌 ID，value 是品牌名稱 |
| store_name_map | Object | 門市名稱對照表，key 是門市 ID，value 是門市名稱 |

## Error response example

```json
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
