# 取得營運分析匯出紀錄列表

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/exportLog/list`
- Method: `GET`

## Request Query Parameters

```cmd
?page=1&size=20
```
## Request Query Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| page           | Number   | 頁碼，預設值為 1 |
| size           | Number   | 每頁筆數，預設值為 20 |
| type           | Number   | 類型，1:營運分析，2:會員分析，3:行銷分析，4.商品分析 |
| log_ids        | Number   | (可選)指定紀錄 ID，以逗號分隔 |
| brand_id      | Number   | (可選)品牌 ID |
| store_id      | Number   | (可選)門市 ID |

## Response Body

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "meta": {
        "page": 1,
        "size": 2,
        "total": 6
    },
    "list": [
        {
            "id": 1,
            "name": "儲存名稱1_營運分析_2023-10-01-2023-10-31",
            "type": 1,
            "status": 0,
            "finish_data_rows": 0,
            "total_data_rows": 100,
            "file_url": null,
            "file_expire_time": null,
            "create_time": "2023-10-10 13:00:00"
        },
        {
            "id": 2,
            "name": "儲存名稱2_營運分析_2023-10-01-2023-10-31",
            "type": 1,
            "status": 1,
            "finish_data_rows": 75,
            "total_data_rows": 100,
            "file_url": null,
            "file_expire_time": null,
            "create_time": "2023-10-10 13:00:00"
        }
    ]
}
```

## Response Body description

| 參數名稱        | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| status          | Number   | 回應狀態碼 |
| message         | String   | 回應訊息 |
| description     | String   | 回應描述 |
| token_need_replace | Number | 是否需要更換Token，1:是，0:否 |
| meta           | Object   | 分頁資訊 |
| meta.page      | Number   | 當前頁碼 |
| meta.size      | Number   | 每頁筆數 |
| meta.total     | Number   | 總筆數 |
| list           | Array    | 營運分析匯出紀錄列表 |
| list[].id      | Number   | 紀錄ID |
| list[].name    | String   | 儲存名稱 |
| list[].type    | Number   | 類型，1:營運分析，2.會員分析，3:行銷分析，4.商品分析 |
| list[].status  | Number   | 狀態，0:未處理，1:處理中，2:檔案上傳中，3.已完成（檔案已上傳），9.處理失敗 |
| list[].finish_data_rows | Number | 已處理筆數 |
| list[].total_data_rows | Number | 總筆數 |
| list[].file_url | String   | 下載連結 |
| list[].file_expire_time | String | 下載連結過期時間 |
| list[].create_time | String | 建立時間 |
