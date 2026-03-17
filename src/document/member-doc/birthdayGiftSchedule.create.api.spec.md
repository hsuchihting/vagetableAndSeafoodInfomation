# 新增特定會員等級的生日禮活動排程

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/birthdayGiftSchedule`
- Method：POST

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |

## Request Query Parameter

```
{
    "activity_name": "Alice品牌等級1入會禮",
    "activity_schedule_start_time": "2021-01-05 00:00:00",
    "send_mode": 1,
    "valid_days": 0,
    "activity_is_active": 1,
    "gift_point": [
        {
            "point_id": 41,
            "score_mode": 2,
            "amount_unit": 1,
            "time_config": {
                "expire_mode": 2,
                "valid_years": 0,
                "valid_days": 2,
                "expire_time": null
            }
        }
    ],
    "gift_score": [
        {
            "point_id": 41,
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
            "amount_unit": 5,
            "is_transferable": 1,
            "time_config": {
                "time_type": "day_day",
                "use_start_day": "1",
                "use_tolerance_day": "15",
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
                "brand_id": 121,
                "store_is_exclude": 0,
                "store_list": [623]
            },
            "offline_coupon_range_code": "OFFLINECODE1",
            "offline_store_range": {
                "brand_id": 121,
                "store_is_exclude": 0,
                "store_list": [623]
            }
        },
        {
            "coupon_set_id": 595,
            "amount_unit": 2,
            "is_transferable": 0,
            "time_config": {
                "time_type": "day_day",
                "use_start_day": "1",
                "use_tolerance_day": "7",
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
                "brand_id": 121,
                "store_is_exclude": 0,
                "store_list": []
            },
            "offline_coupon_range_code": "OFFLINECODE2",
            "offline_store_range": {
                "brand_id": 121,
                "store_is_exclude": 0,
                "store_list": []
            }
        }
    ]
}
```

## Request Body Parameter description

|欄位｜類型｜敘述｜
|----|----|----|
| activiity_name | String | 活動名稱 |
| activity_schedule_start_time | String | <optional> 活動排程開始時間，格式：YYYY-MM-DD HH:mm:ss |
| send_mode | Number | 發送模式，1: 會員生日當月１號，2: 會員生日 N 天前 |
| valid_days | Number | 會員生日 N 天前，0 表示無限期 |
| gift_point | Array | 贈送點數設定陣列 |
| gift_point.point_id | Number | 點數 ID |
| gift_point.score_mode | Number | 發送點數積分模式，1: 點數＋積分，2: 純點數，3:純積分 |
| gift_point.amount_unit | Number | 贈送數量｜
| gift_point.time_config | Object | 點數效期設定|
| gift_point.time_config.expire_mode | Number | 點數效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使使用 rule_expire_time |
| gift_point.time_config.valid_years | Number | Ｎ年後 |
| gift_point.time_config.valid_days | Number | Ｎ天後 |
| gift_point.amount_unit | Number | 贈送數量 |
| gift_score | Array | 贈送積分設定陣列 |
| gift_score.point_id | Number | 積分 ID |
| gift_score.score_mode | Number | 發送積分模式，1: 點數＋積分，2: 純點數，3:純積分 |
| gift_score.amount_unit | Number | 贈送數量｜
| gift_score.time_config | Object | 積分效期設定|
| gift_score.time_config.expire_mode | Number | 積分效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數， 3: 使使用 rule_expire_time  |
| gift_score.time_config.valid_years | Number | Ｎ年後 |
| gift_score.time_config.valid_days | Number | Ｎ天後 |
| gift_score.expire_time | String | 指定到期日（格式：YYYY-MM-DD HH:mm:ss） |
| gift_coupon | Array | 贈送優惠券設定陣列 |
| gift_coupon.coupon_set_id | Number | 優惠券組 ID |
| gift_coupon.amount_unit | Number | 贈送張數 |
| gift_coupon.is_transferable | Number | 優惠券是否可轉讓，0: 否，1: 是 |
| gift_coupon.time_config | Object | 優惠券使用時間設定 |
| gift_coupon.time_config.time_type | String | 使用時間類型：all_fixed：固定起迄時間，設定參數為：start_time, end_time，day_fixed：延後幾日至固定迄時間，依執行日算起+use_start_day 00:00:00至迄時間。設定參數為：use_start_day,end_time，day_day：依執行日算起+use_start_day 00:00:00至延續日use_tolerance_day 23:59:59。設定參數為：use_start_day, use_tolerance_day |
| gift_coupon.time_config.use_start_day | String | 第幾天可使用 |
| gift_coupon.time_config.start_time | String | 使用開始時間（格式：YYYY-MM-DD HH:mm:ss） |
| gift_coupon.time_config.end_time | String | 使用結束時間（格式：YYYY-MM-DD HH:mm:ss） |
| gift_coupon.time_config.use_tolerance_day | String | 可使用天數 |
| gift_coupon.draft_id | Number | 優惠券草稿 ID |
| gift_coupon.coupon_set_code | String | 優惠券組代碼 |
| gift_coupon.usage_channel | Number | 使用通路，1: 全通路，2: 線上，3: 線下 |
| gift_coupon.name | String | 優惠券名稱 |
| gift_coupon.coupon_range_code | String | 門市適用範圍代碼 |
| gift_coupon.store_range_type | Number | 門市適用範圍類型，1: 全部門市，2: 指定門市，3: 排除指定門市 |
| gift_coupon.nidin_league_levels | Array | 適用聯盟等級列表
| gift_coupon.store_range | Array | 門市適用範圍｜
| gift_coupon.store_range.brand_id | Array | 適用品牌 ID 列表 |
| gift_coupon.store_range.store_is_exclude | Number | 是否為排除門市 |
| gift_coupon.store_range.store_list | Array | 適用門市 ID 列表 |
| gift_coupon.offline_coupon_range_code | String | 線下門市適用範圍代碼 |
| gift_coupon.offline_store_range | Array | 線下門市適用範圍｜
| gift_coupon.offline_store_range.brand_id | Number | 品牌 ID |
| gift_coupon.offline_store_range.store_is_exclude | Number | 是否為排除門市 |
| gift_coupon.offline_store_range.store_list | Array | 門市 ID 列表 |

## Error response example

```json
HTTP/2 400 Bad Request
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
