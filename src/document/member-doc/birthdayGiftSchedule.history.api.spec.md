# 取得特定會員等級的生日禮活動排程歷程列表

- API 路徑：`https://beta-nd-panel-api.nidin.shop/1.0/membership/:membership_id/birthdayGiftSchedule/history/:history_id/info`
- Method：GET

## Request URL Parameter

|欄位｜類型｜敘述｜
|----|----|----|
| membership_id | String | 會員等級 ID |
| history_id | String | 歷程 ID |

## Response example

```json
{
  "status": 200,
  "message": "讀取成功!",
  "description": "讀取成功!",
  "token_need_replace": 0,
  "info": {
    "group_id": 3,
    "membership_id": 4,
    "history_id": 1,
    "activity_id": 545,
    "activity_name": "MING會員[3]MING粉卡[4]生日禮",
    "activity_snapshot": null,
    "publish_manager_name": "Ming",
    "unpublish_manager_name": "Ming",
    "publish_author": 55,
    "publish_src_type": 1,
    "unpublish_author": 55,
    "unpublish_src_type": 99,
    "publish_time": "2025-12-02 23:16:19",
    "unpublish_time": "2025-12-02 23:16:27"
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
| info | Object | 歷程資訊 |
| info.group_id | Number | 會員等級群組 ID |
| info.membership_id | Number | 會員等級 ID |
| info.history_id | Number | 歷程 ID |
| info.activity_id | Number | 活動 ID |
| info.activity_name | String | 活動名稱 |
| info.activity_snapshot | Object | 活動快照資料 |
| info.publish_manager_name | String | 上架管理者名稱 |
| info.unpublish_manager_name | String | 下架管理者名稱 |
| info.publish_author | Number | 上架操作人員 ID |
| info.publish_src_type | Number | 上架來源類型 |
| info.unpublish_author | Number | 下架操作人員 ID |
| info.unpublish_src_type | Number | 下架來源類型 |
| info.publish_time | String | 上架時間，格式：YYYY-MM-DD HH:mm:ss |
| info.unpublish_time | String | 下架時間，格式：YYYY-MM-DD HH:mm:ss |

## Error response example

```json
HTTP/2 400 Bad Request
{
    "status": 1101,
    "message": "輸入資訊錯誤!",
    "description": "輸入資訊錯誤!"
}
```
