# 取得特定會員等級的等級禮活動排程資訊

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/levelGiftSchedule/:activity_id/info`
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
        "activity_is_phone_repeatable": 1,
        "activity_is_repeatable": 0,
        "status": "3",
        "start_time": "2021-01-05 00:00:00",
        "end_time": "2099-12-31 23:59:59",
        "group_id": 43,
        "membership_id": 88,
        "rule_adjust_type": 1,
        "created_at": "2024-01-10 10:00:00",
        "updated_at": "2024-01-15 14:30:00",
        "created_by": "管理員A",
        "updated_by": "管理員B",
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
                    "use_tolerance_day": 30,
                    "start_time": null,
                    "end_time": null
                },
                "manual_usage_config": {
                    "usage_store_type": 2,
                    "usage_store_value": 121,
                    "coupon_range_code": "NEM1521KFD"
                },
                "amount_unit": 1,
                "is_transferable": 1,
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
                    "use_tolerance_day": 7,
                     "start_time": null,
                    "end_time": null
                },
                "manual_usage_config": {
                    "usage_store_type": 2,
                    "usage_store_value": 121,
                    "coupon_range_code": "NE1521C595"
                },
                "amount_unit": 2,
                "is_transferable": 0,
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
| info | Object | 等級禮活動排程資訊 |
|info.activity_id | Number | 活動 ID |
|info.activity_name | String | 活動名稱 |
|info.activity_schedule_start_time | String | 排程上架時間（格式：YYYY-MM-DD HH:mm:ss）|
|info.status | String | 活動狀態，3: 待上架，4: 上架中，5: 未上架 |
|info.activity_is_repeatable | Number | 是否可重複領取，0: 是，1: 否 |
|info.activity_is_phone_repeatable | Number | 是否可同手機號碼重複領取，0: 是，1: 否  |
|info.group_id | Number | 會員卡 ID |
|info.membership_id | Number | 會員等級 ID |
|info.rule_adjust_type | Number | 等級變動類型，1: 加入(join)，2: 續約(extend)，3: 升等(upgrade)，4: 降等(downgrade)，5: 退出(leave) |
|info.created_at | String | 建立時間 |
|info.updated_at | String | 更新時間 |
|info.created_by | String | 建立者 |
|info.updated_by | String | 更新者 |
|info.filter | Object | 活動篩選條件 |
|info.filter.membership_group_id | Number | 會員卡 ID |
|info.filter.membership_id | Number | 會員等級 ID |
|info.filter.src_rule_id | Number | 來源規則 ID |
|info.gift_point | Array | 贈送點數列表 |
|info.gift_point.point_id | Number | 點數 ID |
|info.gift_point.score_mode | Number | 發送點數積分模式，1: 點數＋積分，2: 純點數，3:純積分 |
|info.gift_point.time_config | Object| 點數有效期限設定 |
|info.gift_point.time_config.expire_mode | Number | 點數效期模式，0: 永不過期，1: 使用 point_expire_time，2: 以規則的 valid_days 計算天數，3: 使使用 rule_expire_time  |
|info.gift_point.amount_unit | Number | 發送點數|
|info.gift_coupon | Array | 贈送優惠券列表 |
|info.gift_coupon.coupon_set_id | Number | 優惠券組 ID |
|info.gift_coupon.coupon_set_code | String | 折價券代碼 |
|info.gift_coupon.coupon_range_code | String | 門市適用範圍代碼 |
|info.gift_coupon.name | String | 優惠券名稱 |
|info.gift_coupon.amount_unit | Number | 贈送張數 |
|info.gift_coupon.time_config | Object | 優惠券使用期限設定 |
|info.gift_coupon.time_config.time_type | String | 使用時間類型：all_fixed：固定起迄時間，設定參數為：start_time, end_time，day_fixed：延後幾日至固定迄時間，依執行日算起+use_start_day 00:00:00至迄時間。設定參數為：use_start_day,end_time，day_day：依執行日算起+use_start_day 00:00:00至延續日use_tolerance_day 23:59:59。設定參數為：use_start_day, use_tolerance_day |
|info.gift_coupon.time_config.start_time | String | 使用起始時間 |
|info.gift_coupon.time_config.end_time | String | 使用結束時間 |
|info.gift_coupon.time_config.use_start_day | String | 使用起始天數 |
|info.gift_coupon.time_config.use_tolerance_day | String | 使用寬限天|
|info.gift_coupon.store_range | Object | 優惠券門市適用範圍 |
|info.gift_coupon.store_range.allow | Object | 可使用門市範圍 |
|info.gift_coupon.store_range.allow.brand_id | Array | 可使用品牌 ID 列表 |
|info.gift_coupon.store_range.allow.store_id | Array | 可使用門市 ID 列表 |
|info.gift_coupon.store_range.deny | Object | 不可使用門市範圍 |
|info.gift_coupon.store_range.deny.brand_id | Array | | 不可使用品牌 ID 列表 |
|info.gift_coupon.store_range.deny.store_id | Array | 不可使用門市 ID 列表 |
|brand_name_map | Object | 品牌名稱對照表 |
|store_name_map | Object | 門市名稱對照表 |

## Error response example

```json
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
