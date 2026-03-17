# upgrade-gift-dialog.vue 調整說明

## 完成項目

### 1. 新增欄位

- ✅ 活動名稱 (`activity_name`) - 必填
- ✅ 上架時間 (`activity_schedule_start_time`) - 必填
  - 日期選擇器 (v-date-picker)
  - 時間選擇器 (v-time-picker，格式 HH:mm)

### 2. UI 調整

- ✅ 彈窗最大寬度改為 1080px (原 870px)
- ✅ 在點數/積分/優惠券區塊前新增「發送設定」標題

### 3. 文案更新

- ✅ 確認提醒彈窗：「活動已建立，將於排程時間自動上架。」
- ✅ 新增成功訊息：「活動已建立，活動將於排程時間自動上架」
- ✅ 更新成功訊息：「活動已更新，活動將於排程時間自動上架」

### 4. API 調整

使用排程版 API：

- ✅ 新增：`newLevelGiftSchedule` / `newBirthdayGiftSchedule`
- ✅ 更新：`updateLevelGiftSchedule` / `updateBirthdayGiftSchedule`
- ✅ 取得：`getLevelGiftSchedule` / `getBirthDayGiftSchedule`

### 5. 資料處理

- ✅ 新增 `updateScheduleDateTime()` 方法合併日期和時間
- ✅ 表單驗證新增活動名稱和上架時間檢查
- ✅ `configData()` 初始化時拆分上架時間為日期和時間
- ✅ data 新增 `scheduleDate` 和 `scheduleTime` 欄位

## 對應規格文件

| 項目 | 規格要求 | 實作狀態 |
|-----|---------|---------|
| 活動名稱 | 必填欄位 | ✅ 完成 |
| 上架時間 | 日期 + 時間 (00:00-23:59) | ✅ 完成 |
| 彈窗尺寸 | Max width: 1080px | ✅ 完成 |
| 發送設定標題 | 在點數/積分/優惠券前 | ✅ 完成 |
| 確認彈窗文案 | 排程提醒文案 | ✅ 完成 |
| 建立完成文案 | 排程成功文案 | ✅ 完成 |
| 使用排程 API | 所有 CRUD 操作 | ✅ 完成 |

## 使用說明

### 新增活動

1. 輸入活動名稱
2. 選擇上架日期和時間
3. 選擇發送設定（點數/積分/優惠券）
4. 確認後活動將於排程時間自動上架

### 編輯活動

1. 修改活動名稱或上架時間
2. 調整發送設定
3. 確認後更新活動資訊

## 注意事項

- 活動名稱和上架時間為必填欄位
- 上架時間格式：YYYY-MM-DD HH:mm:ss
- 時間選擇器使用 24 小時制
- 活動將於設定的上架時間自動生效
