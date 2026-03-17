# 修改特定會員等級的等級禮活動排程

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/levelGiftSchedule/:activity_id/update`
- Method：POST

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |
| activity_id | String | 活動 ID |

## Request Query Parameter

```json
{
    "rule_adjust_type": 1,
    "activity_is_repeatable": 0,
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
    "gift_coupon": [
        {
            "coupon_set_id": "589",
            "amount_unit": 5,
            "time_config": {
                "time_type": "day_day",
                "use_start_day": "1",
                "use_tolerance_day": "15"
            },
            "store_range": {
                "allow": {
                    "brand_id": [
                        121
                    ],
                    "store_id": []
                },
                "deny": {
                    "brand_id": [],
                    "store_id": [
                        623
                    ]
                }
            }
        },
        {
            "coupon_set_id": "595",
            "amount_unit": 2,
            "time_config": {
                "time_type": "day_day",
                "use_start_day": 1,
                "use_tolerance_day": 7
            },
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
```

## Request Body Parameter description

|欄位｜類型｜敘述｜
|----|----|----|
| rule_adjust_type | Number | 規則調整方式，1：加入(join)，2：續等(extend)，3：升等(upgrade) |
| activiity_name | String | <optional>活動名稱 |
| activity_schedule_start_time | String | <optional> 活動排程開始時間，格式：YYYY-MM-DD HH:mm:ss |
| activity_is_repeatable | Number | <optional>活動是否可重複領取|
| activity_is_active | Number | <optional>活動是否啟用，0: 不啟用，1: 啟用 |
| gift_point | Array | <optional>贈送點數設定陣列 |
| gift_point.point_id | Number | <optional>點數 ID |
| gift_point.score_mode | Number | <optional>發送點數積分模式，1: 點數＋積分，2: 純點數，3:純積分 |
| gift_point.amount_unit | Number | <optional>贈送數量｜
| gift_point.time_config | Object | <optional>點數效期設定|
| gift_point.time_config.time_type | Object | <optional>點數效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使使用 rule_expire_time |
| gift_point.amount_unit | Number | <optional>贈送數量 |
| gift_coupon | Array | <optional>贈送優惠券設定陣列 |
| gift_coupon.coupon_set_id | Number | <optional>優惠券組 ID |
| gift_coupon.coupon_range_code | String | <optional>優惠券適用範圍代碼 |
| gift_coupon.coupon_set_code | String | <optional>優惠券代碼 |
| gift_coupon.amount_unit | Number | <optional>贈送張數 |
| gift_coupon.name | String | <optional>優惠券名稱 |
| gift_coupon.is_transferable | Number | <optional>優惠券是否可轉讓，0: 否，1: 是 |
| gift_coupon.time_config | Object | <optional>優惠券使用時間設定 |
| gift_coupon.time_config.time_type | String | <optional>使用時間類型：all_fixed：固定起迄時間，設定參數為：start_time, end_time，day_fixed：延後幾日至固定迄時間，依執行日算起+use_start_day 00:00:00至迄時間。設定參數為：use_start_day,end_time，day_day：依執行日算起+use_start_day 00:00:00至延續日use_tolerance_day 23:59:59。設定參數為：use_start_day, use_tolerance_day |
| gift_coupon.time_config.start_time | String | <optional>使用起始時間 |
| gift_coupon.time_config.end_time | String | <optional>使用結束時間 |
| gift_coupon.time_config.use_start_day | String | <optional>第幾天可使用 |
| gift_coupon.time_config.use_tolerance_day | String | <optional>可使用天數 |
| gift_coupon.store_range | Object | <optional>門市適用範圍｜
| gift_coupon.store_range.allow | Object | <optional>適用範圍 |
| gift_coupon.store_range.allow.brand_id | Array | <optional>適用品牌 ID 列表 |
| gift_coupon.store_range.allow.store_id | Array | <optional>適用門市 ID 列表 |
| gift_coupon.store_range.deny | Object | <optional>不適用範圍 |
| gift_coupon.store_range.deny.brand_id | Array | <optional>不適用品牌 ID 列表 |
| gift_coupon.store_range.deny.store_id | Array | <optional>不適用門市 ID 列表 |

## reponse example

```json
HTTP/2 200 OK
{
    "status": 200,
    "message": "呼叫成功!",
    "description": "呼叫成功!",
    "token_need_replace": 0,
    "success": 1,
    "activity_id": 99,
    "update_param": {},
    "invalid_param": {},
    "error_code_desc": {}
}
```

## error response example

```json
HTTP/2 400 Bad Request
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
