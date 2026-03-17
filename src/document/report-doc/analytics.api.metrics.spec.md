# 取得營運分析指標

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/metrics`
- Method: `GET`

## Request Query Parameters

```cmd
brand_id=1&store_id=0
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
  "token_need_replace": 1,
  "metrics": {
    "today": {
      "total_order_money": 885,
      "total_order_amount": 14,
      "total_product_amount": 16,
      "average_order_money": 63
    },
    "history": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "data_list": [
        {
          "date": "2023-12-03",
          "total_order_money": 272,
          "total_order_amount": 3,
          "average_order_money": 91
        },
        {
          "date": "2023-12-04",
          "total_order_money": 4984,
          "total_order_amount": 32,
          "average_order_money": 156
        },
        {
          "date": "2023-12-05",
          "total_order_money": 6345,
          "total_order_amount": 45,
          "average_order_money": 141
        }
      ]
    },
    "today_order_status": {
      "waiting": {
        "total_order_money": 20181,
        "total_order_amount": 80
      },
      "accepted": {
        "total_order_money": 1246100,
        "total_order_amount": 3080
      },
      "canceled": {
        "total_order_money": 206017,
        "total_order_amount": 611
      },
      "finished": {
        "total_order_money": 4493465,
        "total_order_amount": 18128
      },
      "voided": {
        "total_order_money": 20203,
        "total_order_amount": 37
      }
    }
    "proportion": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "compare_day": 30,
      "compare_start_date": "2023-11-03",
      "compare_end_date": "2023-12-02",
      "data_list": [
        {
          "type": "order_method",
          "current": [
            {
              "name": "當日單",
              "value": 1,
              "amount": 1000
            },
            {
              "name": "預約單",
              "value": 2,
              "amount": 51
            }
          ],
          "compare": [
            {
              "name": "當日單",
              "value": 1,
              "amount": 927
            },
            {
              "name": "預約單",
              "value": 2,
              "amount": 28
            }
          ]
        },
        {
          "type": "order_type",
          "current": [
            {
              "name": "一般單",
              "value": 1,
              "amount": 1043
            },
            {
              "name": "團購單",
              "value": 2,
              "amount": 8
            }
          ],
          "compare": [
            {
              "name": "一般單",
              "value": 1,
              "amount": 952
            },
            {
              "name": "團購單",
              "value": 2,
              "amount": 3
            }
          ]
        },
        {
          "type": "delivery_type",
          "current": [
            {
              "name": "自取",
              "value": 1,
              "amount": 654
            },
            {
              "name": "內用",
              "value": 2,
              "amount": 187
            },
            {
              "name": "外送",
              "value": 3,
              "amount": 153
            },
            {
              "name": "內用",
              "value": 21,
              "amount": 57
            }
          ],
          "compare": [
            {
              "name": "自取",
              "value": 1,
              "amount": 684
            },
            {
              "name": "內用",
              "value": 2,
              "amount": 131
            },
            {
              "name": "外送",
              "value": 3,
              "amount": 97
            },
            {
              "name": "內用",
              "value": 21,
              "amount": 43
            }
          ]
        },
        {
          "type": "sub_src_type",
          "current": [
            {
              "name": "網站",
              "value": 1,
              "amount": 822
            },
            {
              "name": "LINE",
              "value": 2,
              "amount": 5
            },
            {
              "name": "LINE LIFF",
              "value": 4,
              "amount": 1
            }
          ],
          "compare": [
            {
              "name": "網站",
              "value": 1,
              "amount": 658
            },
            {
              "name": "LINE",
              "value": 2,
              "amount": 14
            }
          ]
        },
        {
          "type": "trade_type",
          "current": [
            {
              "name": "現金",
              "value": 1,
              "amount": 824
            },
            {
              "name": "Tap Pay",
              "value": 706,
              "amount": 8
            },
            {
              "name": "Line Pay",
              "value": 707,
              "amount": 21
            },
            {
              "name": "悠遊付",
              "value": 717,
              "amount": 94
            },
            {
              "name": "全支付",
              "value": 719,
              "amount": 5
            },
            {
              "name": "遠傳電信 FET DPay",
              "value": 909,
              "amount": 99
            }
          ],
          "compare": [
            {
              "name": "現金",
              "value": 1,
              "amount": 828
            },
            {
              "name": "Tap Pay",
              "value": 706,
              "amount": 9
            },
            {
              "name": "Line Pay",
              "value": 707,
              "amount": 51
            },
            {
              "name": "台灣Pay",
              "value": 713,
              "amount": 1
            },
            {
              "name": "悠遊付",
              "value": 717,
              "amount": 5
            },
            {
              "name": "全支付",
              "value": 719,
              "amount": 16
            },
            {
              "name": "icash Pay",
              "value": 720,
              "amount": 9
            },
            {
              "name": "遠傳電信 FET DPay",
              "value": 909,
              "amount": 36
            }
          ]
        }
      ]
    },
    "hotspot": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "data_list": [
        {
          "weekday": 1,
          "hour": "00:00",
          "amount": 0
        },
        {
          "weekday": 1,
          "hour": "02:00",
          "amount": 0
        },
        {
          "weekday": 1,
          "hour": "04:00",
          "amount": 0
        },       
      ]
    },
    "ranking_brand_top": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "total_money": 100,
      "data_list": [
        {
          "brand_id": 46,
          "brand_name": "品牌46",
          "money": 241570,
          "amount": 310,
          "average_money": 1
        },
        {
          "brand_id": 94,
          "brand_name": "品牌94",
          "money": 77061,
          "amount": 29,
          "average_money": 1
        },
        {
          "brand_id": 32,
          "brand_name": "品牌32",
          "money": 67415,
          "amount": 257,
          "average_money": 1
        },       
      ]
    },
    "ranking_brand_last": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "data_list": [
        {
          "brand_id": 1,
          "brand_name": "品牌1",
          "money": 0,
          "amount": 0,
          "average_money": 0
        },
        {
          "brand_id": 3,
          "brand_name": "品牌3",
          "money": 0,
          "amount": 0,
          "average_money": 0
        },        
      ]
    },
    "ranking_store_top": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "total_money": 100,
      "data_list": [
        {
          "store_id": 56,
          "store_name": "門市56",
          "money": 15757,
          "amount": 31
        },
        {
          "store_id": 36,
          "store_name": "門市36",
          "money": 0,
          "amount": 0
        },      
      ]
    },
    "ranking_store_last": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "data_list": [
        {
          "store_id": 36,
          "store_name": "門市36",
          "money": 0,
          "amount": 0
        },
        {
          "store_id": 51,
          "store_name": "門市51",
          "money": 0,
          "amount": 0
        },      
      ]
    },
    "ranking_product_top": {
      "start_date": "2023-12-03",
      "end_date": "2024-01-01",
      "total_amount": 100,
      "data_list": [
        {
          "product_name": "泰式奶茶",
          "amount": 100
        },
        {
          "product_name": "金鑽鳳檸冰茶",
          "amount": 21
        },      
      ]
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
| token_need_replace              | Number     | 是否需要更換Token，1:是，0:否          |
| metrics                         | Object     | 指標                                |
| metrics.today                   | Object     | 今日銷售紀錄                         |
| metrics.today.total_order_money | Number     | 今日銷售總金額                       |
| metrics.today.total_order_amount| Number     | 今日訂單總筆數                       |
| metrics.today.total_product_amount | Number  | 今日訂單商品數                       |
| metrics.today.average_order_money | Number    | 今日平均訂單金額                     |
| metrics.history                 | Object     | 歷史銷售紀錄                         |
| metrics.history.start_date     | String     | 歷史銷售開始日期                     |
| metrics.history.end_date       | String     | 歷史銷售結束日期                     |
| metrics.history.data_list      | Array      | 歷史銷售資料列表                     |
| metrics.history.data_list[].date | String    | 日期                                |
| metrics.history.data_list[].total_order_money | Number | 當日銷售總金額               |
| metrics.history.data_list[].total_order_amount | Number | 當日訂單總筆數               |
| metrics.history.data_list[].average_order_money | Number | 當日平均訂單金額               |
| metrics.today_order_status     | Object     | 今日各訂單狀態銷售紀錄               |
| metrics.today_order_status.waiting | Object  | 未接單狀態銷售紀錄               |
| metrics.today_order_status.waiting.total_order_money | Number | 未接單狀態銷售總金額     |
| metrics.today_order_status.waiting.total_order_amount | Number | 未接單狀態訂單總筆數     |
| metrics.today_order_status.accepted | Object  | 已接單狀態銷售紀錄               |
| metrics.today_order_status.accepted.total_order_money | Number | 已接單狀態銷售總金額     |
| metrics.today_order_status.accepted.total_order_amount | | Number | 已接單狀態訂單總筆數     |
| metrics.today_order_status.canceled | Object  | 取消狀態銷售紀錄                 |
| metrics.today_order_status.canceled.total_order_money | Number | 取消狀態銷售總金額       |
| metrics.today_order_status.canceled.total_order_amount | Number | 取消狀態訂單總筆數       |
| metrics.today_order_status.finished | Object  | 完成狀態銷售紀錄                 |
| metrics.today_order_status.finished.total_order_money |  Number | 完成狀態銷售總金額       |
| metrics.today_order_status.voided | Object      | 作廢狀態銷售紀錄                 |
| metrics.today_order_status.voided.total_order_money | Number | 作廢狀態銷售總金額         |
| metrics.today_order_status.voided.total_order_amount | Number | 作廢狀態訂單總筆數         |
| metrics.proportion               | Object     | 訂單資訊佔比                       |
| metrics.proportion.start_date   | String     | 佔比開始日期                       |
| metrics.proportion.end_date     | String     | 佔比結束日期                       |
| metrics.proportion.compare_day  | Number     | 比較天數 （前 Ｎ 天）                          |
| metrics.proportion.compare_start_date | String | 比較開始日期                     |
| metrics.proportion.compare_end_date | String   | 比較結束日期                     |
| metrics.proportion.data_list    | Array      | 佔比資料列表                       |
| metrics.proportion.data_list[].type | String | 佔比類型，order_method: 訂單方案，order_type: 訂單類型，sub_src_type: 瀏覽器，delivery_type: 取貨方式，trade_type: 付款方式                         |
| metrics.proportion.data_list[].current | Array | 比較基準欄位值列表，對應start_date-end_date  |
| metrics.proportion.data_list[].current[].name | String | 欄位值名稱               |
| metrics.proportion.data_list[].current[].value | Number | 欄位值                 |
| metrics.proportion.data_list[].current[].amount | Number | 訂單數量               |
| metrics.proportion.data_list[].compare | Array | 比較對象欄位值列表，對應compare_start_date-compare_end_date  |
| metrics.proportion.data_list[].compare[].name | String | 欄位值名稱               |
| metrics.proportion.data_list[].compare[].value | Number | 欄位值                 |
| metrics.proportion.data_list[].compare[].amount | Number | 訂單數量               |
| metrics.hotspot                 | Object     | 訂單熱區                           |
| metrics.hotspot.start_date     | String     | 熱區開始日期                       |
| metrics.hotspot.end_date       | String     | 熱區結束日期                       |
| metrics.hotspot.data_list      | Array      | 熱區資料列表                       |
| metrics.hotspot.data_list[].weekday | Number | 星期，1:星期一，2:星期二，3:星期三，4:星期四，5:星期五，6:星期六，7:星期日 |
| metrics.hotspot.data_list[].hour | String   | 小時              |
| metrics.hotspot.data_list[].amount | Number   | 訂單數量                           |
| metrics.ranking_brand_top      | Object     | 品牌銷售排行-前Ｎ 名               |
| metrics.ranking_brand_top.start_date | String | 銷售排行開始日期               |
| metrics.ranking_brand_top.end_date | String   | 銷售排行結束日期               |
| metrics.ranking_brand_top.total_money | Number | 銷售排行總金額               |
| metrics.ranking_brand_top.data_list | Array  | 銷售排行資料列表               |
| metrics.ranking_brand_top.data_list[].brand_id | Number | 品牌ID               |
| metrics.ranking_brand_top.data_list[].brand_name | String | 品牌名稱               |
| metrics.ranking_brand_top.data_list[].money | Number | 銷售金額               |
| metrics.ranking_brand_top.data_list[].amount | Number | 訂單數量               |
| metrics.ranking_brand_top.data_list[].average_money | Number | 平均銷售金額               |
| metrics.ranking_brand_last     | Object     | 品牌銷售排行-後Ｎ 名               |
| metrics.ranking_brand_last.start_date | String | 銷售排行開始日期               |
| metrics.ranking_brand_last.end_date | String   | 銷售排行結束日期               |
| metrics.ranking_brand_last.data_list | Array  | 銷售排行資料列表               |
| metrics.ranking_brand_last.data_list[].brand_id | Number | 品牌ID               |
| metrics.ranking_brand_last.data_list[].brand_name | String | 品牌名稱               |
| metrics.ranking_brand_last.data_list[].money | Number | 銷售金額               |
| metrics.ranking_brand_last.data_list[].amount | Number | 訂單數量               |
| metrics.ranking_brand_last.data_list[].average_money | Number | 平均銷售金額               |
| metrics.ranking_store_top      | Object     | 門市銷售排行-前Ｎ 名               |
| metrics.ranking_store_top.start_date | String | 銷售排行開始日期               |
| metrics.ranking_store_top.end_date | String | 銷售排行結束日期               |
| metrics.ranking_store_top.total_money | Number | 銷售排行總金額               |
| metrics.ranking_store_top.data_list | Array  | 銷售排行資料列表               |
| metrics.ranking_store_top.data_list[].store_id | Number | 門市ID               |
| metrics.ranking_store_top.data_list[].store_name | String | 門市名稱               |
| metrics.ranking_store_top.data_list[].money | Number | 銷售金額               |
| metrics.ranking_store_top.data_list[].amount | Number | 訂單數量               |
| metrics.ranking_store_last     | Object     | 門市銷售排行-後Ｎ 名               |
| metrics.ranking_store_last.start_date | String | 銷售排行開始日期               |
| metrics.ranking_store_last.end_date | String   | 銷售排行結束日期               |
| metrics.ranking_store_last.data_list | Array  | 銷售排行資料列表               |
| metrics.ranking_store_last.data_list[].store_id | Number | 門市ID               |
| metrics.ranking_store_last.data_list[].store_name | String | 門市名稱               |
| metrics.ranking_store_last.data_list[].money | Number | 銷售金額               |
| metrics.ranking_store_last.data_list[].amount | Number | 訂單數量               |
| metrics.ranking_product_top    | Object     | 商品銷售排行-前Ｎ 名               |
| metrics.ranking_product_top.start_date | String | 銷售排行開始日期               |
| metrics.ranking_product_top.end_date | String   | 銷售排行結束日期               |
| metrics.ranking_product_top.total_amount | Number | 銷售排行總數量               |
| metrics.ranking_product_top.data_list | Array  | 銷售排行資料列表               |
| metrics.ranking_product_top.data_list[].product_name | String | 商品名稱               |
| metrics.ranking_product_top.data_list[].amount | Number | 銷售數量               |
