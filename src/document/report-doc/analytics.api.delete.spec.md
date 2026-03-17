# 刪除營運分析模板

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/template/:template_id`
- Method: `DELETE`

## Request URL Parameters

```json
{
    "template_id": 1
}
```

## Request URL Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| template_id | Number  | 模板ID |

## Request Body(application/json)

```json
{
    "status": 200,
    "message": "刪除成功!",
    "description": "刪除成功!",
    "token_need_replace": 0
}
```

## Request Body description

| 參數名稱        | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| status          | Number   | 回應狀態碼 |
| message         | String   | 回應訊息 |
| description     | String   | 回應描述 |
| token_need_replace | Number | 是否需要更換Token，1:是，0:否 |
