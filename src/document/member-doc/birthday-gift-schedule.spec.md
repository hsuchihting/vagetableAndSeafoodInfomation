# 生日禮排程功能規格文件

## 功能概述

生日禮排程功能允許品牌提前設定多個生日禮活動版本，系統會依據設定的上架時間自動切換活動，避免每次變更都需要手動操作。

## 核心規則

### 領取限制

- 同一會員，同年度只限領一次（跨等級計算）
- 如需限制同手機一年僅領一次，請於各等級生日禮皆開啟「同手機號碼領取限制」
- 若未設定，將可能導致同一手機於不同等級帳號中重複領取

### 排程規則

- 設定排程自動切換活動，上架時間一到即生效
- 同時間僅能上架一檔活動
- 無論活動目前狀態為「未上架」或「已下架」，點擊「立即上架」後，活動將立即生效
- 上架時間將更新為系統記錄的最新上架時間

## 活動狀態

| 狀態代碼 | 狀態名稱 | 說明 | 樣式類別 |
|---------|---------|------|---------|
| 3 | 待上架 | 活動已建立但尚未上架 | label-light-default |
| 4 | 上架中 | 活動目前正在生效中 | label-light-success |
| 5 | 未上架 | 活動已下架 | label-light-warning |

## 介面功能

### 列表頁面

#### 頁面元素

1. **等級切換 Tab**
   - 左側垂直 Tab 顯示所有會員等級
   - 點擊切換不同等級的生日禮列表

2. **提示文字區塊**
   - 顯示生日禮的核心規則說明
   - 幫助使用者理解功能限制

3. **搜尋區塊**
   - 活動名稱搜尋（模糊搜尋）
   - 上架時間範圍篩選（起始時間、結束時間）
   - 排序選項

4. **狀態篩選按鈕組**
   - 全部
   - 上架中（status=4）
   - 待上架（status=3）
   - 未上架（status=5）

5. **操作按鈕區**
   - 上下架歷程按鈕：導向歷程列表頁
   - 新增生日禮排程按鈕：開啟新增彈窗

#### 列表欄位

| 欄位 | 說明 | 寬度 |
|------|------|------|
| # | 序號，從 1 開始計算 | 5% |
| 活動名稱(ID) | 顯示活動名稱（藍色）和 ID（灰色） | 40% |
| 狀態 | 顯示活動當前狀態標籤 | 10% |
| 上架時間 | 顯示排程上架時間<br>若有操作者資訊則顯示「由 XXX 上架/建立/更新」 | 20% |
| 操作 | 立即上架/下架按鈕、詳情按鈕、更多選單 | 25% |

#### 列表排序邏輯

```javascript
sortActivityList(list) {
  return list.sort((a, b) => {
    // 優先：上架中(status=4)排在最前面
    if (a.status === 4 && b.status !== 4) return -1
    if (b.status === 4 && a.status !== 4) return 1
    
    // 次要：按修改/建立時間倒序排列
    const timeA = new Date(a.update_time || a.updated_at || a.create_time || a.created_at).getTime()
    const timeB = new Date(b.update_time || b.updated_at || b.create_time || b.created_at).getTime()
    return timeB - timeA
  })
}
```

**排序規則說明：**

1. 優先順序：上架中（status=4）的活動排在最前面
2. 次要順序：待上架（status=3）和未上架（status=5）的活動依據修改時間（updated_at）或建立時間（created_at）倒序排列
3. 備註：上架時間的變更也會更新修改時間

#### 操作按鈕顯示邏輯

| 活動狀態 | 顯示按鈕 |
|---------|---------|
| 上架中（status=4） | 立即下架 |
| 待上架（status=3）或未上架（status=5） | 立即上架 |

所有狀態都顯示：

- 詳情按鈕（眼睛圖示）
- 更多選單（...圖示）
  - 編輯
  - 刪除（僅未上架且從未上架過的活動可刪除）

### 刪除規則

```javascript
canDelete(item) {
  return item.status === 3 && item.is_published !== 1
}
```

**刪除條件：**

- 只有「待上架」（status=3）且從未上架過（is_published=0）的活動可以刪除
- 「上架中」（status=4）和「未上架」（status=5）的活動不可刪除
- 曾經上架過的活動（is_published=1）即使目前為未上架狀態也不可刪除

### 立即上架功能

#### 執行流程

1. **檢查優惠券是否過期**

   ```javascript
   hasCouponExpired(activityInfo) {
     if (!activityInfo?.gift_coupon?.length) return false
     
     const now = new Date()
     return activityInfo.gift_coupon.some(coupon => {
       // 檢查 time_config.end_time
       if (coupon.time_config?.end_time) {
         if (new Date(coupon.time_config.end_time) < now) return true
       }
       // 檢查 time_config.expire_time
       if (coupon.time_config?.expire_time) {
         if (new Date(coupon.time_config.expire_time) < now) return true
       }
       // 檢查優惠券過期狀態
       if (coupon.is_expired === 1 || coupon.status === 'expired') {
         return true
       }
       return false
     })
   }
   ```

2. **優惠券過期處理**
   - 若活動包含已過期的優惠券，顯示提示彈窗：
     - 標題：「優惠券已過期」
     - 文字：「若想啟用此活動，贈送的優惠券需重新設定」
   - 用戶確認後，自動開啟編輯彈窗讓用戶重新設定優惠券
   - 若優惠券都未過期，則繼續上架流程

3. **確認上架**
   - 顯示確認彈窗：
     - 標題：「確認上架」
     - 文字：「若啟用此活動，上架將立即生效，上架時間將更新為當前時間，是否繼續此操作？」
   - 用戶確認後執行上架

4. **執行上架 API**
   - 呼叫 `publishBirthdayGiftSchedule` action
   - 傳遞參數：
     - levelId: 當前等級 ID
     - activityId: 活動 ID
     - ruleAdjustType: 4（生日禮）

5. **上架成功**
   - 刷新列表
   - 顯示成功訊息：
     - 標題：「上架成功」
     - 文字：「活動已立即生效，上架時間已更新為當前時間」

6. **錯誤處理**
   - 若上架失敗，顯示錯誤訊息
   - 提示用戶稍後再試

### 立即下架功能

#### 執行流程

1. **確認下架**
   - 顯示確認彈窗：
     - 標題：「確認下架」
     - 文字：「按下「立即下架」後，活動將會關閉，是否確定要繼續此操作？」

2. **執行下架 API**
   - 呼叫 `unpublishBirthdayGiftSchedule` action
   - 傳遞參數：
     - levelId: 當前等級 ID
     - activityId: 活動 ID
     - ruleAdjustType: 4（生日禮）

3. **下架成功**
   - 刷新列表
   - 顯示成功訊息：
     - 標題：「下架成功」

4. **錯誤處理**
   - 若下架失敗，顯示錯誤訊息
   - 提示用戶稍後再試

## 搜尋功能

### 時間格式處理

```javascript
formatScheduleTime(timeValue) {
  if (!timeValue) return undefined
  // 取得 YYYY-MM-DDTHH:mm 部分，轉換為空格分隔，秒數固定為 00
  const match = timeValue.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/)
  if (match) {
    return match[1] + ' ' + match[2] + ':00'
  }
  return timeValue
}
```

### 搜尋參數映射

| 搜尋元件欄位 | API 欄位 | 說明 |
|------------|---------|------|
| name | activity_name | 活動名稱，模糊搜尋 |
| startTime | activity_schedule_start_time_date_start	 | 上架起始時間，格式：YYYY-MM-DD HH:mm:00 |
| endTime | activity_schedule_start_time_date_end | 上架結束時間，格式：YYYY-MM-DD HH:mm:00 |
| sort | sort | 排序欄位 |

### 搜尋執行

```javascript
ruleSearch(data) {
  this.form = {
    activity_name: data.name,
    activity_schedule_start_time_date_start	: this.formatScheduleTime(data.startTime),
    activity_schedule_start_time_date_end: this.formatScheduleTime(data.endTime),
    sort: data.sort,
  }
  this.pageConfig.page = 1
  this.configData()
}
```

## 分頁功能

### 分頁配置

```javascript
pageConfig: {
  page: 1,      // 當前頁碼
  size: 10,     // 每頁筆數
  total: 0,     // 總筆數
}
```

### 分頁方法

#### 換頁

```javascript
changePage(page) {
  this.pageConfig.page = page
  this.configData()
}
```

#### 改變每頁筆數

```javascript
changeSize(size) {
  this.pageConfig.size = size
  this.pageConfig.page = 1
  this.configData()
}
```

### 序號計算

```javascript
getRowNumber(index) {
  return (this.pageConfig.page - 1) * this.pageConfig.size + index + 1
}
```

## 資料格式化

### 日期時間格式化

```javascript
formatDateTime(dateTime) {
  if (!dateTime) return '-'
  return this.$moment(dateTime).format('YYYY/MM/DD HH:mm')
}
```

**顯示格式：** YYYY/MM/DD HH:mm

### 操作者資訊顯示

```javascript
 getManagerName(item) {
      const mapping = [
        { key: 'publish_manager_name', label: '上架' },
        { key: 'create_manager_name', label: '建立' },
        { key: 'update_manager_name', label: '更新' },
      ]
      for (const { key, label } of mapping) {
        if (item[key]) {
          return `由 ${item[key]} ${label}`
        }
      }
      return ''
  },
```

**優先順序：**

1. 上架操作者
2. 建立操作者
3. 更新操作者

## API 整合

### 使用的 API

| API 名稱 | 說明 | 參數 |
|---------|------|------|
| `getBirthDayGiftSchedule` | 取得生日禮排程列表 | page, size, currentId, status, activity_name, activity_schedule_start_time, activity_schedule_end_time |
| `getBirthDayGiftScheduleInfo` | 取得生日禮排程詳情 | levelId, activityId |
| `publishBirthdayGiftSchedule` | 立即上架生日禮 | levelId, activityId, ruleAdjustType |
| `unpublishBirthdayGiftSchedule` | 立即下架生日禮 | levelId, activityId, ruleAdjustType |

### API 回應處理

```javascript
async configData() {
  const query = {
    page: this.pageConfig.page,
    size: this.pageConfig.size,
    currentId: this.currentId,
    status: this.status,
    activity_name: this.form.activity_name,
    activity_schedule_start_time_date_start	: this.form.activity_schedule_start_time,
    activity_schedule_start_time_date_end: this.form.activity_schedule_end_time,
  }
  
  const result = await this.$store.dispatch(
    'membershipActivity/getBirthDayGiftSchedule',
    query,
  )
  
  // 從 API 回傳的 meta 取得分頁資訊
  if (result?.meta) {
    this.pageConfig.total = result.meta.total_rows || 0
  }
  
  // 排序列表
  this.list = this.sortActivityList(result?.list || [])
}
```

## 元件整合

### 使用的子元件

| 元件名稱 | 用途 | Props/Events |
|---------|------|-------------|
| `NidinVerticalTab` | 等級切換 Tab | tabItems, @changeTab |
| `upgradeGiftDialog` | 新增/編輯活動彈窗 | showModal, currentType, currentId, activityType, modalTitle, editActivityId, usageChannelColorSet, @closeModal |
| `activity-info` | 活動詳情抽屜 | showActivityInfo, activityId, levelId, activityType, usageChannelColorSet, @update:showActivityInfo, @editActivity, @deleteActivity |
| `nd-rule-search` | 搜尋元件 | @ruleSearch |
| `nd-data-table` | 資料表格元件 | show-no-data, show-paginate, pageConfig, @pageChange, @sizeChange |

### 元件間互動

#### 開啟新增彈窗

```javascript
handleCreateActivity() {
  this.editActivityId = null
  this.upgradeGiftTitle = '新增生日禮排程'
  this.showModal = true
}
```

#### 開啟編輯彈窗

```javascript
editActivity(item) {
  this.editActivityId = item.activity_id
  this.upgradeGiftTitle = '編輯生日禮排程'
  this.showModal = true
}
```

#### 關閉彈窗

```javascript
closeModal() {
  this.showModal = false
  this.editActivityId = null
  this.upgradeGiftTitle = '新增生日禮排程'
}
```

#### 開啟活動詳情

```javascript
openActivityInfo(item) {
  this.activityInfoId = item.activity_id
  this.showActivityInfoDrawer = true
  this.$store.commit('membershipActivity/SHOW_ACTIVITY_INFO', {
    show: true,
    activityId: item.activity_id,
  })
}
```

#### 從詳情抽屜編輯

```javascript
handleEditFromInfo(activityInfo) {
  this.editActivityId = activityInfo.activity_id
  this.upgradeGiftTitle = '編輯生日禮排程'
  this.showModal = true
}
```

#### 從詳情抽屜刪除

```javascript
handleDeleteFromInfo(activityInfo) {
  this.deleteActivity(activityInfo)
}
```

## 資料監聽

### 監聽彈窗關閉

```javascript
watch: {
  showModal(val) {
    if (val === false) {
      this.upgradeGiftTitle = '新增生日禮排程'
      this.editActivityId = null
    }
  }
}
```

### 監聽列表更新

```javascript
watch: {
  async updateList(val) {
    if (val) {
      await this.configData()
      this.$store.commit('membershipActivity/UPDATE_LIST', false)
    }
  }
}
```

## 生命週期

### mounted

```javascript
async mounted() {
  // 取得會員卡資訊
  const data = await this.$store.dispatch(
    'membership/getMembershipInfo',
    this.$route.params.cardId,
  )
  // 設定預設等級
  this.currentId = data.level[0].id
  // 載入列表資料
  this.configData()
}
```

## 常數定義

### 狀態選項

```javascript
statusOptions: [
  { text: '全部', value: '' },
  { text: '待上架', value: '3' },
  { text: '上架中', value: '4' },
  { text: '未上架', value: '5' },
]
```

### 預設資料

```javascript
data() {
  return {
    showModal: false,
    showActivityInfoDrawer: false,
    activityInfoId: null,
    editActivityId: null,
    currentStatus: 0,
    currentType: 4,  // 生日禮 rule_adjust_type = 4
    currentId: 0,
    upgradeGiftTitle: '新增生日禮排程',
    form: {},
    status: '',
    list: [],
    pageConfig: {
      page: 1,
      size: 10,
      total: 0,
    },
  }
}
```

## 樣式規範

### 按鈕 SVG 圖示

```scss
.nd-btn .svg-icon.svg-icon-sm {
  display: inline-flex;
  align-items: center;
  ::v-deep svg {
    width: 18px;
    height: 18px;
  }
}
```

### 列表樣式

```scss
.ul-list {
  list-style-type: disc;
}
```

## 錯誤處理

### 通用錯誤處理原則

1. 所有 API 呼叫都需包裝在 try-catch 中
2. 錯誤訊息使用 SweetAlert2 顯示
3. 錯誤訊息優先顯示 API 回傳的 error.message
4. 若無具體錯誤訊息，顯示「請稍後再試」

### 範例

```javascript
try {
  await this.$store.dispatch('action', params)
  // 成功處理
} catch (error) {
  Swal.fire({
    title: '操作失敗',
    text: error.message || '請稍後再試',
    icon: 'error',
    confirmButtonText: '確認',
    customClass: {
      confirmButton: 'nd-btn nd-btn-primary',
    },
  })
}
```

## 使用者體驗優化

### 操作順序

1. **上架/下架操作**
   - 先刷新列表
   - 再顯示成功訊息
   - 確保使用者看到最新資料

2. **彈窗操作**
   - 關閉彈窗時重置狀態
   - 避免殘留資料影響下次操作

3. **搜尋操作**
   - 搜尋時重置頁碼為第一頁
   - 確保使用者看到完整的搜尋結果

4. **優惠券過期檢查**
   - 上架前先檢查優惠券
   - 若過期自動開啟編輯彈窗
   - 避免上架後才發現問題

## 路由設定

### 歷程頁面路由

```javascript
{
  name: 'MemberSystemActivtyHistory',
  params: { cardId: $route.params.cardId },
  query: { levelId: currentId, activityType: 4 }
}
```

## 權限與限制

### 操作權限

- 所有操作都需要適當的會員卡管理權限
- 刪除操作有額外限制（見刪除規則）

### 資料限制

- 同時間僅能有一個活動處於上架中狀態
- 上架時間不能重複
- 活動名稱長度限制：1-45 字元

## 未來擴充性

### 可擴充功能

1. 批次操作（批次上架/下架/刪除）
2. 活動複製功能
3. 活動範本功能
4. 更多篩選條件（建立時間、建立者等）
5. 匯出功能

### 注意事項

- 保持 API 介面的一致性
- 確保與其他禮別（入會禮、續等禮、升等禮）的功能一致性
- 維護程式碼的可讀性和可維護性
