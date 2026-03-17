# 你訂-會員卡管理-後台

## 會員卡制度

- 目前後台有的會員制度項目均須包含，但須注意部分規則和現有制度不同 !
- 入會規則 : 平台/會員App註冊、你訂liff登入、會員整合後即成為你訂會員(第1等級)。
- 你訂新手等級(第1等級)消費只有贈積分。升等至第2等級時，剩餘升等積分不會保留。
- 你訂玩家等級(第2等級)開始才有消費贈點/積分規則。
- 點數折抵規則 : 暫無，點數僅用於遊樂園、點數商城兌換券/商品券。

## 會員卡活動

- **活動說明**
  - 目前後台有的會員卡活動，除會員卡折扣活動外，均須包含。因等級1是純積分制，故再新增「指定商品贈積分活動」。
  - 你訂會員卡活動：入會禮、指定商品贈點、指定商品贈積分、你訂遊樂園 (扭蛋機、刮刮卡 )、續等禮、升等禮、點數加碼活動、積分加碼活動、生日禮。
  - 活動參加門市規則：「你訂聯盟」品牌/門市、指定品牌/門市。
  - 生日禮、續等禮與升等禮中的各等級皆具備獨立的上架與下架歷程記錄。
- **排程管理規格**
  - 適用活動：入會禮、續等禮、升等禮、生日禮。
  - 規格說明：
    - 僅設定上架時間，時間到了將進行切換，上架時間不能重複，支援設定小時。
    - 已上架過的活動不可刪除。
    - 同個版型可以上架多次。
    - 設定排程自動切換活動，上架時間一到即生效；同時間僅能上架一檔活動。
- **上下架歷程**
    1. 依「建立時間」排序，最新顯示於最前。
    2. 即使僅有一檔活動上架，仍需揭露於歷程列表。
    3. 入會禮、生日禮、續等禮和升等禮的標題下方新增『禮遇的類別』- 『等級的名稱』
    4. 入會禮的上下架歷程的標題下方不用有『禮遇的類別』名稱
    5. 生日禮、續等禮與升等禮中的各等級皆具備獨立的上架與下架歷程記錄。
- **會員卡活動列表**
  - 會員卡活動包含以下類型：一般活動、等級活動
- **活動設定**
  - 一般活動：入會禮、指定商品贈點、指定商品贈積分、你訂遊樂園。
  - 等級活動：續等禮、升等禮、點數加碼活動、積分加碼活動、生日禮。
- **檢視單一活動詳情**
  - 顯示活動完整設定內容

### 官方平台券規則（重要）

- 你訂官方平台的會員卡活動只能使用平台券。
- 平台券判斷條件：`owner_type = 1` 且 `brand_id = 0`。
- 入會禮/續等禮/升等禮/生日禮的選券清單與送出資料，皆需符合上述條件。
- 若選用品牌券（`brand_id != 0`）或非平台券（`owner_type != 1`），後端會回覆「沒有操作該優惠券的權限」。

## 查看會員卡詳細資訊

同步會員卡制度與活動資訊

## 你訂型識別條件

- **識別值**：`basicInfo.group_id === 184`
- **說明**：此值固定為你訂型會員卡的識別條件，在 `normal-activity.vue` 或 `level-up-activity.vue` 中從 getter 取得 `basicInfo` 時，判斷 `group_id` 是否為 `184` 以識別相關模組功能是否為你訂型。
- **你訂型活動 Tab 顯示規則**
  - 在等級活動頁籤（`level-up-activity.vue`）中，「會員卡折扣活動」tab 的顯示邏輯：
    - 當 `basicInfo.group_id === 184` 時，該 tab 的 `show` 為 `false`（隱藏）。
    - 否則 `show` 為 `true`（顯示）。

## 排程管理相關檔案盤點

### 活動入口／容器

- [src/views/member/system/activty/index.vue](src/views/member/system/activty/index.vue)：會員卡活動入口與頁籤容器
- [src/views/member/system/card/project/member-card-activity.vue](src/views/member/system/card/project/member-card-activity.vue)：會員卡活動主視圖（一般/等級活動）
- [src/views/member/system/activty/project/level-up-activity.vue](src/views/member/system/activty/project/level-up-activity.vue)：等級活動容器（續等/升等/生日）

### 排程列表（入會禮／續等禮／升等禮／生日禮）

- [src/views/member/system/activty/project/components/join-member-activity.vue](src/views/member/system/activty/project/components/join-member-activity.vue)：入會禮排程列表與操作
- [src/views/member/system/activty/project/components/continuation-activity.vue](src/views/member/system/activty/project/components/continuation-activity.vue)：續等禮排程列表與操作
- [src/views/member/system/activty/project/components/upgrade-activity.vue](src/views/member/system/activty/project/components/upgrade-activity.vue)：升等禮排程列表與操作
- [src/views/member/system/activty/project/components/birthday.vue](src/views/member/system/activty/project/components/birthday.vue)：生日禮排程列表與操作

### 新增／編輯對話框（共用）

- [src/views/member/system/activty/project/components/upgrade-gift-dialog.vue](src/views/member/system/activty/project/components/upgrade-gift-dialog.vue)：四種活動共用新增/編輯流程（排程時間、提醒 Step2、驗證與送出）

### 活動詳情抽屜

- [src/views/member/system/activty/project/components/activity-info.vue](src/views/member/system/activty/project/components/activity-info.vue)：活動詳情抽屜（狀態、上架時間、禮品資訊）

### 上下架歷程

- [src/views/member/system/activty/project/history/index.vue](src/views/member/system/activty/project/history/index.vue)：上下架歷程列表
- [src/views/member/system/activty/project/history/history-search.vue](src/views/member/system/activty/project/history/history-search.vue)：歷程搜尋條件
- [src/router/modules/member/index.js](src/router/modules/member/index.js)：歷程頁路由

### 共用工具

- [src/utils/schedule-mixin.js](src/utils/schedule-mixin.js)：狀態標籤、排序規則、排程時間格式化、清除排程等共用邏輯
- [src/views/member/system/activty/project/components/rule-search.vue](src/views/member/system/activty/project/components/rule-search.vue)：列表搜尋條件（名稱／排程時間）

### API／Vuex

- [src/api/membership.js](src/api/membership.js)：levelGiftSchedule 與 birthdayGiftSchedule API
- [src/store/membership-activity.module.js](src/store/membership-activity.module.js)：排程 CRUD／發布／下架／歷程的 Vuex actions

### 其他（非排程列表）

- [src/views/member/system/card/project/components/birthday.vue](src/views/member/system/card/project/components/birthday.vue)：會員卡詳細頁的生日禮摘要
