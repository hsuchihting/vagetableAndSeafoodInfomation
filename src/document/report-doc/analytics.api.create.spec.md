# 新增營運分析模板

- API URL: `https://beta-nd-panel-api.nidin.shop/1.0/analytics/template`
- Method: `POST`

## Request Query Parameters

```json
{
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
      ]
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
    "product_list": [
      {
        "vendor_custom_id": "p11",
        "product_name": "紅茶",
        "product_type": 1
      }
    ],
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
```

## Request Body description

| 參數名稱        | 類型     |  說明                             |
| --------------- | --------  -------------------------------- |
| brand_id        | Number  | (可選)品牌ID，平台時輸入 0 |
| store_id        | Number  | (可選)門市ID |
| name            | String   | 名稱 |
| meta           | Object   | 模板設定選項 |
| meta.item_show_duplicated_order_info | Number | 是否顯示重複訂單資訊，1:是，0:否 |
| meta.export_type | Number  | 報表統計類型，1:訂單編號，2:品牌統計，3:門市統計 |
| filters        | Object   | 篩選條件 |
| filters.time_info | Object | 時間篩選條件 |
| filters.time_info.src_type | Number | 時間來源類型，1:下訂時間，2:取貨時間|
| filters.time_info.start_date | String | 起始日期，格式 YYYY-MM-DD |
| filters.time_info.end_date | String | 結束日期，格式 YYYY-MM-DD |
| filters.time_info.start_time | String | 起始時間，格式 HH:mm:ss，不指定時為 null |
| filters.time_info.end_time | String | 結束時間，格式 HH:mm:ss，不指定時為 null |
| filters.time_info.weekday_list | Array  | 星期清單，1:星期一，2:星期二，3:星期三，4:星期四，5:星期五，6:星期六，7:星期日，不限制時為空陣列 |
| filters.brand_store_info | Object | （可選）品牌及門市篩選條件 |
| filters.brand_store_info.brand_list | Array | 指定品牌ID，包含該品牌全門市｜
| filters.brand_store_info.store_list | Array | 指定門市ID，包含該門市｜
| filters.money_info | Object | （可選）訂單金額篩選條件 |
| filters.money_info.min_money | Number | 最小訂單金額，不指定時為 0 |
| filters.money_info.max_money | Number | 最大訂單金額，不指定時為 0 |
| filters.order_channel_list | Array | （可選）訂購通路，1: 線上訂單，2：線下訂單 |
| filters.order_trade_type_list | Array | （可選）訂單交易類型，1:現金，2:信用卡，3:行動支付，4:會員點數，701:貨到付款-現金，702:貨到付款-信用卡，703:貨到付款-行動支付，704:貨到付款-會員點數，705:線上刷卡-信用卡，706:線上刷卡-行動支付，707:線上刷卡-會員點數 |
| filters.order_type_list | Array | （可選）訂單類型，1:一般單，2. 揪團單｜
| filters.order_delivery_type_list | Array | （可選）訂單取餐類型，1:自取，2:內用，3:外送，4.內用-桌邊掃碼｜
| filters.order_src_type_list | Array | （可選）訂單來源類型，1.平台，2.專屬，3.平台LIFF，4.專屬LIFF，5.街口支付，6.你訂 APP｜
| filters.order_sub_src_type_list | Array | （可選）訂單瀏覽器來源：1.網站，2.LINE，3.Facebook Messenger，4. LINE LIFF，5. 街口APP，6. 你訂 APP ｜
| filters.address_info | Object | （可選）地址篩選條件 |
| filters.address_info.src_type | Number | 地址來源類型，1:依訂購門市位置，2:依消費者外送位置｜
| filters.address_info.area_code_list | Array | 指定特定區域|
| filters.product_list | Array | （可選）指定商品清單 |
| filters.product_list.vendor_custom_id | String | 商品廠商自訂編號 |
| filters.product_list.product_name | String | 商品名稱 |
| filters.product_list.product_type | Number | 商品類型，1:依訂購門市位置，3. 套餐|
| filters.order_discount_type_list | Array | （可選）訂單折扣類型，1:折價券，2:現折活動，3:會員卡折扣，4.會員點數｜
| filters.order_status_list | Array | （可選）訂單狀態，99. 消費者取消，100:尚未接單，110:已接單，120:門市拒絕，121: 系統拒絕，122: 門市取消，130:已完成，140:已作廢｜
| filters.order_rating_status | Number | （可選）訂單評價狀態，1:有評價，0:無評價｜
| columns        | Array    | 欄位清單 |
| columns[]      | String   | 欄位名稱，例如: "order_brand_id",

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