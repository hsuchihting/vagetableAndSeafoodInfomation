# 取得品牌週報表下載資訊

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/statistic/brandWeeklyStatement`
- Method: `GET`
- remark:
  - 尚未產出的月報表不會出現在 links 中（連 key 都會省略）
  - 此 API 因為最多要取得 12 份 AWS S3 下載簽章，所以 latency 極長
  - 前端必須負責提示使用者下載連結可能過期
  - 每個月五號會產出前一個月的報表
  - 每個月五號會將前前一個月狀態為已接單的訂單，改成已完成

## Request Query Parameters

```cmd
?brand_id=2&year=2018
```

## Request Query Parameters description

| 參數名稱             | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| brand_id       | Number   | 查詢的品牌ID |
| year           | Number   | 查詢年份，YYYY |

## Response Body

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "download_info": {
        "list": [
            {
                "link": "https://nidin-beta.s3.ap-northeast-1.amazonaws.com/statement/brand/%5B1%5D_W_2025_01_20241230.xlsx?...",
                "start_date": "2024-12-30",
                "week": 1
            },
            {
                "link": "https://nidin-beta.s3.ap-northeast-1.amazonaws.com/statement/brand/%5B1%5D_W_2025_02_20250106.xlsx?...",
                "start_date": "2025-01-06",
                "week": 2
            }
        ],
        "meta": {
            "brand_id": 9,
            "year": 2025,
            "acl_limit": 300
        }
    }
}
```

## Response Body description

| 欄位名稱                        | 類型       | 說明                                 |
| ------------------------------ | ---------- | ------------------------------------ |
| status                         | Number     | 狀態碼                               |
| message                        | String     | 回應訊息                             |
| description                    | String     | 回應描述                             |
| token_need_replace            | Number     | 是否需要替換 token，是：1，否：0     |
| download_info                  | Object     | 下載資訊                             |
| download_info.list             | Array      | 週報表下載清單                       |
| download_info.list[].link      | String     | 下載連結（AWS S3 簽章 URL）          |
| download_info.list[].start_date | String    | 該週起始日期 (YYYY-MM-DD)            |
| download_info.list[].week      | Number     | 該週週數                             |
| download_info.meta             | Object     | 下載資訊相關資訊                     |
| download_info.meta.brand_id    | Number     | 品牌ID                               |
| download_info.meta.year        | Number     | 查詢年份                             |
| download_info.meta.acl_limit   | Number     | 下載連結的 ACL 時間（秒）            |
