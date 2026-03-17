# 取得特定會員等級的生日禮活動排程列表

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/birthdayGiftSchedule/list`
- Method：GET

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |

## Request Query Parameter

|欄位｜類型｜敘述｜
|----|----|----|
|activity_name| String | <optional>活動名稱，模糊搜尋， size range: 1-45|
|activity_schedule_start_time| String | <optional>篩選項：篩選上架時間|
|activity_schedule_end_time| String | <optional>篩選項：篩選下架時間|
|status| String | <optional>狀態：3. 未上架，4. 上架中，5. 已結束|
|page | Number | 頁碼，預設為 1 |
|size | Number | 單頁筆數，預設為 10 |

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
    "list": [
        {
            "activity_id": 1799,
            "activity_name": "TIN品牌交大門市會員測試[17]銀卡[39]生日禮",
            "activity_schedule_start_time": "2024-11-26 23:15:11",
            "status": 4,
            "start_time": "2024-11-26 00:00:00",
            "end_time": "2024-12-26 23:59:59",
            "group_id": 17,
            "membership_id": 39,
            "send_mode": 1,
            "valid_days": 0,
            "activity_is_active": 1,
            "update_time": "2024-11-26 23:15:11",
            "create_time": "2024-11-26 23:15:11",
            "filter": [
                {
                    "key": "is_phone_valid",
                    "way": "eq",
                    "value": 1
                },
                {
                    "key": "is_active",
                    "way": "eq",
                    "value": 1
                },
                {
                    "key": "is_suspend",
                    "way": "eq",
                    "value": 0
                }
            ],
            "gift_point": [
                {
                    "point_id": 28,
                    "score_mode": 2,
                    "amount_unit": 5,
                    "time_config": {
                        "expire_mode": 0,
                        "valid_years": 0,
                        "valid_days": 0,
                        "expire_time": null
                    }
                }
            ],
            "gift_score": [
                {
                    "point_id": 28,
                    "score_mode": 3,
                    "amount_unit": 10,
                    "time_config": {
                        "expire_mode": 0,
                        "valid_years": 0,
                        "valid_days": 0,
                        "expire_time": null
                    }
                }
            ],
            "gift_coupon": [
                {
                    "coupon_set_id": 893,
                    "amount_unit": 1,
                    "is_transferable": 1,
                    "time_config": {
                        "time_type": "day_day",
                        "use_start_day": 0,
                        "use_tolerance_day": 7
                    },
                    "draft_id": 1266,
                    "coupon_set_code": "DUV8CRNY45",
                    "usage_channel": 3,
                    "name": "[通用]指定交大店用",
                    "coupon_range_code": "MBFSNGJEQD",
                    "store_range_type": 2,
                    "nidin_league_levels": [1, 2],
                    "store_range": {
                        "brand_id": 96,
                        "store_is_exclude": 0,
                        "store_list": [263]
                    },
                    "offline_coupon_range_code": "NUFJXWJPMO",
                    "offline_store_range": {
                        "brand_id": 96,
                        "store_is_exclude": 0,
                        "store_list": [263]
                    }
                }
            ],
            "publish_manager_name": "王小明",
            "create_manager_name": "王小明",
            "update_manager_name": "王小明"
        }
    ],
    "brand_info_map": [
        "96": {
            "name": "Tin品牌"
        }
    ],
    "store_info_map": [
        "263": {
            "brand_id": 96,
            "name": "交大店",
        }
    ]
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
| list.status | String | 3. 未上架， 4. 上架中， 5. 已下架 |
| list.start_time | String | 活動起始時間 |
| list.end_time | String | 活動結束時間 |
| list.group_id | Number | 會員卡 ID|
| list.membership_id | Number | 會員等級 ID |
| list.send_mode | Number | 發送模式，1: 會員生日當月１號，2: 會員生日 N 天前 |
| list.valid_days | Number | 會員生日 N 天前，0 表示無限期 |
| list.activity_is_active | Number | 活動是否啟用，1: 啟用，0: 停用 |
| list.update_time | String | 活動最後更新時間 |
| list.create_time | String | 活動建立時間 |
| list.filter | Array | 可參加的消費者行為 |
| list.filter.key | String | 欄位比較鍵值 |
| list.filter.way | String | 欄位比較方式 |
| list.filter.value | Number | 欄位比較基準值 |
| list.gift_point | Array | 贈送點數列表 |
| list.gift_point.point_id | Number | 點數 ID |
| list.gift_point.score_mode | Number | 發送點數積分模式，1: 點數＋積分，2: 純點數，3:純積分|
| list.gift_point.amount_unit | Number | 贈送點數數量 |
| list.gift_point.time_config | Object | 點數效期設定｜
| list.gift_point.time_config.expire_mode | Number | 點數效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使使用 rule_expire_time |
| list.gift_point.time_config.valid_years | Number | Ｎ年後 |
| list.gift_point.time_config.valid_days | Number | Ｎ天後 |
| list.gift_point.time_config.expire_time | String | 指定到期日 |
| list.gift_score | Array | 贈送積分列表 |
| list.gift_score.point_id | Number | 積分 ID |
| list.gift_score.score_mode | Number | 發送積分模式，1: 點數＋積分，2: 純點數，3:純積分|
| list.gift_score.amount_unit | Number | 贈送積分數量 |
| list.gift_score.time_config | Object | 積分效期設定｜
| list.gift_score.time_config.expire_mode | Number | 積分效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使使用 rule_expire_time |
| list.gift_score.time_config.valid_years | Number | Ｎ年後 |
| list.gift_score.time_config.valid_days | Number | Ｎ天後 |
| list.gift_score.time_config.expire_time | String | 指定到期日 |
| list.gift_coupon | Array | 贈送優惠券列表 |
| list.gift_coupon.coupon_set_id | Number | 優惠券組 ID |
| list.gift_coupon.amount_unit | Number | 贈送張數 |
| list.gift_coupon.is_transferable | Number | 是否可轉讓，1: 是，0: 否 |
| list.gift_coupon.time_config | Object | 優惠券使用時間設定 |
| list.gift_coupon.time_config.time_type | String | 使用時間類型：all_fixed：固定起迄時間，設定參數為：start_time, end_time，day_fixed：延後幾日至固定迄時間，依執行日算起+use_start_day 00:00:00至迄時間。設定參數為：use_start_day,end_time，day_day：依執行日算起+use_start_day 00:00:00至延續日use_tolerance_day 23:59:59。設定參數為：use_start_day, use_tolerance_day |
| list.gift_coupon.time_config.use_start_day | String | 第幾天可使用 |
| list.gift_coupon.time_config.use_tolerance_day | String | 可使用天數 |
| list.gift_coupon.draft_id | Number | 優惠券草稿 ID |
| list.gift_coupon.coupon_set_code | String | 折價券代碼 |
| list.gift_coupon.usage_channel | Number | 使用通路，1: 全通路，2: 線上，3: 線下 |
| list.gift_coupon.name | String | 優惠券名稱 |
| list.gift_coupon.coupon_range_code | String | 門市適用範圍代碼 |
| list.gift_coupon.store_range_type | Number | 門市適用範圍類型，1: 全部門市，2: 指定門市，3: 排除指定門市 |
| list.gift_coupon.nidin_league_levels | Array | 適用聯盟等級列表 |
| list.gift_coupon.store_range | Object | 門市適用範圍｜
| list.gift_coupon.store_range.brand_id | Number | 品牌 ID |
| list.gift_coupon.store_range.store_is_exclude | Number | 是否為排除門市 |
| list.gift_coupon.store_range.store_list| | Array | 門市 ID 列表 |
| list.gift_coupon.offline_coupon_range_code | String | 線下門市適用範圍代碼 |
| list.gift_coupon.offline_store_range | Object | 線下門市適用範圍｜
| list.gift_coupon.offline_store_range.brand_id | Number | | 品牌 ID |
| list.gift_coupon.offline_store_range.store_is_exclude | Number | 是否為排除門市 |
| list.gift_coupon.offline_store_range.store_list| | Array | 門市 ID 列表 |
| list.publish_manager_name | String | 發佈管理者名稱 |
| list.create_manager_name | String | 建立管理者名稱 |
| list.update_manager_name | String | 更新管理者名稱 |
| brand_name_map | Array | 品牌名稱對照表 |
| brand_name_map.name | String | 品牌名稱 |
| store_info_map | Array | 門市名稱對照表 |
| store_info_map.brand_id | Number | 品牌 ID |
| store_info_map.name | String | 門市名稱 |

## Error response example

```json
HTTP/2 400 Bad Request
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
