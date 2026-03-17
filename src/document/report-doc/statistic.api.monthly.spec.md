# 取得品牌月報表下載資訊

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/statistic/brandMonthlyStatement`
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
    "download_info": {
        "meta": {
            "brand_id": 9,
            "year": 2018,
            "acl_limit": 300
        },
        "links": {
            "2018-03": "https://nidin-beta.s3-ap-northeast-1.amazonaws.com/statement/brand/%5B9%5D_2018_03.xml?AWSAccessKeyId=AKIAJ7VGBZCIK5QTMUAA&Expires=1525256363&Signature=Gy6o3l9F%2BPvQg7CzFLC1Mn%2FWF9M%3D",
            "2018-04": "https://nidin-beta.s3-ap-northeast-1.amazonaws.com/statement/brand/%5B9%5D_2018_04.xml?AWSAccessKeyId=AKIAJ7VGBZCIK5QTMUAA&Expires=1525256364&Signature=9LfeFAt5B96yPMfGT%2FN4%2Fn4CP50%3D"
        }
    }
}
```

## Response Body description

| 欄位名稱                           | 類型       | 說明                                 |
| -------------------------------- | ---------- | ------------------------------------ |
| status                          | Number     | 狀態碼                               |
| message                         | String     | 回應訊息                             |
| description                     | String     | 回應描述                             |
| download_info                   | Object     | 下載資訊                             |
| download_info.meta              | Object     | 下載資訊相關資訊                     |
| download_info.meta.brand_id     | Number     | 品牌ID                               |
| download_info.meta.year         | Number     | 查詢年份                             |
| download_info.meta.acl_limit    | Number     | 下載連結的 ACL 時間（秒）            |
| download_info.links             | Object     | 下載連結清單                       |
| download_info.links.[YYYY-MM]   | String     | 該月份的下載連結                     |
