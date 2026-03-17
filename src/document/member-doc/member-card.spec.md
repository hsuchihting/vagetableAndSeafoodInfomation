# 會員卡活動-入會禮/續等禮/升等禮/生日禮支援排程設定

## 任務需求

會員卡活動 - 入會禮／續等禮等功能需支援排程設定，避免目前必須於當天手動執行的限制。此功能可讓客戶提前完成設定，系統將依排程自動生效，提升操作彈性與準備效率。

## 任務描述

影響範圍：入會禮/續等禮/升等禮/生日禮

在入會禮/續等禮/升等禮/生日禮，新增「排程管理」介面，讓每個禮都可以新增多個不同模板內容，每個模板內容，可以設定上架時間，時間到了將進行切換。

- 詳細規格參考下方設計
  - 設定時新增欄位，可設定[名稱]、[上架時間]
  - 調整頁面呈現方式，改為列表呈現
  - 介面欄位
    - ID
    - 名稱
    - 狀態：
      - 預約執行（排程時間未到）
      - 上架中（正在執行中）
      - 未上架（未設定排程或已下架）
    - 上架時間
      - 僅「預約執行」和「上架中」狀態才顯示時間
      - 「未上架」狀態顯示「-」
      - 僅設定上架時間，時間到了將進行切換，上架時間不能重複
      - 支援設定小時
    - 建立者
      - 顯示建立活動的管理員名稱
      - 格式：「由 XXX 建立」
    - 詳情&編輯
    - 立即上架按鈕、立即下架按鈕
  - 同個版型可以上架多次
  - 設定排程自動切換活動，上架時間一到即生效；同時間僅能上架一檔活動。
  - 列表排序規則：
    - 使用最後更新時間（updated_at）排序：新 → 舊
    - 所有狀態的活動統一使用此排序規則
    - 備註：上架時間的變更也會更新修改時間
  - 按鈕顯示邏輯：
    - 當活動狀態為「上架中」時，顯示「立即下架」按鈕
    - 當活動狀態為「預約執行」或「未上架」時，顯示「立即上架」按鈕
  - 編輯按鈕邏輯：
    - 當活動狀態為「上架中」時：
      - 列表頁面：完全隱藏編輯的下拉選單（使用 `v-if="item.status !== 4"` 控制 `<v-menu>` 元素）
      - 活動詳情頁面：完全隱藏編輯按鈕（使用 `v-if="activityInfo.status !== 4"`）
      - 歷程頁面：因使用 `hideActions` prop，所有操作按鈕均隱藏
    - 當活動狀態為「預約執行」或「未上架」時：
      - 列表頁面：顯示下拉選單，僅包含「編輯」選項
      - 活動詳情頁面：顯示編輯按鈕
    - hideActions 功能：
      - 用於上下架歷程頁面，設定 `hideActions="true"` 時完全隱藏所有操作按鈕
      - 確保歷程頁面的只讀性質，避免誤操作
  - 刪除功能：
    - 已移除刪除功能，未來將以封存方式處理
  - 上架規則：
    - 已上架和已下架的活動都可以重複上架
    - 同時間只能有一個活動處於「上架中」狀態，不能重疊
    - 點擊「立即上架」後，上架時間會自動更新為當下按按鈕的時間
    - 上架成功後列表會自動刷新
    - 優惠券過期檢查：
      - 點擊「立即上架」時，系統會檢查活動中的優惠券是否已過期
      - 若活動包含已過期的優惠券，會顯示提示彈窗：「若想啟用此活動，贈送的優惠券需重新設定」
      - 用戶確認後，系統會自動開啟編輯彈窗讓用戶重新設定優惠券
      - 若優惠券都未過期，則正常執行上架流程
  - 封存功能（未來規劃）：
    - 目前已移除刪除功能
    - 未來將以封存方式處理不需要的活動

## 畫面設計（ＵＩ）

### BDMS >會員卡管理>會員卡活動管理 > 入會禮/續等禮/升等禮/生日禮

1. 首頁改成列表管理樣式
    1. 流程與細節請參考設計稿
        1. 列表欄位：
            - ID：活動識別碼
            - 名稱：活動名稱（可點擊開啟詳情）
            - 狀態：預約執行 / 上架中 / 未上架
            - 上架時間：
              - 預約執行、上架中：顯示排程時間
              - 未上架：顯示「-」
            - 建立者：顯示「由 XXX 建立」（使用 `create_manager_name`）
            - 操作：編輯按鈕（上架中時隱藏）
        2. 建立者資訊字體大小：12px（使用 `nd-font-size-caption` 樣式類別）
    2. 規格與說明請參考入會禮的設計稿, 其餘的都比照入會禮規格說明
    3. 每個活動功能頁面的說明文案都不同!

2. 新增入會禮活動彈窗：
    1. 新增點數，積分和 優惠券區塊增加 標題『發送設定』
    2. 彈窗尺寸：
        - 第一步（活動設定）Max width: 1080px
        - 第二步（確認提醒）Max width: 480px
    3. 表單欄位樣式：
        - 活動名稱 input 高度：32px（設計稿規格）
        - 實作方式：`style="height: 32px"`
    4. 生日禮的發送時間與選項間距幫我縮減成180px
    5. 增加內容 :
        1. 活動名稱
            - input 高度：32px（符合設計稿規格）
        2. 上架時間: 『日期』與 00:00-23:59『小時與分鐘』
            - 日期選擇器限制：只能選擇今天及以後的日期（實作方式：`:setMinNow="true"`）

3. 按下確認後會攤出提醒彈窗，裡面文案需修改（每個活動文案一樣)
    - 彈窗文案：「按下「確認」後，活動將依排程時間上架，時間到後即自動生效。」
4. 活動建立的告知彈窗文案需修改（每個活動文案一樣)
5. 增加上下架歷程頁
6. 排列方式會以最新的擺在第一個
7. 只有一檔活動上架，一樣揭露在此列表
8. 頁面標題與麵包屑：
      - 標題動態顯示：「入會禮上下架歷程」、「續等禮上下架歷程」、「升等禮上下架歷程」、「生日禮上下架歷程」
      - 副標題顯示規則：
        - 入會禮：不顯示副標題
        - 續等禮/升等禮/生日禮：顯示等級名稱（如「等級一」）
      - 麵包屑更新實作：
        - 透過 Vuex store 的 `breadcrumbsConfig/changeBreadcrumb` action 更新
        - 在 `updatePageTitle()` 方法中統一處理標題、麵包屑和 DOM 屬性更新
        - 當路由參數變化時自動更新
        - 組件銷毀時清除 DOM 自訂屬性
9. 生日禮、續等禮與升等禮中的各等級皆具備獨立的上架與下架歷程記錄。
增加活動詳情頁
    1. 內容樣式同會員卡制度詳情
        1. 備註: 每個活動的內容都不同需去到各自設計稿查詢
    2. 顯示邏輯：
        1. 點數區塊：依據 `basicInfo.membership_point_type === 2` 條件顯示
        2. 積分區塊：只在生日禮（`activityType === 4`）時顯示
        3. 優惠券區塊：所有活動類型都顯示
        4. 備註: 每個活動的內容都不同需去到各自設計稿查詢
    3. 樣式規範：
        1. 標題「活動資訊」：使用 `nd-text-cool-gray-7` 樣式類別
        2. 活動資訊欄位文字（活動名稱、上架時間、同手機號碼限領、狀態、管理員資訊）：使用 `nd-text-cool-gray-7` 樣式類別
        3. 區塊標題（點數、積分、優惠券）：使用 `nd-text-neutral-9` 樣式類別
        4. 區塊標題字體大小：使用 `nd-font-size-base` 樣式類別
        5. 區塊標題與上方內容間距：上方 `mt-6`（點數）或 `mt-7`（優惠券）、下方 `mb-3`
    4. 按鈕顯示邏輯：
        1. hideActions 為 true 時（上下架歷程頁面）：完全隱藏編輯和刪除按鈕
        2. hideActions 為 false 時（一般活動頁面）：
           - 編輯按鈕：僅在活動狀態不為「上架中」（status !== 4）時顯示
           - 刪除按鈕：僅在符合 canDelete 條件時顯示（未上架且從未上架過）

### 調整範圍與各個活動設計稿

| 功能項目 | 類別 | 調整項目 | 說明 | 參考設計稿連結 | 對應檔案 | 使用 API |
|---------|------|---------|------|--------------|---------|-----------|
| 入會禮 | 首頁列表管理樣式 | 改版為「列表管理樣式」 | - 流程與細節請參考設計稿<br>- 規格與說明請比照「入會禮」<br>- 其餘（續等禮／升等禮／生日禮）依同規格套用 | Figma 連結 | `src/views/member/system/activty/project/components/join-member-activity.vue` | `GET /membership/:id/levelGiftSchedule/list`<br>`PUT /membership/:id/levelGiftSchedule/:activity_id/publish`<br>`PUT /membership/:id/levelGiftSchedule/:activity_id/unpublish`<br>`DELETE /membership/:id/levelGiftSchedule/:activity_id/delete` |
| 入會禮 | 新增欄位 | 活動名稱 & 上架時間 | - 增加「活動名稱」欄位<br>- 增加「上架時間」（日期＋時段 00:00–23:59） | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | `POST /membership/:id/levelGiftSchedule`<br>`POST /membership/:id/levelGiftSchedule/:activity_id/update`<br>`GET /membership/:id/levelGiftSchedule/:activity_id/info` |
| 入會禮 | 步驟確認彈窗 | 修改確認文案 | 按下「確認」後出現提醒彈窗，文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 入會禮 | 活動建立彈窗 | 修改建立完成提示文案 | 活動建立完成後的系統提示彈窗文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 入會禮 | 上下架歷程頁 | 新增歷程列表頁 | - 按「最新紀錄在最上」排序<br>- 僅顯示一檔上架中活動於列表<br>- 標題顯示「入會禮上下架歷程」，不顯示副標題<br>- 麵包屑透過 Vuex store 動態更新 | Figma 連結 | `src/views/member/system/activty/project/history/index.vue` | `GET /membership/:id/levelGiftSchedule/history/list`<br>`GET /membership/:id/levelGiftSchedule/history/:history_id/info` |
| 入會禮 | 活動詳情頁 | 新增活動詳情頁面 | - 樣式比照「會員卡制度詳情」 | Figma 連結 | `src/views/member/system/activty/project/components/activity-info.vue` | `GET /membership/:id/levelGiftSchedule/:activity_id/info` |
| 續等禮 | 首頁列表管理樣式 | 改版為「列表管理樣式」 | - 流程與細節請參考設計稿<br>- 規格與說明請比照「入會禮」<br>- 其餘（續等禮／升等禮／生日禮）依同規格套用 | Figma 連結 | `src/views/member/system/activty/project/components/continuation-activity.vue` | `GET /membership/:id/levelGiftSchedule/list`<br>`PUT /membership/:id/levelGiftSchedule/:activity_id/publish`<br>`PUT /membership/:id/levelGiftSchedule/:activity_id/unpublish`<br>`DELETE /membership/:id/levelGiftSchedule/:activity_id/delete` |
| 續等禮 | 新增欄位 | 活動名稱 & 上架時間 | - 增加「活動名稱」欄位<br>- 增加「上架時間」（日期＋時段 00:00–23:59） | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | `POST /membership/:id/levelGiftSchedule`<br>`POST /membership/:id/levelGiftSchedule/:activity_id/update`<br>`GET /membership/:id/levelGiftSchedule/:activity_id/info` |
| 續等禮 | 步驟確認彈窗 | 修改確認文案 | 按下「確認」後出現提醒彈窗，文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 續等禮 | 活動建立彈窗 | 修改建立完成提示文案 | 活動建立完成後的系統提示彈窗文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 續等禮 | 上下架歷程頁 | 新增歷程列表頁 | - 按「最新紀錄在最上」排序<br>- 僅顯示一檔上架中活動於列表<br>- 標題顯示「續等禮上下架歷程」<br>- 副標題顯示等級名稱<br>- 麵包屑透過 Vuex store 動態更新 | Figma 連結 | `src/views/member/system/activty/project/history/index.vue` | `GET /membership/:id/levelGiftSchedule/history/list`<br>`GET /membership/:id/levelGiftSchedule/history/:history_id/info` |
| 續等禮 | 活動詳情頁 | 新增活動詳情頁面 | - 樣式比照「會員卡制度詳情」<br>- 各活動內容依各自設計稿確認 | Figma 連結 | `src/views/member/system/activty/project/components/activity-info.vue` | `GET /membership/:id/levelGiftSchedule/:activity_id/info` |
| 升等禮 | 首頁列表管理樣式 | 改版為「列表管理樣式」 | - 流程與細節請參考設計稿<br>- 規格與說明請比照「入會禮」<br>- 其餘（續等禮／升等禮／生日禮）依同規格套用 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-activity.vue` | `GET /membership/:id/levelGiftSchedule/list`<br>`PUT /membership/:id/levelGiftSchedule/:activity_id/publish`<br>`PUT /membership/:id/levelGiftSchedule/:activity_id/unpublish`<br>`DELETE /membership/:id/levelGiftSchedule/:activity_id/delete` |
| 升等禮 | 新增欄位 | 活動名稱 & 上架時間 | - 增加「活動名稱」欄位<br>- 增加「上架時間」（日期＋時段 00:00–23:59） | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | `POST /membership/:id/levelGiftSchedule`<br>`POST /membership/:id/levelGiftSchedule/:activity_id/update`<br>`GET /membership/:id/levelGiftSchedule/:activity_id/info` |
| 升等禮 | 步驟確認彈窗 | 修改確認文案 | 按下「確認」後出現提醒彈窗，文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 升等禮 | 活動建立彈窗 | 修改建立完成提示文案 | 活動建立完成後的系統提示彈窗文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 升等禮 | 上下架歷程頁 | 新增歷程列表頁 | - 按「最新紀錄在最上」排序<br>- 僅顯示一檔上架中活動於列表<br>- 標題顯示「升等禮上下架歷程」<br>- 副標題顯示等級名稱<br>- 麵包屑透過 Vuex store 動態更新 | Figma 連結 | `src/views/member/system/activty/project/history/index.vue` | `GET /membership/:id/levelGiftSchedule/history/list`<br>`GET /membership/:id/levelGiftSchedule/history/:history_id/info` |
| 升等禮 | 活動詳情頁 | 新增活動詳情頁面 | - 樣式比照「會員卡制度詳情」<br>- 各活動內容依各自設計稿確認 | Figma 連結 | `src/views/member/system/activty/project/components/activity-info.vue` | `GET /membership/:id/levelGiftSchedule/:activity_id/info` |
| 生日禮 | 首頁列表管理樣式 | 改版為「列表管理樣式」 | - 流程與細節請參考設計稿<br>- 規格與說明請比照「入會禮」<br>- 其餘（續等禮／升等禮／生日禮）依同規格套用 | Figma 連結 | `src/views/member/system/activty/project/components/birthday.vue` | `GET /membership/:id/birthdayGiftSchedule/list`<br>`PUT /membership/:id/birthdayGiftSchedule/:activity_id/publish`<br>`PUT /membership/:id/birthdayGiftSchedule/:activity_id/unpublish`<br>`DELETE /membership/:id/birthdayGiftSchedule/:activity_id/delete` |
| 生日禮 | 新增欄位 | 活動名稱 & 上架時間 | - 增加「活動名稱」欄位<br>- 增加「上架時間」（日期＋時段 00:00–23:59） | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | `POST /membership/:id/birthdayGiftSchedule`<br>`POST /membership/:id/birthdayGiftSchedule/:activity_id/update`<br>`GET /membership/:id/birthdayGiftSchedule/:activity_id/info` |
| 生日禮 | 步驟確認彈窗 | 修改確認文案 | 按下「確認」後出現提醒彈窗，文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 生日禮 | 活動建立彈窗 | 修改建立完成提示文案 | 活動建立完成後的系統提示彈窗文案更新 | Figma 連結 | `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | - |
| 生日禮 | 上下架歷程頁 | 新增歷程列表頁 | - 按「最新紀錄在最上」排序<br>- 僅顯示一檔上架中活動於列表<br>- 標題顯示「生日禮上下架歷程」<br>- 副標題顯示等級名稱<br>- 麵包屑透過 Vuex store 動態更新 | Figma 連結 | `src/views/member/system/activty/project/history/index.vue` | `GET /membership/:id/birthdayGiftSchedule/history/list`<br>`GET /membership/:id/birthdayGiftSchedule/history/:history_id/info` |
| 生日禮 | 活動詳情頁 | 新增活動詳情頁面 | - 樣式比照「會員卡制度詳情」 | Figma 連結 | `src/views/member/system/activty/project/components/activity-info.vue` | `GET /membership/:id/birthdayGiftSchedule/:activity_id/info` |

## BDMS >會員卡管理>會員卡詳細資訊

- 增加活動名稱與上架時間資訊
- 『查看所有等級進行中活動 彈窗』 也需增加活動名稱與上架時間：
- 調整範圍

| 活動功能 | 頁面 | 調整內容 | 備註 / 連結 |
|---------|------|---------|------------|
| 入會禮 | 會員卡詳細資訊頁 | 增加活動名稱與上架時間，方便品牌查看活動資訊| ✅ 已完成（2025-12-17）|
| 入會禮 | 查看所有等級進行中活動 彈窗 | 增加活動名稱與上架時間，保持與詳細資訊頁一致||
| 續等禮 | 會員卡詳細資訊頁 | 增加活動名稱與上架時間，方便品牌查看活動資訊| ✅ 已完成（2025-12-17）|
| 續等禮 | 查看所有等級進行中活動 彈窗 | 增加活動名稱與上架時間，保持與詳細資訊頁一致||
| 升等禮 | 會員卡詳細資訊頁 | 增加活動名稱與上架時間，方便品牌查看活動資訊| ✅ 已完成（2025-12-17）|
| 升等禮 | 查看所有等級進行中活動 彈窗 | 增加活動名稱與上架時間，保持與詳細資訊頁一致||
| 生日禮 | 會員卡詳細資訊頁 | 增加活動名稱與上架時間，方便品牌查看活動資訊| ✅ 已完成（2025-12-17）|
| 生日禮 | 查看所有等級進行中活動 彈窗 | 增加活動名稱與上架時間，保持與詳細資訊頁一致||

## 後台API 調整

### 等級禮（入會禮、續等禮、升等禮）API 共用說明

入會禮、續等禮、升等禮皆共用同一組 API，僅需於 body 或 query 帶入共同參數 `rule_adjust_type`，以區分不同等級變動類型：

| rule_adjust_type 值 | 對應禮別 |
|---|---|
| 1 | 入會禮 |
| 2 | 續等禮 |
| 3 | 升等禮 |

例如：

- 查詢入會禮列表：`GET /membership/:membership_id/levelGiftSchedule/list?rule_adjust_type=1`
- 查詢續等禮列表：`GET /membership/:membership_id/levelGiftSchedule/list?rule_adjust_type=2`
- 查詢升等禮列表：`GET /membership/:membership_id/levelGiftSchedule/list?rule_adjust_type=3`

所有等級禮相關新增、編輯、刪除、上下架等 API 皆以 rule_adjust_type 區分禮別。

// 保留以下原始內容

1. 新增排程版API - 現有的會員禮＆生日禮活動API路徑加入`Schedule`，例如：
`/membership/288/levelGiftSchedule`
`/membership/288/birthdayGiftSchedule`
2. 排程API 新增/編輯/取得資訊/列表加入以下參數
    1. `activity_name`：活動名稱
    2. `activity_schedule_start_time`：排程上架時間
3. 排程立即上下架功能
    1. 立即上架 `PUT /membership/:membership_id/levelGiftSchedule/:activity_id/publish`
    2. 立即下架 `PUT /membership/:membership_id/levelGiftSchedule/:activity_id/unpublish`
        1. 共通body參數

        ```php
        {
          "rule_adjust_type": 1
        }
        ```

### 1. 新增排程版API

現有的會員禮＆生日禮活動API路徑加入`Schedule`，例如：

#### 等級禮排程 API

- **新增排程活動**
  - `POST /membership/:membership_id/levelGiftSchedule`
- **更新排程活動**
  - `POST /membership/:membership_id/levelGiftSchedule/:activity_id/update`
- **取得排程活動列表**
  - `GET /membership/:membership_id/levelGiftSchedule/list`
- **取得排程活動資訊**
  - `GET /membership/:membership_id/levelGiftSchedule/:activity_id/info`
- **刪除排程活動**
  - `DELETE /membership/:membership_id/levelGiftSchedule/:activity_id/delete`

#### 生日禮排程 API

- **新增排程活動**
  - `POST /membership/:membership_id/birthdayGiftSchedule`
- **更新排程活動**
  - `POST /membership/:membership_id/birthdayGiftSchedule/:activity_id/update`
- **取得排程活動列表**
  - `GET /membership/:membership_id/birthdayGiftSchedule/list`
- **取得排程活動資訊**
  - `GET /membership/:membership_id/birthdayGiftSchedule/:activity_id/info`
- **刪除排程活動**
  - `DELETE /membership/:membership_id/birthdayGiftSchedule/:activity_id/delete`

### 2. 排程API 新增/編輯參數

所有排程 API 的新增/編輯/取得資訊/列表都需加入以下參數：

| 參數名稱 | 類型 | 必填 | 說明 | 範例 |
|---------|------|------|------|------|
| `activity_name` | String | 是 | 活動名稱 | "2024 春節入會禮" |
| `activity_schedule_start_time` | String | 是 | 排程上架時間（格式：YYYY-MM-DD HH:mm:ss） | "2024-01-20 00:00:00" |
| `activity_schedule_end_time` | String | 否 | 篩選下架時間（格式：YYYY-MM-DD HH:mm:ss），用於列表查詢篩選 | "2024-02-20 00:00:00" |
| `gift_point` | Array | 否 | 點數/積分設定 | 參考現有格式 |
| `gift_coupon` | Array | 否 | 優惠券設定 | 參考現有格式 |
| `gift_score` | Array | 否 | 積分設定 | 參考現有格式 |
| `rule_adjust_type` | Number | 是 | 規則調整類型 | 1 |
| `activity_is_repeatable` | Number | 否 | 會員是否可重複領取（0=否，1=是）<br>**僅升等禮/續等禮使用** | 0 |
| `activity_is_phone_repeatable` | Number | 否 | 同手機號碼是否可重複領取（0=是，1=否）<br>**僅入會禮/生日禮使用** | 1 |
| `send_mode` | Number | 否 | 發送模式 | 2 |
| `valid_days` | Number | 否 | 有效天數 | null |

### 3. 排程立即上下架功能

#### 立即上架

- **等級禮立即上架**
  - `PUT /membership/:membership_id/levelGiftSchedule/:activity_id/publish`
- **生日禮立即上架**
  - `PUT /membership/:membership_id/birthdayGiftSchedule/:activity_id/publish`

#### 立即下架

- **等級禮立即下架**
  - `PUT /membership/:membership_id/levelGiftSchedule/:activity_id/unpublish`
- **生日禮立即下架**
  - `PUT /membership/:membership_id/birthdayGiftSchedule/:activity_id/unpublish`

#### 共通 Body 參數

```json
{
  "rule_adjust_type": 1
}
```

### 4. 上下架歷程 API

- **取得歷程列表**
  - 等級禮：`GET /membership/:membership_id/levelGiftSchedule/history/list`
  - 生日禮：`GET /membership/:membership_id/birthdayGiftSchedule/history/list`

- **取得歷程詳情**
  - 等級禮：`GET /membership/:membership_id/levelGiftSchedule/history/:history_id/info`
  - 生日禮：`GET /membership/:membership_id/birthdayGiftSchedule/history/:history_id/info`

#### 歷程列表 API 請求參數

| 參數名稱 | 類型 | 必填 | 說明 |
|---------|------|------|------|
| `page` | Number | 否 | 頁碼，預設為 1 |
| `size` | Number | 否 | 單頁筆數，預設為 1 |
| `rule_adjust_type` | Number | 否 | 等級變動類型：1: 加入，2: 續約，3: 升等，4: 降等，5: 退出 |
| `activity_id` | Number | 否 | 活動 ID |
| `activity_name` | String | 否 | 活動名稱，模糊搜尋，size range: 1-45 |
| `publish_time_start` | String | 否 | 篩選上架起始時間，格式：YYYYMMDD |
| `publish_time_end` | String | 否 | 篩選上架結束時間，格式：YYYYMMDD |
| `unpublish_time_start` | String | 否 | 篩選下架起始時間，格式：YYYYMMDD |
| `unpublish_time_end` | String | 否 | 篩選下架結束時間，格式：YYYYMMDD |

#### 歷程顯示規則

1. **手動操作顯示規則**
   - 1.1 手動操作（`publish_src_type=1` 或 `unpublish_src_type=1`）：顯示「由 某某 上架／下架」
   - 1.2 自動排程（`publish_src_type=99` 或 `unpublish_src_type=99`）：顯示「由系統自動上架／下架」

2. **連動操作規則**
   - 2.1 若手動按「立即上架」導致其他活動被系統自動下架，這個下架也會視為人為操作，記錄為「由 某某 下架」

3. **篩選條件**
   - 日期篩選僅需「日期」（無需小時分鐘），格式為 YYYYMMDD

#### 歷程資料欄位說明

| 欄位名稱 | 類型 | 說明 | 範例值 |
|---------|------|------|--------|
| `history_id` | Number | 歷程記錄 ID | 123 |
| `activity_id` | Number | 活動 ID | 456 |
| `activity_name` | String | 活動名稱 | "2024 春節入會禮" |
| `group_id` | Number | 會員卡群組 ID | 3 |
| `membership_id` | Number | 會員等級 ID | 4 |
| `rule_adjust_type` | Number | 等級變動類型，1: 加入(join)，2: 續約(extend)，3: 升等(upgrade)，4: 降等(downgrade)，5: 退出(leave) | 1 |
| `publish_time` | String | 上架時間（格式：YYYY-MM-DD HH:mm:ss） | "2024-01-20 00:00:00" |
| `unpublish_time` | String | 下架時間（格式：YYYY-MM-DD HH:mm:ss），尚未下架時為 null | "2024-02-20 00:00:00" |
| `publish_src_type` | Number | 上架來源，1: 人為操作，99: 系統執行 | 1 |
| `unpublish_src_type` | Number | 下架來源，1: 人為操作，99: 系統執行 | 99 |
| `publish_author` | Number | 上架操作者帳號 ID | 55 |
| `unpublish_author` | Number | 下架操作者帳號 ID，尚未下架時為 null | 55 |
| `publish_manager_name` | String | 手動上架的操作者名稱 | "管理員A" |
| `unpublish_manager_name` | String | 手動下架的操作者名稱，尚未下架時為 null | "管理員B" |

#### 歷程列表回應範例

```json
{
    "status": 200,
    "message": "讀取成功!",
    "description": "讀取成功!",
    "token_need_replace": 0,
    "meta": {
        "page": 1,
        "size": 50,
        "total_rows": 1,
        "total_pages": 1
    },
    "list": [
        {
            "group_id": 3,
            "membership_id": 4,
            "rule_adjust_type": 1,
            "history_id": 1,
            "activity_id": 545,
            "activity_name": "MING會員[3]MING粉卡[4]入會禮",
            "publish_manager_name": "Ming",
            "unpublish_manager_name": "Ming",
            "publish_author": 55,
            "publish_src_type": 1,
            "unpublish_author": 55,
            "unpublish_src_type": 99,
            "publish_time": "2025-12-02 23:16:19",
            "unpublish_time": "2025-12-02 23:16:27"
        }
    ]
}
```

### 5. API 回應格式範例

#### 列表回應

```json
{
  "list": [
    {
      "activity_id": 123,
      "activity_name": "2024 春節入會禮",
      "activity_schedule_start_time": "2024-01-20 00:00:00",
      "status": 1,
      "is_published": 1,
      "created_at": "2024-01-10 10:00:00",
      "updated_at": "2024-01-15 14:30:00",
      "created_by": "管理員A",
      "updated_by": "管理員B"
    }
  ]
}
```

#### 詳情回應

```json
{
  "info": {
    "activity_id": 123,
    "activity_name": "2024 春節入會禮",
    "activity_schedule_start_time": "2024-01-20 00:00:00",
    "gift_point": [],
    "gift_coupon": [],
    "gift_score": [],
    "rule_adjust_type": 1,
    "activity_is_repeatable": 0,
    "activity_is_phone_repeatable": 0,
    "send_mode": 2,
    "valid_days": null,
    "status": 1,
    "is_published": 1,
    "created_at": "2024-01-10 10:00:00",
    "updated_at": "2024-01-15 14:30:00",
    "created_by": "管理員A",
    "updated_by": "管理員B"
  }
}
```

---

## 前端實作注意事項

### 1. 表單提交資料處理

#### 1.1 `activity_is_repeatable` 和 `activity_is_phone_repeatable` 使用規則與預設值處理

**後端規格要求**：

| 活動類型 | `activity_is_repeatable` | `activity_is_phone_repeatable` | 說明 |
|---------|-------------------------|-------------------------------|------|
| 入會禮 (1) | **固定傳 0** | ✅ 使用並傳送 | 1=限領一次，0=可重複領 |
| 續等禮 (2) | ✅ 使用並傳送 | ❌ 不使用 | 1=可重複領，0=限領一次 |
| 升等禮 (3) | ✅ 使用並傳送 | ❌ 不使用 | 1=可重複領，0=限領一次 |
| 生日禮 (4) | **固定傳 0** | ✅ 使用並傳送 | 1=限領一次，0=可重複領 |

**問題描述**：當活動沒有設定任何禮物（點數、積分、優惠券）時，`activity_is_repeatable` 和 `activity_is_phone_repeatable` 欄位可能傳送 `null` 值，導致 API 錯誤。

**解決方案**：根據活動類型決定要傳送哪個欄位，並確保預設值為數字而非 `null`。

**實作程式碼**（`upgrade-gift-dialog.vue`）：

```javascript
// 在 submitConfig 方法中組裝 fromData
let fromData = {
  gift_point: this.giftPoint,
  gift_coupon: this.giftCoupon,
  rule_adjust_type: this.activityType,
  gift_score: this.giftScore,
  ...this.form,
}

// 升等禮/續等禮使用 activity_is_repeatable
if ([2, 3].includes(this.currentType)) {
  fromData.activity_is_repeatable = this.activityRepeatable || 0
} else {
  // 入會禮/生日禮時，activity_is_repeatable 固定為 0
  fromData.activity_is_repeatable = 0
}

// 入會禮/生日禮，是否同手機號碼限領一次
if ([1, 4].includes(this.currentType)) {
  fromData.activity_is_phone_repeatable = this.activityIsPhoneRepeatable
}
```

**初始化處理**（`configData` 方法）：

```javascript
const hasAnyGift =
  this.currentConfig?.gift_point?.length ||
  this.currentConfig?.gift_coupon?.length ||
  this.currentConfig?.gift_score?.length

this.activityRepeatable = hasAnyGift
  ? this?.currentConfig?.activity_is_repeatable
  : 0 // 若無值則需固定傳給後端 0
this.activityIsPhoneRepeatable = hasAnyGift
  ? this.currentConfig?.activity_is_phone_repeatable
  : 1 // 若無值則需固定傳給後端 1
```

**顯示邏輯修正**：

在活動列表和詳情頁中，`activity_is_phone_repeatable` 的顯示邏輯：

- `activity_is_phone_repeatable === 1`：顯示「**是**」（限領一次）
- `activity_is_phone_repeatable === 0`：顯示「否」（可重複領）

**修正檔案**：

| 檔案 | 修正內容 |
|------|---------|
| `upgrade-gift-dialog.vue` | 根據活動類型決定傳送欄位；入會禮/生日禮固定 `activity_is_repeatable=0` |
| `join-member-activity.vue` | 修正 `activityIsPhoneRepeatableStatusText` 顯示邏輯（1=是，0=否） |
| `activity-info.vue` | 根據活動類型動態顯示對應欄位（入會/生日禮顯示手機限領，升等/續等禮顯示重複領取） |

**注意事項**：

- 當沒有任何禮物設定時，這兩個欄位固定為預設值（`activity_is_repeatable=0`、`activity_is_phone_repeatable=1`）
- 當有禮物設定時，使用 API 回傳的值，若為 `null` 或 `undefined` 則使用預設值
- 避免使用 `|| 0`，因為當值為 `0` 時會被錯誤地覆蓋

#### 1.2 `activity_schedule_start_time` 秒數格式處理

**問題描述**：前端 DateSelect 元件輸出格式為 `YYYY-MM-DD HH:mm`（16 字元），但 API 要求格式為 `YYYY-MM-DD HH:mm:ss`（19 字元），秒數需固定為 `00`。

**解決方案**：在表單提交前，檢查並補齊秒數為 `:00`。

**實作程式碼**（`upgrade-gift-dialog.vue`）：

```javascript
// 在 handleSave 方法中，組裝 fromData 後
const timeValue = fromData.activity_schedule_start_time
if (timeValue) {
  if (timeValue.length === 16) {
    // 格式為 "YYYY-MM-DD HH:mm"，補上秒數
    fromData.activity_schedule_start_time = timeValue + ':00'
  } else if (timeValue.length === 19) {
    // 格式為 "YYYY-MM-DD HH:mm:ss"，確保秒數為 00
    fromData.activity_schedule_start_time = timeValue.substring(0, 17) + '00'
  }
}
```

**處理邏輯說明**：

- 若長度為 16 字元（`YYYY-MM-DD HH:mm`）：直接附加 `:00`
- 若長度為 19 字元（`YYYY-MM-DD HH:mm:ss`）：將秒數部分替換為 `00`
- 確保送出的時間格式一律為 `YYYY-MM-DD HH:mm:00`

#### 1.3 分頁總筆數欄位容錯

**問題描述**：部分列表 API 只回傳 `meta.total_rows`，造成分頁總筆數顯示不一致。

**解決方案**：分頁總筆數使用 `meta.total_rows` 優先。

**實作範例**：

```javascript
this.tablePageConfig.total =
  res.meta?.total_rows || res.meta?.total || 0
```

#### 1.4 API 回應業務成功/失敗處理及清除排程資料完整性

**問題描述**：Activity API 可能在 HTTP status 為 200 時，透過 `success` 字段傳遞業務層的失敗狀態。當 `success: 0` 時表示業務失敗（例如參數格式錯誤、操作條件不符），需要顯示對應的錯誤提示而不進行成功流程。具體案例包括：

1. **API 回應業務失敗** — 後端傳遞 `success: 0` 但 HTTP status 為 200
2. **清除排程時資料遺漏** — `useClearActivityScheduleStartTime()` 重建 coupon 時漏掉 `store_range_type`、`nidin_league_levels` 等必需欄位，導致業務失敗
3. **錯誤訊息被掩蓋** — 後端的 `message` 欄位包含誤導文字（如「呼叫成功!」），遮蔽了 `error_code_desc` 中的真實錯誤原因

**API 回應格式**：

```json
{
  "status": 200,
  "message": "更新成功!",
  "success": 1,
  "activity_id": 768,
  "error_code_desc": [],
  "invalid_param": []
}
```

**業務失敗範例（清除排程時的 coupon 欄位遺漏）**：

```json
{
  "status": 200,
  "message": "呼叫成功!",
  "success": 0,
  "error_code_desc": { "1404": "參數格式錯誤!" },
  "invalid_gift_coupon": {
    "2401": {
      "store_range_type": 1404,
      "nidin_league_levels": 1404,
      "store_range": 1404,
      "offline_store_range": 1404
    }
  },
  "invalid_param": { "gift_coupon": 1404 }
}
```

**成功判定規則**：

- 必須滿足：`Number(status) === 200` 且 (`success` 字段不存在 OR `Number(success) !== 0`)
- 若 `success` 字段存在但值為 0，則視為業務失敗

**錯誤消息提取優先級**：

1. **優先取 `error_code_desc`** —— 業務錯誤碼（支援 Array 或 Object 格式）
   - 原因：後端在 `success: 0` 時，`message` 欄位通常包含誤導文字
2. **其次取 `message`** —— API 通用消息欄位
3. **最後使用 fallback** —— 預設文案「操作失敗，請稍後再試」

**影響範圍**：

- 入會禮、續等禮、升等禮、生日禮的所有 API 操作（新增、編輯、上架、下架、清除排程等）
- 特別是 `useClearActivityScheduleStartTime()` 的清除排程流程

**實作位置**：

1. **對話框層級檢查** - `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`
   - 在 `submitConfig` 方法中檢查提交 API 回應的業務成功
   - 若業務失敗，顯示 SweetAlert2 錯誤彈窗並阻止成功流程

2. **服務層檢查** - `src/core/services/schedule-mixin.service.js`
   - 在 5 個異步函數中共 7 個 API 調用點應用防護檢查
   - 若業務失敗，拋出錯誤讓呼叫端的 try/catch 捕獲
   - 清除排程時保持 coupon 欄位完整性，並正確顯示業務失敗訊息

**核心助手函數** (`src/core/services/schedule-mixin.service.js`)：

```javascript
/**
 * 判定 API 回應是否業務成功
 * @param {Object} response - API 回應物件
 * @returns {boolean} 業務成功為真，失敗為假
 */
function isApiBusinessSuccess(response) {
  if (!response) return false
  const hasSuccessField = typeof response.success !== 'undefined'
  // 若 success 字段存在且值為 0，表示業務失敗
  if (hasSuccessField && Number(response.success) === 0) {
    return false
  }
  // HTTP 狀態必須為 200
  return Number(response.status) === 200
}

/**
 * 從 API 回應中解析錯誤消息
 * @param {Object} response - API 回應物件
 * @param {string} fallback - 無法解析時的預設文案
 * @returns {string} 錯誤消息
 */
function resolveApiErrorMessage(response, fallback = '操作失敗，請稍後再試') {
  if (!response) return fallback
  
  // 優先從 error_code_desc 提取（支援 Array 和 Object）
  // 原因：後端在 success: 0 時，message 欄位可能包含誤導文字（如「呼叫成功!」）
  const errorCodeDesc = response.error_code_desc
  if (Array.isArray(errorCodeDesc)) {
    const codeMessage = errorCodeDesc.find(Boolean)
    if (codeMessage) return codeMessage
  } else if (errorCodeDesc && typeof errorCodeDesc === 'object') {
    const codeMessage = Object.values(errorCodeDesc).find(Boolean)
    if (codeMessage) return codeMessage
  }
  
  // 退回使用 message 欄位
  if (response.message) return response.message
  
  return fallback
}
```

**服務函數應用範例（清除排程）** (`src/core/services/schedule-mixin.service.js`)：

```javascript
export async function useClearActivityScheduleStartTime({ levelId, activityId, activityType }) {
  // ... 確認彈窗
  try {
    const isBirthday = activityType === 4
    const infoMethod = isBirthday
      ? 'getBirthdayGiftScheduleInfo'
      : 'getLevelGiftScheduleInfo'
    const updateMethod = isBirthday
      ? 'updateBirthdayGiftSchedule'
      : 'updateLevelGiftSchedule'

    // 第 1 個 API 調用：取得活動資訊
    const activityInfo = await membership.removeALLParameters()
      [infoMethod](levelId, activityId)
    
    if (!isApiBusinessSuccess(activityInfo) || !activityInfo?.info) {
      throw new Error(resolveApiErrorMessage(activityInfo, '取得活動資訊失敗'))
    }

    const {
      gift_coupon,
      gift_point,
      gift_score,
      // ... 其他欄位
    } = activityInfo.info

    // 清除排程時保持 coupon 欄位完整性
    let processedGiftCoupon = []
    if (gift_coupon && gift_coupon.length) {
      // ✅ 以完整 clone 為基礎，保留所有欄位（含 store_range_type、nidin_league_levels 等）
      processedGiftCoupon = gift_coupon.map((coupon) => _.cloneDeep(coupon))

      if (isBirthday) {
        // 生日禮特定轉換：將 store_range / offline_store_range 包成陣列
        processedGiftCoupon = processedGiftCoupon.map((coupon) => {
          if (coupon.store_range && !Array.isArray(coupon.store_range)) {
            coupon.store_range = [coupon.store_range]
          }
          if (
            coupon.offline_store_range &&
            !Array.isArray(coupon.offline_store_range)
          ) {
            coupon.offline_store_range = [coupon.offline_store_range]
          }
          return coupon
        })
      }
    }

    const updateData = {
      activity_schedule_start_time: null,
      gift_coupon: processedGiftCoupon,
      gift_point: processedGiftPoint,
      gift_score: gift_score && gift_score.length ? _.cloneDeep(gift_score) : [],
      // ... 其他欄位
    }

    // 第 2 個 API 調用：更新排程時間
    const updateResponse = await membership
      .removeALLParameters()
      [updateMethod](levelId, activityId, updateData)
    
    if (!isApiBusinessSuccess(updateResponse)) {
      throw new Error(resolveApiErrorMessage(updateResponse, '清除失敗'))
    }
    
    // 成功流程
    await Swal.fire({
      title: '排程時間已清除',
      icon: 'success',
      confirmButtonText: '了解',
      customClass: { confirmButton: 'nd-btn nd-btn-primary' },
    })

    return true
  } catch(error) {
    // ✅ 顯示具體錯誤訊息（已由 resolveApiErrorMessage 正確解析）
    Swal.fire({
      title: '清除失敗',
      text: error.message || '請稍後再試',
      icon: 'error',
      confirmButtonText: '了解',
      customClass: { confirmButton: 'nd-btn nd-btn-primary' },
    })
    return false
  }
}
```

**對話框層級應用範例** (`src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`)：

```javascript
// 在 submitConfig 方法中
const data = await membership.removeALLParameters()[apiFn](...)

// 檢查業務成功
const hasSuccessField = typeof data?.success !== 'undefined'
const isBusinessSuccess =
  data &&
  Number(data.status) === 200 &&
  (!hasSuccessField || Number(data.success) !== 0)

if (!isBusinessSuccess) {
  // 解析錯誤消息（優先取業務錯誤碼）
  let errorMessage = data?.message || '操作失敗，請稍後再試'
  if (Array.isArray(data?.error_code_desc)) {
    errorMessage = data.error_code_desc.find(Boolean) || errorMessage
  } else if (data?.error_code_desc && typeof data.error_code_desc === 'object') {
    errorMessage = Object.values(data.error_code_desc).find(Boolean) || errorMessage
  }
  
  // 顯示錯誤彈窗
  Swal.fire({
    title: errorMessage,
    icon: 'error',
    confirmButtonText: '了解',
    customClass: { confirmButton: 'nd-btn nd-btn-primary' },
  })
  
  // 重置步驟並禁止成功流程
  this.currentStep = 1
  return
}

// 繼續成功流程...
```

**修正檔案異動清單**：

| 檔案 | 修改位置 | 內容 |
|------|---------|------|
| `upgrade-gift-dialog.vue` | `submitConfig` 方法 | 新增業務成功檢查；支援 Array/Object 格式的 error_code_desc 解析，優先取業務錯誤 |
| `schedule-mixin.service.js` | 檔案頂部 | 新增 `isApiBusinessSuccess()` 和 `resolveApiErrorMessage()` 助手函數 |
| `schedule-mixin.service.js` | `useClearActivityScheduleStartTime()` 函數 | 改用 `_.cloneDeep(coupon)` 保留完整 coupon 欄位；應用業務成功檢查；顯示具體錯誤訊息 |
| `schedule-mixin.service.js` | 其餘 4 個異步函數（共 6 個 API 調用點） | 應用業務成功檢查及錯誤訊息解析 |

**後續驗證**：

- ✅ 清除排程時 coupon 欄位完整 — `store_range_type`、`nidin_league_levels` 等不遺漏
- ✅ 清除排程成功 — 列表狀態隨即更新，不卡在清除前狀態
- ✅ API 業務失敗時 — 顯示 `error_code_desc` 中的真實錯誤，而非 "呼叫成功!"
- ✅ 生日禮排程清除 — `store_range` / `offline_store_range` 仍正確包成陣列
- ✅ 缺少 `success` 字段時 — 以 HTTP status 判定

| 檔案路徑 | 說明 |
|---------|------|
| `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue` | 活動新增/編輯彈窗，包含上述資料處理邏輯 |

### 2.1 彈窗尺寸動態調整

**實作位置**：`src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`

**功能說明**：活動設定彈窗根據步驟動態調整寬度，提供更好的使用者體驗。

**實作方式**：

```javascript
data() {
  return {
    currentStep: 1,
    modelWidth: '1080px',
    // ... 其他資料
  }
},
watch: {
  currentStep(val) {
    if (val === 1) {
      this.modelWidth = '1080px'  // 第一步：活動設定
    } else {
      this.modelWidth = '480px'   // 第二步：確認提醒
    }
  },
}
```

**彈窗尺寸規格**：

- 第一步（活動設定）：1080px - 容納活動名稱、上架時間、點數/積分/優惠券設定等複雜表單
- 第二步（確認提醒）：480px - 僅顯示提醒文案「按下「確認」後，活動將依排程時間上架，時間到後即自動生效。」

**使用方式**：

```vue
<nd-dialog
  :dialogTitle="activityModalTitle"
  :showDialog="showModal"
  :dialogWidth="modelWidth"
  @update:showDialog="$emit('closeModal')"
>
  <!-- 彈窗內容 -->
</nd-dialog>
```

### 3. 搜尋功能時間格式處理

#### 3.1 `ruleSearch` 方法中的時間格式轉換

**問題描述**：`rule-search.vue` 搜尋元件傳遞的欄位名稱（`name`、`startTime`、`endTime`）與 API 所需的欄位名稱（`activity_name`、`activity_schedule_start_time`）不一致，且時間格式需統一為 `YYYY-MM-DD HH:mm:00`。

**解決方案**：在各活動列表元件的 `ruleSearch` 方法中，進行欄位名稱映射與時間格式轉換。

**實作程式碼**（適用於 `join-member-activity.vue`、`birthday.vue`、`upgrade-activity.vue`、`continuation-activity.vue`）：

```javascript
/**
 * 格式化時間為 YYYY-MM-DD HH:mm:00 格式
 */
formatScheduleTime(timeValue) {
  if (!timeValue) return undefined
  // 如果是日期格式 (YYYY-MM-DD)，補上時間
  if (timeValue.length === 10) {
    return timeValue + ' 00:00:00'
  }
  // 如果是 YYYY-MM-DD HH:mm 格式，補上秒數
  if (timeValue.length === 16) {
    return timeValue + ':00'
  }
  // 如果是 YYYY-MM-DD HH:mm:ss 格式，確保秒數為 00
  if (timeValue.length === 19) {
    return timeValue.substring(0, 17) + '00'
  }
  return timeValue
},

ruleSearch(data) {
  // 映射搜尋欄位名稱
  this.form = {
    activity_name: data.name,
    activity_schedule_start_time: this.formatScheduleTime(data.startTime),
    activity_schedule_end_time: this.formatScheduleTime(data.endTime),
    sort: data.sort,
  }
  this.tablePageIndex = 1
  this.configData()
},
```

**處理邏輯說明**：

| 輸入格式 | 長度 | 輸出格式 |
|---------|------|---------|
| `YYYY-MM-DD` | 10 字元 | `YYYY-MM-DD 00:00:00` |
| `YYYY-MM-DD HH:mm` | 16 字元 | `YYYY-MM-DD HH:mm:00` |
| `YYYY-MM-DD HH:mm:ss` | 19 字元 | `YYYY-MM-DD HH:mm:00`（秒數固定為 00） |

**欄位映射關係**：

| `rule-search.vue` 欄位 | API 欄位 |
|----------------------|---------|
| `name` | `activity_name` |
| `startTime` | `activity_schedule_start_time` |
| `endTime` | `activity_schedule_end_time` |

**相關檔案**：

| 檔案路徑 | 說明 |
|---------|------|
| `src/views/member/system/activty/project/components/rule-search.vue` | 搜尋元件，傳遞 `name`、`startTime`、`endTime` |
| `src/views/member/system/activty/project/components/join-member-activity.vue` | 入會禮列表，包含 `formatScheduleTime` 和 `ruleSearch` 方法 |
| `src/views/member/system/activty/project/components/birthday.vue` | 生日禮列表，包含 `formatScheduleTime` 和 `ruleSearch` 方法 |
| `src/views/member/system/activty/project/components/upgrade-activity.vue` | 升等禮列表，包含 `formatScheduleTime` 和 `ruleSearch` 方法 |
| `src/views/member/system/activty/project/components/continuation-activity.vue` | 續等禮列表，包含 `formatScheduleTime` 和 `ruleSearch` 方法 |
| `src/views/member/system/activty/project/history/index.vue` | 上下架歷程頁，包含麵包屑更新邏輯 |

### 4. 上下架歷程頁面麵包屑與標題更新

**實作位置**：`src/views/member/system/activty/project/history/index.vue`

**功能說明**：上下架歷程頁面需要根據活動類型動態更新頁面標題和麵包屑。

**實作方式**：

```javascript
/**
 * 更新頁面標題和麵包屑
 */
updatePageTitle() {
  // 動態更新路由 meta 中的 title
  if (this.$route.meta) {
    this.$route.meta.title = `${this.giftTypeName}上下架歷程`
  }
  // 更新 document title
  document.title = `${this.giftTypeName}上下架歷程 - BDMS`
  
  // 更新 Vuex store 中的麵包屑標題
  this.$store.dispatch('breadcrumbsConfig/changeBreadcrumb', {
    title: `${this.giftTypeName}上下架歷程`,
    index: this.$store.getters['breadcrumbsConfig/breadcrumbs'].length - 1
  })
  
  // 設置自訂屬性到 body，讓其他組件可以讀取
  document.body.setAttribute('data-gift-type-name', this.giftTypeName)
  document.body.setAttribute('data-level-name', this.levelName || '')
  document.body.setAttribute('data-page-type', 'schedule-history')
  
  // 觸發自訂事件，讓監聽的組件可以即時更新
  window.dispatchEvent(new CustomEvent('page-info-updated', {
    detail: {
      giftTypeName: this.giftTypeName,
      levelName: this.levelName,
      pageType: 'schedule-history'
    }
  }))
}
```

**更新時機**：

- 頁面載入時（`mounted` 生命週期）
- 路由參數變化時（`watch` $route.query）

**清理機制**：

```javascript
beforeDestroy() {
  // 離開頁面時清除自訂屬性
  document.body.removeAttribute('data-gift-type-name')
  document.body.removeAttribute('data-level-name')
  document.body.removeAttribute('data-page-type')
}
```

**顯示效果**：

- 入會禮：「入會禮上下架歷程」（無副標題）
- 續等禮：「續等禮上下架歷程」（副標題：等級名稱）
- 升等禮：「升等禮上下架歷程」（副標題：等級名稱）
- 生日禮：「生日禮上下架歷程」（副標題：等級名稱）

### 5. 活動詳情開啟功能

**實作位置**：四個活動列表組件（`join-member-activity.vue`、`birthday.vue`、`upgrade-activity.vue`、`continuation-activity.vue`）

**功能說明**：點擊活動名稱時，開啟活動詳情抽屜（Drawer）。

**實作方式**：

**HTML 範本**：

```vue
<td>
  <span class="text-primary cursor-pointer" @click="openActivityInfo(item)">
    {{ item.activity_name }}
  </span>
  <span class="text-muted ml-2">({{ item.activity_id }})</span>
</td>
```

**JavaScript 方法**：

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

**使用組件**：

```vue
<activity-info
  :showActivityInfo="showActivityInfoDrawer"
  :activityId="activityInfoId"
  :levelId="currentId"
  :activityType="currentType"
  :usageChannelColorSet="usageChannelColorSet"
  @update:showActivityInfo="showActivityInfoDrawer = $event"
  @editActivity="handleEditFromInfo"
  @deleteActivity="handleDeleteFromInfo"
/>
```

**顯示效果**：

- 活動名稱顯示為藍色文字（`text-primary`）
- 滑鼠游標變為手指型（`cursor-pointer`）
- 活動 ID 以灰色文字顯示在活動名稱旁邊
- 點擊後開啟活動詳情抽屜，顯示完整活動資訊

### 6. 活動詳情抽屜組件

**實作位置**：`src/views/member/system/activty/project/components/activity-info.vue`

**功能說明**：以抽屜（Drawer）形式顯示活動詳細資訊，支援編輯、刪除操作。

**主要功能**：

- 顯示活動基本資訊（活動名稱、上架時間、狀態）
- 顯示操作者資訊（建立者/更新者）
- 顯示點數設定（依據會員卡點數類型）
- 顯示積分設定（僅生日禮顯示）
- 顯示優惠券設定（含使用期限、使用通路、適用門市品牌）
- 提供編輯、刪除按鈕（依據活動狀態動態顯示）

**組件 Props**：

| Prop 名稱 | 類型 | 必填 | 預設值 | 說明 |
|---------|------|------|-------|------|
| `showActivityInfo` | Boolean | 否 | `false` | 是否顯示活動詳情抽屜 |
| `activityId` | Number/String | 否 | `null` | 活動 ID |
| `levelId` | Number/String | 否 | `null` | 等級 ID |
| `activityType` | Number | 否 | `1` | 活動類型（1: 入會禮, 2: 續等禮, 3: 升等禮, 4: 生日禮） |
| `usageChannelColorSet` | Function | 否 | `() => ''` | 使用通路顏色設定函數 |

**組件 Events**：

| Event 名稱 | 參數 | 說明 |
|-----------|------|------|
| `update:showActivityInfo` | `Boolean` | 更新抽屜顯示狀態 |
| `editActivity` | `Object` | 觸發編輯活動（傳遞活動資訊物件） |
| `deleteActivity` | `Object` | 觸發刪除活動（傳遞活動資訊物件） |

**資料獲取邏輯**：

```javascript
async fetchActivityInfo() {
  if (!this.activityId || !this.levelId) return

  this.loading = true
  try {
    let actionName = 'membershipActivity/getLevelGiftScheduleInfo'
    if (this.activityType === 4) {
      actionName = 'membershipActivity/getBirthDayGiftScheduleInfo'
    }

    const response = await this.$store.dispatch(actionName, {
      levelId: this.levelId,
      activityId: this.activityId,
    })

    this.activityInfo = response || {}
    // 如果 API 回傳 store_name_map 和 brand_name_map，則使用它們
    if (response.store_name_map) {
      this.storeNameMap = response.store_name_map
    } else {
      this.storeNameMap = this.basicInfo.store_name_map || {}
    }
    if (response.brand_name_map) {
      this.brandNameMap = response.brand_name_map
    }
  } catch (error) {
    console.error('取得活動詳情失敗:', error)
    Swal.fire({
      title: '取得活動詳情失敗',
      text: error.message || '請稍後再試',
      icon: 'error',
      confirmButtonText: '確認',
      customClass: {
        confirmButton: 'nd-btn nd-btn-primary',
      },
    })
  } finally {
    this.loading = false
  }
}
```

**按鈕顯示邏輯**：

1. **編輯按鈕**：
   - 上架中活動（`status === 4`）：禁用（`disabled`）
   - 未上架/已下架活動：可用

2. **刪除按鈕**：
   - 僅未上架活動（`status === 3`）顯示
   - 已上架/已下架活動不顯示

**刪除確認邏輯**：

```javascript
deleteActivity() {
  if (!this.canDelete) {
    Swal.fire({
      title: '無法刪除',
      text: '進行中或已上架過的活動不可刪除',
      icon: 'warning',
      confirmButtonText: '確認',
      customClass: {
        confirmButton: 'nd-btn nd-btn-primary',
      },
    })
    return
  }
  this.$emit('deleteActivity', this.activityInfo)
  this.drawerClose()
}
```

**管理員資訊顯示**：

```javascript
computed: {
  managerInfo() {
    if (this.activityInfo.updated_by) {
      return `由 ${this.activityInfo.updated_by} 更新於 ${this.activityInfo.updated_at}`
    } else if (this.activityInfo.created_by) {
      return `由 ${this.activityInfo.created_by} 建立於 ${this.activityInfo.created_at}`
    }
    return ''
  }
}
```

**區塊顯示條件**：

| 區塊名稱 | 顯示條件 | 說明 |
|---------|---------|------|
| 點數區塊 | `basicInfo.membership_point_type === 2` | 僅會員卡有開啟點數功能時顯示 |
| 積分區塊 | `activityType === 4` | 僅生日禮顯示 |
| 優惠券區塊 | 總是顯示 | 所有活動類型都顯示 |

**Watch 監聽**：

```javascript
watch: {
  showActivityInfo: {
    immediate: true,
    handler(newVal) {
      this.drawer[0].open = newVal
      if (newVal && this.activityId) {
        this.fetchActivityInfo()
      }
    },
  },
  drawer: {
    deep: true,
    handler(newVal) {
      this.$store.commit('membershipActivity/SHOW_ACTIVITY_INFO', {
        show: newVal[0].open,
        activityId: this.activityId,
      })
      if (!newVal[0].open) {
        this.$emit('update:showActivityInfo', false)
      }
    },
  },
}
```

### 7. 從活動詳情抽屜觸發編輯與刪除

**實作位置**：四個活動列表組件（`join-member-activity.vue`、`birthday.vue`、`upgrade-activity.vue`、`continuation-activity.vue`）

**功能說明**：活動詳情抽屜中的編輯、刪除按鈕可觸發對應操作。

**事件處理方法**：

```javascript
/**
 * 從活動詳情抽屜中點擊編輯
 */
handleEditFromInfo(activityInfo) {
  this.editActivityId = activityInfo.activity_id
  this.upgradeGiftTitle = '編輯XXX活動' // XXX 為活動類型名稱
  this.showModal = true
}

/**
 * 從活動詳情抽屜中點擊刪除
 */
handleDeleteFromInfo(activityInfo) {
  this.deleteActivity(activityInfo)
}
```

**工作流程**：

1. 用戶在活動列表點擊活動名稱，開啟活動詳情抽屜
2. 在抽屜中點擊「編輯」按鈕
3. `activity-info.vue` 發送 `@editActivity` 事件
4. 列表組件接收事件，關閉抽屜並開啟編輯彈窗（`upgrade-gift-dialog.vue`）
5. 編輯彈窗載入活動資料並允許修改
6. 儲存後重新載入列表資料

### 8. 優惠券過期檢查功能

**實作位置**：四個活動列表組件（`join-member-activity.vue`、`birthday.vue`、`upgrade-activity.vue`、`continuation-activity.vue`）

**功能說明**：點擊「立即上架」時，檢查活動中的優惠券是否已過期，若已過期則提示重新設定。

**檢查邏輯**：

```javascript
/**
 * 檢查活動中的優惠券是否已過期
 */
hasCouponExpired(activityInfo) {
  if (!activityInfo?.gift_coupon?.length) {
    return false
  }

  const now = new Date()

  return activityInfo.gift_coupon.some((coupon) => {
    // 檢查優惠券的 time_config
    if (coupon.time_config) {
      const endDate = new Date(coupon.time_config.end_date)
      if (endDate < now) {
        return true // 優惠券已過期
      }
    }
    // 檢查優惠券本身的過期狀態
    if (coupon.is_expired === 1 || coupon.status === 'expired') {
      return true
    }
    return false
  })
}
```

**立即上架流程**：

```javascript
async launchActivity(item) {
  // 先檢查活動詳情，確認優惠券是否過期
  try {
    const activityInfo = await this.$store.dispatch(
      'membershipActivity/getLevelGiftScheduleInfo',
      {
        levelId: this.currentId,
        activityId: item.activity_id,
      }
    )

    // 檢查優惠券是否過期
    if (this.hasCouponExpired(activityInfo)) {
      const result = await Swal.fire({
        title: '優惠券已過期',
        text: '若想啟用此活動，贈送的優惠券需重新設定',
        icon: 'warning',
        confirmButtonText: '重新設定',
        cancelButtonText: '取消',
        showCancelButton: true,
        reverseButtons: true,
        customClass: {
          confirmButton: 'nd-btn nd-btn-primary',
          cancelButton: 'nd-btn nd-btn-default',
        },
      })

      if (result.isConfirmed) {
        // 開啟編輯彈窗讓使用者重新設定
        this.editActivity(item)
      }
      return // 中斷上架流程
    }
  } catch (error) {
    console.error('獲取活動詳情失敗:', error)
  }

  // 優惠券未過期，繼續上架流程
  const result = await Swal.fire({
    title: '若啟用此活動，上架將立即生效，是否繼續此操作？',
    icon: 'warning',
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    reverseButtons: true,
    showCancelButton: true,
    customClass: {
      confirmButton: 'nd-btn nd-btn-primary',
      cancelButton: 'nd-btn nd-btn-default',
    },
  })

  if (result.isConfirmed) {
    try {
      await this.$store.dispatch('membershipActivity/publishLevelGiftSchedule', {
        levelId: this.currentId,
        activityId: item.activity_id,
        rule_adjust_type: this.currentType,
      })
      
      Swal.fire({
        title: '上架成功',
        icon: 'success',
        confirmButtonText: '確認',
        customClass: {
          confirmButton: 'nd-btn nd-btn-primary',
        },
      })
      
      await this.configData() // 重新載入列表
    } catch (error) {
      Swal.fire({
        title: '上架失敗',
        text: error.message || '請稍後再試',
        icon: 'error',
        confirmButtonText: '確認',
        customClass: {
          confirmButton: 'nd-btn nd-btn-primary',
        },
      })
    }
  }
}
```

**過期檢查規則**：

1. 檢查 `coupon.time_config.end_date` 是否小於當前時間
2. 檢查 `coupon.is_expired === 1` 或 `coupon.status === 'expired'`
3. 任一條件成立即判定為已過期

**使用者體驗流程**：

1. 點擊「立即上架」
2. 系統自動檢查優惠券過期狀態
3. 若有過期優惠券：
   - 顯示提示彈窗「若想啟用此活動，贈送的優惠券需重新設定」
   - 提供「重新設定」與「取消」選項
   - 點擊「重新設定」自動開啟編輯彈窗
4. 若無過期優惠券：
   - 顯示確認彈窗「若啟用此活動，上架將立即生效，是否繼續此操作？」
   - 確認後執行上架操作

### 9. 生日禮等級分頁功能

**實作位置**：`src/views/member/system/activty/project/components/birthday.vue`

**功能說明**：生日禮頁面使用左側垂直分頁切換不同等級，每個等級有獨立的活動列表。

**組件結構**：

```vue
<template>
  <div class="mt-10">
    <div class="row">
      <div class="col-2">
        <nidin-vertical-tab :tabItems="levelTabItems" @changeTab="changeTab" />
      </div>
      <div class="col-10">
        <div class="nd-pl-3">
          <!-- 活動列表內容 -->
        </div>
      </div>
    </div>
  </div>
</template>
```

**Tab 切換邏輯**：

```javascript
data() {
  return {
    currentId: 0, // 當前選中的等級 ID
    list: [],
    pageConfig: {
      page: 1,
      size: 10,
      total: 0,
    },
  }
},
computed: {
  ...mapGetters({
    levelTabItems: 'membership/levelTabItems', // 從 Vuex 獲取等級列表
  }),
},
async mounted() {
  const data = await this.$store.dispatch(
    'membership/getMembershipInfo',
    this.$route.params.cardId,
  )
  this.currentId = data.level[0].id // 預設選中第一個等級
  this.configData()
},
methods: {
  /**
   * 切換等級 Tab
   */
  changeTab(value) {
    this.currentId = value
    this.pageConfig.page = 1 // 重置頁碼
    this.configData()
  },
  /**
   * 取得列表資料
   */
  async configData() {
    if (!this.currentId) return
    const query = {
      page: this.pageConfig.page,
      size: this.pageConfig.size,
      currentId: this.currentId,
      status: this.tabStatus || 0,
      activity_name: this.form.activity_name,
      activity_schedule_start_time: this.form.activity_schedule_start_time,
      activity_schedule_end_time: this.form.activity_schedule_end_time,
    }
    const result = await this.$store.dispatch(
      'membershipActivity/getBirthDayGiftSchedule',
      query,
    )

    // 從 API 回傳的 meta 取得分頁資訊
    if (result?.meta) {
      this.pageConfig.total = result.meta.total_rows || 0
    }

    // 後端已處理排序，前端無需排序
    this.list = result?.list || []
  },
}
```

**與其他活動類型的差異**：

| 項目 | 生日禮 (birthday.vue) | 入會禮/續等禮/升等禮 |
|-----|---------------------|-------------------|
| 左側分頁 | ✅ 使用垂直分頁 | ❌ 無（入會禮）<br>✅ 有（續等禮、升等禮） |
| API 路徑 | `/birthdayGiftSchedule/*` | `/levelGiftSchedule/*` |
| `currentType` | `4` | `1`(入會) / `2`(續等) / `3`(升等) |
| 分頁參數 | `currentId` | `currentId`（續等/升等）<br>無（入會） |

### 10. 上下架歷程頁面實作

**實作位置**：`src/views/member/system/activty/project/history/index.vue`

**功能說明**：顯示活動的上下架歷史記錄，支援搜尋與分頁。

**頁面結構**：

```vue
<template>
  <div class="card">
    <!-- 編輯活動彈窗 -->
    <upgradeGiftDialog />
    
    <!-- 活動詳情抽屜 -->
    <nd-activity-info />
    
    <div class="card-header">
      <div>
        <div class="card-label">上下架歷程</div>
        <div v-if="showSubtitle">{{ giftTypeName }} - {{ levelName }}</div>
      </div>
      <div class="card-toolbar">
        <button @click="$router.go(-1)">返回</button>
      </div>
    </div>
    
    <div class="card-body">
      <!-- 搜尋條件 -->
      <nd-history-search @ruleSearch="ruleSearch" />
      
      <!-- 歷程列表 -->
      <nd-data-table>
        <template v-slot:theadContent>
          <!-- 表頭：序號、活動ID、活動名稱、上架時間、上架操作者、下架時間、下架操作者 -->
        </template>
        <template v-slot:tbody>
          <!-- 列表內容 -->
        </template>
      </nd-data-table>
    </div>
  </div>
</template>
```

**Data 屬性**：

| 屬性名稱 | 類型 | 預設值 | 說明 |
|---------|------|-------|------|
| `showActivityInfo` | Boolean | `false` | 是否顯示活動詳情抽屜 |
| `showModal` | Boolean | `false` | 是否顯示編輯彈窗 |
| `selectedActivityId` | Number/String | `null` | 選中的活動 ID |
| `editActivityId` | Number/String | `null` | 編輯中的活動 ID |
| `levelId` | Number/String | `null` | 等級 ID |
| `list` | Array | `[]` | 歷程列表 |
| `searchParams` | Object | `{}` | 搜尋參數（活動名稱、上架/下架時間） |
| `pageConfig` | Object | `{page: 1, size: 10, total: 0}` | 分頁配置 |
| `activityType` | Number | `1` | 活動類型（1=入會禮, 2=續等禮, 3=升等禮, 4=生日禮） |
| `scheduleType` | String | `'levelGiftSchedule'` | 排程類型 |
| `levelName` | String | `''` | 等級名稱 |
| `giftTypeName` | String | `''` | 禮遇類型名稱 |

**Computed 屬性**：

```javascript
computed: {
  /**
   * 是否顯示副標題
   * 入會禮不顯示，其他禮遇類型顯示等級名稱
   */
  showSubtitle() {
    return this.activityType !== 1
  },
  
  /**
   * 彈窗標題
   */
  modalTitle() {
    return this.editActivityId
      ? `編輯${this.giftTypeName}排程`
      : `新增${this.giftTypeName}排程`
  },
}
```

**主要方法**：

1. **parseRouteParams()** - 解析路由參數

```javascript
parseRouteParams() {
  const query = this.$route.query
  this.activityType = Number(query.activityType) || 1
  this.levelId = query.levelId || this.$route.params.levelId

  // 根據活動類型設定排程類型和禮遇名稱
  switch (this.activityType) {
    case 1:
      this.scheduleType = 'levelGiftSchedule'
      this.giftTypeName = '入會禮'
      break
    case 2:
      this.scheduleType = 'levelGiftSchedule'
      this.giftTypeName = '續等禮'
      break
    case 3:
      this.scheduleType = 'levelGiftSchedule'
      this.giftTypeName = '升等禮'
      break
    case 4:
      this.scheduleType = 'birthdayGiftSchedule'
      this.giftTypeName = '生日禮'
      break
  }
}
```

1. **updatePageTitle()** - 更新頁面標題和麵包屑

```javascript
updatePageTitle() {
  // 動態更新路由 meta 中的 title
  if (this.$route.meta) {
    this.$route.meta.title = `${this.giftTypeName}上下架歷程`
  }
  
  // 更新 document title
  document.title = `${this.giftTypeName}上下架歷程 - BDMS`
  
  // 更新 Vuex store 中的麵包屑標題
  this.$store.dispatch('breadcrumbsConfig/changeBreadcrumb', {
    title: `${this.giftTypeName}上下架歷程`,
    index: this.$store.getters['breadcrumbsConfig/breadcrumbs'].length - 1,
  })
  
  // 設置自訂屬性到 body，讓其他組件可以讀取
  document.body.setAttribute('data-gift-type-name', this.giftTypeName)
  document.body.setAttribute('data-level-name', this.levelName || '')
  document.body.setAttribute('data-page-type', 'schedule-history')
  
  // 觸發自訂事件，讓監聽的組件可以即時更新
  window.dispatchEvent(new CustomEvent('page-info-updated', {
    detail: {
      giftTypeName: this.giftTypeName,
      levelName: this.levelName,
      pageType: 'schedule-history',
    },
  }))
}
```

1. **fetchMembershipInfo()** - 取得會員卡資訊

```javascript
async fetchMembershipInfo() {
  try {
    const data = await this.$store.dispatch(
      'membership/getMembershipInfo',
      this.$route.params.cardId,
    )
    
    // 設定 levelId（如果沒有從路由取得）
    if (!this.levelId && data.level && data.level.length > 0) {
      this.levelId = data.level[0].id
    }
    
    // 設定等級名稱
    if (data.level && this.levelId) {
      const level = data.level.find((l) => l.id === Number(this.levelId))
      this.levelName = level ? level.name : ''
    }
  } catch (error) {
    console.error('取得會員卡資訊失敗:', error)
  }
}
```

1. **fetchHistoryList()** - 取得歷程列表

```javascript
async fetchHistoryList() {
  if (!this.levelId) return

  try {
    const params = {
      page: this.pageConfig.page,
      size: this.pageConfig.size,
      rule_adjust_type: this.activityType,
      ...this.searchParams,
    }

    const data = await this.$store.dispatch(
      'membershipActivity/getScheduleHistory',
      {
        membership_id: this.$route.params.cardId,
        level_id: this.levelId,
        schedule_type: this.scheduleType,
        ...params,
      }
    )

    this.list = data.list || []
    this.pageConfig.total = data.meta?.total_rows || 0
  } catch (error) {
    console.error('取得歷程列表失敗:', error)
    this.list = []
  }
}
```

1. **getPublishOperator(item)** - 取得上架操作者文字

```javascript
getPublishOperator(item) {
  if (item.publish_src_type === 99) {
    return '由系統自動上架'
  }
  if (item.publish_manager_name) {
    return `由 ${item.publish_manager_name} 上架`
  }
  return ''
}
```

1. **getUnpublishOperator(item)** - 取得下架操作者文字

```javascript
getUnpublishOperator(item) {
  if (item.unpublish_src_type === 99) {
    return '由系統自動下架'
  }
  if (item.unpublish_manager_name) {
    return `由 ${item.unpublish_manager_name} 下架`
  }
  return ''
}
```

1. **deleteActivity(activityInfo)** - 刪除活動

```javascript
deleteActivity(activityInfo) {
  // 檢查是否可刪除
  if (activityInfo.status !== 3 || activityInfo.is_published === 1) {
    Swal.fire({
      title: '無法刪除',
      text: '進行中或已上架過的活動不可刪除',
      icon: 'warning',
      confirmButtonText: '確認',
      customClass: {
        confirmButton: 'nd-btn nd-btn-primary',
      },
    })
    return
  }

  // 根據活動類型設定刪除的內容類型
  let currentContent = 'join-member-activity'
  switch (this.activityType) {
    case 1:
      currentContent = 'join-member-activity'
      break
    case 2:
      currentContent = 'continuation-activity'
      break
    case 3:
      currentContent = 'upgrade-activity'
      break
    case 4:
      currentContent = 'birthday'
      break
  }

  this.$store.commit('membershipActivity/SHOW_DELETE_MODEL', {
    show: true,
    id: activityInfo.activity_id,
    levelId: this.levelId,
    currentConpontent: currentContent,
  })
}
```

**生命週期鉤子**：

```javascript
async mounted() {
  // 從路由參數取得相關資訊
  this.parseRouteParams()
  // 取得會員卡資訊
  await this.fetchMembershipInfo()
  // 更新頁面標題和麵包屑
  this.updatePageTitle()
  // 取得歷程列表
  await this.fetchHistoryList()
},

beforeDestroy() {
  // 離開頁面時清除自訂屬性
  document.body.removeAttribute('data-gift-type-name')
  document.body.removeAttribute('data-level-name')
  document.body.removeAttribute('data-page-type')
}
```

**Watch 監聽**：

```javascript
watch: {
  '$route.query': {
    handler() {
      this.parseRouteParams()
      this.updatePageTitle()
      this.fetchHistoryList()
    },
    deep: true,
  },
  
  showModal(val) {
    if (val === false) {
      this.editActivityId = null
    }
  },
}
```

**搜尋功能**：

使用 `history-search.vue` 子組件提供以下搜尋條件：

- 活動名稱（模糊搜尋）
- 上架時間範圍（起始日期、結束日期）
- 下架時間範圍（起始日期、結束日期）

**表格欄位**：

| 欄位名稱 | 說明 | 資料來源 |
|---------|------|---------|
| 序號 | 列表序號 | `getRowNumber(index)` |
| 活動 ID | 活動識別碼 | `item.activity_id` |
| 活動名稱 | 可點擊開啟詳情 | `item.activity_name` |
| 上架時間 | YYYY/MM/DD HH:mm 格式 | `formatDateTime(item.publish_time)` |
| 上架操作者 | 人為/系統自動 | `getPublishOperator(item)` |
| 下架時間 | YYYY/MM/DD HH:mm 格式 | `formatDateTime(item.unpublish_time)` |
| 下架操作者 | 人為/系統自動 | `getUnpublishOperator(item)` |

### 11. 活動詳情抽屜按鈕顯示邏輯

**實作位置**：`src/views/member/system/activty/project/components/activity-info.vue`

**功能說明**：活動詳情抽屜的編輯和刪除按鈕顯示邏輯，區分一般活動頁面和上下架歷程頁面。

**Props 新增**：

| Prop 名稱 | 類型 | 必填 | 預設值 | 說明 |
|---------|------|------|-------|------|
| `hideActions` | Boolean | 否 | `false` | 是否隱藏操作按鈕（編輯、刪除）<br>在上下架歷程頁面時設為 `true` |

**顯示規則**：

1. **一般活動頁面**（`hideActions = false`）：
   - 編輯按鈕：顯示，但「上架中」（status=4）的活動為禁用狀態
   - 刪除按鈕：僅「未上架」（status=3）的活動顯示

2. **上下架歷程頁面**（`hideActions = true`）：
   - 編輯按鈕：不顯示
   - 刪除按鈕：不顯示

**實作程式碼**：

```vue
<template>
  <div class="nd-py-6 flex d-flex justify-content-between">
    <div class="nd-font-weight-bold nd-font-size-h6">
      {{ activityInfo.activity_name || '活動詳情' }}
    </div>
    <div v-if="!hideActions">
      <button
        class="nd-btn nd-btn-default nd-btn-md mr-4"
        v-if="activityInfo.status !== 4"
        :disabled="activityInfo.status === 4"
        @click="editActivity"
      >
        編輯
      </button>
      <button
        v-if="canDelete"
        class="nd-btn nd-btn-outline-danger nd-btn-md mr-4"
        @click="deleteActivity"
      >
        刪除
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // ... 其他 props
    /**
     * 是否隱藏操作按鈕（編輯、刪除）
     * 在歷程頁面時設為 true
     */
    hideActions: {
      type: Boolean,
      default: false,
    },
  },
  // ... 其他程式碼
}
</script>
```

**使用方式**：

**1. 一般活動頁面**（入會禮/續等禮/升等禮/生日禮）：

```vue
<activity-info
  :showActivityInfo="showActivityInfoDrawer"
  :activityId="activityInfoId"
  :levelId="currentId"
  :activityType="currentType"
  :usageChannelColorSet="usageChannelColorSet"
  @update:showActivityInfo="showActivityInfoDrawer = $event"
  @editActivity="handleEditFromInfo"
  @deleteActivity="handleDeleteFromInfo"
/>
```

**2. 上下架歷程頁面**：

```vue
<nd-activity-info
  :showActivityInfo.sync="showActivityInfo"
  :activityId="selectedActivityId"
  :levelId="levelId"
  :activityType="activityType"
  :hideActions="true"
  @editActivity="handleEditFromInfo"
  @deleteActivity="handleDeleteFromInfo"
/>
```

**效果說明**：

| 頁面類型 | hideActions | 編輯按鈕 | 刪除按鈕 |
|---------|------------|---------|---------|
| 活動列表頁 | `false`（預設） | ✅ 顯示<br>上架中禁用 | ✅ 顯示<br>僅未上架可見 |
| 上下架歷程頁 | `true` | ❌ 不顯示 | ❌ 不顯示 |

**設計原因**：

- 上下架歷程頁面主要用於查看歷史記錄，不應提供編輯和刪除功能
- 避免使用者在歷程頁面誤操作當前活動
- 保持歷程頁面的只讀性質，確保資料完整性

### 12. 操作者顯示字體大小調整

**實作位置**：

- `src/views/member/system/activty/project/components/join-member-activity.vue`
- `src/views/member/system/activty/project/components/continuation-activity.vue`
- `src/views/member/system/activty/project/components/upgrade-activity.vue`
- `src/views/member/system/activty/project/components/birthday.vue`

**功能說明**：將活動列表中「由 XXX 建立/上架」的操作者資訊字體大小統一設定為 12px。

**實作方式**：

```vue
<template>
  <td>
    <p class="mb-0">{{ item.activity_schedule_start_time }}</p>
    <p
      v-if="getManagerName(item)"
      class="text-muted mb-0 nd-font-size-caption"
    >
      {{ getManagerName(item) }}
    </p>
  </td>
</template>
```

**樣式規格**：

- 字體大小：12px（透過 nd-font-size-caption 樣式類別設定）
- 顏色：灰色（text-muted）
- 邊距：底部無邊距（mb-0）

**顯示內容**：

- 未上架（status=3）：「由 XXX 建立」
- 上架中（status=4）：「由 XXX 上架」
- 已下架（status=5）：「由 XXX 建立」

**統一性**：
所有四個活動頁面（入會禮、續等禮、升等禮、生日禮）的操作者資訊都使用相同的字體大小和樣式，確保介面一致性。

### 13. 表格樣式調整

**實作位置**：

- `src/views/member/system/activty/project/components/join-member-activity.vue`
- `src/views/member/system/activty/project/components/continuation-activity.vue`
- `src/views/member/system/activty/project/components/upgrade-activity.vue`
- `src/views/member/system/activty/project/components/birthday.vue`
- `src/views/member/system/activty/project/history/index.vue`

**功能說明**：移除 nd-data-table 的 td 元素的 border-top 樣式，改用 Bootstrap 的 table-borderless 類別。

**實作方式**：

```vue
<template>
  <nd-data-table>
    <template v-slot:tbody>
      <tr class="table-borderless">
        <!-- 表格內容 -->
      </tr>
    </template>
  </nd-data-table>
</template>
```

**移除內容**：

- 移除原有的 `::v-deep .nd-data-table td { border-top: none }` CSS 規則
- 在 `<tr>` 元素上直接使用 Bootstrap 的 `table-borderless` 類別

**效果**：

- 表格內容更清爽，無分隔線干擾視覺
- 符合專案其他 nd-data-table 的統一樣式規範

### 14. 清除排程時間功能

**實作位置**：

- `src/views/member/system/activty/project/components/join-member-activity.vue`（入會禮）
- `src/views/member/system/activty/project/components/continuation-activity.vue`（續等禮）
- `src/views/member/system/activty/project/components/upgrade-activity.vue`（升等禮）
- `src/views/member/system/activty/project/components/birthday.vue`（生日禮）

**功能說明**：列表頁面操作選單中新增「清除排程時間」功能，允許將已設定的排程時間移除。

**實作方式**：

1. **UI 調整**：
   - 在操作選單（v-menu）中添加「清除排程時間」選項
   - 位置：編輯選項之後
   - 顯示條件：活動狀態不為「上架中」（status !== 4）

```vue
<v-menu offset-y v-if="item.status !== 4">
  <template v-slot:activator="{ on, attrs }">
    <button class="nd-btn nd-btn-icon nd-icon-primary" v-bind="attrs" v-on="on">
      <i class="flaticon-more-1"></i>
    </button>
  </template>
  <v-list>
    <v-list-item @click="editActivity(item)" link>
      <v-list-item-title>編輯</v-list-item-title>
    </v-list-item>
    <v-list-item @click="clearScheduleTime(item)" link>
      <v-list-item-title>清除排程時間</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>
```

1. **功能實作**（`clearScheduleTime()` 方法）：

```javascript
/**
 * 清除排程時間
 * 將 activity_schedule_start_time 設為 null
 */
async clearScheduleTime(item) {
  const result = await Swal.fire({
    title: '確定要清除排程時間嗎？',
    text: '清除後，活動將不會自動上架',
    icon: 'warning',
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    reverseButtons: true,
    showCancelButton: true,
    customClass: {
      confirmButton: 'nd-btn nd-btn-primary',
      cancelButton: 'nd-btn nd-btn-default',
    },
  })

  if (result.isConfirmed) {
    try {
      // 先獲取活動詳情
      const activityInfo = await this.$store.dispatch(
        'membershipActivity/getLevelGiftScheduleInfo', // 或 getBirthDayGiftScheduleInfo
        {
          levelId: this.currentId,
          activityId: item.activity_id,
        },
      )

      // 準備更新資料，將排程時間設為 null
      const updateData = {
        activity_name: activityInfo.activity_name,
        activity_schedule_start_time: null,
        send_mode: activityInfo.send_mode,
        valid_days: activityInfo.valid_days,
        gift_point: activityInfo.gift_point || [],
        gift_coupon: activityInfo.gift_coupon || [],
        gift_score: activityInfo.gift_score || [],
        rule_adjust_type: this.currentType,
        activity_is_repeatable: activityInfo.activity_is_repeatable || 0,
        activity_is_phone_repeatable: activityInfo.activity_is_phone_repeatable,
      }

      // 呼叫更新 API（直接使用 membership API）
      await membership
        .removeALLParameters()
        .updateLevelGiftSchedule( // 或 updateBirthdayGiftSchedule
          this.currentId,
          item.activity_id,
          updateData,
        )

      // 先刷新列表
      await this.configData()

      // 顯示成功訊息
      await Swal.fire({
        title: '排程時間已清除',
        icon: 'success',
        confirmButtonText: '了解',
        customClass: {
          confirmButton: 'nd-btn nd-btn-primary',
        },
      })
    } catch (error) {
      Swal.fire({
        title: '清除失敗',
        text: error.message || '請稍後再試',
        icon: 'error',
        confirmButtonText: '了解',
        customClass: {
          confirmButton: 'nd-btn nd-btn-primary',
        },
      })
    }
  }
}
```

**API 呼叫流程**：

1. 先呼叫 `getLevelGiftScheduleInfo` 或 `getBirthDayGiftScheduleInfo` 取得完整活動資料
2. 將 `activity_schedule_start_time` 設為 `null`
3. 直接呼叫 `membership.removeALLParameters().updateLevelGiftSchedule()` 或 `updateBirthdayGiftSchedule()` 送出完整資料
4. 更新成功後刷新列表

**API 對應關係**：

| 活動類型 | 詳情 API | 更新 API |
|---------|---------|---------|
| 入會禮/續等禮/升等禮 | `getLevelGiftScheduleInfo` | `updateLevelGiftSchedule` |
| 生日禮 | `getBirthDayGiftScheduleInfo` | `updateBirthdayGiftSchedule` |

**使用情境**：

- **情境 1**：活動已設定排程時間但不想自動上架
  - 用戶在列表點擊操作選單的「清除排程時間」
  - 系統將該活動的排程時間設為 null
  - 活動狀態變更為「未上架」，上架時間欄位顯示「-」
  - 後續需手動點擊「立即上架」才能上架

- **情境 2**：錯誤設定的排程時間需要重新設定
  - 清除原有排程時間
  - 編輯活動重新設定正確的排程時間

**注意事項**：

- 清除排程時間不會影響活動的其他設定（活動名稱、禮物配置等）
- 清除後的活動需要手動點擊「立即上架」才能上架
- 上架中的活動（status=4）無法清除排程時間（操作選單不顯示）

**重要實作細節（2026-01-30 更新）**：

為確保「清除上架時間」功能正確保留活動資料（點數/積分/優惠券），實作時需注意以下關鍵點：

1. **API 資料結構處理**：

   ```javascript
   // ❌ 錯誤：直接從回應物件取值
   const activityInfo = await membership.levelGiftScheduleInfo(levelId, activityId)
   const { gift_point, gift_coupon } = activityInfo
   
   // ✅ 正確：從 info 屬性中取得資料
   const activityInfo = await membership.levelGiftScheduleInfo(levelId, activityId)
   const { gift_point, gift_coupon } = activityInfo.info
   ```

   Info API 回傳結構：`{ status, message, info: { activity_name, gift_point, ... } }`

2. **gift_coupon 欄位處理**：
   - 必須移除 Info API 回傳的唯讀欄位：`name`、`coupon_set_code`、`manual_usage_config`

- 必須進行深度複製（使用 lodash `cloneDeep`）以避免嵌套物件引用問題
- 生日禮需將 `store_range` 和 `offline_store_range` 包成陣列格式

1. **gift_point 時間格式化**：
   - 若 `time_config.expire_time` 存在，需格式化為 `YYYY-MM-DD 23:59:59`

2. **實作範例（從 schedule-mixin.js）**：

   ```javascript
   // 取得活動資料
   const activityInfo = await membership.removeALLParameters()[infoMethod](levelId, activityId)
   const info = activityInfo.info // 關鍵：從 info 屬性取得
   
   // 處理 gift_coupon
   let processedGiftCoupon = []
   if (info.gift_coupon?.length) {
     processedGiftCoupon = info.gift_coupon.map((coupon) => {
       const cleaned = {
         coupon_set_id: coupon.coupon_set_id,
         amount_unit: coupon.amount_unit,
         time_config: _.cloneDeep(coupon.time_config || {}),
         store_range: _.cloneDeep(coupon.store_range || {}),
       }
       // 保留可選欄位
       if (coupon.is_transferable !== undefined) cleaned.is_transferable = coupon.is_transferable
       if (coupon.coupon_range_code) cleaned.coupon_range_code = coupon.coupon_range_code
       if (coupon.offline_store_range) {
         cleaned.offline_store_range = _.cloneDeep(coupon.offline_store_range)
       }
       return cleaned
     })
     
     // 生日禮特殊處理
     if (activityType === 4) {
       processedGiftCoupon = processedGiftCoupon.map(coupon => {
         if (!Array.isArray(coupon.store_range)) coupon.store_range = [coupon.store_range]
         if (coupon.offline_store_range && !Array.isArray(coupon.offline_store_range)) {
           coupon.offline_store_range = [coupon.offline_store_range]
         }
         return coupon
       })
     }
   }
   
   // 處理 gift_point
   let processedGiftPoint = []
   if (info.gift_point?.length) {
     processedGiftPoint = info.gift_point.map(point => {
      const processed = _.cloneDeep(point)
       if (processed.time_config?.expire_time) {
         const match = processed.time_config.expire_time.match(/^(\d{4}-\d{2}-\d{2})/)
         if (match) processed.time_config.expire_time = match[1] + ' 23:59:59'
       }
       return processed
     })
   }
   
   // 送出更新
   const updateData = {
     activity_name: info.activity_name,
     activity_schedule_start_time: null, // 清除排程時間
     send_mode: info.send_mode,
     valid_days: info.valid_days,
     gift_point: processedGiftPoint,
     gift_coupon: processedGiftCoupon,
    gift_score: info.gift_score?.length ? _.cloneDeep(info.gift_score) : [],
     rule_adjust_type: activityType,
     activity_is_repeatable: [2, 3].includes(activityType) ? info.activity_is_repeatable : 0,
     activity_is_phone_repeatable: info.activity_is_phone_repeatable,
   }
   ```

3. **測試檢查點**：
   - ✅ 活動名稱保持不變
   - ✅ 點數/積分/優惠券配置完整保留
   - ✅ 活動狀態變更為「未上架」
   - ✅ 上架時間欄位顯示「-」
   - ✅ 可以重新編輯活動設定新的排程時間

**Vuex Store 更新**：

為了支援清除排程時間功能，需在 `src/store/membership-activity.module.js` 中新增兩個 action：

```javascript
/**
 * 更新等級禮排程活動
 */
async updateLevelGiftSchedule(context, { levelId, activityId, data }) {
  try {
    const result = await membership
      .removeALLParameters()
      .updateLevelGiftSchedule(levelId, activityId, data)
    return result
  } catch (err) {
    console.error(err)
    throw err
  }
},

/**
 * 更新生日禮排程活動
 */
async updateBirthdayGiftSchedule(context, { levelId, activityId, data }) {
  try {
    const result = await membership
      .removeALLParameters()
      .updateBirthdayGiftSchedule(levelId, activityId, data)
    return result
  } catch (err) {
    console.error(err)
    throw err
  }
},
```

### 15. 實作日期

- **2025-12-16**：完成活動排程功能實作
  - 完成入會禮/續等禮/升等禮/生日禮排程列表頁面
  - 完成活動新增/編輯彈窗（支援活動名稱、上架時間設定）
  - 完成立即上架/下架功能
  - 完成活動詳情抽屜組件
  - 完成優惠券過期檢查機制
  - 完成列表排序邏輯（上架中優先 > 修改時間倒序）
  - 完成表單資料處理（`activity_is_repeatable`、`activity_schedule_start_time` 格式處理）
  - 完成搜尋功能時間格式轉換
  - 完成上下架歷程頁面完整實作（包含麵包屑動態更新、搜尋、分頁、操作者顯示等功能）
  - 完成生日禮刪除規則調整（需檢查 `is_published` 狀態）
  - 完成活動詳情抽屜按鈕顯示邏輯（歷程頁面隱藏編輯/刪除按鈕）
  - 完成操作者顯示字體大小統一調整為 12px
- **2025-12-18**：修正活動欄位使用規則
  - 修正 `activity_is_repeatable` 和 `activity_is_phone_repeatable` 使用邏輯
    - 入會禮：`activity_is_repeatable` 固定為 0，使用 `activity_is_phone_repeatable`
    - 續等禮：使用 `activity_is_repeatable`，不使用 `activity_is_phone_repeatable`
    - 升等禮：使用 `activity_is_repeatable`，不使用 `activity_is_phone_repeatable`
    - 生日禮：`activity_is_repeatable` 固定為 0，使用 `activity_is_phone_repeatable`
  - 修正 `activity_is_phone_repeatable` 顯示邏輯（1=限領一次，0=可重複領）
  - 更新 `upgrade-gift-dialog.vue` 根據活動類型決定傳送欄位
  - 更新 `activity-info.vue` 根據活動類型動態顯示對應欄位
  - 更新 `join-member-activity.vue` 修正顯示文字邏輯
  - 更新規格文件 `member-card.spec.md` 記錄欄位使用規則
- **2025-12-17**：完成會員卡詳細資訊頁 API 串接
  - 完成入會禮（`join-member-activity.vue`）API 串接
    - 新增 `activityInfo` 資料物件（`activity_name`、`activity_schedule_start_time`）
    - 新增 `fetchActivityInfo()` 方法，呼叫 `membershipActivity/getLevelGiftSchedule` 並帶入 `rule_adjust_type: 1`、`status: 4`
    - 在 `mounted()` 生命週期自動載入上架中活動資訊
    - 在 `changeTab()` 切換等級時重新載入活動資訊
  - 完成續等禮（`continuation-activity.vue`）API 串接
    - 新增 `activityInfo` 資料物件（`activity_name`、`activity_schedule_start_time`）
    - 新增 `fetchActivityInfo()` 方法，呼叫 `membershipActivity/getLevelGiftSchedule` 並帶入 `rule_adjust_type: 2`、`status: 4`
    - 在 `mounted()` 生命週期自動載入上架中活動資訊
    - 在 `changeTab()` 切換等級時重新載入活動資訊
  - 完成升等禮（`upgrade-activity.vue`）API 串接
    - 新增 `activityInfo` 資料物件（`activity_name`、`activity_schedule_start_time`）
    - 新增 `fetchActivityInfo()` 方法，呼叫 `membershipActivity/getLevelGiftSchedule` 並帶入 `rule_adjust_type: 3`、`status: 4`
    - 在 `mounted()` 生命週期自動載入上架中活動資訊
    - 在 `changeTab()` 切換等級時重新載入活動資訊
  - 完成生日禮（`birthday.vue`）API 串接
    - 新增 `activityInfo` 資料物件（`activity_name`、`activity_schedule_start_time`）
    - 新增 `fetchActivityInfo()` 方法，呼叫 `membershipActivity/getBirthDayGiftSchedule` 並帶入 `status: 4`
    - 在 `mounted()` 生命週期自動載入上架中活動資訊
    - 在 `changeTab()` 切換等級時重新載入活動資訊
- **2025-12-19（第一次調整）**：調整活動列表操作者顯示邏輯與表格樣式
  - 修正操作者文字顯示邏輯：
    - 僅「上架中」（status=4）顯示「由 XXX 上架」
    - 其他狀態（status=3 未上架、status=5 已下架）顯示「由 XXX 建立」
    - 修改檔案：`join-member-activity.vue`、`continuation-activity.vue`、`upgrade-activity.vue`、`birthday.vue`
  - 移除表格 border-top 樣式：
    - 移除 `::v-deep .nd-data-table td { border-top: none }` CSS 規則
    - 在 `<tr>` 元素上使用 Bootstrap 的 `table-borderless` 類別
    - 修改檔案：上述四個活動組件 + `history/index.vue`
- **2025-12-19（第二次調整）**：重大需求調整
  - 狀態文案調整：
    - 新增「預約執行」狀態（排程時間未到）
    - 保留「上架中」狀態（正在執行中）
    - 「已下架」改為「未上架」（未設定排程或已下架）
  - 列表欄位調整：
    - 新增「建立者」欄位，顯示「由 XXX 建立」（使用 `create_manager_name`）
    - 上架時間欄位調整：
      - 預約執行、上架中：顯示排程時間
      - 未上架：顯示「-」
    - 移除原先上架時間下方的灰字操作者資訊（已改為獨立欄位）
  - 排序規則調整：
    - 使用最後更新時間（updated_at）排序：新 → 舊
    - 移除之前的「上架中優先」邏輯
  - 刪除功能：
    - 完全移除刪除功能
    - 未來將以封存方式處理
  - 操作者顯示調整：
    - 歷程頁面移除「由系統自動上架」文字
    - 一律顯示「由 XXX 上架」（使用 `publish_manager_name`）
  - 上架歷程：
    - 應保留當時上架的完整內容（不受後續編輯影響）
  - 修改檔案：`join-member-activity.vue`、`continuation-activity.vue`、`upgrade-activity.vue`、`birthday.vue`、`history/index.vue`
- **2026-01-06（第三次調整）**：UI/UX 全面優化更新
  - **階段 1：列表顯示調整**
    - 表頭欄位：「建立者」→「最後編輯者」
    - 欄寬調整：5%, 30%, 10%, 20%, 15%, 20%
    - 新增 `getLastEditor()` 方法：
      - 優先顯示「由 XXX 編輯」（使用 `update_manager_name`）
      - 若無編輯者則顯示「由 XXX 建立」（使用 `create_manager_name`）
    - 新增 `getPublishOperator()` 方法：
      - 僅「上架中」（status=4）顯示「由 XXX 上架」（使用 `publish_manager_name`）
      - 其他狀態不顯示操作者
    - 排程時間欄位結構調整：
      - 第一行顯示時間（status=5 時顯示 "-"）
      - 第二行顯示上架操作者資訊（12px 灰字）
    - `getScheduleTime()` 方法調整：
      - status=5（未上架）時顯示 "-"
      - 其他狀態顯示排程時間
  - **階段 2：移除前端排序邏輯**
    - 後端已處理所有排序邏輯
    - 前端無需進行排序操作
    - 移除 `sortActivityList()` 方法呼叫
  - **階段 3：操作功能變更**
    - 完全移除刪除功能：
      - 移除 `canDelete()` 方法
      - 移除 `deleteActivity()` 方法
      - 移除 `handleDeleteFromInfo()` 方法
      - 從 `activity-info` 組件移除 `@deleteActivity` 事件綁定
      - 移除選單中的刪除選項
    - 保留編輯功能（上架中時禁用）
  - **階段 4：顯示邏輯調整**
    - 移除 `getManagerName()` 方法（已被 `getLastEditor()` 和 `getPublishOperator()` 取代）
    - `getPublishOperator()` 只顯示手動上架資訊：
      - 移除「由系統自動上架」邏輯
      - 只在 status=4 且有 `publish_manager_name` 時顯示
    - 狀態文字維持：
      - status=3：「預約執行」
      - status=4：「上架中」
      - status=5：「未上架」
  - **修改檔案**：
    - `src/views/member/system/activty/project/components/birthday.vue`
    - `src/views/member/system/activty/project/components/continuation-activity.vue`
    - `src/views/member/system/activty/project/components/join-member-activity.vue`
    - `src/views/member/system/activty/project/components/upgrade-activity.vue`
  - **注意事項**：
    - continuation-activity.vue 和 upgrade-activity.vue 有少量 Prettier 格式化警告，不影響功能
    - 所有核心功能已正確實施且無編譯錯誤
- **2026-01-06（第四次調整）**：操作選單功能優化
  - **階段 1：清除排程時間功能新增**
    - UI 調整：
      - 在操作選單中添加「清除排程時間」選項（緊接在「編輯」之後）
      - 移除原先的 disabled 狀態，改為可點擊執行功能
    - 功能實作（新增 `clearScheduleTime()` 方法）：
      - 點擊時顯示確認彈窗：「確定要清除排程時間嗎？清除後，活動將不會自動上架」
      - 確認後呼叫對應的更新 API：
        - 入會禮/續等禮/升等禮：直接呼叫 `membership.removeALLParameters().updateLevelGiftSchedule()`
        - 生日禮：直接呼叫 `membership.removeALLParameters().updateBirthdayGiftSchedule()`
      - 將 `activity_schedule_start_time` 設為 `null`
      - 保留活動其他資料（活動名稱、禮物設定等）
      - 更新成功後刷新列表並顯示「排程時間已清除」訊息
    - API 呼叫流程：
      1. 先呼叫詳情 API 取得完整活動資料（`getLevelGiftScheduleInfo` 或 `getBirthDayGiftScheduleInfo`）
      2. 將 `activity_schedule_start_time` 設為 `null`
      3. 直接呼叫 membership API 送出完整資料（不經過 Vuex store）
    - Vuex Store 更新：
      - 在 `src/store/membership-activity.module.js` 新增 `updateLevelGiftSchedule` action
      - 在 `src/store/membership-activity.module.js` 新增 `updateBirthdayGiftSchedule` action
  - **階段 2：上架時間欄位優化**
    - 移除必填驗證：
      - 移除 `ValidationProvider` 的 `required` 規則
      - 移除「上架時間」標籤後的紅色星號 `*`
      - 移除 `validateForm()` 方法中檢查上架時間的驗證邏輯
    - 新增清除按鈕：
      - 在日期選擇器旁邊添加 X 按鈕
      - 按鈕僅在有填寫時間值時顯示（`v-if="form.activity_schedule_start_time"`）
      - 使用紅色圖示 `mdi-close` 表示清除動作
    - 清除功能實作（新增 `clearScheduleTime()` 方法）：
      - 將 `form.activity_schedule_start_time` 設為 `null`
    - 資料送出邏輯調整：
      - 在 `submitConfig()` 方法中新增判斷
      - 當欄位為空或 `null` 時，確保傳給後端的值為 `null`
      - 有值時維持原有格式轉換邏輯（`YYYY-MM-DD HH:mm:00`）
  - **使用情境說明**：
    - 情境 1：列表操作
      - 用戶在列表點擊操作選單的「清除排程時間」
      - 系統將該活動的排程時間設為 null
      - 活動狀態變更為「未上架」，上架時間欄位顯示「-」
    - 情境 2：編輯表單
      - 用戶在編輯活動時可選擇不填寫上架時間
      - 或點擊 X 按鈕清除已填寫的時間
      - 儲存後該活動不會自動上架，需手動上架
  - **修改檔案**：
    - 列表操作功能：
      - `src/views/member/system/activty/project/components/join-member-activity.vue`
      - `src/views/member/system/activty/project/components/birthday.vue`
      - `src/views/member/system/activty/project/components/continuation-activity.vue`
      - `src/views/member/system/activty/project/components/upgrade-activity.vue`
    - 表單欄位優化：
      - `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`
    - Vuex Store：
      - `src/store/membership-activity.module.js`（新增 `updateLevelGiftSchedule` 和 `updateBirthdayGiftSchedule` actions）
  - **注意事項**：
    - 清除排程時間不會影響活動的其他設定（活動名稱、禮物配置等）
    - 清除後的活動需要手動點擊「立即上架」才能上架
    - 上架時間為選填欄位，允許建立沒有排程時間的活動
    - API 呼叫改為直接使用 `membership.removeALLParameters()` 方式，不經過 Vuex store dispatch
- **2026-01-15（第五次調整）**：統一 API 呼叫方式
  - **背景說明**：
    - 原先清除排程時間功能透過 Vuex store dispatch 呼叫 API
    - 為了與專案其他功能保持一致，改為直接呼叫 membership API
  - **修改內容**：
    - 保留 Vuex store 中的 `updateLevelGiftSchedule` 和 `updateBirthdayGiftSchedule` actions（供其他功能使用）
    - 四個列表頁面的 `clearScheduleTime()` 方法改為直接呼叫 API：

      ```javascript
      // 舊寫法（透過 Vuex store）
      await this.$store.dispatch('membershipActivity/updateLevelGiftSchedule', {
        levelId: this.currentId,
        activityId: item.activity_id,
        data: updateData,
      })
      
      // 新寫法（直接呼叫 API）
      await membership
        .removeALLParameters()
        .updateLevelGiftSchedule(
          this.currentId,
          item.activity_id,
          updateData,
        )
      ```

    - 新增 `import membership from '@/api/membership.js'` 到四個列表組件
  - **優點**：
    - 與專案其他 API 呼叫方式一致（例如刪除功能使用 `membership.removeALLParameters().deleteLevelGiftSchedule()`）
    - 減少不必要的中間層，程式碼更直接易懂
    - 維持 Vuex store 簡潔，避免過多單次使用的 actions
  - **修改檔案**：
    - `src/views/member/system/activty/project/components/join-member-activity.vue`
    - `src/views/member/system/activty/project/components/continuation-activity.vue`
    - `src/views/member/system/activty/project/components/upgrade-activity.vue`
    - `src/views/member/system/activty/project/components/birthday.vue`
  - **Vuex Store 保留**：
    - `src/store/membership-activity.module.js` 中的 `updateLevelGiftSchedule` 和 `updateBirthdayGiftSchedule` actions 保留供其他功能使用
- **2026-01-30（第六次調整）**：活動列表排序邏輯優化
  - **背景說明**：
    - 原先排序邏輯為「按最後更新時間倒序排列（新→舊）」
    - 業務需求變更為「狀態優先排序 + 同狀態內依更新時間升序排列」
  - **排序邏輯移除**：
    - 後端已處理活動列表排序
    - 移除前端 `sortActivityList()` 和 `getStatusPriority()` 方法
    - 前端直接使用後端返回的列表順序
  - **修改檔案**：
    - `src/utils/schedule-mixin.js`（移除 `sortActivityList()` 和 `getStatusPriority()` 方法）
    - `src/views/member/system/activty/project/components/join-member-activity.vue`（移除排序呼叫）
    - `src/views/member/system/activty/project/components/continuation-activity.vue`（移除排序呼叫）
    - `src/views/member/system/activty/project/components/upgrade-activity.vue`（移除排序呼叫）
    - `src/views/member/system/activty/project/components/birthday.vue`（移除排序呼叫）
- **2026-01-30（第七次調整）**：修正清除上架時間功能資料遺失問題
  - **問題描述**：
    - 按下「清除上架時間」按鈕後，點數/積分/優惠券資料被清空
    - 預期行為應是只清除 `activity_schedule_start_time`，其他資料保持不變
  - **根本原因**：
    - Info API 回傳的資料結構包在 `info` 屬性中：`{ status, message, info: { activity_name, gift_point, ... } }`
    - 原程式碼直接從 `activityInfo` 取值，導致 `gift_point`、`gift_coupon` 等欄位為 `undefined`
    - 送給 Update API 的資料缺少禮物配置，後端將其視為清空操作
  - **修正內容**（`src/utils/schedule-mixin.js`）：
    1. **正確取得 API 資料結構**：

       ```javascript
       // ❌ 之前：直接使用 activityInfo
       const { gift_point, gift_coupon } = activityInfo
       
       // ✅ 現在：從 info 屬性中取得資料
       const { gift_point, gift_coupon } = activityInfo.info
       ```

    2. **gift_coupon 深度複製與欄位過濾**：
    - 使用 lodash `cloneDeep` 進行深度複製，避免嵌套物件引用問題
    - 只保留 Update API 需要的欄位：`coupon_set_id`、`amount_unit`、`time_config`、`store_range`
    - 移除唯讀欄位：`name`、`coupon_set_code`、`manual_usage_config`
    - 保留可選欄位：`is_transferable`、`coupon_range_code`、`offline_store_range`
    - 生日禮特殊處理：將 `store_range` 和 `offline_store_range` 包成陣列
    1. **gift_point 深度複製與時間格式化**：
    - 使用 lodash `cloneDeep` 進行深度複製
    - 格式化 `time_config.expire_time` 為 `YYYY-MM-DD 23:59:59`
    1. **gift_score 深度複製**：
    - 使用 lodash `cloneDeep` 確保積分配置正確複製
  - **測試檢查點**：
    - ✅ 活動名稱保持不變
    - ✅ 點數/積分/優惠券配置完整保留
    - ✅ 活動狀態變更為「未上架」
    - ✅ 上架時間欄位顯示「-」
    - ✅ 可以重新編輯活動設定新的排程時間
  - **影響範圍**：
    - 入會禮、續等禮、升等禮、生日禮清除上架時間功能
    - 所有使用 `clearActivityScheduleStartTime()` 方法的頁面
  - **修改檔案**：
    - `src/utils/schedule-mixin.js`（修正 `clearActivityScheduleStartTime()` 方法）
  - **文檔更新**：
    - 更新「清除排程時間功能」章節，補充重要實作細節
    - 加入 API 資料結構處理、gift_coupon 欄位處理、實作範例等說明
- **2026-02-02（第八次調整）**：積分 point_id 補齊與編輯回填
  - **問題描述**：新增/編輯積分時未帶入 `point_id`，導致 API payload 遺漏。
  - **調整內容**：
    - 在積分彈窗（`score-dialig.vue`）新增回填邏輯，開啟彈窗與編輯時強制帶入 `point_id`。
    - 在送出前（`upgrade-gift-dialog.vue`）正規化 `gift_score`，確保每筆都有 `point_id`。
    - 在 `setGiftScore()` 收到資料時即補齊 `point_id`。
  - **程式碼風格要求**：避免使用 `??`，改以三元運算子或 `||` 寫法。
  - **修改檔案**：
    - `src/views/member/system/activty/project/components/score-dialig.vue`
    - `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`
- **2026-02-02（第九次調整）**：表單驗證只在按確認後觸發
  - **問題描述**：重新開啟點數/積分/活動設定彈窗時，欄位會立即顯示驗證錯誤，未符合「按確認才驗證」的預期。
  - **調整內容**：
    - 所有對話框表單使用 `ValidationObserver`/`ValidationProvider` 的 `mode="passive"`，避免 blur 即驗證。
    - 在重新開啟與關閉彈窗時重置驗證狀態，避免保留上次驗證結果。
  - **實作方式**：
    - `upgrade-gift-dialog.vue`：開啟/關閉時呼叫 `this.$refs.activityForm.reset()`。
    - `point-dialig.vue`：`showPointModal` 變化時呼叫 `this.$refs.pointForm.reset()`。
    - `score-dialig.vue`：`showScoreModal` 變化時呼叫 `this.$refs.scoreForm.reset()`。
  - **修改檔案**：
    - `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`
    - `src/views/member/system/activty/project/components/point-dialig.vue`
    - `src/views/member/system/activty/project/components/score-dialig.vue`
- **2026-02-02（第十次調整）**：活動詳情防呆與清除排程容錯
  - **問題描述**：生日禮活動詳情抽屜出現 `Cannot read properties of undefined (reading 'info')`，原因是 `activity_snapshot` 缺失時仍讀取 `activity_snapshot.info`。
  - **調整內容**：
    - 活動詳情抽屜新增 `activity_snapshot` 缺失的防呆邏輯，改用安全的 snapshot fallback。
    - 清除上架時間流程改為接受 `info/list/本體` 三種回傳形狀，避免 `activityInfo.info` 為空時崩潰。
  - **修改檔案**：
    - `src/views/member/system/activty/project/components/activity-info.vue`
    - `src/utils/schedule-mixin.js`
- **2026-02-03（第十一次調整）**：第二步確認送出後避免回跳第一步
  - **問題描述**：在第二步按下確認送出後，SweetAlert 成功彈窗出現前，畫面會短暫閃現第一步表單。
  - **調整內容**：
    - 成功時不立即重置 `currentStep`，避免 SweetAlert 前後出現第一步畫面。
    - 將 `currentStep` 重置移至 `showModal=true` 的開啟流程，關閉時不再切回第一步。
  - **修改檔案**：
    - `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`
- **2026-02-25（第十二次調整）**：統一使用 moment.js 進行時間格式化
  - **問題描述**：代碼中存在已標記 `@deprecated` 的 `formatDate` Vuex getter，內部使用 `new Date()` 進行時間轉換。需要統一改為使用 moment.js。
  - **調整內容**：
    - 移除 `upgrade-gift-dialog.vue` 中 `mapGetters` 的 `formatDate: 'bdmsConfig/formatDate'` 引入。
    - 將 `changeData()` 方法中的時間格式化改為直接使用 `this.$moment()`：
      - 變更前：`this.formatDate(val.time_config.end_time, 'YYYY-MM-DD') + ' 23:59:59'`
      - 變更後：`this.$moment(val.time_config.end_time).format('YYYY-MM-DD') + ' 23:59:59'`
  - **驗證結果**：
    - 所有相關組件（`history/index.vue`、`history-search.vue`、`schedule-mixin.js`、`activity-info.vue`、`join-member-activity.vue`、`continuation-activity.vue`、`upgrade-activity.vue`）已全部正確使用 `$moment()`，無其他改動。
    - 新增或編輯優惠券後，`time_config.end_time` 格式正確為 `YYYY-MM-DD 23:59:59`。
  - **修改檔案**：
    - `src/views/member/system/activty/project/components/upgrade-gift-dialog.vue`
- **2026-02-25（第十三次調整）**：合併重複的刪除 API 呼叫邏輯
  - **問題描述**：`closeDeleteModel()` 方法中，'join-member-activity'（入會禮排程刪除）和 'birthday'（生日禮排程刪除）兩段程式碼基本上在做相同的事情，僅呼叫的 API 方法名不同，導致代碼重複。
  - **調整內容**：
    - 將兩個 case 中各自獨立的異步呼叫改為設置 `updateFun` 變數
    - 移除了重複的 `.then()` 回調和兩個 `return` 語句
    - 統一使用底部的 `membership.removeALLParameters()[updateFun]()` 動態呼叫
    - 現在所有類型的刪除操作都通過同一個邏輯分支處理
  - **修改詳情**：
    - **變更前**：

      ```javascript
      } else if (this.showDeleteModel.currentConpontent === 'join-member-activity') {
        membership
          .removeALLParameters()
          .deleteLevelGiftSchedule(setupId, this.showDeleteModel.id)
          .then(() => { ... })
        return
      } else if (this.showDeleteModel.currentConpontent === 'birthday') {
        membership
          .removeALLParameters()
          .deleteBirthdayGiftSchedule(setupId, this.showDeleteModel.id)
          .then(() => { ... })
        return
      }
      ```

    - **變更後**：

      ```javascript
      } else if (this.showDeleteModel.currentConpontent === 'join-member-activity') {
        updateFun = 'deleteLevelGiftSchedule'
      } else if (this.showDeleteModel.currentConpontent === 'birthday') {
        updateFun = 'deleteBirthdayGiftSchedule'
      }
      // 統一於下方執行
      membership
        .removeALLParameters()
        [updateFun](setupId, this.showDeleteModel.id)
        .then(() => { ... })
      ```

  - **優點**：
    - 代碼更簡潔，便於維護
    - 減少重複邏輯
    - 所有刪除類型的處理方式一致
  - **修改檔案**：
    - `src/views/member/system/activty/index.vue`（`closeDeleteModel()` 方法中的第 408-431 行）

---

## 代碼重構優化（2026-02-26）

### 背景

經過 Fix #9 和 Fix #10 的改動後，原先在 `schedule-mixin.service.js` 中的 4 個 wrapper methods 已 redundant，改由各組件直接引用對應的 filters 和 service functions。此次重構則完成最後的整理與清理工作。

### 改動概述

| 項目 | 描述 | 狀態 |
|-----|------|------|
| 移除 4 個 wrapper methods | 從 `schedule-mixin.service.js` 移除已無效的 wrapper 方法 | ✅ 完成 |
| 轉換 named exports | 將 `filter.service.js` 中的 named exports 改為 `Vue.filter()` 呼叫 | ✅ 完成 |
| 刪除 unused computed | 刪除相關組件中的未使用 computed properties | ✅ 完成 |

### 1. 移除 `schedule-mixin.service.js` 中的 wrapper methods

**移除的 4 個 wrapper methods**（原位置：lines ~406-428）：

```javascript
// ─── 已移除 ─────────────────────────────────────────────────────

/** 活動狀態 CSS class（委派給 status-color.service.js） */
// getStatusClass(status) { ... }

/** 活動設定是否為空（委派給 activityConfigEmpty filter） */
// isActivityConfigEmpty(currentConfig) { ... }

/** 顯示「尚未設定 / 是 / 否」（委派給 repeatableStatusText filter） */
// getRepeatableStatusText(opts) { ... }

/** 正規化活動詳情 payload（委派給 normalizeActivityInfo filter） */
// normalizeActivityInfoPayload(payload) { ... }
```

**原因**：

- 各活動列表組件已直接使用 Vue filters（`this.$options.filters.xxx()`）進行取值
- 不再經由 mixin wrapper 進行中轉
- Wrapper methods 成為冗餘代碼

**影響檔案**：

- `src/core/services/schedule-mixin.service.js`

### 2. 更新 `fetchActivityInfoDetail` 內部呼叫

**改動位置**：`src/core/services/schedule-mixin.service.js`（line ~195）

**變更前**：

```javascript
const normalized = this.normalizeActivityInfoPayload(response, this.basicInfo)
```

**變更後**：

```javascript
const normalized = Vue.filter('normalizeActivityInfo')(response, this.basicInfo)
```

**原因**：

- `fetchActivityInfoDetail` 方法內部改為直接呼叫 global Vue filter
- 與 wrapper 方法移除保持一致

### 3. 轉換 `filter.service.js` named exports 為 `Vue.filter()` 呼叫

**改動位置**：`src/core/services/filter.service.js`（lines ~1725-1959）

**改動內容**（8 個 named exports → `Vue.filter()` 呼叫）：

| Named Export | → | Vue.filter() 呼叫 |
|-------------|---|-----------------|
| `isActivityConfigEmpty` | → | `Vue.filter('activityConfigEmpty', ...)` |
| `getRepeatableStatusText` | → | `Vue.filter('repeatableStatusText', ...)` |
| `getLastEditor` | → | `Vue.filter('getLastEditor', ...)` |
| `getPublishOperator` | → | `Vue.filter('getPublishOperator', ...)` |
| `activityScheduleStatusText` | → | `Vue.filter('activityScheduleStatusText', ...)` |
| `getSchedulePublishTime` | → | `Vue.filter('getSchedulePublishTime', ...)` |
| `hasExpiredCoupon` | → | `Vue.filter('hasExpiredCoupon', ...)` |
| `normalizeActivityInfoPayload` | → | `Vue.filter('normalizeActivityInfo', ...)` |

**未轉換的 function**：

- `clearActivityScheduleStartTime` — 保留為 local async function（使用 Swal、lodash、membership API，不適合 filter）

**原因**：

- Named exports 主要被 `schedule-mixin.service.js` 中已移除的 wrapper methods 使用
- 現已改為統一的 `Vue.filter()` 註冊方式
- 與 Vue 全域 filter 系統保持一致

### 4. 刪除未使用的 computed properties

**改動組件**（共 3 個）：

#### 4.1 `join-member-activity.vue`

**移除的 computed property**（原位置：lines 198-204）：

```javascript
// ─── 已移除 ─────────────────────────────────────────────────

// activityIsPhoneRepeatableStatusText() {
//   return this.$options.filters.repeatableStatusText({
//     isCreate: this.isCreate,
//     value: this.current.config?.activity_is_phone_repeatable,
//   })
// },
```

**原因**：

- 檢視範本後，確認此 computed 從未被 `<template>` 中引用
- 「手機限領」相關的狀態文字無需在列表頁顯示
- 相關資訊已在活動詳情頁另行處理

#### 4.2 `continuation-activity.vue`

**移除的 computed property**（原位置：lines 222-227）：

```javascript
// ─── 已移除 ─────────────────────────────────────────────────

// activityIsRepeatableStatusText() {
//   return this.$options.filters.repeatableStatusText({
//     isCreate: this.isCreate,
//     value: this.currentConfig?.activity_is_repeatable,
//   })
// },
```

**原因**：

- 檢視範本後，確認此 computed 從未被 `<template>` 中引用
- 「可重複領取」狀態無需在列表頁顯示
- 相關資訊已在活動詳情頁另行處理

#### 4.3 `upgrade-activity.vue`

**移除的 computed property**（原位置：lines 215-221）：

```javascript
// ─── 已移除 ─────────────────────────────────────────────────

// activityIsRepeatableStatusText() {
//   return this.$options.filters.repeatableStatusText({
//     isCreate: this.isCreate,
//     value: this.currentConfig?.activity_is_repeatable,
//   })
// },
```

**原因**：

- 檢視範本後，確認此 computed 從未被 `<template>` 中引用
- 與 `continuation-activity.vue` 相同邏輯

**保留的 computed**：

- 所有組件的 `isCreate` computed 保留（被 `watch` 監聽器使用）

### 重構前後對比

#### 代碼數量

| 檔案 | 移除行數 | 改動說明 |
|-----|--------|---------|
| `schedule-mixin.service.js` | ~25 | 移除 4 個 wrapper methods + 相關註解 |
| `filter.service.js` | 0（轉換，非刪除） | 8 個 named exports → Vue.filter() 呼叫 |
| `join-member-activity.vue` | 7 | `activityIsPhoneRepeatableStatusText` computed |
| `continuation-activity.vue` | 6 | `activityIsRepeatableStatusText` computed |
| `upgrade-activity.vue` | 7 | `activityIsRepeatableStatusText` computed |
| **總計** | **~45** | **3 個組件，2 個 service 檔案** |

#### 架構改進

| 改進項目 | 詳述 |
|--------|------|
| **降低耦合度** | Wrapper methods 移除，各組件直接使用全域 filters；避免 mixin 中的中介層 |
| **統一濾鏡實現** | Named exports 改為 `Vue.filter()` 呼叫；所有濾鏡均透過 Vue 全域系統註冊 |
| **代碼清潔** | 刪除 3 個未使用 computed；減少組件中的冗餘邏輯 |
| **易於維護** | 全域 filters 集中管理，不再分散於多個 service 和 wrapper 方法 |

### 驗證清單

- ✅ 所有 4 個 wrapper methods 已從 `schedule-mixin.service.js` 移除
- ✅ `fetchActivityInfoDetail` 已更新內部呼叫
- ✅ `filter.service.js` 的 8 個 named exports 已轉換為 `Vue.filter()` 呼叫
- ✅ 3 個組件的 unused computed properties 已刪除
- ✅ 確認 `isCreate` computed 在各組件中仍被 `watch` 監聽器使用（保留）
- ✅ 無殘留的 `getStatusClass`、`isActivityConfigEmpty`、`getRepeatableStatusText`、`normalizeActivityInfoPayload` 呼叫

### 相關檔案清單

| 檔案路徑 | 改動概述 |
|--------|--------|
| `src/core/services/schedule-mixin.service.js` | 移除 4 個 wrapper methods；更新 `fetchActivityInfoDetail` 內部呼叫 |
| `src/core/services/filter.service.js` | 8 個 named exports → `Vue.filter()` 呼叫 |
| `src/views/member/system/activty/project/components/join-member-activity.vue` | 刪除 `activityIsPhoneRepeatableStatusText` computed |
| `src/views/member/system/activty/project/components/continuation-activity.vue` | 刪除 `activityIsRepeatableStatusText` computed |
| `src/views/member/system/activty/project/components/upgrade-activity.vue` | 刪除 `activityIsRepeatableStatusText` computed |
