# 取得特定會員等級的生日禮活動排程資訊

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/birthdayGiftSchedule/:activity_id/info`
- Method：GET

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |
| activity_id | String | 活動 ID |

## Response example

```json
HTTP/2 200 OK
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "info": {
        "activity_id": 458,
        "activity_name": "Alice品牌等級1入會禮",
        "activity_schedule_start_time": "2024-01-20 00:00:00",
        "status": 3,
        "start_time": "2021-01-05 00:00:00",
        "end_time": "2099-12-31 23:59:59",
        "group_id": 43,
        "membership_id": 88,
        "send_mode": 1,
        "valid_days": 0,
        "activity_is_active": 1,
        "update_time": "2024-01-15 14:30:00",
        "create_time": "2024-01-10 10:00:00",
        "filter": [
            {
                "key": "is_phone_valid",
                "way": "eq",
                "value": 1
            }
        ],
        "gift_point": [
            {
                "point_id": 41,
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
                "point_id": 42,
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
                "coupon_set_id": 589,
                "amount_unit": 1,
                "is_transferable": 1,
                "time_config": {
                    "time_type": "day_day",
                    "use_start_day": 0,
                    "use_tolerance_day": 30,
                    "start_time": null,
                    "end_time": null
                },
                "draft_id": 1001,
                "coupon_set_code": "MY3RGJIFGP",
                "usage_channel": 1,
                "name": "小玉紅茶贈品券",
                "coupon_range_code": "NEM1521KFD",
                "store_range_type": 2,
                "nidin_league_levels": [1, 2],
                "store_range": {
                    "brand_id": [121],
                    "store_is_exclude": 0,
                    "store_list": [332, 334]
                },
                "offline_coupon_range_code": "OFFCODE1",
                "offline_store_range": {
                    "brand_id": 121,
                    "store_is_exclude": 0,
                    "store_list": [332]
                }
            },
            {
                "coupon_set_id": 595,
                "amount_unit": 2,
                "is_transferable": 0,
                "time_config": {
                    "time_type": "day_day",
                    "use_start_day": 1,
                    "use_tolerance_day": 7,
                    "start_time": null,
                    "end_time": null
                },
                "draft_id": 1002,
                "coupon_set_code": "GSNUH0KSYX",
                "usage_channel": 2,
                "name": "咖啡券",
                "coupon_range_code": "NE1521C595",
                "store_range_type": 2,
                "nidin_league_levels": [1],
                "store_range": {
                    "brand_id": [121],
                    "store_is_exclude": 0,
                    "store_list": []
                },
                "offline_coupon_range_code": "OFFCODE2",
                "offline_store_range": {
                    "brand_id": 121,
                    "store_is_exclude": 0,
                    "store_list": []
                }
            }
        ],
        "publish_manager_name": "管理員A",
        "create_manager_name": "管理員A",
        "update_manager_name": "管理員B"
    },
    "brand_info_map": {
        "121": {
            "name": "Alice 咖啡"
        }
    },
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

## Response fields description

|欄位｜類型｜敘述｜
|----|----|----|
| status | Number | 回應狀態碼 |
| message | String | 回應訊息 |
| description | String | 回應描述訊息 |
| token_need_replace | Number | 是否需要更換 Token，1: 是，0: 否 |
| list | Object | 等級禮活動排程資訊 |
| list.activity_id | Number | 活動 ID |
| list.activity_name | String | 活動名稱 |
| list.activity_schedule_start_time | String | 排程上架時間（格式：YYYY-MM-DD HH:mm:ss）|
| list.status | String | 活動狀態，3: 未上架，4: 上架中，5: 已下架 |
| list.start_time | String | 活動開始時間（格式：YYYY-MM-DD HH:mm:ss） |
| list.end_time | String | 活動結束時間（格式：YYYY-MM-DD HH:mm:ss） |
| list.group_id | Number | 會員卡群組 ID |
| list.membership_id | Number | 會員等級 ID |
| list.send_mode | Number | 發送模式，1: 會員生日當月１號，2: 會員生日 N 天前 |
| list.valid_days | Number | 會員生日 N 天前，0 表示無限期 |
| list.activity_is_active | Number | 活動是否啟用，1: 啟用，0: 停用 |
| list.update_time | String | 活動最後更新時間（格式：YYYY-MM-DD HH:mm:ss） |
| list.create_time | String | 活動建立時間（格式：YYYY-MM-DD HH:mm:ss） |
| list.filter | Object | 活動篩選條件 |
| list.filter.key | String | 欄位比較鍵值 |
| list.filter.way | String | 欄位比較方式 |
| list.filter.value | Number | 欄位比較基準值 |
| list.gift_point | Array | 贈送點數列表 |
| list.gift_point.point_id | Number | 點數 ID |
| list.gift_point.score_mode | Number | 發送點數積分模式，1: 點數＋積分，2: 純點數，3:純積分 |
| list.gift_point.amount_unit | Number | 發送點數|
| list.gift_point.time_config | Object| 點數有效期限設定 |
| list.gift_point.time_config.expire_mode | Number | 點數效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使使用 rule_expire_time  |
| list.gift_point.time_config.valid_years | Number | Ｎ年後 |
| list.gift_point.time_config.valid_days | Number | Ｎ天後 |
| list.gift_point.time_config.expire_time | String | 指定到期日（格式：YYYY-MM-DD HH:mm:ss） |
| list.gift_score | Array | 贈送積分列表 |
| list.gift_score.point_id | Number | 積分 ID |
| list.gift_score.score_mode | Number | 發送積分模式，1: 點數＋積分，2: 純點數，3:純積分 |
| list.gift_score.amount_unit | Number | 發送積分 |
| list.gift_score.time_config | Object| 積分有效期限設定 |
| list.gift_score.time_config.expire_mode | Number | 積分效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數， 3: 使使用 rule_expire_time  |
| list.gift_score.time_config.valid_years | Number | Ｎ年後 |
| list.gift_score.time_config.valid_days | | Number | Ｎ天後 |
| list.gift_score.time_config.expire_time | String | 指定到期日（格式：YYYY-MM-DD HH:mm:ss） |
| list.gift_coupon | Array | 贈送優惠券列表 |
| list.gift_coupon.coupon_set_id | Number | 優惠券組 ID |
| list.gift_coupon.amount_unit | Number | 贈送張數 |
| list.gift_coupon.is_transferable | Number | 優惠券是否可轉讓，1: 可轉讓，0: 不可轉讓 |
| list.gift_coupon.time_config | Object | 優惠券使用期限設定 |
| list.gift_coupon.time_config.time_type | String | 使用時間類型：all_fixed：固定起迄時間，設定參數為：start_time, end_time，day_fixed：延後幾日至固定迄時間，依執行日算起+use_start_day 00:00:00至迄時間。設定參數為：use_start_day,end_time，day_day：依執行日算起+use_start_day 00:00:00至延續日use_tolerance_day 23:59:59。設定參數為：use_start_day, use_tolerance_day |
| list.gift_coupon.time_config.use_start_day | String | 使用起始天數 |
| list.gift_coupon.time_config.use_tolerance_day | String | 使用寬限天|
| list.gift_coupon.draft_id | Number | 優惠券草稿 ID |
| list.gift_coupon.coupon_set_code | String | 優惠券組代碼 |
| list.gift_coupon.usage_channel | Number | 使用通路，1: 全通路，2: 線上，3: 線下 |
| list.gift_coupon.name | String | 優惠券名稱 |
| list.gift_coupon.coupon_range_code | String | 優惠券適用範圍代碼 |
| list.gift_coupon.store_range_type | Number | 優惠券門市適用範圍類型，1: 全部門市，2: 指定門市 |3: 排除指定門市 |
| list.gift_coupon.nidin_league_levels | Array | 指定可使用此優惠券的聯盟等級 ID 列表 |
| list.gift_coupon.store_range | Object | 優惠券門市適用範圍 |
| list.gift_coupon.store_range.brand_id | Array | 可使用品牌 ID 列表 |
| list.gift_coupon.store_range.store_is_exclude | Number | 門市是否排除 |
| list.gift_coupon.store_range.store_list| | Array | 門市 ID 列表 |
| list.gift_coupon.offline_coupon_range_code | String | 線下門市適用範圍代碼 |
| list.gift_coupon.offline_store_range | Object | | 線下門市適用範圍｜
| list.gift_coupon.offline_store_range.brand_id | Number | 品牌 ID |
| list.gift_coupon.offline_store_range.store_is_exclude | Number | 是否為排除門市 |
| list.gift_coupon.offline_store_range.store_list| | Array | 門市 ID 列表 |
| list.publish_manager_name | String | 發佈管理者名稱 |
| list.create_manager_name | String | 建立管理者名稱 |
| list.update_manager_name | String | 最後更新管理者名稱 |
| brand_info_map | Array | 品牌名稱對照表 |
| brand_info_map.name | String | 品牌名稱 |
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
