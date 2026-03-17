# 取得特定會員等級的等級禮活動排程列

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/levelGiftSchedule/list`
- Method：GET

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |

## Request Query Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| page | Number | 頁碼，預設為 1 |
|size | Number | 單頁筆數，預設為 1 |
|rule_adjust_type|Number|等級變動類型：1: 加入，2: 續約，3: 升等|
|status|Number|狀態：3: 待上架，4: 上架中，5: 未上架|
|activity_name|String|活動名稱，模糊搜尋， size range: 1-45|
|activity_schedule_start_time_date_start|String|篩選項：篩選上架時間 YYYYMMDD|
|activity_schedule_start_time_date_end |String|篩選項：篩選下架時間 YYYYMMDD|
|sort|String|排序方式(如：name ASC, id DESC)|

## Response example

```json
HTTP/2 200 OK
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
        "458": {
            "activity_id": 458,
            "activity_name": "Alice品牌等級1入會禮",
            "activity_schedule_start_time": "2024-01-20 00:00:00",
            "activity_is_repeatable": 0,
            "status": 4,
            "start_time": "2021-01-05 00:00:00",
            "end_time": "2099-12-31 23:59:59",
            "group_id": 43,
            "membership_id": 88,
            "rule_adjust_type": 1,
            "publish_manager_name": "管理員A",
            "create_manager_name": "管理員A",
            "update_manager_name": "管理員B",
            "filter": {
                "membership_group_id": 43,
                "membership_id": 88,
                "src_rule_id": 160
            },
            "gift_point": [
                {
                    "point_id": 41,
                    "score_mode": 2,
                    "time_config": {
                        "expire_mode": 0
                    },
                    "amount_unit": 5
                }
            ],
            "gift_coupon": [
                {
                    "coupon_set_id": "589",
                    "time_config": {
                        "time_type": "day_day",
                        "use_start_day": 0,
                        "use_tolerance_day": 30
                    },
                    "manual_usage_config": {
                        "usage_store_type": 2,
                        "usage_store_value": 121,
                        "coupon_range_code": "NEM1521KFD"
                    },
                    "amount_unit": 1,
                    "coupon_set_code": "MY3RGJIFGP",
                    "name": "小玉紅茶贈品券",
                    "coupon_range_code": "NEM1521KFD",
                    "store_range": {
                        "allow": {
                            "brand_id": [
                                121
                            ],
                            "store_id": [
                                332,
                                334
                            ]
                        },
                        "deny": {
                            "brand_id": [],
                            "store_id": []
                        }
                    }
                },
                {
                    "coupon_set_id": "595",
                    "time_config": {
                        "time_type": "day_day",
                        "use_start_day": 1,
                        "use_tolerance_day": 7
                    },
                    "manual_usage_config": {
                        "usage_store_type": 2,
                        "usage_store_value": 121,
                        "coupon_range_code": "NE1521C595"
                    },
                    "amount_unit": 2,
                    "coupon_set_code": "GSNUH0KSYX",
                    "name": "咖啡券",
                    "coupon_range_code": "NE1521C595",
                    "store_range": {
                        "allow": {
                            "brand_id": [
                                121
                            ],
                            "store_id": []
                        },
                        "deny": {
                            "brand_id": [],
                            "store_id": []
                        }
                    }
                }
            ]
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

## Response body description

|欄位｜類型｜敘述｜
|----|----|----|
| status | Number | 回應狀態碼 |
| message | String | 回應訊息 |
| description | String | 回應描述 |
| token_need_replace | Number | 是否需要更換 Token，0: 不需要，1: 需要 |
| meta | Object | 分頁資訊 |
| meta.page | Number | 當前頁碼 |
| meta.size | Number | 單頁筆數 |
| meta.total_rows | Number | 總筆數 |
| meta.total_pages | Number | 總頁數 |
| list | Object | 等級禮活動排程列表 |
| list.activity_id | Number | 活動 ID |
| list.activity_name | String | 活動名稱 |
| list.activity_schedule_start_time | String | 排程上架時間（格式：YYYY-MM-DD HH:mm:ss） |
| list.activity_is_repeatable | Number | 是否可以重複領取，0: 否，1: 是 |
| list.status | Number | 活動狀態：3: 未上架，4: 上架中，5: 已下架 |
| list.start_time | String | 活動起始時間 |
| list.end_time | String | 活動結束時間 |
| list.group_id | Number | 會員卡 ID|
| list.membership_id | Number | 會員等級 ID |
| list.rule_adjust_type | Number | 等級變動類型，1: 加入(join)，2: 續約(extend)，3: 升等(upgrade)，4: 降等(downgrade)，5: 退出(leave) |
| list.publish_manager_name | String | 上架此排程的管理員 |
| list.create_manager_name | String | 最後更新此排程的管理員 |
| list.update_manager_name | String | 建立此排程的管理員 |
| list.filter | Object | 活動篩選條件 |
| list.membership_group_id | Number | 目標會員卡 ID |
| list.membership_id | Number | 目標會員等級 ID |
| list.src_rule_id | Number | 來源規則 ID |
| list.gift_point | Array | 贈送點數列表 |
| list.gift_point.point_id | Number | 點數 ID |
| list.gift_point.score_mode | Number | 發送點數積分模式，1: 點數＋積分，2: 純點數，3:純積分|
| list.gift_point.time_config | Object | 點數效期設定｜
| list.gift_point.time_config.expire_mode | Number | 點數效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使使用 rule_expire_time |
| list.gift_point.amount_unit | Number | 贈送點數數量 |
| list.gift_coupon | Array | 贈送優惠券列表 |
| list.gift_coupon.coupon_set_id | Number | 優惠券組 ID |
| list.gift_coupon.coupon_set_code | String | 優惠券代碼 |
| list.gift_coupon.coupon_range_code | String | 門市適用範圍代碼 |
| list.gift_coupon.name | String | 優惠券名稱 |
| list.gift_coupon.amount_unit | Number | 贈送張數 |
| list.gift_coupon.time_config | Object | 優惠券使用時間設定 |
| list.gift_coupon.time_config.time_type | String | 使用時間類型：all_fixed：固定起迄時間，設定參數為：start_time, end_time，day_fixed：延後幾日至固定迄時間，依執行日算起+use_start_day 00:00:00至迄時間。設定參數為：use_start_day,end_time，day_day：依執行日算起+use_start_day 00:00:00至延續日use_tolerance_day 23:59:59。設定參數為：use_start_day, use_tolerance_day |
| list.gift_coupon.time_config.start_time	 | String | 起始時間|
| list.gift_coupon.time_config.end_time	 | String | 結束時間|
| list.gift_coupon.time_config.use_start_day | String | 第幾天可使用 |
| list.gift_coupon.time_config.use_tolerance_day | String | 可使用天數 |
| list.gift_coupon.store_range | Object | 門市適用範圍｜
| list.gift_coupon.store_range.allow | Object | 適用範圍 |
| list.gift_coupon.store_range.allow.brand_id | Array | 適用品牌 ID 列表 |
| list.gift_coupon.store_range.allow.store_id | Array | 適用門市 ID 列表 |
| list.gift_coupon.store_range.deny | Object | 不適用範圍 |
| list.gift_coupon.store_range.deny.brand_id | Array | 不適用品牌 ID 列表 |
| list.gift_coupon.store_range.deny.store_id | Array | 不適用門市 ID 列表 |
| brand_name_map | Object | 品牌名稱對照表 |
| store_name_map | Object | 門市名稱對照表 |

## Error response example

```json
HTTP/2 400 Bad Request
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
