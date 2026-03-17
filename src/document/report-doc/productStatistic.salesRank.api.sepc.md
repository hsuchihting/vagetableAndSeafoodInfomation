# 取得商品/套餐/配料 TOP N

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/productStatistic/salesRank`
- Method: `GET`

## Request Query Parameters

```cmd
?product_type=1&topn=10&start_date=2022-09-02&end_date=2022-09-02&brand_id=1
```

## Request Query Parameters description

| 參數名稱        | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| product_type   | Number   | 商品類型，1:商品，2:套餐，3:配料 |
| topn           | Number   | 取得前 N 名 |
| start_date     | String   | 起始日期，格式：YYYY-MM-DD |
| end_date       | String   | 結束日期，格式：YYYY-MM-DD |
| store_id       | Number   | (可選)門市 ID |

## Response Query Parameters example

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "list": [
        {
            "brand_id": 1,
            "brand_name": "你訂品牌",
            "vendor_custom_id": "NidintXwZK68Ox4",
            "name": "紅茶",
            "percentage": 49,
            "sale_amount": 581
        },
        {
            "brand_id": 1,
            "brand_name": "你訂品牌",
            "vendor_custom_id": "NidinfsnZxupe3T",
            "name": "珍珠奶茶",
            "percentage": 36,
            "sale_amount": 428
        }
    ],
    "meta_data": {
        "product_type": "商品",
        "date": "2022-09-02 ~ 2022-09-02"
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
| list           | Array    | 銷售排行列表 |
| list[].brand_id | Number  | 品牌ID |
| list[].brand_name | String | 品牌名稱 |
| list[].vendor_custom_id | String | 商品/套餐/配料自訂ID |
| list[].name    | String   | 商品/套餐/配料名稱 |
| list[].percentage | Number | 銷售佔比百分比 |
| list[].sale_amount | Number | 銷售數量 |
| meta_data      | Object   | 其他資訊 |
| meta_data.product_type | String | 商品類型名稱 |
| meta_data.date | String   | 查詢日期範圍 |