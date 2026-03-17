# 取得營運分析模板列表

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/template/list`
- Method: `GET`

## Request Query Parameters

```cmd
brand_id=1&type=2&store_id=0
```

## Request Query Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| brand_id       | Number   | (可選)品牌ID |
| store_id       | Number   | (可選)門市ID |

## Response Body

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "list": [
        {
            "id": 1,
            "brand_id": 1,
            "store_id": 0,
            "name": "行銷活動查看內容用"
        },
        {
            "id": 2,
            "brand_id": 1,
            "store_id": 0,
            "name": "行銷活動查看內容用2"
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
| list           | Array    | 營運分析模板列表 |
| list[].id      | Number   | 營運分析模板ID |
| list[].brand_id | Number  | 品牌ID |
| list[].store_id | Number  | 門市ID |
| list[].name    | String   | 模板名稱 |
