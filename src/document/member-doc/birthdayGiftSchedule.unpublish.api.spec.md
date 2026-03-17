# 立即下架特定會員等級的生日禮活動排程

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/birthdayGiftSchedule/:activity_id/unpublish`
- Method：PUT

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |
| activity_id | String | 活動 ID |

## Request Query Parameter

```json
{
    "rule_adjust_type": 1
}
```

## Request Query Parameter description

|欄位｜類型｜敘述｜
|----|----|----|
| rule_adjust_type | Number | 等級變動類型：1: 加入，2: 續約，3: 升等 |

## Response example

```json
HTTP/2 200 OK
{
    "status": 200,
    "message": "更新成功!",
    "description": "更新成功!",
    "token_need_replace": 0
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
