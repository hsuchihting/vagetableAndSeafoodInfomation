# 取得營運分析模板資訊

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/template/:template_id`
- Method: `GET`

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

## Response Body

```json
{
    "status": 200,
    "message": "更新成功!",
    "description": "更新成功!",
    "token_need_replace": 0,
    "template": {
        "id": 1,
        "brand_id": 1,
        "store_id": 0,
        "name": "行銷活動查看內容用",
        "meta": {
            "item_show_duplicated_order_info": 1,
            "export_type": 1
        },
        "filters": {
            "time_info": {
                "src_type": 1,
                "start_date": "2023-10-01",
                "end_date": "2023-10-31",
                "start_time": "12:10",
                "end_time": "14:00",
                "weekday_list": [
                    1,
                    2
                ]
            },
            "brand_store_info": {
                "brand_list": [
                    12
                ],
                "store_list": [
                    56
                ],
                "brand_map": {
                    "1": {
                        "name": "迷客夏"
                    }
                },
                "store_map": {
                    "2": {
                        "brand_id": 1,
                        "name": "一號店"
                    }
                }
            },
            "money_info": {
                "min_money": 100,
                "max_money": 10000
            },
            "address_info": {
                "src_type": 1,
                "area_code_list": [
                    2
                ]
            },
            "product_list": [
                {
                    "vendor_custom_id": "p11",
                    "product_name": "紅茶",
                    "product_type": 1
                }
            ],
            "order_channel_list": [
                1
            ],
            "order_trade_type_list": [
                1,
                707
            ],
            "order_type_list": [
                1
            ],
            "order_delivery_type_list": [
                1
            ],
            "order_src_type_list": [],
            "order_sub_src_type_list": [],
            "order_discount_type_list": [
                4
            ],
            "order_status_list": [
                130
            ],
            "order_rating_status": 1
        },
        "columns": [
            "order_brand_id",
            "order_store_id",
            "order_shopper_id",
            "order_shopper_phone",
            "order_contact",
            "order_contact_phone",
            "order_time",
            "order_delivery_reserv_time",
            "order_channel",
            "order_type",
            "order_groupby_follower_amount",
            "order_method",
            "order_delivery_type",
            "order_status",
            "order_id",
            "order_src_vendor_code",
            "order_src_type",
            "order_sub_src_type",
            "order_shopper_remark",
            "order_store_memo",
            "order_rating_star_first",
            "order_rating_comment_first",
            "order_rating_star_second",
            "order_rating_comment_second",
            "order_special_item_setting",
            "item_total_amount",
            "item_product_name",
            "item_product_alias",
            "item_product_amount",
            "item_product_unit_money",
            "item_package_product_detail",
            "item_option_name",
            "item_option_amount",
            "item_option_unit_money",
            "payment_option_total_money",
            "payment_product_total_money",
            "payment_order_total_money",
            "payment_order_total_paid_money",
            "payment_order_trade_type",
            "payment_order_payment_status",
            "payment_order_invoice_type",
            "payment_order_shipping_money",
            "promotion_discount_money",
            "promotion_discount_activity_name",
            "promotion_coupon_money",
            "membership_point_payment_amount",
            "membership_discount_money",
            "membership_point_income_amount"
        ]
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
| template       | Object   | 模板資料 |
| template.id    | Number   | 模板ID |
| template.brand_id | Number | 品牌ID |
| template.store_id | Number  | 門市ID |
| template.name  | String   | 模板名稱 |
| template.meta  | Object   | 模板設定資料 |
| template.meta.item_show_duplicated_order_info | Number | 是否顯示重複訂單資料，1:是，0:否 |
| template.meta.export_type | Number | 匯出類型，1:一般匯出，2:詳細匯出 |
| template.filters | Object  | 篩選條件資料 |
| template.filters.time_info | Object | 時間篩選資料 |
| template.filters.time_info.src_type | Number | 時間來源類型，1:下訂時間，2:取貨時間 |
| template.filters.time_info.start_date | String | 開始日期，格式:YYYY-MM-DD |
| template.filters.time_info.end_date | String | 結束日期，格式:YYYY-MM-DD |
| template.filters.time_info.start_time | String | 開始時間，格式:HH:mm:ss |
| template.filters.time_info.end_time | String | 結束時間，格式:HH:mm:ss |
| template.filters.time_info.weekday_list | Array  | 星期篩選清單，1:星期一，2:星期二，3:星期三，4:星期四，5:星期五，6:星期六，7:星期日 |
| template.filters.brand_store_info | Object | 品牌/門市篩選資料 |
| template.filters.brand_store_info.brand_list | Array | 品牌ID清單 |
| template.filters.brand_store_info.store_list | Array | 門市ID清單 |
| template.filters.brand_store_info.brand_map | Object | 品牌對應資料 |
| template.filters.brand_store_info.brand_map.name | String | 品牌名稱 |
| template.filters.brand_store_info.store_map | Object | 門市對應資料 |
| template.filters.brand_store_info.store_map.brand_id | Number | 所屬品牌ID |
| template.filters.brand_store_info.store_map.name | String | 門市名稱 |
| template.filters.money_info | Object | 金額篩選資料 |
| template.filters.money_info.min_money | Number | 最低金額 |
| template.filters.money_info.max_money | Number | 最高金額 |
| template.filters.address_info | Object | 縣市/區域篩選對象 |
| template.filters.address_info.src_type | Number | 地址來源類型，1:依訂購門市位置，2:依消費者外送位置 |
| template.filters.address_info.area_code_list | Array | | 指定特定區域，列出所有區域時代表選擇對應縣市 |
| template.filters.product_list | Array  | 指定商品 |
| template.filters.product_list.vendor_custom_id | String | 商品代號 |
| template.filters.product_list.product_type | Number | 產品類型，1:依訂購門市位置，3:套餐 |
| template.filters.product_list.product_name | String | 產品名稱 |
| template.filters.order_channel_list | Array | 訂單通路，1:線上訂購，2:線下訂單 |
| template.filters.order_trade_type_list | Array | 交易類型，1:現金，2:信用卡，3:LINE Pay，4:街口支付，5:Apple Pay，6:Google Pay，7:會員點數，700:第三方支付，701:貨到付款，702:門市付款，703:ATM轉帳，704:超商代碼繳費，705:超商條碼繳費，706:電子錢包，707:其他 |
| template.filters.order_type_list | Array | 訂單類型，1:一般單，2:揪團單 |
| template.filters.order_delivery_type_list | Array | 取餐方式，1:自取，2:內用，3:外送，21:內用-桌邊掃碼 |
| template.filters.order_src_type_list | Array | 訂單來源，1. 平台，2. 專屬，3. 平台 LIFF，4. 專屬 LIFF，5. 街口支付，6. 你訂 APP |
| template.filters.order_sub_src_type_list | Array | 訂單子來源，1. 網頁，2. LINE，3. Facebook Messenger，4. LINE LIFF，5. 街口支付 app，7. 你訂 APP |
| template.filters.order_discount_type_list | Array | 折扣類型，1:折價券，2:現折活動，3:會員卡折扣，4:會員點數 |
| template.filters.order_status_list | Array | 訂單狀態，99. 消費者取消，100:尚未接單，110:已接單，120:門市拒絕，121: 系統拒絕，122: 門市取消，130:已完成，140:已作廢 |
| template.filters.order_rating_status | Number | 評價狀態，0:未評價，1:已評價 |
| template.columns | Array  | 欄位清單 |

### 補充 template.columns 欄位中的值

選擇欄位

- `order_brand_id` 品牌(ID)
- `order_store_id` 門市(ID)
- `order_shopper_id` 訂購人(ID)
- `order_shopper_phone` 訂購人電話
- `order_contact` 取貨人
- `order_contact_phone` 取貨人電話
- `order_time` 下訂時間
- `order_delivery_reserv_time` 預計取餐時間
- `order_channel` 訂購通路
- `order_type` 訂單類型
- `order_groupby_follower_amount` 跟團人數
- `order_method` 訂單方案
- `order_delivery_type` 取貨方式
- `order_status` 訂單狀態
- `order_id` 訂單ID
- `order_src_vendor_code` 追蹤碼
- `order_src_type` 訂單來源
- `order_sub_src_type` 訂單瀏覽器來源
- `order_shopper_remark` 訂購人備註
- `order_store_memo` 店家備註
- `order_rating_star_first` 評價星數(首評)
- `order_rating_comment_first` 評價內容(首評)
- `order_rating_star_second` 評價星數(修改)
- `order_rating_comment_second` 評價內容(修改)
- `order_special_item_setting` 特殊需求
- `item_total_amount` 訂單商品數量
- `item_product_name` 商品名稱
- `item_product_alias` 商品別名
- `item_product_amount` 商品數量
- `item_product_unit_money` 商品單價
- `item_package_product_detail` 套餐品項
- `item_option_name` 配料名稱
- `item_option_amount` 配料數量
- `item_option_unit_money` 配料單價
- `payment_option_total_money` 配料原始金額
- `payment_product_total_money` 商品原始金額(不含配料)
- `payment_order_total_money` 訂單原始金額(不含運費)
- `payment_order_total_paid_money` 訂單實付金額
- `payment_order_trade_type` 付款方式
- `payment_order_payment_status` 付款狀態
- `payment_order_invoice_type` 發票類型
- `payment_order_shipping_money` 運費金額
- `promotion_discount_money` 現折活動折扣金額
- `promotion_discount_activity_name` 現折活動名稱
- `promotion_coupon_money` 折價券折扣金額
- `membership_point_payment_amount` 折抵點數
- `membership_discount_money` 會員卡折扣金額
- `membership_point_income_amount` 獲得點數