# 會員卡活動排程系統分析書

## 1. 目的與範圍

### 目的

支援入會禮、續等禮、升等禮、生日禮的「排程上架」與管理，讓使用者可提前設定活動內容與上架時間，系統於排程時間自動生效，並提供上下架歷程與詳情檢視。

### 影響範圍

- 活動類型：入會禮／續等禮／升等禮／生日禮
- 模組：活動列表、活動新增/編輯彈窗、活動詳情抽屜、上下架歷程頁

## 2. 使用者流程

1. 進入活動管理列表（四種活動類型共用規格）
2. 新增或編輯活動（兩步驟對話框）
3. 設定活動內容與排程時間
4. 送出後顯示成功提示
5. 於列表查看狀態、上架時間與操作者資訊
6. 需要時立即上架/下架、查看歷程、開啟活動詳情

## 3. 功能需求摘要

### 列表管理

- 每個活動可有多筆排程模板
- 同時間只允許一筆活動「上架中」
- 欄位：ID、名稱、狀態、上架時間、最後編輯者、操作
- 狀態：
  - 預約執行（排程時間未到）
  - 上架中（生效中）
  - 未上架（未設定排程或已下架）
- 排程時間顯示：
  - 預約執行/上架中：顯示時間
  - 未上架：顯示 "-"
- 排序規則：狀態優先（上架中 > 預約執行 > 未上架），同狀態以 update_time 升序
- 操作：
  - 上架中顯示「立即下架」
  - 預約執行/未上架顯示「立即上架」
  - 上架中隱藏編輯下拉選單

### 新增/編輯彈窗

- 兩步驟流程
  - Step1：表單輸入
  - Step2：提醒文案
- 尺寸：Step1 1080px、Step2 480px
- 活動名稱必填
- 上架時間可為空，需支援日期+時間（分鐘）
- 生日禮顯示積分欄位，點數依據會員卡點數設定顯示
- 活動送出成功時顯示 SweetAlert 成功訊息
- `currentStep` 僅在彈窗開啟時初始化為 Step1，成功送出後不立即重置，避免回跳 Step1
- 表單驗證使用 `ValidationObserver`/`ValidationProvider` 的 `mode="passive"`
- 重新開啟/關閉彈窗時需重置驗證狀態，避免保留上次錯誤

### 活動詳情抽屜

- 顯示活動名稱、上架時間、狀態、操作者
- 顯示點數/積分/優惠券資訊（依活動類型）
- 上架中狀態不可編輯
- 歷程頁使用 hideActions 隱藏所有操作
- `activity_snapshot` 可能缺失，需使用安全 fallback 避免讀取 `undefined.info`

### 上下架歷程頁

- 顯示歷史記錄列表
- 標題與麵包屑依活動類型動態更新
- 歷程顯示：由誰上架/下架、時間

## 4. API 介面摘要

### 等級禮（入會/續等/升等）

- GET list: /membership/:id/levelGiftSchedule/list
- GET info: /membership/:id/levelGiftSchedule/:activity_id/info
- POST create: /membership/:id/levelGiftSchedule
- POST update: /membership/:id/levelGiftSchedule/:activity_id/update
- PUT publish: /membership/:id/levelGiftSchedule/:activity_id/publish
- PUT unpublish: /membership/:id/levelGiftSchedule/:activity_id/unpublish
- GET history list: /membership/:id/levelGiftSchedule/history/list
- GET history info: /membership/:id/levelGiftSchedule/history/:history_id/info

### 生日禮

- GET list: /membership/:id/birthdayGiftSchedule/list
- GET info: /membership/:id/birthdayGiftSchedule/:activity_id/info
- POST create: /membership/:id/birthdayGiftSchedule
- POST update: /membership/:id/birthdayGiftSchedule/:activity_id/update
- PUT publish: /membership/:id/birthdayGiftSchedule/:activity_id/publish
- PUT unpublish: /membership/:id/birthdayGiftSchedule/:activity_id/unpublish
- GET history list: /membership/:id/birthdayGiftSchedule/history/list
- GET history info: /membership/:id/birthdayGiftSchedule/history/:history_id/info

### 共同欄位

- activity_name: 活動名稱
- activity_schedule_start_time: 排程上架時間 (YYYY-MM-DD HH:mm:ss)
- gift_point, gift_score, gift_coupon: 禮品設定
- rule_adjust_type: 等級禮類型 (1/2/3)
- activity_is_repeatable: 續等/升等使用
- activity_is_phone_repeatable: 入會/生日使用

## 5. 核心資料流與格式

### 送出資料

- activity_schedule_start_time
  - 若為空值，送 null
  - 若為 YYYY-MM-DD HH:mm，補成 YYYY-MM-DD HH:mm:00
- activity_is_repeatable
  - 入會/生日固定 0
  - 續等/升等使用 activityRepeatable
- activity_is_phone_repeatable
  - 入會/生日使用
- gift_score
  - 送出前需正規化，每筆包含 `point_id`

### 活動詳情與清除排程

- 詳情 API 回傳 `info` 需安全取值（支援 `info/list/本體` 三種形狀）
- 清除排程時間時，需保留 gift_point/gift_score/gift_coupon
- 生日禮 store_range/offline_store_range 需包陣列
- gift_score 在編輯回填時需補齊 `point_id`

## 6. UI/UX 注意事項

- Step2 提醒文案固定
- SweetAlert 成功訊息出現時不得回跳 Step1
- Step1 表單驗證為被動模式（passive），避免開啟即驗證
- Step1 顯示時機：僅在對話框開啟時重置為 Step1，關閉時不切換
- 上架中活動不可編輯
- 操作選單需依狀態顯示

## 7. 錯誤處理

- API success 判定：若 payload.success 存在，success=1 才算成功
- 上架時間重複需顯示欄位錯誤並彈窗提示
- API error: 依 message/description 顯示對應錯誤

## 8. 開發注意事項

1. 不要在 SweetAlert 顯示前重置 currentStep
2. currentStep 重置應在彈窗開啟時統一處理，關閉時不要切回 Step1
3. 表單驗證使用 `mode="passive"` 並在開關彈窗時重置驗證狀態
4. 生日禮 API 與等級禮 API 路徑不同
5. clearScheduleTime 需完整保留禮品設定
6. store_range/offline_store_range 結構需依生日禮規則處理
7. 排程時間格式一律補秒數 00
8. gift_score 編輯回填與送出前需補齊 `point_id`
9. 列表排序依 status 優先與 update_time 升序

## 9. 測試建議

- 新增活動：無排程時間/有排程時間
- 編輯活動：修改排程時間、修改禮品
- 重複上架時間：前端阻擋與後端錯誤提示
- 立即上架/下架：狀態切換與列表刷新
- 成功提示：SweetAlert 出現前不閃現 Step1 與 Step2，並且 SweetAlert 在關閉 Step2 後 0.5 秒出現
- 生日禮：積分顯示與 payload 檢查（`point_id`）
- 清除排程時間：禮品不被清空

## 10. 主要檔案

- src/views/member/system/activty/project/components/upgrade-gift-dialog.vue
- src/views/member/system/activty/project/components/join-member-activity.vue
- src/views/member/system/activty/project/components/continuation-activity.vue
- src/views/member/system/activty/project/components/upgrade-activity.vue
- src/views/member/system/activty/project/components/birthday.vue
- src/views/member/system/activty/project/components/activity-info.vue
- src/views/member/system/activty/project/history/index.vue
- src/utils/schedule-mixin.js

