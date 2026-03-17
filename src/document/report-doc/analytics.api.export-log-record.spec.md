# 取得營運分析匯出紀錄

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/exportLog/:log_id`
- Method: `GET`

## Request URL Parameters

```cmd
?log_id=1
```

## Request URL Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| log_id          | Number   | 匯出紀錄ID |

## Response Body

```json
{
  "status": 200,
  "message": "讀取成功!",
  "description": "讀取成功!",
  "token_need_replace": 0,
  "log": {
    "id": 1,
    "name": "儲存名稱1_營運分析_2023-10-01-2023-10-31",
    "type": 1,
    "status": 0,
    "finish_data_rows": 0,
    "total_data_rows": 100,
    "file_url": null,
    "file_expire_time": null,
    "create_time": "2023-10-10 13:00:00"
  }
}
```

## Response Body description

| 參數名稱        | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| status          | Number   | 回應狀態碼 |
| message         | String   | 回應訊息 |
| description     | String   | 回應描述 |
| token_need_replace | Number | 是否需要更換Token，1:是，0:否 |
| log            | Object   | 匯出紀錄資訊 |
| log.id         | Number   | 匯出紀錄ID |
| log.name       | String   | 匯出紀錄名稱 |
| log.type       | Number   | 類型，1:營運分析，2:會員分析，3:行銷分析，4.商品分析 |
| log.status     | Number   | 狀態，0:未處理，1:處理中，2:檔案上傳中，3.已完成（檔案已上傳），9.處理失敗 |
| log.finish_data_rows | Number | 已完成資料筆數 |
| log.total_data_rows  | Number | 總資料筆數 |
| log.file_url   | String   | 檔案下載連結 |
| log.file_expire_time | String | 檔案過期時間 |
| log.create_time | String   | 建立時間 |
