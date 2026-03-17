# 等級禮活動編輯彈窗組件需求文件

## 組件名稱

`upgrade-gift-dialog.vue`

## 組件概述

等級禮活動編輯彈窗組件，用於新增或編輯會員卡等級禮活動（入會禮、續等禮、升等禮、生日禮）的詳細設定，包含點數、積分、優惠券等禮品配置。

## 功能需求

### 1. 活動基本資訊設定

#### 1.1 活動名稱

- 必填欄位
- 文字輸入框

#### 1.2 上架時間

- 必填欄位
- 日期時間選擇器
- 格式：`YYYY-MM-DD HH:mm:00`

#### 1.3 發送時間（僅生日禮）

- 會員生日當日前 N 天（可設定 0-30 天）
- 生日當月1日

### 2. 禮品發送設定

#### 2.1 點數設定（當會員卡支援點數時）

- 可新增一筆點數設定
- 設定項目：
  - 發送點數數量
  - 點數期限（永不過期 / 指定時間 / 依規則計算）

#### 2.2 積分設定（僅生日禮）

- 可新增一筆積分設定
- 設定項目：
  - 發送積分數量

#### 2.3 優惠券設定

- 可新增多張優惠券
- 設定項目：
  - 優惠券選擇
  - 發送張數
  - 使用期限
  - 使用通路
  - 可用門市

### 3. 重複領取設定

#### 3.1 續等禮/升等禮

- 會員是否可以重複領取此等級之禮品
- 選項：是 / 否

#### 3.2 入會禮/生日禮

- 同手機號碼是否限領一次
- 選項：是 / 否
- 必填欄位

### 4. 彈窗流程

#### 4.1 步驟一：設定內容

- 填寫活動名稱、上架時間
- 設定發送禮品（點數/積分/優惠券）
- 設定重複領取規則

#### 4.2 步驟二：確認提交

- 顯示提醒訊息
- 確認後送出資料

### 5. 子彈窗功能

#### 5.1 點數設定彈窗

- 組件：`nd-point-dialog`
- 設定發送點數的詳細參數

#### 5.2 積分設定彈窗

- 組件：`nd-score-dialog`
- 設定發送積分的詳細參數

#### 5.3 優惠券選擇彈窗

- 組件：`nd-chooseCoupon`
- 從現有優惠券中選擇
- 可導向建立新優惠券

#### 5.4 優惠券設定彈窗

- 組件：`nd-activity-dialog`
- 設定優惠券發送張數、使用期限、可用門市等

## 資料結構

### Props

| 屬性名稱 | 類型 | 預設值 | 說明 |
|---------|------|--------|------|
| showModal | Boolean | true | 控制彈窗顯示 |
| modalTitle | String | '' | 彈窗標題 |
| giftText | String | '' | 禮品類型文字（如：續等禮） |
| showGiftText | Boolean | true | 是否顯示禮品類型設定 |
| currentStatus | Number | 0 | 當前狀態 |
| currentType | Number | 0 | 活動類型（1:入會禮, 2:續等禮, 3:升等禮, 4:生日禮） |
| currentId | Number | 0 | 當前等級 ID |
| activityType | Number | 0 | 活動類型（用於 API） |
| usageChannelColorSet | Function | - | 使用通路顏色設定函數 |
| editActivityId | Number | null | 編輯模式下的活動 ID |

### Data

| 屬性名稱 | 類型 | 預設值 | 說明 |
|---------|------|--------|------|
| currentStep | Number | 1 | 當前步驟 |
| showPoint | Boolean | true | 是否顯示點數區塊 |
| showCoupon | Boolean | true | 是否顯示優惠券區塊 |
| showScore | Boolean | true | 是否顯示積分區塊 |
| showPointModal | Boolean | false | 點數設定彈窗顯示狀態 |
| showScoreModal | Boolean | false | 積分設定彈窗顯示狀態 |
| showChooseCouponModal | Boolean | false | 優惠券選擇彈窗顯示狀態 |
| showActivityModal | Boolean | false | 優惠券設定彈窗顯示狀態 |
| giftPoint | Array | [] | 點數設定列表 |
| giftCoupon | Array | [] | 優惠券設定列表 |
| giftScore | Array | [] | 積分設定列表 |
| activityId | Number | 0 | 活動 ID |
| activityRepeatable | Number | 0 | 是否可重複領取 |
| activityIsPhoneRepeatable | Number | 0 | 同手機是否限領一次 |
| modelWidth | String | '1080px' | 彈窗寬度 |
| form | Object | {} | 表單資料 |

### Form 資料結構

```javascript
{
  activity_name: '',                    // 活動名稱
  activity_schedule_start_time: '',     // 上架時間
  send_mode: 2,                         // 發送時間模式（生日禮用）
  valid_days: null                      // 生日前幾天發送
}
```

## API 整合

### 使用的 API 方法

| 方法名稱 | 說明 |
|---------|------|
| membership.newLevelGiftSchedule | 新增等級禮活動 |
| membership.updateLevelGiftSchedule | 更新等級禮活動 |
| membership.newBirthdayGiftSchedule | 新增生日禮活動 |
| membership.updateBirthdayGiftSchedule | 更新生日禮活動 |

### 使用的 Vuex Actions

| Action 名稱 | 說明 |
|------------|------|
| membershipActivity/getLevelGiftSchedule | 獲取等級禮活動列表 |
| membershipActivity/getLevelGiftScheduleInfo | 獲取等級禮活動詳情 |
| membershipActivity/getBirthDayGiftSchedule | 獲取生日禮活動列表 |
| membershipActivity/getBirthDayGiftScheduleInfo | 獲取生日禮活動詳情 |
| membershipActivity/setSetting | 設定優惠券配置 |
| membershipActivity/setCoupon | 設定選中的優惠券 |

### 提交資料結構

```javascript
{
  activity_name: String,                  // 活動名稱
  activity_schedule_start_time: String,   // 上架時間
  rule_adjust_type: Number,               // 等級變動類型
  activity_is_repeatable: Number,         // 是否可重複領取
  activity_is_phone_repeatable: Number,   // 同手機是否限領一次
  gift_point: Array,                      // 點數設定
  gift_coupon: Array,                     // 優惠券設定
  gift_score: Array,                      // 積分設定（生日禮用）
  send_mode: Number,                      // 發送時間模式（生日禮用）
  valid_days: Number                      // 生日前幾天發送（生日禮用）
}
```

## 表單驗證規則

### 必填欄位

1. 活動名稱
2. 上架時間
3. 同手機限領設定（入會禮/生日禮）
4. 可重複領取設定（續等禮/升等禮）

### 驗證訊息

- 請輸入活動名稱
- 請選擇上架時間
- 請選擇是否同手機號碼限領一次
- 請選擇會員是否可以重複領取

## 活動類型差異

| 活動類型 | currentType | 特殊設定 |
|---------|-------------|---------|
| 入會禮 | 1 | 同手機限領設定 |
| 續等禮 | 2 | 可重複領取設定 |
| 升等禮 | 3 | 可重複領取設定 |
| 生日禮 | 4 | 同手機限領設定、發送時間、積分設定 |

## 業務規則

1. 點數僅能新增一筆
2. 積分僅能新增一筆（僅生日禮）
3. 優惠券可新增多張
4. 活動建立後將於排程時間自動上架
5. 編輯模式需載入現有活動資料

## 相依組件

- `nd-dialog`：基礎彈窗組件
- `nd-point-dialog`：點數設定彈窗
- `nd-score-dialog`：積分設定彈窗
- `nd-chooseCoupon`：優惠券選擇組件
- `nd-activity-dialog`：優惠券設定彈窗
- `nd-more`：更多內容展開組件
- `nd-tooltip`：提示工具組件
- `DateSelect`：日期時間選擇組件

## Events

### 發出的事件

| 事件名稱 | 參數 | 說明 |
|---------|------|------|
| closeModal | - | 關閉彈窗 |

## Watch 監聽

| 監聽屬性 | 說明 |
|---------|------|
| modalTitle | 同步更新彈窗標題 |
| currentStep | 切換步驟時調整彈窗寬度 |
| showModal | 開啟時載入資料，關閉時重置狀態 |
| showChooseCouponModal | 關閉時重置優惠券設定 |
