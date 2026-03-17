# 重新執行匯出營運分析

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/exportLog/:log_id/retry`
- Method: `POST`

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
  "log_id": 1
}
```

## Response Body description

| 參數名稱        | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| status          | Number   | 回應狀態碼 |
| message         | String   | 回應訊息 |
| description     | String   | 回應描述 |
| token_need_replace | Number | 是否需要更換Token，1:是，0:否 |
| log_id         | Number   | 建立的紀錄ID |