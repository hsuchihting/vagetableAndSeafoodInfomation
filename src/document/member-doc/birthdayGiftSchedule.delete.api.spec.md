
# 刪除特定會員等級的生日禮活動排程

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/birthdayGiftSchedule/:activity_id/delete`
- Method：DELETE

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
    "token_need_replace": 0
}
```

## Error response example

```json
HTTP/2 400 Bad Request
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```