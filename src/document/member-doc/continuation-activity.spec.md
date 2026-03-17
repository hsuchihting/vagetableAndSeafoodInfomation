# 續等禮活動管理組件需求文件

## 組件名稱

`continuation-activity.vue`

## 組件概述

續等禮活動管理組件，用於管理會員卡等級的續等禮活動排程。當會員續約維持當前等級時，可獲得的禮品活動設定。

## 功能需求

### 1. 等級切換功能

- 左側顯示垂直分頁（nidinVerticalTab），列出所有會員等級
- 點擊不同等級時切換顯示該等級的續等禮活動列表
- 永久卡（無時效等級）不需設定續等禮，顯示提示訊息

### 2. 活動列表顯示

| 欄位 | 說明 |
|-----|------|
| # | 序號（支援分頁計算） |
| 活動名稱(ID) | 活動名稱可點擊跳轉至活動詳情頁，並顯示活動 ID |
| 狀態 | 未上架(3)、上架中(4)、已下架(5) |
| 上架時間 | 排程上架時間，並顯示操作人員資訊 |
| 操作 | 上架/下架按鈕、詳情、編輯、刪除等操作 |

### 3. 狀態篩選功能

- 支援篩選條件：全部、未上架、上架中、已下架
- 使用 `v-btn-toggle` 切換篩選狀態

### 4. 搜尋功能

- 活動名稱模糊搜尋
- 上架時間區間篩選
- 排序設定

### 5. 活動操作功能

#### 5.1 新增活動

- 點擊「+ 新增續等禮活動」按鈕開啟新增彈窗
- 使用 `upgradeGiftDialog` 組件進行活動設定

#### 5.2 編輯活動

- 點擊更多選單中的「編輯」開啟編輯彈窗
- 載入現有活動資料進行修改

#### 5.3 刪除活動

- 僅「未上架」狀態的活動可刪除
- 刪除前顯示確認彈窗

#### 5.4 立即上架

- 適用於「未上架」或「已下架」狀態的活動
- 上架前檢查活動中的優惠券是否已過期
- 若優惠券過期，提示用戶前往編輯
- 上架成功後更新上架時間為當前時間

#### 5.5 立即下架

- 適用於「上架中」狀態的活動
- 下架前顯示確認彈窗

### 6. 活動詳情抽屜

- 點擊詳情按鈕開啟活動資訊抽屜
- 支援從抽屜中編輯或刪除活動

### 7. 上下架歷程

- 提供跳轉至上下架歷程頁面的連結

## 資料結構

### Props

| 屬性名稱 | 類型 | 說明 |
|---------|------|------|
| usageChannelColorSet | Function | 使用通路顏色設定函數 |

### Data

| 屬性名稱 | 類型 | 預設值 | 說明 |
|---------|------|--------|------|
| showModal | Boolean | false | 控制新增/編輯彈窗顯示 |
| currentConfig | Object | {} | 當前活動配置 |
| currentStatus | Number | 4 | 當前狀態（上架中） |
| currentType | Number | 2 | 活動類型（2=續等禮） |
| currentId | Number | 0 | 當前等級 ID |
| upgradeGiftTitle | String | '新增續等禮活動' | 彈窗標題 |
| status | Number | 0 | 篩選狀態（0=全部） |
| form | Object | {} | 搜尋表單資料 |
| tablePageIndex | Number | 1 | 當前頁碼 |
| list | Array | [] | 活動列表 |
| meta | Object | {} | 分頁資訊 |
| editActivityId | Number | null | 編輯中的活動 ID |
| showActivityInfoDrawer | Boolean | false | 活動詳情抽屜顯示狀態 |
| activityInfoId | Number | null | 詳情抽屜中的活動 ID |

### Computed

| 屬性名稱 | 說明 |
|---------|------|
| basicInfo | 會員卡基本資訊（從 Vuex 獲取） |
| levelTabItems | 等級分頁項目（從 Vuex 獲取） |
| updateList | 列表更新標記（從 Vuex 獲取） |
| isCreate | 判斷是否為新建模式 |
| activityIsRepeatableStatusText | 可重複領取狀態文字 |
| isPermanent | 是否為永久卡等級 |

## API 整合

### 使用的 Vuex Actions

| Action 名稱 | 說明 |
|------------|------|
| membership/getMembershipInfo | 獲取會員卡資訊 |
| membershipActivity/getLevelGiftSchedule | 獲取等級禮活動排程列表 |
| membershipActivity/getLevelGiftScheduleInfo | 獲取等級禮活動詳情 |
| membershipActivity/publishLevelGiftSchedule | 上架等級禮活動 |
| membershipActivity/unpublishLevelGiftSchedule | 下架等級禮活動 |

### API 參數

```javascript
{
  page: Number,           // 頁碼
  size: Number,           // 每頁筆數（預設 10）
  rule_adjust_type: 2,    // 等級變動類型（2=續等禮）
  status: Number,         // 狀態篩選
  activity_name: String,  // 活動名稱搜尋
  activity_schedule_start_time: String,  // 上架時間起
  activity_schedule_end_time: String,    // 上架時間迄
  sort: String,           // 排序
  currentId: Number       // 等級 ID
}
```

## 狀態碼對照表

| 狀態碼 | 狀態名稱 | 樣式 Class |
|-------|---------|-----------|
| 3 | 未上架 | label-light-default |
| 4 | 上架中 | label-light-success |
| 5 | 已下架 | label-light-warning |

## 排序邏輯

1. 上架中（status=4）的活動優先顯示
2. 其他狀態按修改/建立時間倒序排列

## 業務規則

1. 永久卡等級不需設定續等禮
2. 同時間僅能有一檔活動處於上架中狀態
3. 僅「未上架」狀態的活動可刪除
4. 上架前需檢查優惠券是否過期
5. 立即上架會將上架時間更新為當前時間

## 相依組件

- `nidin-vertical-tab`：垂直分頁組件
- `upgrade-gift-dialog`：活動新增/編輯彈窗
- `activity-info`：活動詳情抽屜
- `nd-rule-search`：搜尋組件
- `nd-data-table`：資料表格組件

## 路由資訊

- 活動詳情頁：`MemberSystemActivtyInfo`
- 上下架歷程：`MemberSystemActivtyHistory`
