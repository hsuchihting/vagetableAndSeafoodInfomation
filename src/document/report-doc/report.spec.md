# BDMS 報表功能規格文檔

## 目錄結構

1. [文檔概述](#文檔概述)
2. [路由架構](#路由架構)
3. [權限控制](#權限控制)
4. [功能模組](#功能模組)
   - [數據分析](#數據分析模組)
   - [報表中心](#報表中心模組)
5. [API 對照表](#api-對照表)
6. [實作參考](#實作參考)
7. [更新日誌](#更新日誌)

---

## 文檔概述

本文檔詳細記錄了 BDMS 報表功能的設計規格、功能模組、路由架構、權限控制，以及各功能模組的實現細節。

**最後更新日期**：2026-02-25  
**文檔版本**: 3.1

### 核心功能模組

- **數據分析**：數據概覽、趨勢分析（訂單、商品、系統）
- **報表中心**：自訂報表、定期報表、報表下載區

---

## 路由架構

### 路由層級結構

```plaintext
/analytics (數據分析)
├── /overview (數據概覽)
│   └── 支援子 tab：營運、商品
└── /trend (趨勢分析)
    ├── /order (訂單趨勢)
    ├── /product (商品排名)
    └── /system (系統使用率) 🔒

/report-center (報表中心)
├── /custom (自訂報表)
│   ├── /operation/:id? (營運分析)
│   ├── /member/:id? (會員分析)
│   └── /marketing/:id? (行銷分析)
├── /scheduled (定期報表)
└── /downloads (報表下載紀錄)
```

### 路由對照表

| 功能模組         | 路由路徑                                    | Route Name                    |
| ---------------- | --------------------------------------------- | ----------------------------- |
| **數據概覽**     | `/analytics/overview`                         | AnalyticsOverview             |
| **趨勢分析**     | `/analytics/trend`                            | AnalyticsTrend                |
| 訂單趨勢         | `/analytics/trend/order`                      | AnalyticsTrendOrder           |
| 商品排名         | `/analytics/trend/product`                    | AnalyticsTrendProduct         |
| 系統使用率       | `/analytics/trend/system`                     | AnalyticsTrendSystem          |
| **自訂報表**     | `/report-center/custom`                       | ReportCenterCustom            |
| 營運分析         | `/report-center/custom/operation/:id?`        | ReportCenterCustomOperation   |
| 會員分析         | `/report-center/custom/member/:id?`           | ReportCenterCustomMember      |
| 行銷分析         | `/report-center/custom/marketing/:id?`        | ReportCenterCustomMarketing   |
| **定期報表**     | `/report-center/scheduled`                    | ReportCenterScheduled         |
| **報表下載紀錄** | `/report-center/downloads`                    | ReportCenterDownloads         |

### 路由重構歷史（2026-02-25）

#### 背景
專案路由架構從舊路由（`/data-center/*`、`/analytics/report-center/*`）遷移至新路由（`/analytics/*`、`/report-center/*`），期間保留了 15 條 redirect 規則作為向下相容層，該過渡期已結束。

#### 變更
1. **移除所有舊路由 redirect 定義**
   - 刪除 [src/router/modules/data-center/index.js](../src/router/modules/data-center/index.js) 中「舊路由重定向（向下相容）」區塊（第 135–201 行）
   - 包含 9 條 `/data-center/*` redirect 與 6 條 `/analytics/report-center/*` redirect
   - 保留根路由 `redirect: '/analytics/overview'`（用於應用啟動導航）

2. **修正舊路由硬編碼引用**
   - [src/views/404/index.vue](../src/views/404/index.vue)：404 頁面按鈕改為 `$router.push('/analytics/overview')`
   - 此為整個 `src/` 目錄中**唯一**硬編碼舊路徑的地方

#### 驗收結果
- ✅ 舊路由（如 `/data-center/dashboard`）現顯示 404 頁面
- ✅ 新路由正常載入對應元件
- ✅ 按外部系統確認無舊路由依賴

---

## 權限控制

### 權限模型

| 角色 | 代碼 | 可見功能 |
|-----|------|---------|
| 系統管理員 | `admin` | 完整權限，所有功能可見 |
| 品牌管理員 | `brand` | 完整權限，所有功能可見 |
| 門市管理員 | `store` | **受限權限**，見下表 |

### Store 角色受限功能（隱藏）

以下功能對 Store 角色**隱藏**，僅 Admin 和 Brand 角色可見：

| 受限項目 | 位置 |
|---------|------|
| 系統使用率 | 趨勢分析 > 系統使用率（`/analytics/trend/system`） |
| 週報表 | 定期報表 > 週報表 卡片 |
| 月報表 | 定期報表 > 月報表 卡片 |
| 週報表 Tab | 報表下載區 > 週報表 |
| 月報表 Tab | 報表下載區 > 月報表 |

### 實作層級

1. **選單層級**：選單配置檔案移除受限項目（`menu-admin.js`, `menu-brand.js`, `menu-store.js`）
2. **路由層級**：路由 meta 標註 `roleAccess`，路由守衛檢查（可選）
3. **元件層級**：使用 v-if / computed 過濾受限項目

---

## 功能模組

### 數據分析模組


### 需求背景（2026-02-25）

在「報表中心 → 報表下載區 → 定期報表」中，期望改善初次進入時的使用者體驗：

- **初次進入自動展示資料**：若預設已有年份（當年）與第一筆品牌資料，應自動執行搜尋並展示報表資料，無需使用者手動按搜尋。
- **手動篩選需按搜尋**：使用者手動切換年份或品牌後，應需按搜尋按鈕才更新結果，避免誤觸 API。
- **限制自動 API 呼叫**：切換品牌時，**僅在預設第一筆品牌時自動呼叫報表 API**；若切換至其他品牌，應不呼叫 API（等待使用者按搜尋）。

### 變更摘要（2026-02-25）

- **新增 `hasDefaultFilters` computed**：判斷當前是否有預設年份 + 品牌（store 角色判斷 store_id），作為「是否自動搜尋」的依據。

- **修改 `mainTab` watcher（改為 async）**：切換到定期報表 tab（`mainTab === 1`）時：
  - 若已搜尋過 (`hasSearchedScheduled === true`)：重新載入當前 tab 資料。
  - 若未搜尋過但有預設條件 (`!hasSearchedScheduled && hasDefaultFilters`)：自動呼叫 `searchScheduledReport()`。

- **修改 `created()` 末尾**：在 `handleRouteQuery()` 後補上自動搜尋邏輯，確保初次進入定期報表 tab 時（例如透過 route query 帶 `tab` 時）若有預設條件即自動搜尋。

- **防止不必要的自動 API 呼叫**：確保手動切換品牌/年份後，表格不更新（等待按搜尋）。已搜尋過後手動更改篩選條件不會自動重搜，維持現有「只有按搜尋才更新結果」的設計意圖。

### 影響範圍（2026-02-25）

- [src/views/data-center/download/index.vue](../src/views/data-center/download/index.vue)

### 驗收條件（2026-02-25）

#### A. 初次進入自動載入

1. 不帶任何 query 直接進入「報表下載區 → 定期報表」。
2. 系統應以預設年份 + 第一筆品牌自動執行搜尋。
3. 定期報表區域應自動顯示對應報表資料。

#### B. 從 scheduled-report 跳轉

1. 從「定期報表」頁籤跳轉至報表下載區（帶 `tab` + `brand_id` query 參數）。
2. 應自動帶入相應篩選條件並顯示資料。
3. **Store 角色**：原本未自動搜尋，修改後應自動搜尋（同 Admin/Brand 行為）。

#### C. 切換年份或品牌

1. 進入定期報表並已自動載入資料。
2. 手動更改年份或品牌。
3. 表格**不會自動更新**，仍顯示前一次搜尋結果。
4. 按下搜尋後，表格才依新條件更新。

#### D. 清除後不自動重搜

1. 已搜尋並顯示報表資料。
2. 點擊清除。
3. 篩選條件清空（年份除外），表格為「無資料」。
4. 不會因為清除而自動重搜帶回預設資料。

### 實現細節（2026-02-25）

**`hasDefaultFilters` computed：**

```javascript
hasDefaultFilters() {
  const hasYear = !!this.scheduledFilters.year
  if (this.roleType === 'store') {
    return hasYear && !!this.scheduledFilters.store_id
  }
  return hasYear && !!this.scheduledFilters.brand_id
}
```

**`mainTab` watcher：**

```javascript
async mainTab(newVal) {
  if (newVal === 1) {
    // 確保 subTab 在可見範圍內...
    if (this.hasSearchedScheduled) {
      // 已搜尋：重新載入當前 tab
      this.loadReportDataByTab(this.subTab, this.appliedScheduledFilters)
    } else if (this.hasDefaultFilters) {
      // 首次進入且有預設條件：自動搜尋
      await this.searchScheduledReport()
    }
  }
}
```

**`created()` 末尾：**

```javascript
this.handleRouteQuery()

// 首次進入定期報表 tab 時，若有預設條件則自動搜尋
if (this.mainTab === 1 && !this.hasSearchedScheduled && this.hasDefaultFilters) {
  await this.searchScheduledReport()
}
```

---

## 2026-01-29 變更：報表下載區（定期報表）品牌/門市篩選器顯示與門市清單綁定

### 需求更新（2026-01-29）

本次需求延伸針對「報表下載區 → 定期報表」的篩選器與權限行為做調整，重點如下：

1. **門市下拉顯示時機**

- 週報表 / 月報表：**不顯示**門市下拉。
- 會員報表：
  - **門市制**（`membership_group_type = 2`）才顯示門市下拉。
  - **品牌制**（`membership_group_type = 1`）不顯示門市下拉。
- 門市下拉**不允許 disabled 狀態**，要嘛顯示且可操作，要嘛不顯示。

1. **權限與報表可見性**

- Admin / Brand：可看週報表、月報表、會員報表。
- Store：只能看會員報表，週報表/月報表仍隱藏。

1. **搜尋條件與驗證規則**

- 週/月報表：只驗 `brand_id`，**不需 `store_id`**，並強制 `store_id = 0`。
- 會員報表：
  - **門市制**必填 `store_id`。
  - **品牌制**固定 `store_id = 0`。

1. **品牌切換避免門市下拉閃爍**

- 切換品牌後**先讀取會員制度**，再決定是否顯示門市下拉。
- 在會員制度讀取中，不顯示門市下拉（避免先出現後消失）。

1. **Store 權限補齊 brand_id**

- 會員報表查詢必須補齊 `brand_id`。
- 若已選 `store_id` 但 `brand_id` 為空，需透過門市反推品牌再送 API。

### 影響範圍（2026-01-29）

- [src/views/data-center/download/index.vue](../src/views/data-center/download/index.vue)

### 驗收條件（2026-01-29 更新）

#### A. Admin / Brand

1. 週/月報表不顯示門市下拉。
2. 會員報表：

- 品牌制不顯示門市下拉，查詢時 `store_id = 0`。
- 門市制顯示門市下拉，需可選且不 disabled。

#### B. Store

1. 僅可看到會員報表。
2. 門市下拉正常顯示且可選。
3. 搜尋時必須帶 `brand_id`（由 `store_id` 反推）。

### 需求背景（2026-01-29）

在「報表中心 → 報表下載區 → 定期報表」的篩選器中，Admin / Brand 可能會切換到不同品牌，而不同品牌的會員制度型態可能不同：

- **品牌制**（`membership_group_type = 1`）：不需要選門市。
- **門市制**（`membership_group_type = 2`）：必須可選門市，且即使只有 1 間門市也要顯示門市下拉。

先前行為在部分情境下會出現：Brand 切到「門市制」品牌時門市下拉仍 disabled，或切品牌時門市清單帶到跨品牌資料。

本次調整目標：

- **切換品牌不自動搜尋**：仍維持「按下搜尋才套用條件並出結果」。
- **門市下拉一致可見**：對 Admin / Brand / Store 都顯示門市下拉；但 Admin/Brand 在品牌制時必須 disabled。
- **門市制顯示正確門市清單**：切到門市制品牌時，門市下拉顯示該品牌門市清單並預設第一間。
- **避免跨品牌門市清單**：切換品牌時抓門市清單必須帶 `brand_id`。

### 變更摘要（2026-01-29）

- **門市下拉渲染規則**：
  - `roleType in ['admin','brand','store']`：門市下拉一律渲染。
  - **Admin/Brand**：
    - 品牌制（`membership_group_type !== 2`）→ 門市下拉 disabled。
    - 門市制（`membership_group_type === 2`）且已選品牌 → 門市下拉 enabled 並顯示門市清單。
  - **Store**：門市下拉維持可操作（不因品牌制/門市制 disabled）。

- **切換品牌時預設門市（門市制）**：
  - Admin/Brand 切換 `scheduledFilters.brand_id` 時，若該品牌為門市制，會抓取該品牌門市清單並預設帶入第一筆門市（即使只有 1 間門市）。
  - 切換品牌只更新篩選器狀態與下拉選項，**不會觸發搜尋**。

- **避免跨品牌門市清單**：
  - 取得門市清單一律使用 `user/getStore({ brand_id })`（並同步更新 `user.current.brand_id`），避免沿用舊品牌或跨品牌資料。

### 關鍵行為（2026-01-29）

- **品牌切換**（Admin/Brand）：
  1. 切換 `scheduledFilters.brand_id`。
  2. 清空 `scheduledFilters.store_id` 與 `storeOptions`（避免殘留舊品牌門市）。
  3. 取得該品牌 `membershipInfo`。
  4. 若為門市制：抓取該品牌 `storeOptions` 並預設 `scheduledFilters.store_id` 為第一筆。
  5. 不更新 `appliedScheduledFilters`（因此不會立即出結果）。

- **搜尋按鈕（仍以 appliedScheduledFilters 查詢）**：
  - Store：沿用既有邏輯（門市必填，且 brand_id 需可被推導/取得）。
  - Admin/Brand：
    - 品牌必填。
    - 門市制時門市必填；品牌制時強制 `store_id = 0`（不帶門市條件）。

### 影響範圍（2026-01-29）

- [src/views/data-center/download/index.vue](../src/views/data-center/download/index.vue)

### 驗收條件（2026-01-29）

#### A. Admin/Brand - 品牌制

1. 進入「報表下載區 → 定期報表」。
2. 選擇一個「品牌制」品牌（`membership_group_type = 1`）。
3. 門市下拉必須可見且為 disabled。
4. 按搜尋後，送出的搜尋條件必須不帶門市限制（`store_id = 0`）。

#### B. Admin/Brand - 門市制

1. 選擇一個「門市制」品牌（`membership_group_type = 2`）。
2. 門市下拉必須可見且可操作，並顯示「該品牌」門市清單（即使只有 1 間也要顯示）。
3. 切換品牌後，門市下拉預設會帶入第一間門市，但**不會自動出結果**。
4. 未選門市直接按搜尋時，必須提示「請選擇門市」。
5. 選好門市並按搜尋後，結果才依條件更新。

#### C. Store

1. Store 角色進入定期報表。
2. 門市下拉必須可見且可操作（不因品牌制/門市制而 disabled）。
3. 行為需維持既有搜尋與 brand_id 推導流程不變。

## 2026-01-27 變更：報表下載區（定期報表）Store 權限 UX 優化

### 需求背景（2026-01-27）

在「報表中心 → 報表下載區 → 定期報表」Store 權限情境下，需要避免「畫面未操作就出現無權限警告」以及「切換門市下拉就立即改變表格/警告」造成誤解，並確保清除行為符合直覺。

### 變更摘要（2026-01-27）

- **按下搜尋才顯示結果/提示**：未按搜尋前表格顯示「無資料」且不顯示無權限提示；按下搜尋後才依當次條件載入資料，並在無權限時顯示提示。
- **切換門市下拉不即時更新會員報表結果**：切換下拉只更新 UI 選擇值；會員報表的「顯示結果」以「最後一次按下搜尋的條件」為準。
- **清除行為（保留年份）**：清空門市選項（store_id 回到 0/未選）、表格顯示「無資料」、不顯示無權限提示；年份維持使用者當前選擇。

### 關鍵設計（2026-01-27）

定期報表採用「UI 條件」與「已套用搜尋條件」分離：

- `scheduledFilters`：使用者下拉當下選擇（UI 狀態）。
- `appliedScheduledFilters`：按下搜尋後才更新（表格顯示與 API 查詢以此為準）。
- `hasSearchedScheduled`：是否已按過搜尋（控制是否顯示無權限提示）。

### 會員報表權限提示（父層負責，2026-01-27）

- 父層載入會員報表前，會先檢查會員模組是否開通（門市制/門市角色需帶 store_id）。
- 未開通時：`memberReportData` 置空，且僅在 `hasSearchedScheduled=true` 時顯示無權限提示。
- 已開通時：載入會員報表資料；若資料為空則顯示「無資料」。

### 影響範圍（2026-01-27）

- [src/views/data-center/download/index.vue](../src/views/data-center/download/index.vue)
- [src/views/data-center/download/components/MemberReportTable.vue](../src/views/data-center/download/components/MemberReportTable.vue)

### 驗收條件（2026-01-27）

#### A. Store 權限 - 未搜尋前

1. 進入「報表下載區 → 定期報表 → 會員報表」。
1. 未按搜尋前，表格顯示「無資料」，且不顯示無權限提示。

#### B. Store 權限 - 按搜尋後

1. 選擇門市與年份後點擊搜尋。
1. 已開通會員卡功能：顯示報表資料；若無資料則顯示「無資料」。
1. 未開通會員卡功能：顯示無權限提示文案（warningDescript）。

#### C. Store 權限 - 切換門市下拉

1. 已在會員報表按搜尋並看到結果（資料/無資料/無權限提示）。
1. 切換門市下拉到另一個門市（包含從有權限切到無權限）。
1. 未再次按搜尋前，會員報表仍維持「上一次搜尋結果」，不會因下拉切換立刻變更。
1. 再次按搜尋後，才會依新門市條件更新結果。

#### D. Store 權限 - 清除

1. 點擊清除。
1. `store_id` 清空（回到未選狀態），表格顯示「無資料」，不顯示無權限提示。
1. 年份維持原值。

## 2026-01-27 變更：報表下載區（定期報表）匯出紀錄列表預設帶入門市

### 需求背景（定期報表匯出紀錄，2026-01-27）

在「報表下載區 → 定期報表」會呼叫匯出紀錄列表 API 取得列表。

- 參考 API 規格：[analytics.api.export-log-list.spec.md](analytics.api.export-log-list.spec.md)
- API Query 支援 `brand_id` / `store_id`（可選），但實務上 brand 權限若未帶 `store_id`，後端會少掉門市條件導致資料不符合預期。

### 變更摘要（定期報表匯出紀錄，2026-01-27）

- **Admin / Brand / Store 進入頁面時預設帶入第一筆門市**：避免 brand 權限呼叫匯出紀錄列表時漏帶 `store_id`。
- **Brand（單品牌）也需補齊 brand_id**：即使 `multiple=false`，呼叫列表 API 仍需帶 `brand_id` / `store_id`。
- **切換品牌時同步刷新預設門市**：brand/admin 切換品牌後，若目前 `store_id` 不存在於新品牌門市清單，會自動改成第一筆門市。

### 行為規格（Acceptance Criteria，2026-01-27）

#### A. 預設帶入門市

1. 進入「報表下載區 → 定期報表」。
1. 系統呼叫匯出紀錄列表 API 時，必須帶 `store_id`（預設第一筆門市），且 brand 權限必須帶 `brand_id`。

#### B. 切換品牌

1. brand/admin 角色切換品牌。
1. 若原 `store_id` 不屬於新品牌的門市清單，則 `store_id` 自動切換為新品牌第一筆門市。
1. 下一次取得匯出紀錄列表時，需以更新後的 `brand_id` / `store_id` 查詢。

### 影響範圍（定期報表匯出紀錄，2026-01-27）

- [src/views/data-center/download/index.vue](../src/views/data-center/download/index.vue)
- [src/views/data-center/download/components/CustomReportTable.vue](../src/views/data-center/download/components/CustomReportTable.vue)

## 2026-01-26 變更：門市權限定期報表（會員報表）可正常搜尋與顯示

### 背景

門市權限在「報表下載區 → 定期報表 → 會員報表」情境下，可能出現兩個問題：

1. 按下搜尋不會呼叫 API

- 主因是 store 情境下的篩選條件未補齊 brand_id（brand_id 為 0），導致後續載入流程不執行或不會成功取得資料。

1. 會員報表列表永遠顯示未開通警示（warningDescript）

- 主因是 memberAuth 的計算時機與參數未對齊：membershipInfo 更新後未重新計算授權，或 store 角色未帶 storeId 判斷，導致 memberAuth 長期維持 false。

### 變更摘要

本次修正聚焦在兩個面向：

- 搜尋行為（門市權限）
  - 確保 store 角色下 scheduledFilters.brand_id 必定可被補齊（優先由門市帶出 brand_id，拿不到則 fallback 使用頁面 brand_id）。
  - 若仍無法取得 brand_id，顯示明確提示，避免使用者感覺「按了沒反應」。

- 授權顯示（門市權限）
  - membershipInfo 更新後，會重新呼叫授權檢查。
  - store 角色判斷授權時，必須帶 storeId 呼叫 provider，已開通則顯示「列表資料」或「無資料」。

### 影響範圍（修改檔案）

- [src/views/data-center/download/index.vue](../src/views/data-center/download/index.vue)
- [src/views/data-center/download/components/MemberReportTable.vue](../src/views/data-center/download/components/MemberReportTable.vue)

### 行為規格（Acceptance Criteria）

#### A. 門市權限定期報表搜尋

1. 使用 store 角色進入「報表下載區 → 定期報表 → 會員報表」。
2. 選擇門市與年份後，點擊搜尋。
3. 系統必須觸發對應的報表載入流程並呼叫 API 取得資料。
4. 若無法取得 brand_id（例如門市清單缺少 brand_id 且頁面 brand_id 也不可用），必須顯示提示訊息，不可靜默失敗。

#### B. 門市權限會員報表列表顯示

1. 若該品牌/門市已開通會員卡功能：

- 列表應顯示報表資料；若無資料則顯示「無資料」。

1. 若未開通：

- 顯示 warningDescript。

1. membershipInfo 由父層非同步更新後：

- 父層需重新計算 memberAuth，狀態不可卡在舊值。

### 測試建議

1. store 角色：

- 切換不同門市，確認 brand_id 會被補齊並能成功搜尋。

1. brand/admin 角色：

- 確認既有行為不受影響（仍以品牌篩選搜尋）。

1. 開通/未開通兩種帳號：

- 開通：看到列表或無資料
- 未開通：看到 warning

# BDMS-報表

## 需求概述

- 背景：BDMS 為主要管理後台，現行 ECMS 報表功能分散於多處（週報表、月報表、行銷報表等），需手動切換系統下載，且不同報表欄位不一致、無法即時監控產出狀態。
- 目的：整合所有報表功能至整合進 BDMS 分析與報表模組。

## 功能架構

```cmd
數據分析
├── 數據概覽 (不可變更時間)
│ ├── 營運
│ ├── 商品
│ ├── 會員
│
├── 趨勢分析 (可篩選時間範圍)
│ ├── 訂單 (訂單趨勢、訂單明細)
│ ├── 商品 (商品排名、套餐排名)
│ └── 系統 (系統使用率) 🔒 Store 權限隱藏
│
報表中心
├── 自訂報表（營運分析、會員分析）
├── 定期報表（週報表 🔒、月報表 🔒、會員報表）
└── 報表下載區
    ├── 自訂報表
    └── 定期報表（週報表 🔒、月報表 🔒、會員報表）
```

**權限控制說明**（2026-01-14 新增）：

本系統根據使用者角色（Admin、Brand、Store）控制部分功能的可見性：

| 權限角色 | 可見功能範圍 |
|---------|-------------|
| **Admin** | 所有功能 |
| **Brand** | 所有功能 |
| **Store** | 除以下功能外的所有功能：<br>- 趨勢分析 > 系統使用率<br>- 定期報表 > 週報表<br>- 定期報表 > 月報表<br>- 報表下載區 > 週報表<br>- 報表下載區 > 月報表 |

🔒 圖例：標記為 🔒 的功能僅對 Admin 和 Brand 角色開放，Store 角色不可見。

### 功能說明

1. BDMS 資訊架構調整
    1. 模組名稱調整：
       - 原「分析與報表」改為【數據分析】
       - 原「統計報表」整合至【報表中心】
       - 儀表板改為【數據概覽】
    2. 模組選單層級及順序：
       - 數據分析
         - 數據概覽（原儀表板）
         - 趨勢分析
       - 報表中心（含原統計報表功能）
         - 自訂報表
         - 定期報表
         - 報表下載區
    3. 架構說明：
       - 「數據分析」和「報表中心」為獨立的第一層級模組
       - 「報表中心」放置於「數據分析」下方（第二順位）
       - 原「報表中心」下的三個子功能（自訂報表、定期報表、報表下載區）移至新的「報表中心」模組下
2. ECMS 比照現折活動方式處理，顯示提醒並將功能disabled，提醒文案如下
    1. 週報表/月報表：報表模組已搬至「 新後台管理系統 > 分析與報表 > 報表中心 > 報表下載紀錄  」，請至新後台管理系統操作、檢視相關內容，此區域(舊後台)功能即將關閉。
    2. 營運報表/系統使用率：報表模組已搬至「 新後台管理系統 > 分析與報表> 報表中心 > 趨勢分析  」，請至新後台管理系統操作、檢視相關內容，此區域(舊後台)功能即將關閉。

#### 數據概覽

1. 功能說明：顯示商品銷售相關數據，包含固定週期排行與可自訂時間範圍的排名圖表
2. 導覽層級：數據分析 > 數據概覽
3. 類型：商品分析
4. 調整：
    1. 儀表板名稱改為【數據概覽】，新增tab可查看不同類型分析。
    2. 商品分析：原功能【商品銷售報表】區塊位置移動至此。原功能為（單一商品銷售總份數排行 TOP3、單一門市商品銷售總份數 TOP3、商品銷售排名 TOP5）移動至數據概覽(商品分析)，UI與現行一樣。

##### 商品銷售概覽元件

**檔案位置**：`src/views/data-center/sales/index.vue`

**使用 API**：

- `productStatistic.compareWeekProductRank()` - 取得單一商品銷售總份數排行 TOP3（週比較）
- `productStatistic.compareWeekStoreRank()` - 取得單一門市商品銷售總份數 TOP3（週比較）
- `productStatistic.salesProductRank()` - 取得商品銷售排名 TOP5（支援自訂日期範圍）

**功能說明**：

1. **單一商品銷售總份數排行 TOP3**
   - 固定顯示上週與上上週的比較數據
   - 顯示成長率或持平/新進榜狀態
   - 依據 brandId 和 storeId 進行篩選

2. **單一門市商品銷售總份數 TOP3**
   - 固定顯示上週與上上週的比較數據
   - 顯示成長率或持平/新進榜狀態
   - 依據 brandId 和 storeId 進行篩選

3. **商品銷售排名 TOP5**
   - 支援時間範圍篩選：今日、前3日、前7日、自訂
   - 使用 v-chip-group 切換時間範圍
   - 橫向長條圖顯示商品銷售數量
   - 自訂日期功能：
     - 點擊「自訂」標籤開啟日期選擇彈窗
     - 使用 Dialog 元件（`@/components/dialog`）
     - 使用 nd-datetime 元件（`@/components/date-select`）選擇日期
     - 日期範圍限制：最多查詢 90 天（三個月）
     - 開始日期最大值為今日
     - 結束日期最大值為今日或開始日期+90天（取較小值）
     - 確認按鈕：驗證日期範圍後更新圖表
     - 取消按鈕：關閉彈窗並恢復至先前選擇的時間範圍

**彈窗實作細節**：

```vue
<!-- 自訂日期彈窗 -->
<Dialog
  :showDialog="modal.show"
  :dialogTitle="modal.title"
  :dialogWidth="modal.size"
  :close="false"
  @update:showDialog="handleDialogToggle"
>
  <div class="nd-font-size-body mb-4">請選擇日期，限查詢三個月</div>

  <div class="d-flex align-items-center">
    <nd-datetime
      v-model="modal.startDate"
      :max="modal.endDate || maxStartDate"
      class="flex-grow-1"
    />
    <span class="mx-3">-</span>
    <nd-datetime
      v-model="modal.endDate"
      :min="modal.startDate"
      :max="maxEndDateForModal"
      class="flex-grow-1"
    />
  </div>

  <template #footer>
    <div class="d-flex justify-content-end">
      <v-btn outlined color="primary" class="px-8" @click="cancelCustomRange">
        取消
      </v-btn>
      <v-btn color="primary" class="px-8 ml-3" @click="confirmCustomRange">
        確認
      </v-btn>
    </div>
  </template>
</Dialog>
```

**日期範圍切換邏輯**：

```javascript
// 監聽 dateRange.type 變化
'dateRange.type'(val, oldVal) {
  if (val === 99) {
    // 選擇自訂時開啟彈窗
    this.modal.previousType = typeof oldVal === 'number' ? oldVal : 1
    this.modal.startDate = this.dateRange.start_date || this.$moment().toISOString()
    this.modal.endDate = this.dateRange.end_date || this.$moment().toISOString()
    this.$nextTick(() => {
      this.modal.show = true
    })
  } else {
    // 選擇其他選項時更新圖表
    this.modal.show = false
    this.getBarChart()
  }
}
```

**API 參數**：

```javascript
// 商品銷售排名 TOP5
{
  date_mode: 1 | 2 | 3 | 99,  // 1: 今日, 2: 前3日, 3: 前7日, 99: 自訂
  brand_id: 'brand_id',       // 可選
  store_id: 'store_id',       // 可選
  start_date: 'YYYY-MM-DD',   // date_mode=99 時必填
  end_date: 'YYYY-MM-DD'      // date_mode=99 時必填
}
```

**狀態管理**：

- `modal.previousType`：記錄切換至自訂前的時間範圍類型，用於取消時恢復
- `modal.closingByAction`：標記是否由確認/取消按鈕關閉，避免觸發額外的恢復邏輯
- 使用 `$nextTick()` 確保 DOM 更新後再開啟彈窗

#### 趨勢分析

1. **功能說明**：查看時間範圍內的趨勢分析，支援品牌/門市篩選與時間區間選擇。
2. **導覽層級**：數據分析 > 趨勢分析
3. **實作方式**：使用 Tab 切換（訂單、商品、系統），採用 `v-if` 條件渲染，確保圖表在頁籤可見時才初始化，避免尺寸計算錯誤。
4. **共用篩選條件**：
   - 品牌／門市選擇（`nd-select-brand-store`）
     - 權限顯示規則（2026-01-19 更新）：
       - **Brand 權限**：品牌下拉只顯示該帳號被授權的品牌；門市下拉僅顯示該品牌底下、且帳號被授權的門市（避免顯示未授權資料）。
       - **Store 權限**：僅顯示門市下拉（品牌下拉隱藏）；門市清單僅顯示該帳號被授權的門市。
     - 範圍限縮（2026-01-19 更新）：上述權限過濾**僅套用在趨勢分析頁**，其餘頁面維持既有元件行為。
       - `nd-select-brand-store` 新增開關 `usePermissionScope`（預設 `false`）。
       - 趨勢分析頁會傳入 `usePermissionScope=true` 以啟用「只顯示授權範圍」的選項邏輯。
   - 時間區間（由各子組件的 DateRangeFilter 元件提供）
5. **功能模組**：

**實作位置**（2026-01-19 更新）：

- `src/views/data-center/trend/index.vue`：
  - `nd-select-brand-store` 傳入 `usePermissionScope=true`
  - Store 權限下隱藏品牌下拉（僅顯示門市）
- `src/components/nd-select-brand-store/index.vue`：
  - 新增 props：`usePermissionScope`（預設 `false`）
  - 啟用時：Brand/Store 權限優先使用 `store.state.user.brand/store` 作為選項來源，必要時再回退既有 API 行為以避免清單為空

##### 1. 訂單趨勢

**檔案位置**：`src/views/data-center/trend/order.vue`

**使用 API**：

- `statistic.orderSummary()` - 取得訂單趨勢資料（每日/每月統計）
- `statistic.orderSummarySheets()` - 下載訂單趨勢報表（Excel）

**功能說明**：

- **訂單趨勢圖表**
  - 圖表類型：雙軸圖（長條圖 + 折線圖）
  - 左 Y 軸（長條圖）：訂單總額（千元）
  - 右 Y 軸（折線圖）：訂單總數
  - X 軸：日期（MM/DD）或月份（YYYY/M）
  - 統計頻率切換：每日統計 / 每月統計
  - 圖表庫：@antv/g2 v4
  - 下載功能：下載圖表為 PNG 圖片

- **訂單分析表格**
  - 表格欄位：
    - 日期
    - 已接單訂單總數
    - 自取訂單數
    - 外送訂單數
    - 內用-桌邊掃碼訂單數（包含內用 + 桌邊掃碼兩種訂單）
    - 已接單訂單總金額
    - 退訂訂單總數
    - 退訂訂單總金額
  - 表格元件：nd-data-table
  - 下載功能：下載報表為 Excel

**API 參數**：

```javascript
{
  list_type: 'daily' | 'monthly' | 'daily_group_by_month',  // 統計頻率
  return_type: 'all',               // 回傳類型
  start_date: 'YYYYMMDD' | 'YYYYMM', // 起始日期（需轉換格式，daily 為 YYYYMMDD，monthly 為 YYYYMM）
  end_date: 'YYYYMMDD' | 'YYYYMM',   // 結束日期（需轉換格式，daily 為 YYYYMMDD，monthly 為 YYYYMM）
  brand_ids: 'brand_id',           // 品牌 ID（字串）
  store_ids: 'store_id'            // 門市 ID（字串）
}
```

**日期範圍與頻率自動切換機制**：

- **DateRangeFilter 元件**（`src/views/data-center/trend/components/DateRangeFilter.vue`）：
  - 快速選擇按鈕：
    - 「近七天」按鈕 → 自動設定 `frequency: 'daily'`
    - 「近一個月」按鈕 → 自動設定 `frequency: 'monthly'`
    - 手動選擇日期 → 自動設定 `frequency: 'daily_group_by_month'`
  - `emitChange()` 方法會傳遞 `{ startDate, endDate, dateRangeText, frequency }` 給父組件
  - 日期格式標準化：
    - 內部使用 `formatDateToYYYYMMDD()` 方法處理 ISO 格式日期
    - 將 `2025-12-01T00:00:00.000+08:00` 自動轉換為 `YYYY-MM-DD`
    - 確保傳出的日期格式統一為 `YYYY-MM-DD`

- **order.vue 元件**：
  - **UI/API 頻率分離機制**（2026-01-13 更新）：
    - 新增 `apiListType` data：實際送給 API 的 list_type 參數
    - 新增 `displayFrequency` computed：UI 按鈕顯示的頻率狀態
      - 當 `apiListType === 'daily_group_by_month'` 時，返回 `'daily'`
      - 其他情況返回 `frequency` 本身
    - 新增 `dateFormatFrequency` computed：日期格式化時使用的頻率
      - 當 `apiListType === 'monthly'` 時，返回 `'monthly'`
      - 其他情況返回 `'daily'`
    - 統計頻率按鈕綁定 `displayFrequency` 而非 `frequency`
      - 確保自訂日期時「每日訂單」按鈕保持 active 狀態
  - **自訂日期映射至每日按鈕**：
    - `onDateRangeChange()` 接收 `frequency: 'daily_group_by_month'` 時：
      - 設定 `this.frequency = 'daily'`（UI 顯示每日）
      - 設定 `this.apiListType = 'daily_group_by_month'`（API 使用自訂日期模式）
    - 其他快速選擇時：
      - 同時設定 `this.frequency` 和 `this.apiListType` 為相同值
  - **手動切換頻率處理**：
    - 新增 `handleFrequencyClick(value)` 方法處理按鈕點擊
    - 同步更新 `frequency` 和 `apiListType` 為相同值
    - 重置分頁至第一頁
  - **daily_group_by_month 資料攤平**（2026-01-13 更新）：
    - 新增 `getDateEntries()` 方法處理不同 list_type 的資料結構
    - 當 `apiListType === 'daily_group_by_month'` 時：
      - API 回傳巢狀結構：`{ "2022-02": { "2022-02-27": {...}, "2022-02-28": {...} }, "2022-03": {...} }`
      - 攤平為陣列：`[{ dateKey: "2022-02-27", data: {...} }, { dateKey: "2022-02-28", data: {...} }, ...]`
    - 其他 list_type 維持原邏輯：`{ "2022-02-27": {...}, "2022-02-28": {...} }`
    - `processChartData()` 和 `processTableData()` 統一使用 `getDateEntries()` 取得日期列表
  - 使用 `isUpdating` flag 機制避免重複呼叫 API：
    1. 設定 `isUpdating = true` 暫停 watch 監聽
    2. 批次更新所有狀態（dateRangeText、frequency、apiListType、filters）
    3. 使用 `$nextTick()` 確保所有狀態更新完成後
    4. 重置 `isUpdating = false` 並只呼叫一次 `loadData()`
  - watch 機制：
    - `frequency`、`apiListType` 和 `filters` 都有 watch 監聽
    - watch 內部會檢查 `isUpdating` flag
    - 只有在非批次更新期間才觸發 `loadData()`
  - 日期格式處理：
    - apiParams computed 使用 `apiListType` 而非 `frequency`
    - 使用 `dateFormatFrequency` 決定日期格式（YYYYMMDD 或 YYYYMM）
    - 統一處理 ISO 格式日期：使用 `split('T')[0]` 提取 `YYYY-MM-DD`

**日期格式轉換邏輯**：

```javascript
// apiParams computed 屬性
// 處理 ISO 格式日期（如 2025-12-01T00:00:00.000+08:00）
if (this.filters.startDate) {
  const startDateOnly = this.filters.startDate.split('T')[0]  // 提取 YYYY-MM-DD
  if (this.frequency === 'monthly') {
    // YYYY-MM-DD -> YYYYMM (取年月)
    params.start_date = startDateOnly.substring(0, 7).replace(/-/g, '')
  } else {
    // YYYY-MM-DD -> YYYYMMDD (移除連字號)
    params.start_date = startDateOnly.replace(/-/g, '')
  }
}
if (this.filters.endDate) {
  const endDateOnly = this.filters.endDate.split('T')[0]  // 提取 YYYY-MM-DD
  if (this.frequency === 'monthly') {
    // YYYY-MM-DD -> YYYYMM (取年月)
    params.end_date = endDateOnly.substring(0, 7).replace(/-/g, '')
  } else {
    // YYYY-MM-DD -> YYYYMMDD (移除連字號)
    params.end_date = endDateOnly.replace(/-/g, '')
  }
}
```

**資料處理**：

- API 回傳格式：`response.list` 為物件，key 為日期（YYYY-MM-DD 或 YYYY-MM）
- 圖表資料格式化：將日期轉換為 MM/DD 或 YYYY/M 顯示
- 表格資料排序：最新日期在前（倒序）
- 內用訂單數計算：`order_amount_dinein + order_amount_qrcode_dinein`（合併兩種內用訂單類型）

##### 2. 商品排名

**檔案位置**：`src/views/data-center/trend/product.vue`

**使用 API**：

- `productStatistic.salesRank()` - 取得商品/套餐/配料 TOP N（支援日期篩選）

**使用元件**：

- `DateRangeFilter` - 日期範圍篩選器
- `nd-tooltip` - 提示文字元件

**功能說明**：

- **商品排名 Top 10**
  - 顯示欄位：
    - `#` - 排名（1-10）
    - `品牌` - 品牌名稱（`brand_name`）
    - `商品名稱` - 商品名稱（`name`）
    - `銷售比例` - 銷售佔比進度條 + 百分比（`percentage`），附 tooltip「此商品銷量佔所有商品多少比例」
    - `銷售件數` - 銷售數量（`sale_amount`），附 tooltip「總共銷售出的商品數量」
  - 使用 `product_type: 1` 參數取得商品排名資料
  
- **套餐排名 Top 10**
  - 顯示欄位：
    - `#` - 排名（1-10）
    - `品牌` - 品牌名稱（`brand_name`）
    - `商品名稱` - 套餐名稱（`name`）
    - `銷售比例` - 銷售佔比進度條（綠色）+ 百分比（`percentage`），附 tooltip「此商品銷量佔所有套餐多少比例」
    - `銷售件數` - 銷售數量（`sale_amount`），附 tooltip「總共銷售出的套餐數量」
  - 使用 `product_type: 2` 參數取得套餐排名資料

**日期範圍限制**（2026-01-14 新增）：

- 日期範圍限制：最多查詢 90 天（三個月）
- 當起始日期變更時，若結束日期超過起始日加 89 天，自動調整結束日期
- 當結束日期變更時，若超過起始日加 89 天，自動調整起始日期
- 當從「訂單/系統」切換至「商品」頁籤時，若目前日期區間超過 90 天，會自動將 `end_date` 調整為 `start_date + 89 天`，避免商品排名 API 因超過查詢範圍而回傳錯誤
- 實作位置：
  - `src/views/data-center/trend/product.vue`：`onDateRangeChange()` 方法、`filters.startDate` / `filters.endDate` watch 監聽器
  - `src/views/data-center/trend/index.vue`：`switchTab()` 切換至 `product` 時進行日期區間修正（clamp）
- 實作邏輯：

  ```javascript
  // 在 onDateRangeChange 方法中檢查日期範圍
  if (startDate && endDate) {
    const ninetyDaysAfter = this.$moment(startDate).add(89, 'days').format('YYYY-MM-DD')
    if (this.$moment(endDate).isAfter(ninetyDaysAfter)) {
      endDate = ninetyDaysAfter
    }
  }
  
  // 監聽 filters.startDate 變化
  'filters.startDate'(val) {
    if (this.filters.endDate && val) {
      const ninetyDaysAfter = this.$moment(val).add(89, 'days').format('YYYY-MM-DD')
      if (this.$moment(this.filters.endDate).isAfter(ninetyDaysAfter)) {
        this.$emit('update:filters', {
          ...this.filters,
          endDate: ninetyDaysAfter,
        })
      }
    }
  }
  ```

**API 參數**：

```javascript
{
  product_type: 1 | 2 | 3,  // 1: 商品, 2: 套餐, 3: 配料
  topn: 10,                  // 取得前 N 名
  start_date: 'YYYY-MM-DD',  // 起始日期
  end_date: 'YYYY-MM-DD',    // 結束日期（與起始日期間隔最多 90 天）
  brand_id: 'brand_id',      // 可選
  store_id: 'store_id'       // 可選
}
```

**資料處理**：

- 使用 `Promise.all()` 並行呼叫商品和套餐排名 API
- API 回傳 `list[]` 陣列，前端轉換為以下格式：

  ```javascript
  {
    name: item.name,               // 商品/套餐名稱
    brandName: item.brand_name,    // 品牌名稱
    percentage: item.percentage,   // 銷售佔比（百分比）
    saleAmount: item.sale_amount   // 銷售數量
  }
  ```

- 銷售比例由後端計算提供，前端直接使用
- 支援日期範圍篩選和品牌/門市篩選
- 進度條顏色：商品使用藍色（`#5b8ff9`），套餐使用綠色（`#5bc9bc`）

**實作範例**：

```javascript
// 並行請求商品和套餐排名
const [productResponse, comboResponse] = await Promise.all([
  productStatistic
    .removeALLParameters()
    .setParameters({ ...this.apiParams, product_type: 1, topn: 10 })
    .salesRank(),
  productStatistic
    .removeALLParameters()
    .setParameters({ ...this.apiParams, product_type: 2, topn: 10 })
    .salesRank(),
])

// 資料轉換
const rankings = list
  .slice(0, 10)
  .map(({ name, brand_name, percentage, sale_amount }) => ({
    name,
    brandName: brand_name,
    percentage: percentage || 0,
    saleAmount: sale_amount || 0,
  }))
```

##### 3. 系統使用率 🔒

**權限限制**：僅 Admin 和 Brand 角色可見，Store 角色隱藏此功能

**檔案位置**：`src/views/data-center/trend/system.vue`

**使用 API**：

- `statistic.operateApiSummary()` - 取得系統使用率資料（每日/每月統計）
- `statistic.operateApiSummarySheets()` - 下載系統使用率報表（Excel）

**功能說明**：

- **系統使用率圖表**
  - 圖表類型：多折線圖（3 條折線 + 散點）
  - 折線說明：
    - Order 系統（藍色 #5b8ff9）
    - CRM 系統（綠色 #5bc9bc）
    - Data 系統（粉色 #f987a6）
  - Y 軸：使用次數（≥1000 顯示為 K）
  - X 軸：日期（MM/DD）或月份（YYYY/M）
  - 統計頻率切換：每日統計 / 每月統計
  - 圖表庫：@antv/g2 v4
  - 圖例：自定義圖例（關閉內建圖例）
  - 下載功能：下載報表為 Excel

**API 參數**：

```javascript
{
  list_type: 'daily' | 'monthly',  // 統計頻率
  return_type: 'all',               // 回傳類型
  start_date: 'YYYYMMDD',          // 起始日期（需轉換格式）
  end_date: 'YYYYMMDD',            // 結束日期（需轉換格式）
  brand_ids: 'brand_id',           // 品牌 ID（字串）
  store_ids: 'store_id'            // 門市 ID（字串）
}
```

**資料處理**：

- API 回傳格式：`response.list` 為物件，key 為日期（YYYY-MM-DD 或 YYYY-MM）
- 圖表資料結構：

  ```javascript
  {
    date: '11/12',           // 格式化後的日期
    type: 'Order',           // 系統類型
    value: 1234              // 使用次數
  }
  ```

- 系統欄位對應：
  - `operate_api_order` → Order 系統
  - `operate_api_crm` → CRM 系統
  - `operate_api_data` → Data 系統

**圖表渲染優化**：

- 使用 `v-if` 條件渲染，避免隱藏狀態下初始化導致尺寸錯誤
- 資料更新時銷毀並重建圖表（`destroy()` + 重新 `new Chart()`）
- 使用 `autoFit: true` 自動適應容器尺寸
- 圖表高度：350px

**共同技術細節**：

- 日期格式轉換：前端傳送 YYYYMMDD 格式給 API，API 回傳 YYYY-MM-DD 或 YYYY-MM 格式
- 統計頻率判斷：根據 `frequency` 或日期字串長度判斷是每日（10 字元）或每月（7 字元）
- 圖表初始化時機：使用 `$nextTick()` 確保 DOM 已渲染
- 參數管理：使用 `removeALLParameters()` 清除舊參數，`setParameters()` 設定新參數

#### 報表中心

報表中心為獨立的第一層級模組，包含四個子功能頁面，透過側邊選單訪問各獨立頁面。

##### 1. 自訂報表

**功能說明**：由使用者主動設定篩選條件與欄位，生成報表（非系統排程產出）。

**導覽層級**：報表中心 > 自訂報表

**實作方式**：

- 入口頁面顯示報表類型卡片（營運分析、會員分析、行銷分析）
- 點擊卡片跳轉至對應的報表模組頁面
- 報表模組頁面包含側邊欄模板列表與主要報表內容區

**頁面架構**：

- **入口頁面** (`/report-center/custom`)
  - 品牌/門市篩選器（多品牌/多門市權限時顯示）
  - 報表類型卡片列表：
    - 營運分析（已實作）
    - 會員分析（規劃中）
    - 行銷分析（規劃中）
  - 點擊卡片後跳轉至對應路由，並傳遞 brand_id、store_id 參數

- **報表模組頁面** (`/report-center/custom/operation/:id?`)
  - 左側：模板列表側邊欄（新增、編輯、刪除模板）
  - 右側：報表內容區
    - 篩選條件設定（時間、品牌門市、金額、地址、商品等）
    - 欄位選擇（自訂報表欄位）
    - 儲存至模板按鈕
    - 輸出報表按鈕

**使用 API**：

- `analytics.templateList()` - 取得模板列表
- `analytics.templateInfo(id)` - 取得模板詳細資訊
- `analytics.templateCreate(data)` - 新增模板
- `analytics.templateEdit(id, data)` - 編輯模板
- `analytics.templateDelete(id)` - 刪除模板
- `analytics.export(data)` - 匯出營運分析報表

**路由配置**：

- 入口頁面：`/report-center/custom` (ReportCenterCustom)
- 營運分析：`/report-center/custom/operation/:id?` (ReportCenterCustomOperation)
- 會員分析：`/report-center/custom/member/:id?` (ReportCenterCustomMember)
- 行銷分析：`/report-center/custom/marketing/:id?` (ReportCenterCustomMarketing)

**Store 權限下拉選單實作**（2026-01-15 新增）：

為確保 Store 權限使用者能正確切換多門市，入口頁面實作了以下機制：

**檔案位置**：`src/views/data-center/report/index.vue`

**實作重點**：

1. **brand_id 推導機制**
   - Store 權限時，`nd-select-brand-store` 元件需要 `brand_id` 才能載入門市列表
   - 新增 `deriveBrandIdFromStore()` 方法從 `user.store` 陣列推導 `brand_id`
   - 在 `created` 生命週期中確保 Store 權限時 `brand_id` 有值

2. **門市切換同步**
   - 監聽 `store_id` 變化，自動同步更新對應的 `brand_id`
   - 確保 `routerQuery` 同時包含 `brand_id` 和 `store_id` 參數

**關鍵實作代碼**：

```javascript
// created 生命週期（2026-01-15 更新：確保門市預設選中）
created() {
  this.getBrandOptions()
  if ((!this.store_id || !this.brand_id) && this.roleType !== 'admin') {
    this.$store.dispatch('dataCenter/setDefault')
  }
  // store 權限：確保 brand_id 和 store_id 都有值，門市下拉預設選到第一筆
  if (this.roleType === 'store') {
    this.ensureStoreDefaults()
  }
  this.setQuery()
}

// 確保 Store 權限的預設值（2026-01-15 新增）
ensureStoreDefaults() {
  // 從 user.store 列表確保 store_id 和 brand_id 都有值
  const storeList = this.$store.state.user.store || []
  if (storeList.length > 0) {
    // 如果 store_id 為空，設定為第一個門市（確保下拉選單有預設值）
    if (!this.store_id) {
      this.store_id = storeList[0].store_id
    }
    // 如果 brand_id 為空，從選中的 store 推導
    if (!this.brand_id) {
      const selectedStore = storeList.find(
        (s) => s.store_id === this.store_id,
      )
      if (selectedStore && selectedStore.brand_id) {
        this.brand_id = selectedStore.brand_id
      } else if (storeList[0].brand_id) {
        // 找不到選中的 store，用第一個 store 的 brand_id
        this.brand_id = storeList[0].brand_id
      }
    }
  }
}

// store_id watcher - 切換門市時同步 brand_id
watch: {
  store_id(newVal) {
    if (this.roleType === 'store' && newVal) {
      const storeList = this.$store.state.user.store || []
      const selectedStore = storeList.find((s) => s.store_id === newVal)
      if (selectedStore && selectedStore.brand_id) {
        this.brand_id = selectedStore.brand_id
      }
    }
    this.setQuery()
  }
}
```

**nd-select-brand-store 元件優化**（2026-01-15 新增）：

**檔案位置**：`src/components/nd-select-brand-store/index.vue`

**問題說明**：

- Store 權限呼叫 `user/getStore` action 時，會用傳入的 `brand_id` 呼叫 `storeListBrief(brand_id)` API
- 門市帳號可能沒有該品牌的存取權限，導致 API 回傳錯誤碼 1602「此品牌不存在」

**解決方案**：

- Store 權限時直接使用 Vuex 中已存在的 `user.store` 列表（登入時已填充）
- Admin / Brand 權限維持原有邏輯，透過 API 取得門市列表

**修正代碼**：

```javascript
async changeBrandId(isFirst = false) {
  // 更改門市的品牌選單
  let brand_id = this.brand_id

  // 門市權限：直接使用 Vuex 中已存在的 user.store 列表，避免呼叫 API 造成權限錯誤
  if (this.roleType === 'store') {
    const existingStoreList = this.$store.state.user.store || []
    if (existingStoreList.length > 0) {
      this.storeOptions = existingStoreList
      return
    }
  }

  // Admin / Brand 權限：維持原有 API 呼叫邏輯
  let status = [1, 2]
  if (!brand_id && this.roleType === 'store' && this.brandOptions.length) {
    brand_id = this.brandOptions[0].brand_id
  }
  if (brand_id) {
    if (!isFirst && this.roleType !== 'store') {
      this.store_id = 0
    }
    if (this.showAllStore) {
      status = 0
    }
    let store_list = await this.$store.dispatch('user/getStore', {
      brand_id,
      status,
    })
    this.storeOptions = store_list
  }
}
```

##### 2. 定期報表

**功能說明**：由系統定期排程產出週期性報表（固定時間產出），提供下載與歷史紀錄查詢。

**導覽層級**：報表中心 > 定期報表

**實作方式**：

- 品牌/門市篩選器
- 報表卡片列表顯示（週報表、月報表、會員卡報表-點數、會員卡報表-優惠券）
- 每張卡片包含：報表名稱、排程時間、最後更新時間、下載按鈕、歷史紀錄按鈕

**頁面架構**：

- 頂部篩選區：
  - 品牌選擇器（使用 nd-select-brand-store 元件）
  - 門市選擇器（使用 nd-select-brand-store 元件）
  - 搜尋按鈕
  - 清除按鈕
- 報表卡片區（使用 v-for 渲染）：
  - 報表名稱
  - 排程時間（每週 03:00 / 每月1號 03:00 / 每月5號 03:00）
  - 最後更新時間
  - 操作按鈕：下載、歷史紀錄（可選）
- 歷史下載紀錄彈窗（v-dialog）：
  - 顯示可下載月份列表
  - 每個月份提供獨立下載按鈕
  - 下載連結過期提醒（5 分鐘）

**報表類型**：

| 報表名稱 | 排程時間 | 支援歷史 | API 方法 | 權限 |
|---------|---------|---------|----------|------|
| 週報表 🔒 | 每週 03:00 | ✓ | `brandWeeklyStatement` | Admin, Brand |
| 月報表 🔒 | 每月1號 03:00 | ✓ | `brandMonthlyStatement` | Admin, Brand |
| 會員卡報表-點數 | 每月5號 03:00 | ✗ | `membershipMonthlyPoint` | All |
| 會員卡報表-優惠券 | 每月5號 03:00 | ✗ | `membershipMonthlyCoupon` | All |

**權限控制實作**（2026-01-14 新增）：

在 `src/views/data-center/scheduled-report/index.vue` 中根據使用者角色過濾報表卡片：

```javascript
computed: {
  roleType() {
    return this.$store.state.user.roleType
  },
  visibleReportCards() {
    const isStore = this.roleType === 'store'
    if (isStore) {
      // Store 權限：過濾掉週報表和月報表
      return this.reportCards.filter(card => 
        !['weekly', 'monthly'].includes(card.type)
      )
    }
    return this.reportCards
  }
}
```

**使用 API**：

- `statistic.brandWeeklyStatement(brand_id, year)` - 取得品牌週報表下載資訊
- `statistic.brandMonthlyStatement(brand_id, year)` - 取得品牌月報表下載資訊
- `statistic.membershipMonthlyPoint()` - 取得會員卡點數月報表
- `statistic.membershipMonthlyCoupon()` - 取得會員卡優惠券月報表

**路由配置**：`/report-center/scheduled` (ReportCenterScheduled)

**Store 權限多門市切換實作**（2026-01-15 新增）：

**檔案位置**：`src/views/data-center/scheduled-report/index.vue`

**實作重點**：

1. **篩選器改為門市選擇器**
   - Store 權限時，篩選區顯示「門市」下拉選單（非品牌）
   - Admin / Brand 權限維持原有「品牌」下拉選單

2. **門市資料來源**
   - 直接使用 `this.$store.state.user.store` 陣列作為門市選項
   - 初始化時選擇第一個門市

3. **brand_id 推導**
   - 監聽 `filters.storeId` 變化，從選中的門市推導 `brand_id`
   - 確保 API 呼叫時帶入正確的 `brand_id`

4. **API 查詢參數**
   - 會員報表 API 需同時帶入 `brand_id` 和 `store_id`
   - Store 權限時，`store_id` 使用實際選中的門市 ID（字串格式）

**UI 結構變更**：

```vue
<!-- 篩選條件 -->
<div class="card card-custom gutter-b">
  <div class="card-body pb-0">
    <div class="row align-items-center">
      <!-- 品牌選擇器（非 store 權限） -->
      <div v-if="roleType !== 'store'" class="col-md-4">
        <div class="form-group">
          <label class="nd-font-size-body">品牌</label>
          <v-autocomplete
            v-model="filters.brandId"
            :items="brandOptions"
            ...
          />
        </div>
      </div>
      <!-- 門市選擇器（store 權限） -->
      <div v-if="roleType === 'store'" class="col-md-4">
        <div class="form-group">
          <label class="nd-font-size-body">門市</label>
          <v-autocomplete
            v-model="filters.storeId"
            :items="storeOptions"
            item-text="name"
            item-value="store_id"
            ...
          />
        </div>
      </div>
    </div>
  </div>
</div>
```

**資料結構**：

```javascript
data() {
  return {
    filters: {
      brandId: null,
      storeId: null,  // 新增
    },
    brandOptions: [],
    storeOptions: [],  // 新增
  }
}
```

**關鍵實作代碼**：

```javascript
// 初始化篩選器
initFilters() {
  if (this.roleType === 'brand' && this.brandOptions.length) {
    this.filters.brandId = this.brandOptions[0].brand_id
  } else if (this.roleType === 'store') {
    // user.store 是陣列，不是物件
    const storeList = this.$store.state.user.store || []
    this.storeOptions = storeList
    if (storeList.length > 0) {
      this.filters.storeId = storeList[0].store_id
      this.filters.brandId = storeList[0].brand_id
    }
  }
}

// 監聽門市切換，同步 brand_id
watch: {
  'filters.storeId': {
    handler(newVal) {
      if (newVal && this.roleType === 'store') {
        // 從選中的 store 推導 brand_id
        const selectedStore = this.storeOptions.find((s) => s.store_id === newVal)
        if (selectedStore && selectedStore.brand_id) {
          this.filters.brandId = selectedStore.brand_id
        }
        this.fetchLatestUpdateTimes()
      }
    },
  },
}

// API 查詢參數組裝
getApiQuery(reportKey) {
  const currentYear = new Date().getFullYear()

  if (['weekly', 'monthly'].includes(reportKey)) {
    return {
      brand_id: this.filters.brandId,
      year: currentYear,
    }
  }

  // 會員報表：store 權限時帶入 store_id
  const query = {
    brand_id: this.filters.brandId,
    store_id: '0',
    page: 1,
    size: 10,
  }
  if (this.roleType === 'store' && this.filters.storeId) {
    query.store_id = String(this.filters.storeId)
  }
  return query
}

// 傳遞 store_id 給 mixin
async fetchLatestUpdateTimes() {
  if (!this.filters.brandId) return

  try {
    const excludeReports =
      this.roleType === 'store' ? ['weekly', 'monthly'] : []

    // 組裝查詢參數
    const params = { brand_id: this.filters.brandId }
    if (this.roleType === 'store' && this.filters.storeId) {
      params.store_id = String(this.filters.storeId)
    }

    const lastUpdates = await this.loadAllReportLastUpdate(
      params,
      { excludeReports },
    )
    
    // 更新報表卡片的最後更新時間 ...
  } catch (error) {
    console.error('Failed to fetch latest update times:', error)
  }
}
```

**report-loader.mixin.js 更新**（2026-01-15 新增）：

**檔案位置**：`src/mixins/report-loader.mixin.js`

**修正內容**：支援外部傳入 `store_id` 參數給會員報表 API

```javascript
// 會員點數報表
async loadMembershipMonthlyPoint(params) {
  try {
    const query = {
      page: 1,
      size: 20,
      brand_id: params.brand_id,
      store_id: params.store_id || '0',  // 支援外部傳入
    }
    
    const data = await statistic
      .removeALLParameters()
      .setParameters(query)
      .membershipMonthlyPoint()
    // ...
  }
}

// 會員優惠券報表
async loadMembershipMonthlyCoupon(params) {
  try {
    const query = {
      page: 1,
      size: 20,
      brand_id: params.brand_id,
      store_id: params.store_id || '0',  // 支援外部傳入
    }
    
    const data = await statistic
      .removeALLParameters()
      .setParameters(query)
      .membershipMonthlyCoupon()
    // ...
  }
}

// 批量載入報表更新時間
async loadAllReportLastUpdate(params, options = {}) {
  const currentYear = new Date().getFullYear()
  const excludeReports = options.excludeReports || []

  try {
    const promises = []
    const reportKeys = []

    // 會員點數報表
    if (!excludeReports.includes('memberPoint')) {
      promises.push(
        statistic
          .removeALLParameters()
          .setParameters({
            brand_id: params.brand_id,
            store_id: params.store_id || '0',  // 支援外部傳入
            page: 1,
            size: 1,
          })
          .membershipMonthlyPoint()
          .catch(() => null)
      )
      reportKeys.push('memberPoint')
    }

    // 會員優惠券報表（同上）
    if (!excludeReports.includes('memberCoupon')) {
      promises.push(
        statistic
          .removeALLParameters()
          .setParameters({
            brand_id: params.brand_id,
            store_id: params.store_id || '0',  // 支援外部傳入
            page: 1,
            size: 1,
          })
          .membershipMonthlyCoupon()
          .catch(() => null)
      )
      reportKeys.push('memberCoupon')
    }
    
    // ...
  }
}
```

**重要說明**：

- 下載連結為 AWS S3 簽章 URL，有效期限為 5 分鐘（300 秒）
- 每個月 5 號產出前一個月的報表
- API 延遲較長，需顯示 Loading 提示
- 會員報表 API 的 `store_id` 必須使用字串格式（如 `'0'` 或 `'123'`），因為 `proxy-base.js` 會過濾掉數字 `0`

##### 3. 報表下載區

**功能說明**：集中顯示所有報表（自訂＋定期）的下載紀錄，提供下載與狀態追蹤。

**導覽層級**：報表中心 > 報表下載紀錄

**實作方式**：

- 使用雙層 Tab 切換：
  - 第一層：使用 v-tabs 元件（自訂報表 / 定期報表）
  - 第二層（定期報表）：使用 nd-tab 元件（週報表 🔒 / 月報表 🔒 / 會員報表），支援權限控制
- 表格使用 nd-data-table 元件顯示下載紀錄
- 定期報表支援品牌和年份篩選器
- 使用者需點擊「搜尋」按鈕後才會呼叫 API 載入資料（不自動載入）
- 品牌自動選擇第一筆資料（初始化時）
- 父組件集中處理 API 呼叫，子組件負責資料呈現
- 週報表支援分頁顯示，每頁 10 筆

**頁面架構**（2026-01-14 更新權限控制）：

- 主要 Tab 切換區（使用 v-tabs 元件）：
  - 自訂報表 Tab
  - 定期報表 Tab
- 定期報表子 Tab 切換區（使用 nd-tab 元件，**支援權限控制**）：
  - 週報表 Tab 🔒 (Admin/Brand only)
  - 月報表 Tab 🔒 (Admin/Brand only)
  - 會員報表 Tab (All)
- 定期報表篩選區（品牌、年份）：
  - 品牌選擇器（使用 v-autocomplete 元件）
  - 年份選擇器（使用 v-select 元件）
  - 搜尋按鈕：觸發資料載入
  - 清除按鈕：清空篩選條件並清除已載入的資料
- 報表列表表格：
  - 自訂報表：報表名稱、報表類型、建立時間、狀態、進度條、操作（下載/重試）
  - 週報表：日期範圍、報表類型、建立時間、操作（下載） 🔒
  - 月報表：月份、報表類型、建立時間、操作（下載） 🔒
  - 會員報表：月份、報表類型（點數/優惠券）、建立時間、操作（下載/明細）

**權限控制實作**（2026-01-14 新增）：

在 `src/views/data-center/download/index.vue` 中根據使用者角色過濾 Tab：

```javascript
data() {
  return {
    subTabs: [
      { 
        id: 0, 
        value: 'weekly', 
        name: '週報表', 
        show: true,
        roleAccess: ['admin', 'brand'] // 🔒 權限標註
      },
      { 
        id: 1, 
        value: 'monthly', 
        name: '月報表', 
        show: true,
        roleAccess: ['admin', 'brand'] // 🔒 權限標註
      },
      { 
        id: 2, 
        value: 'member', 
        name: '會員報表', 
        show: true,
        roleAccess: ['admin', 'brand', 'store'] // 全權限
      },
    ],
  }
},
computed: {
  roleType() {
    return this.$store.state.user.roleType
  },
  visibleSubTabs() {
    return this.subTabs.filter(tab => 
      tab.show && (!tab.roleAccess || tab.roleAccess.includes(this.roleType))
    )
  }
}
```

**頁面架構**：

- 主要 Tab 切換區（使用 v-tabs 元件）：
  - 自訂報表 Tab
  - 定期報表 Tab
- 定期報表子 Tab 切換區（使用 nd-tab 元件）：
  - 週報表 Tab
  - 月報表 Tab
  - 會員報表 Tab
- 定期報表篩選區（品牌、年份）：
  - 品牌選擇器（使用 v-autocomplete 元件）
  - 年份選擇器（最近7年，預設當年，使用 v-autocomplete 元件）
  - 搜尋按鈕：點擊後才呼叫 API 載入資料
  - 清除按鈕：清空篩選條件並清除已載入的資料
- 報表列表表格：
  - 自訂報表：報表名稱、報表類型、建立時間、狀態、進度條、操作（下載/重試）
  - 週報表：報表名稱、建立時間、操作（下載）
  - 月報表：月份、建立時間、操作（下載）
  - 會員報表：月份、報表類型（點數/優惠券）、建立時間、操作（下載/明細）

**元件架構**：

```cmd
index.vue (父組件)
├── CustomReportTable.vue (自訂報表)
│   └── 內部處理 analytics API
└── 定期報表
    ├── WeeklyReportTable.vue (週報表)
    ├── MonthlyReportTable.vue (月報表)
    └── MemberReportTable.vue (會員報表)
```

**資料流向**：

父組件（index.vue）：

- 統一處理所有定期報表的 API 呼叫
- 點擊「搜尋」按鈕或切換子 Tab 時觸發資料載入
- 透過 props 將資料傳遞給子組件：
  - `weeklyReportData` → WeeklyReportTable
  - `monthlyReportData` → MonthlyReportTable
  - `memberReportData` → MemberReportTable

子組件：

- 接收 `reportData` 和 `loading` props
- 負責資料呈現和使用者互動
- 週報表元件內部實作分頁邏輯（使用 computed 切割資料）
- 下載功能使用 `downloadFile` service

**使用 API**：

自訂報表（CustomReportTable 內部呼叫）：

- `analytics.exportLogList(loading)` - 取得營運分析匯出紀錄列表
- `analytics.exportRetry(id)` - 重試匯出營運分析

定期報表（index.vue 統一呼叫）：

- `statistic.brandWeeklyStatement({ brand_id, year })` - 取得品牌週報表
- `statistic.brandMonthlyStatement({ brand_id, year })` - 取得品牌月報表
- `statistic.membershipMonthlyPoint({ page: 1, size: 10, brand_id, store_id: '0' })` - 取得會員點數月報表（使用字串 '0' 查詢品牌整體報表，前端實作分頁切割）
- `statistic.membershipMonthlyCoupon({ page: 1, size: 10, brand_id, store_id: '0' })` - 取得會員優惠券月報表（使用字串 '0' 查詢品牌整體報表，前端實作分頁切割）

**重要說明**：

- 會員報表 API 的 `store_id` 必須使用字串格式 `'0'` 而非數字 `0`，因為 proxy-base.js 的 `getParameterString()` 方法會過濾掉值為數字 `0` 的參數
- 會員報表在前端使用 `slice()` 方法實作分頁邏輯，每頁預設顯示 10 筆資料

**資料結構**：

週報表：

```javascript
{
  name: '2024-12-30 ~ 2025-01-05', // 日期範圍格式 (起始日期 ~ 結束日期)
  start_date: '2024-12-30',         // 起始日期
  week: 1,                          // 週次
  create_time: '2024/01/31 23:59:59',
  file_url: 'https://...'
}
```

月報表：

```javascript
{
  month: '2024-01',
  create_time: '2024/01/31 23:59:59',
  file_url: 'https://...'
}
```

會員報表（點數與優惠券合併）：

```javascript
// 單筆資料格式
{
  month: '2024-01',
  type: 1, // 1:點數, 2:優惠券
  create_time: '2024/01/31 23:59:59',
  file_url: 'https://...',
  more_files: []
}

// 資料處理邏輯
// 1. 並行呼叫 membershipMonthlyPoint 和 membershipMonthlyCoupon API
// 2. 合併兩個 API 的 list 陣列
// 3. 依 month 欄位進行降冪排序（最新月份在前）
// 4. 傳遞給 MemberReportTable 元件顯示
```

**路由配置**：`/report-center/downloads` (ReportCenterDownloads)

---

## 路由架構實作

### 路由層級結構

根據功能架構，路由規劃如下：

```plaintext
/analytics (數據分析)
├── /overview (數據概覽)
└── /trend (趨勢分析)
    ├── /order (訂單趨勢)
    ├── /product (商品排名)
    └── /system (系統使用率)

/report-center (報表中心)
├── /custom (自訂報表)
│   ├── /operation/:id? (營運分析)
│   ├── /member/:id? (會員分析)
│   └── /marketing/:id? (行銷分析)
├── /scheduled (定期報表)
└── /downloads (報表下載紀錄)
```

### 路由對照表

| 功能模組         | 新路由路徑                                    | 原路由路徑                          | Route Name                    |
| ---------------- | --------------------------------------------- | ----------------------------------- | ----------------------------- |
| **數據概覽**     | `/analytics/overview`                         | `/data-center/dashboard`            | AnalyticsOverview             |
| **趨勢分析**     | `/analytics/trend`                            | -                                   | AnalyticsTrend                |
| 訂單趨勢         | `/analytics/trend/order`                      | -                                   | AnalyticsTrendOrder           |
| 商品排名         | `/analytics/trend/product`                    | `/data-center/sales`                | AnalyticsTrendProduct         |
| 系統使用率       | `/analytics/trend/system`                     | -                                   | AnalyticsTrendSystem          |
| **自訂報表**     | `/report-center/custom`                       | `/data-center/report`               | ReportCenterCustom            |
| 營運分析         | `/report-center/custom/operation/:id?`        | `/data-center/report/operation/:id?` | ReportCenterCustomOperation   |
| 會員分析         | `/report-center/custom/member/:id?`           | `/data-center/report/member/:id?`    | ReportCenterCustomMember      |
| 行銷分析         | `/report-center/custom/marketing/:id?`        | `/data-center/report/marketing/:id?` | ReportCenterCustomMarketing   |
| **定期報表**     | `/report-center/scheduled`                    | -                                   | ReportCenterScheduled         |
| **報表下載紀錄** | `/report-center/downloads`                    | `/data-center/download`             | ReportCenterDownloads         |

### Meta 資訊設計

每個路由都包含以下 meta 資訊，用於權限控制與麵包屑導航：

```javascript
meta: {
  title: '頁面標題',          // 頁面標題
  module: 'analytics',        // 所屬模組
  subModule: 'overview',      // 所屬子模組 (overview/trend/reportCenter)
  type: 'custom',             // 報表類型 (custom/scheduled/downloads)
  category: 'order'           // 分類 (order/product/system/operation/member/marketing)
}
```

### 向下相容處理

所有舊路由 (`/data-center/*`) 皆透過 `redirect` 重定向至新路由，確保現有連結不會失效：

| 舊路由                                    | 重定向至                                      |
| ----------------------------------------- | --------------------------------------------- |
| `/data-center/dashboard`                  | `/analytics/overview`                         |
| `/data-center/sales`                      | `/analytics/overview`                         |
| `/data-center/sales/list`                 | `/analytics/overview`                         |
| `/data-center/sales/list/product/:id`     | `/analytics/overview`                         |
| `/data-center/report`                     | `/report-center/custom`                       |
| `/data-center/report/operation/:id?`      | `/report-center/custom/operation/:id?`        |
| `/data-center/report/member/:id?`         | `/report-center/custom/member/:id?`           |
| `/data-center/report/marketing/:id?`      | `/report-center/custom/marketing/:id?`        |
| `/data-center/download`                   | `/report-center/downloads`                    |

### 實作檔案

- **路由定義**: `/src/router/modules/data-center/index.js`
- **主路由配置**: `/src/router/index.js`
- **預設首頁**: 重定向至 `/analytics/overview`

---

## 權限控制實作

### 概述

本系統根據使用者角色（Admin、Brand、Store）控制功能可見性，部分功能僅對 Admin 和 Brand 角色開放。

### 權限類型

| 角色 | 代碼 | 權限範圍 |
|-----|------|---------|
| 系統管理員 | `admin` | 完整權限，可見所有功能 |
| 品牌管理員 | `brand` | 完整權限，可見所有功能 |
| 門市管理員 | `store` | 受限權限，部分功能隱藏 |

### Store 權限限制功能

以下功能對 Store 角色隱藏，僅 Admin 和 Brand 角色可見：

1. **趨勢分析 > 系統使用率** (`/analytics/trend/system`)
2. **定期報表 > 週報表** (報表卡片)
3. **定期報表 > 月報表** (報表卡片)
4. **報表下載區 > 週報表 Tab** (子 Tab)
5. **報表下載區 > 月報表 Tab** (子 Tab)

### 實作層級

#### 1. 選單層級控制

**檔案位置**：

- `/src/core/config/menu-admin.js` - Admin 選單（顯示所有功能）
- `/src/core/config/menu-brand.js` - Brand 選單（顯示所有功能）
- `/src/core/config/menu-store.js` - Store 選單（隱藏受限功能）

**實作方式**：

在 `menu-store.js` 中移除或隱藏特定選單項目：

```javascript
// src/core/config/menu-store.js
{
  id: 24,
  text: '趨勢分析',
  serverBuild: ['betadev', 'beta', 'preBeta', 'master'],
  name: 'AnalyticsTrend',
  mark: [
    'AnalyticsTrendOrder',
    'AnalyticsTrendProduct',
    // 'AnalyticsTrendSystem', // ❌ Store 權限移除
  ],
}
```

#### 2. 路由守衛控制

**檔案位置**：`/src/router/modules/data-center/index.js`

**實作方式**：

在路由 meta 中新增權限標註：

```javascript
// 趨勢分析 - 系統使用率
{
  path: '/analytics/trend/system',
  name: 'AnalyticsTrendSystem',
  component: () => import('@/views/data-center/trend/system'),
  meta: {
    title: '系統使用率',
    module: 'analytics',
    subModule: 'trend',
    category: 'system',
    roleAccess: ['admin', 'brand'], // 🔒 權限限制
  },
}
```

在路由守衛中檢查權限：

```javascript
// router/index.js 或 router/guards.js
router.beforeEach((to, from, next) => {
  const roleType = store.state.user.roleType
  const roleAccess = to.meta.roleAccess
  
  if (roleAccess && !roleAccess.includes(roleType)) {
    // 無權限訪問，重定向至首頁
    next({ name: 'AnalyticsOverview' })
    return
  }
  
  next()
})
```

#### 3. 元件層級控制

##### A. 趨勢分析頁面

**檔案位置**：`/src/views/data-center/trend/index.vue`

**實作方式**：根據使用者角色過濾 Tab 選項

```javascript
export default {
  data() {
    return {
      tabs: [
        { id: 0, value: 'order', name: '訂單', component: 'order' },
        { id: 1, value: 'product', name: '商品', component: 'product' },
        { 
          id: 2, 
          value: 'system', 
          name: '系統', 
          component: 'system',
          roleAccess: ['admin', 'brand'] // 🔒 權限標註
        },
      ],
    }
  },
  computed: {
    roleType() {
      return this.$store.state.user.roleType
    },
    visibleTabs() {
      return this.tabs.filter(tab => 
        !tab.roleAccess || tab.roleAccess.includes(this.roleType)
      )
    }
  },
  watch: {
    visibleTabs: {
      handler(newTabs) {
        // 確保當前 Tab 在可見範圍內
        if (newTabs.length > 0 && !newTabs.find(t => t.id === this.activeTab)) {
          this.activeTab = newTabs[0].id
        }
      },
      immediate: true
    }
  }
}
```

##### B. 定期報表頁面

**檔案位置**：`/src/views/data-center/scheduled-report/index.vue`

**實作方式**：根據使用者角色過濾報表卡片

```javascript
import { reportCards } from '@/modules/report-center.config'

export default {
  data() {
    return {
      reportCards, // 從配置檔引入
    }
  },
  computed: {
    roleType() {
      return this.$store.state.user.roleType
    },
    visibleReportCards() {
      const isStore = this.roleType === 'store'
      if (isStore) {
        // Store 權限：過濾掉週報表和月報表
        return this.reportCards.filter(card => 
          !['weekly', 'monthly'].includes(card.type)
        )
      }
      return this.reportCards
    }
  }
}
```

**配置檔更新**：`/src/modules/report-center.config.js`

```javascript
export const reportCards = [
  {
    type: 'weekly',
    title: '週報表',
    schedule: '每週 03:00',
    roleAccess: ['admin', 'brand'], // 🔒 權限標註
    icon: 'calendar-week',
    // ...其他設定
  },
  {
    type: 'monthly',
    title: '月報表',
    schedule: '每月1號 03:00',
    roleAccess: ['admin', 'brand'], // 🔒 權限標註
    icon: 'calendar-month',
    // ...其他設定
  },
  {
    type: 'memberPoint',
    title: '會員卡報表-點數',
    schedule: '每月5號 03:00',
    roleAccess: ['admin', 'brand', 'store'], // 全權限
    icon: 'award',
    // ...其他設定
  },
  {
    type: 'memberCoupon',
    title: '會員卡報表-優惠券',
    schedule: '每月5號 03:00',
    roleAccess: ['admin', 'brand', 'store'], // 全權限
    icon: 'ticket',
    // ...其他設定
  },
]
```

##### C. 報表下載區頁面

**檔案位置**：`/src/views/data-center/download/index.vue`

**實作方式**：根據使用者角色過濾子 Tab

```javascript
export default {
  data() {
    return {
      subTabs: [
        { 
          id: 0, 
          value: 'weekly', 
          name: '週報表', 
          show: true,
          roleAccess: ['admin', 'brand'] // 🔒 權限標註
        },
        { 
          id: 1, 
          value: 'monthly', 
          name: '月報表', 
          show: true,
          roleAccess: ['admin', 'brand'] // 🔒 權限標註
        },
        { 
          id: 2, 
          value: 'member', 
          name: '會員報表', 
          show: true,
          roleAccess: ['admin', 'brand', 'store'] // 全權限
        },
      ],
    }
  },
  computed: {
    roleType() {
      return this.$store.state.user.roleType
    },
    visibleSubTabs() {
      return this.subTabs.filter(tab => 
        tab.show && (!tab.roleAccess || tab.roleAccess.includes(this.roleType))
      )
    }
  },
  mounted() {
    this.initializeTab()
  },
  methods: {
    // 確保初始 Tab 是可見的
    initializeTab() {
      if (this.visibleSubTabs.length > 0) {
        const firstVisibleTab = this.visibleSubTabs[0]
        if (this.subTab !== firstVisibleTab.id) {
          this.subTab = firstVisibleTab.id
        }
      }
    }
  }
}
```

### 權限檢查工具方法

**檔案位置**：`/src/utils/permission.js`（建議新增）

```javascript
/**
 * 檢查使用者是否有權限訪問特定功能
 * @param {Array<string>} allowedRoles - 允許的角色陣列 ['admin', 'brand', 'store']
 * @param {string} userRole - 使用者角色
 * @returns {boolean}
 */
export function hasAccess(allowedRoles, userRole) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true // 無限制，所有角色都可訪問
  }
  return allowedRoles.includes(userRole)
}

/**
 * 過濾陣列中有權限訪問的項目
 * @param {Array} items - 項目陣列
 * @param {string} userRole - 使用者角色
 * @param {string} accessKey - 權限鍵名，預設 'roleAccess'
 * @returns {Array}
 */
export function filterByAccess(items, userRole, accessKey = 'roleAccess') {
  return items.filter(item => 
    hasAccess(item[accessKey], userRole)
  )
}

/**
 * 檢查是否為 Store 角色
 * @param {string} userRole - 使用者角色
 * @returns {boolean}
 */
export function isStoreRole(userRole) {
  return userRole === 'store'
}

/**
 * 檢查是否為 Admin 或 Brand 角色
 * @param {string} userRole - 使用者角色
 * @returns {boolean}
 */
export function isAdminOrBrand(userRole) {
  return ['admin', 'brand'].includes(userRole)
}
```

**使用範例**：

```javascript
import { filterByAccess, isStoreRole } from '@/utils/permission'

export default {
  computed: {
    roleType() {
      return this.$store.state.user.roleType
    },
    visibleTabs() {
      return filterByAccess(this.tabs, this.roleType)
    },
    isStoreUser() {
      return isStoreRole(this.roleType)
    }
  }
}
```

### 測試檢查清單

實作完成後，請依照以下清單進行測試：

#### Admin 角色測試

- [ ] 登入 Admin 帳號
- [ ] 確認「趨勢分析」選單顯示「訂單」、「商品」、「系統」三個 Tab
- [ ] 確認可訪問 `/analytics/trend/system` 路由
- [ ] 確認「定期報表」頁面顯示週報表、月報表、會員報表卡片
- [ ] 確認「報表下載區」顯示週報表、月報表、會員報表三個 Tab

#### Brand 角色測試

- [ ] 登入 Brand 帳號
- [ ] 確認「趨勢分析」選單顯示「訂單」、「商品」、「系統」三個 Tab
- [ ] 確認可訪問 `/analytics/trend/system` 路由
- [ ] 確認「定期報表」頁面顯示週報表、月報表、會員報表卡片
- [ ] 確認「報表下載區」顯示週報表、月報表、會員報表三個 Tab

#### Store 角色測試

- [ ] 登入 Store 帳號
- [ ] 確認「趨勢分析」選單**僅顯示**「訂單」、「商品」兩個 Tab
- [ ] 確認無法訪問 `/analytics/trend/system` 路由（應重定向至首頁）
- [ ] 確認「定期報表」頁面**僅顯示**會員報表卡片（週報表、月報表隱藏）
- [ ] 確認「報表下載區」**僅顯示**會員報表 Tab（週報表、月報表隱藏）

#### 權限切換測試

- [ ] 在不同角色間切換，確認選單和頁面即時更新
- [ ] Store 角色下直接訪問受限 URL，確認正確重定向
- [ ] 確認所有權限控制不影響其他功能正常運作

### 注意事項

1. **向下相容**：雖然功能對 Store 角色隱藏，但路由和 API 仍保留，以確保系統穩定性
2. **錯誤處理**：當 Store 角色嘗試訪問受限功能時，應友善地重定向而非顯示錯誤
3. **UI 優化**：隱藏功能不應在介面上留下痕跡（如空白區域），應完全移除
4. **文件同步**：權限變更時需同步更新本文件和系統文件
5. **API 安全**：前端權限控制僅為 UX 優化，後端 API 應同步實施權限驗證

---

## API 使用對照表

### Analytics API 使用情況

本專案使用的 Analytics API 定義於 `/src/api/analytics.js`，以下為各功能模組對應的 API 使用情況：

| API 方法 | 功能說明 | 使用檔案 | API 文件 |
|---------|---------|---------|---------|
| `templateList()` | 取得模板列表 | [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue) | [analytics.api.list.spec.md](analytics.api.list.spec.md) |
| `templateInfo(id)` | 取得模板資訊 | [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue) | [analytics.api.info.spec.md](analytics.api.info.spec.md) |
| `templateCreate(data)` | 新增模板 | [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue) | [analytics.api.create.spec.md](analytics.api.create.spec.md) |
| `templateEdit(id, data)` | 編輯模板 | [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue) | [analytics.api.update.spec.md](analytics.api.update.spec.md) |
| `templateDelete(id)` | 刪除模板 | [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue) | [analytics.api.delete.spec.md](analytics.api.delete.spec.md) |
| `exportLogList(loading)` | 取得營運分析匯出紀錄列表 | [src/views/data-center/download/index.vue](src/views/data-center/download/index.vue), [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue) | [analytics.api.export-log-list.spec.md](analytics.api.export-log-list.spec.md) |
| `exportLog(id)` | 取得營運分析匯出紀錄 | - | [analytics.api.export-log-record.spec.md](analytics.api.export-log-record.spec.md) |
| `export(data)` | 匯出營運分析 | [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue) | [analytics.api.export.spec.md](analytics.api.export.spec.md) |
| `exportRetry(id)` | 重試匯出營運分析 | [src/views/data-center/download/index.vue](src/views/data-center/download/index.vue) | [analytics.api.export-log-retry.spec.md](analytics.api.export-log-retry.spec.md) |
| `metrics()` | 取得營運分析指標 | [src/views/data-center/dashboard/components/OperationDashboard.vue](src/views/data-center/dashboard/components/OperationDashboard.vue) | [analytics.api.metrics.spec.md](analytics.api.metrics.spec.md) |
| `trend()` | 取得營運分析趨勢 | [src/views/data-center/dashboard/components/OperationDashboard.vue](src/views/data-center/dashboard/components/OperationDashboard.vue) | [analytics.api.trend.spec.md](analytics.api.trend.spec.md) |

### 功能模組與 API 對應關係

#### 1. 數據概覽 - 營運儀表板

**檔案位置**: [src/views/data-center/dashboard/components/OperationDashboard.vue](src/views/data-center/dashboard/components/OperationDashboard.vue)

**使用的 API**:

- `analytics.metrics()` - 取得營運分析指標（今日數據、歷史銷售、訂單狀態、佔比、熱區）
- `analytics.trend()` - 取得營運分析趨勢（趨勢概覽圖表）

**主要功能**:

- 今日銷售數據統計（交易總金額、訂單總數、商品數、平均訂單金額）
- 各訂單狀態統計（未接單、已接單、已退訂、已完成、已作廢）
- 交易總金額&訂單總數趨勢圖
- 平均訂單金額趨勢圖
- 品牌/門市/商品排名 Top5 & Last5
- 下訂熱門時間熱力圖
- 趨勢概覽（可篩選品牌、門市、訂單來源）
- 5 種佔比分析（訂單方案、訂單類型、瀏覽器、取貨方式、付款方式）

**呼叫範例**:

```javascript
// 取得營運分析指標
const query = {
  brand_id: this.brandId,
  store_id: this.storeId,
}
await analytics
  .removeALLParameters()
  .setParameters(query)
  .metrics()
  .then((data) => {
    if (data.status === 200) {
      this.metricsData = data.metrics
      // 設定各種圖表...
    }
  })

// 取得營運分析趨勢
await analytics
  .removeALLParameters()
  .setParameters(this.trendFilter)
  .trend()
  .then((data) => {
    if (data.status === 200) {
      this.trendData = data.trend
      this.setTrendChart()
    }
  })
```

#### 2. 報表中心 - 自訂報表模組

**檔案位置**: [src/views/data-center/report/module/index.vue](src/views/data-center/report/module/index.vue)

**使用的 API**:

- `analytics.templateList()` - 取得模板列表
- `analytics.templateInfo(id)` - 取得模板詳細資訊
- `analytics.templateCreate(data)` - 新增模板
- `analytics.templateEdit(id, data)` - 編輯模板
- `analytics.templateDelete(id)` - 刪除模板
- `analytics.export(data)` - 匯出營運分析報表
- `analytics.exportLogList(false)` - 取得匯出紀錄列表（用於排程檢查下載狀態）

**主要功能**:

- 模板管理（新增、編輯、刪除、儲存）
- 報表篩選條件設定（時間、品牌門市、金額、地址、商品等）
- 報表欄位選擇
- 報表匯出及下載
- 長時間下載排程檢查

**呼叫範例**:

```javascript
// 取得模板列表
let query = {}
if (this.storeId) query.store_id = this.storeId
else if (this.brandId) query.brand_id = this.brandId

await analytics
  .removeALLParameters()
  .setParameters(query)
  .templateList()
  .then((data) => {
    if (data.status === 200) {
      this.moduleList = [...newItem, ...defaultItem, ...data.list]
    }
  })

// 匯出報表
let query = _.cloneDeep(this.activeItem)
if (this.activeItem.id && this.activeItem.id !== 'default') {
  query.template_id = this.activeItem.id
}
delete query.id
analytics
  .removeALLParameters()
  .export(query)
  .then((data) => {
    if (data.status === 200) {
      // 處理下載邏輯...
    }
  })

// 排程檢查下載狀態
let query = {
  page: 1,
  size: 20,
  type: 1,
  log_ids: this.exportList.join(','),
}
analytics
  .removeALLParameters()
  .setParameters(query)
  .exportLogList(false) // loading false
  .then((data) => {
    if (data.status === 200) {
      const list = data.list
      this.loneTimeCheckDownload(list)
    }
  })
```

#### 3. 報表中心 - 報表下載區

**檔案位置**: [src/views/data-center/download/index.vue](src/views/data-center/download/index.vue)

**使用的 API**:

- `analytics.exportLogList(loading)` - 取得營運分析匯出紀錄列表
- `analytics.exportRetry(id)` - 重試匯出營運分析

**主要功能**:

- 顯示所有報表下載紀錄
- 篩選品牌/門市
- 報表類型篩選（營運分析、會員分析、行銷分析、商品分析）
- 下載狀態顯示（進度條）
- 重試失敗的匯出任務
- 下載報表檔案

**呼叫範例**:

```javascript
// 取得匯出紀錄列表
this.query.page = this.tablePaginate.page
this.query.size = this.tablePaginate.size
if (this.tabs) {
  this.query.type = this.tabs
}
analytics
  .removeALLParameters()
  .setParameters(this.query)
  .exportLogList()
  .then((data) => {
    if (data.status === 200) {
      this.tablePaginate.total = data.meta.total
      this.tableList = data.list
    }
  })

// 重試匯出
analytics
  .removeALLParameters()
  .exportRetry(id)
  .then((data) => {
    if (data.status === 200) {
      this.getTable()
    }
  })
```

---

## Statistic API 使用對照表

### Statistic API 使用情況

本專案使用的 Statistic API 用於定期報表和趨勢分析功能，以下為各功能模組對應的 API 使用情況：

| API 方法 | 功能說明 | 使用/規劃檔案 | API 文件 |
|---------|---------|---------|---------|
| `statistic.brandWeeklyStatement(brand_id, year)` | 取得品牌週報表下載資訊 | [src/views/data-center/scheduled-report/index.vue](src/views/data-center/scheduled-report/index.vue) | [statistic.api.weekly.spec.md](statistic.api.weekly.spec.md) |
| `statistic.brandMonthlyStatement(brand_id, year)` | 取得品牌月報表下載資訊 | [src/views/data-center/scheduled-report/index.vue](src/views/data-center/scheduled-report/index.vue) | [statistic.api.monthly.spec.md](statistic.api.monthly.spec.md) |
| `statistic.orderSummary(params)` | 取得簡易營運報表 | [src/views/data-center/trend/order.vue](src/views/data-center/trend/order.vue) | [statistic.api.orderSummary.spec.md](statistic.api.orderSummary.spec.md) |
| `statistic.orderSummarySheets(params)` | 匯出簡易營運報表 | [src/views/data-center/trend/order.vue](src/views/data-center/trend/order.vue) | [statistic.api.orderSummarySheets.spec.md](statistic.api.orderSummarySheets.spec.md) |
| `statistic.operateApiSummary(params)` | 取得簡易系統使用率報表 | [src/views/data-center/trend/system.vue](src/views/data-center/trend/system.vue) | [statistic.api.operateApiSummary.spec.md](statistic.api.operateApiSummary.spec.md) |
| `statistic.operateApiSummarySheets(params)` | 匯出簡易系統使用率報表 | [src/views/data-center/trend/system.vue](src/views/data-center/trend/system.vue) | [statistic.api.operateApiSummarySheets.spec.md](statistic.api.operateApiSummarySheets.spec.md) |

### 功能模組與 Statistic API 對應關係

#### 1. 趨勢分析 - 訂單趨勢

**檔案位置**: [src/views/data-center/trend/order.vue](src/views/data-center/trend/order.vue)

**使用的 API**:

- `statistic.orderSummary(params)` - 取得簡易營運報表
- `statistic.orderSummarySheets(params)` - 匯出簡易營運報表（Excel 格式）

**主要功能**:

- 訂單總數趨勢圖（支援每日/每月統計）
- 訂單總額趨勢圖（支援每日/每月統計）
- 訂單明細表格（日期、訂單數量、訂單金額、平均客單價）
- 支援統計頻率切換（每日、每月、依日期合計並依年月分組）
- 支援品牌/門市篩選
- 報表匯出功能

**API 參數說明**:

```javascript
// 查詢參數
const params = {
  list_type: 'daily',              // 查詢類型：daily, monthly, daily_group_by_month
  start_date: '20210101',          // 起始日期 YYYYMMDD (monthly 時為 YYYYMM)
  end_date: '20210131',            // 結束日期 YYYYMMDD (monthly 時為 YYYYMM)
  brand_id: 1,                     // (可選) 品牌ID
  store_ids: '1,2,3',              // (可選) 門市ID清單，逗號分隔
  return_type: 'page',             // 回傳類型：page (分頁) 或 all (全部資料)
  page: 1,                         // 頁碼（return_type 為 page 時使用）
  size: 20,                        // 每頁筆數（return_type 為 page 時使用）
}
```

**回傳資料結構**:

- `list.date` - 日期或年月
- `list.order_amount_accepted` - 已接單訂單總數量
- `list.order_money_accepted` - 已接單訂單總金額
- `list.order_amount_rejected` - 已拒單訂單總數量
- `list.order_money_rejected` - 已拒單訂單總金額
- `list.order_amount_takeout` - 外帶自取總數量
- `list.order_amount_delivery` - 外送總數量

**呼叫範例**:

```javascript
// 取得訂單趨勢資料
const params = {
  list_type: this.frequency,  // 'daily' 或 'monthly'
  start_date: this.startDate,
  end_date: this.endDate,
  brand_id: this.brandId,
  store_ids: this.storeIds.join(','),
  return_type: 'all',
}

await statistic
  .removeALLParameters()
  .appendQuery(params)
  .orderSummary()
  .then(response => {
    if (response.status === 200) {
      // 處理圖表資料
      this.processChartData(response.list)
      // 處理表格資料
      this.orderDetails = this.processTableData(response.list)
    }
  })

// 匯出報表
await statistic
  .removeALLParameters()
  .appendQuery(params)
  .orderSummarySheets()
  .then(response => {
    // 下載 Excel 檔案
    this.downloadFile(response)
  })
```

#### 2. 趨勢分析 - 系統使用率

**檔案位置**: [src/views/data-center/trend/system.vue](src/views/data-center/trend/system.vue)

**使用的 API**:

- `statistic.operateApiSummary(params)` - 取得簡易系統使用率報表
- `statistic.operateApiSummarySheets(params)` - 匯出簡易系統使用率報表（Excel 格式）

**主要功能**:

- 三大系統使用統計卡片（Order 系統、CRM 系統、Data 系統）
- 系統使用率趨勢圖（支援每日/每月統計）
- 使用明細表格（日期、各系統使用次數、總計）
- 支援統計頻率切換（每日、每月、依日期合計並依年月分組）
- 支援品牌/門市篩選
- 報表匯出功能

**API 參數說明**:

```javascript
// 查詢參數
const params = {
  list_type: 'daily',              // 查詢類型：daily, monthly, daily_group_by_month
  start_date: '20220522',          // 起始日期：daily 為 YYYYMMDD，monthly 為 YYYYMM
  end_date: '20220531',            // 結束日期：daily 為 YYYYMMDD，monthly 為 YYYYMM
  brand_ids: '1',                  // (可選) 品牌ID（字串格式）
  store_ids: '1,2,3',              // (可選) 門市ID清單，逗號分隔
  return_type: 'page',             // 回傳類型：page (分頁) 或 all (全部資料)
  page: 1,                         // 頁碼（return_type 為 page 時使用）
  size: 20,                        // 每頁筆數（return_type 為 page 時使用）
}
```

**日期格式轉換**:

系統使用 `formatDateParam()` 方法根據統計頻率自動轉換日期格式：

```javascript
/**
 * 格式化日期參數
 * @param {String} dateString - YYYY-MM-DD 格式的日期字串或 ISO 格式
 * @returns {String} - 每月統計回傳 YYYYMM，每日統計回傳 YYYYMMDD
 */
formatDateParam(dateString) {
  if (!dateString) return ''
  
  // 處理 ISO 格式或帶時間的日期字串，只取日期部分
  const dateOnly = dateString.split('T')[0]
  
  if (this.frequency === 'monthly') {
    // YYYY-MM-DD -> YYYYMM
    return dateOnly.substring(0, 7).replace(/-/g, '')
  }

  // daily 或 daily_group_by_month 都使用 YYYYMMDD 格式
  // YYYY-MM-DD -> YYYYMMDD
  return dateOnly.replace(/-/g, '')
}
```

**apiParams computed 屬性**:

```javascript
apiParams() {
  const params = {
    list_type: this.frequency,
    return_type: 'all',
  }

  if (this.filters.startDate) {
    params.start_date = this.formatDateParam(this.filters.startDate)
  }
  if (this.filters.endDate) {
    params.end_date = this.formatDateParam(this.filters.endDate)
  }
  if (this.filters.brandId) {
    params.brand_ids = String(this.filters.brandId)
  }
  if (this.filters.storeId) {
    params.store_ids = String(this.filters.storeId)
  }

  return params
}
```

**回傳資料結構**:

- `list.date` - 日期或年月
- `list.operate_api_order` - Order 系統使用次數
- `list.operate_api_crm` - CRM 系統使用次數
- `list.operate_api_data` - Data 系統使用次數

**呼叫範例**:

```javascript
// 取得系統使用率資料
const params = {
  list_type: this.frequency,  // 'daily' 或 'monthly'
  start_date: this.startDate,
  end_date: this.endDate,
  brand_id: this.brandId,
  store_ids: this.storeIds.join(','),
  return_type: 'all',
}

await statistic
  .removeALLParameters()
  .appendQuery(params)
  .operateApiSummary()
  .then(response => {
    if (response.status === 200) {
      // 處理圖表資料
      this.processChartData(response.list)
      // 處理表格資料
      this.systemUsageDetails = this.processTableData(response.list)
      // 計算總計
      this.calculateSummary(response.list)
    }
  })

// 匯出報表
await statistic
  .removeALLParameters()
  .appendQuery(params)
  .operateApiSummarySheets()
  .then(response => {
    // 下載 Excel 檔案
    this.downloadFile(response)
  })
```

#### 3. 報表中心 - 定期報表

**檔案位置**: [src/views/data-center/scheduled-report/index.vue](src/views/data-center/scheduled-report/index.vue)

**使用的 API**:

- `statistic.brandWeeklyStatement(brand_id, year)` - 取得品牌週報表下載資訊
- `statistic.brandMonthlyStatement(brand_id, year)` - 取得品牌月報表下載資訊
- `statistic.membershipMonthlyPoint()` - 取得會員卡點數月報表
- `statistic.membershipMonthlyCoupon()` - 取得會員卡優惠券月報表

**主要功能**:

- 定期報表卡片列表（週報表、月報表、會員卡報表-點數、會員卡報表-優惠券）
- 品牌/門市篩選器
- 報表排程時間顯示
- 報表下載功能
- 歷史報表下載紀錄彈窗
- 下載連結過期提醒（5 分鐘）

**報表卡片配置**:

| 報表名稱 | 排程時間 | API 方法 | 備註 |
|---------|---------|----------|------|
| 週報表 | 每週 03:00 | `brandWeeklyStatement` | 支援歷史紀錄 |
| 月報表 | 每月1號 03:00 | `brandMonthlyStatement` | 支援歷史紀錄 |
| 會員卡報表-點數 | 每月5號 03:00 | `membershipMonthlyPoint` | - |
| 會員卡報表-優惠券 | 每月5號 03:00 | `membershipMonthlyCoupon` | - |

**API 參數說明**:

```javascript
// 週報表/月報表查詢參數
const params = {
  brand_id: 2,     // 品牌ID
  year: 2018,      // 查詢年份 YYYY
}
```

**回傳資料結構**:

**週報表 API (`brandWeeklyStatement`)**:

- `download_info.meta.brand_id` - 品牌ID
- `download_info.meta.year` - 查詢年份
- `download_info.meta.acl_limit` - 下載連結的 ACL 時間（秒，通常為 300 秒）
- `download_info.list` - 下載資訊陣列（2024-12-16 更新：由 links 物件改為 list 陣列）
  - `list[].link` - AWS S3 下載 URL
  - `list[].start_date` - 週報表起始日期（YYYY-MM-DD）
  - `list[].week` - 週次

**月報表 API (`brandMonthlyStatement`)**:

- `download_info.meta.brand_id` - 品牌ID
- `download_info.meta.year` - 查詢年份
- `download_info.meta.acl_limit` - 下載連結的 ACL 時間（秒，通常為 300 秒）
- `download_info.links` - 下載連結清單（物件格式，key 為 YYYY-MM，value 為 AWS S3 下載 URL）

**重要說明**:

1. **連結時效性**：下載連結為 AWS S3 簽章 URL，有效期限為 5 分鐘（300 秒），前端需提示使用者連結可能過期
2. **報表產出時間**：
   - 週報表：每週定期產出
   - 月報表：每個月 5 號產出前一個月的報表
   - 每個月 5 號會將前前一個月狀態為已接單的訂單，改成已完成
3. **尚未產出的報表**：
   - 週報表：不會出現在 `list` 陣列中
   - 月報表：不會出現在 `links` 物件中（連 key 都會省略）
4. **API 延遲**：此 API 最多要取得 12 份 AWS S3 下載簽章，latency 極長，需加上 Loading 提示
5. **API 格式更新** (2024-12-16)：週報表 API 回傳格式由 `download_info.links` (物件) 改為 `download_info.list` (陣列)

**UI 架構**:

- 頂部篩選區：品牌選擇器、門市選擇器、搜尋按鈕、清除按鈕
- 報表卡片區：使用 `v-for` 迴圈渲染四張報表卡片
- 每張卡片包含：報表名稱、排程時間、最後更新時間、下載按鈕、歷史紀錄按鈕（可選）
- 歷史紀錄彈窗：顯示所有可下載的月份列表

**呼叫範例**:

```javascript
// 取得週報表下載資訊 (使用報表下載區的實作方式)
async loadWeeklyReport() {
  const query = {
    brand_id: this.scheduledFilters.brand_id,
    year: this.scheduledFilters.year,
  }
  
  await statistic
    .removeALLParameters()
    .setParameters(query)
    .brandWeeklyStatement()
    .then(response => {
      if (response.status === 200 && response.download_info.list) {
        this.weeklyReportData = response.download_info.list.map(item => {
          // 計算結束日期（起始日期 + 6 天）
          const startDate = new Date(item.start_date)
          const endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + 6)
          
          // 格式化日期為 YYYY-MM-DD
          const formatDate = (date) => date.toISOString().split('T')[0]
          
          return {
            name: `${formatDate(startDate)} ~ ${formatDate(endDate)}`,
            start_date: item.start_date,
            week: item.week,
            create_time: '-',
            file_url: item.link,
          }
        })
      }
    })
}

// 取得月報表下載資訊
await statistic
  .removeALLParameters()
  .setParameters({ brand_id: this.filters.brandId, year: currentYear })
  .brandMonthlyStatement()
  .then(response => {
    if (response.status === 200) {
      const { meta, links } = response.download_info
      
      // 處理下載連結
      this.historyDialog.links = Object.keys(links)
        .sort()
        .reverse()
        .map(key => ({
          month: key,
          url: links[key],
        }))
    }
  })
```

**實作日期**：2025-12-16

### API 實作注意事項

#### Statistic API 整合建議

1. **API 代理類別更新**

`/src/api/statistic.js` 已包含以下方法：

```javascript
// src/api/statistic.js

/**
 * 取得品牌週報表下載資訊
 */
brandWeeklyStatement() {
  return this.submit('get', `${this.endpoint}/brandWeeklyStatement`)
}

/**
 * 取得品牌月報表下載資訊
 */
brandMonthlyStatement() {
  return this.submit('get', `${this.endpoint}/brandMonthlyStatement`)
}

/**
 * 取得簡易營運報表
 */
orderSummary() {
  return this.submit('get', `${this.endpoint}/orderSummary`)
}

/**
 * 匯出簡易營運報表
 */
orderSummarySheets() {
  return this.submit('get', `${this.endpoint}/orderSummarySheets`, null, {
    responseType: 'blob',  // 重要：Excel 檔案需要 blob 格式
  })
}

/**
 * 取得簡易系統使用率報表
 */
operateApiSummary() {
  return this.submit('get', `${this.endpoint}/operateApiSummary`)
}

/**
 * 匯出簡易系統使用率報表
 */
operateApiSummarySheets() {
  return this.submit('get', `${this.endpoint}/operateApiSummarySheets`, null, {
    responseType: 'blob',  // 重要：Excel 檔案需要 blob 格式
  })
}
```

1. **日期格式處理**

不同的 `list_type` 需要不同的日期格式：

- `daily`: YYYYMMDD（例如：20210101）
- `monthly`: YYYYMM（例如：202101）
- `daily_group_by_month`: YYYYMMDD（例如：20210101）

1. **時間區間限制**

- `daily` 和 `daily_group_by_month`：起始與結束日期間隔不可超過 12 個月
- `monthly`：起始與結束年月間隔不可超過 24 個月

1. **Excel 檔案下載處理**

```javascript
// 下載 Excel 檔案的通用方法
downloadFile(response) {
  const url = window.URL.createObjectURL(new Blob([response]))
  const link = document.createElement('a')
  link.href = url
  
  // 從 Content-Disposition header 取得檔名
  const contentDisposition = response.headers['content-disposition']
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1].replace(/"/g, '')
    : 'report.xlsx'
  
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
```

1. **AWS S3 連結過期處理**

```javascript
// 檢查連結是否過期
isLinkExpired(expireTime) {
  return Date.now() > expireTime
}

// 顯示過期警告
showAclWarning(aclLimit) {
  this.$swal({
    icon: 'warning',
    title: '下載連結時效提醒',
    text: `下載連結將在 ${aclLimit} 秒（${Math.floor(aclLimit / 60)} 分鐘）後過期，請盡快下載`,
    confirmButtonText: '我知道了',
  })
}
```

---

#### View 檔案結構

```plaintext
src/views/data-center/
├── dashboard/
│   ├── index.vue                    # 數據概覽主頁（含 Tab 切換：營運/商品）
│   └── components/
│       └── OperationDashboard.vue   # 營運儀表板元件
├── trend/
│   ├── index.vue                    # 趨勢分析主頁（含 Tab 切換與品牌/門市篩選）
│   ├── order.vue                    # 訂單趨勢分析
│   ├── product.vue                  # 商品排名分析
│   ├── system.vue                   # 系統使用率分析
│   └── components/
│       └── DateRangeFilter.vue      # 日期範圍篩選共用元件
├── sales/
│   └── index.vue                    # 商品銷售報表（整合至數據概覽商品 Tab）
├── report/
│   ├── index.vue                    # 報表中心主頁（含 Tab 切換：自訂報表/定期報表/報表下載區）
│   └── module/                      # 自訂報表模組
│       ├── index.vue                # 自訂報表模組主容器
│       ├── components/
│       │   └── sidebar.vue          # 模板列表側邊欄
│       ├── operation/
│       │   ├── index.vue            # 營運分析組件
│       │   ├── filters.vue          # 篩選條件組件
│       │   └── columns.vue          # 欄位選擇組件
│       ├── member/
│       │   └── index.vue            # 會員分析組件
│       ├── marketing/
│       │   └── index.vue            # 行銷分析組件
│       └── product/
│           └── index.vue            # 商品分析組件
├── scheduled-report/
│   └── index.vue                    # 定期報表管理
└── download/
    └── index.vue                    # 報表下載紀錄
```

#### 元件架構說明

##### 報表中心 (report/)

**入口頁面** (`index.vue`):

- 職責：顯示報表類型選擇卡片，提供跳轉至各報表模組的入口
- 資料傳遞：透過 `routerQuery` 傳遞品牌/門市篩選參數
- 程式碼行數：約 170 行
- 架構說明：
  - 條件式顯示品牌/門市篩選器（多品牌/多門市權限時）
  - 卡片列表：營運分析、會員分析（待開發）、行銷分析（待開發）
  - 使用 `nd-action-box` 元件呈現卡片
  - 點擊卡片透過 `$router.push()` 跳轉至對應報表模組頁面
- 功能：
  - 品牌選擇器（單品牌權限時不顯示）
  - 門市選擇器（門市權限時顯示）
  - 報表卡片列表（使用 `v-for` 渲染）
  - 路由參數管理（brand_id, store_id）
- 依賴：
  - `nd-action-box` - 卡片元件
  - `nd-select-brand-store` - 品牌門市選擇器
  - Vuex store (`dataCenter` 模組)

**自訂報表模組** (`module/index.vue`):

- 職責：模板管理與報表匯出
- Props 介面：
  - `reportType` (String): 報表類型（'operation', 'member', 'marketing', 'product'）
  - 預設值：''（空字串時根據路由判斷）
- 主要功能：
  - 模板列表管理（新增、編輯、刪除、儲存）
  - 報表篩選條件設定
  - 報表欄位選擇
  - 報表匯出及下載
  - 長時間下載排程檢查
- Computed 屬性：
  - `type()`: 優先使用 `reportType` prop，若無則根據路由名稱判斷，預設返回 `'operation'`
- 程式碼行數：約 580 行
- 依賴：
  - `@/api/analytics` - 分析 API
  - `sidebar.vue` - 側邊欄模板列表
  - `operation/index.vue` - 營運分析組件
  - `member/index.vue` - 會員分析組件
  - `marketing/index.vue` - 行銷分析組件
  - `product/index.vue` - 商品分析組件
- **修改說明**（2025-12-16）：
  - 新增 `reportType` prop，支援外部指定報表類型
  - 修改 `type` computed，優先使用 prop，提升元件復用性
  - 預設返回 `'operation'` 而非 `null`，確保元件正常運作

**定期報表** (`scheduled-report/index.vue`):

- 職責：定期報表列表管理與下載
- 路由：`/report-center/scheduled`
- 主要功能：週報表、月報表列表與下載管理
- 程式碼行數：約 260 行

**報表下載區** (`download/index.vue`):

- 職責：報表下載紀錄管理
- 路由：`/report-center/downloads`
- 主要功能：顯示所有報表下載狀態與下載檔案
- 程式碼行數：約 320 行

##### 數據概覽 (dashboard/)

**主容器** (`index.vue`):

- 職責：品牌/門市篩選、Tab 切換（營運/商品）、路由跳轉
- 資料傳遞：透過 props 將 `brand_id`、`store_id` 傳遞給子元件
- 程式碼行數：約 200 行

**營運儀表板元件** (`components/OperationDashboard.vue`):

- 職責：營運數據展示與圖表渲染（今日數據、訂單狀態、交易金額、排名、趨勢、佔比分析）
- Props 介面：
  - `brandId` (Number): 品牌 ID
  - `storeId` (Number): 門市 ID
- 主要功能：
  - 8 種圖表類型（交易總金額、平均訂單金額、熱門時間、趨勢概覽、5 種佔比圖表）
  - 資料獲取：`getMetrics()`, `getTrend()`
  - Watch 監聽：品牌/門市切換時自動重新載入資料
  - 生命週期：`beforeDestroy` 銷毀圖表實例防止記憶體洩漏
- 程式碼行數：約 1,400 行
- 依賴：
  - `@/api/analytics` - 數據 API
    - `analytics.metrics()` - 取得營運分析指標
    - `analytics.trend()` - 取得營運分析趨勢
  - G2 圖表庫（AntV v4.x）
  - `nd-tooltip` 元件
  - Vuex getters: `orderDeliveryOptions`, `orderSrcTypeOptions`, `orderMethodOptions`

**佔比圖表開發邏輯**：

1. **API 資料結構** (`/analytics/metrics`)：

   ```javascript
   metricsData.proportion = {
     data_list: [
       {
         type: 'order_method',  // 圖表類型
         current: [             // 最近 30 日資料
           { value: 1, name: '預訂', amount: 150 },
           { value: 2, name: '現場點餐', amount: 80 }
         ],
         compare: [             // 前 30 日資料（用於比較）
           { value: 1, name: '預訂', amount: 120 },
           { value: 2, name: '現場點餐', amount: 90 }
         ]
       },
       // ... 其他類型（order_type, sub_src_type, delivery_type, trade_type）
     ],
     start_date: '2024-11-20',          // 最近 30 日起始
     end_date: '2024-12-19',            // 最近 30 日結束
     compare_start_date: '2024-10-21',  // 前 30 日起始
     compare_end_date: '2024-11-19'     // 前 30 日結束
   }
   ```

2. **圖表類型配置**：
   - `order_method`: 訂單方案（預訂、現場點餐等）
   - `order_type`: 訂單類型（內用、外帶等）
   - `sub_src_type`: 各瀏覽器（Chrome、Safari、Firefox等）
   - `delivery_type`: 取貨方式（需透過 `orderDeliveryOptions` 轉換名稱）
   - `trade_type`: 付款方式（信用卡、現金等）

3. **資料處理流程**：

   a. **setProportionChart()** - 主圖表建立：

   ```javascript
   metricsData.proportion.data_list.forEach((item) => {
     const compare = setProportionData(item, 'compare')  // 處理前 30 日
     const current = setProportionData(item, 'current')  // 處理最近 30 日
     // 建立雙層環圖...
   })
   ```

   b. **setProportionData(list, option)** - 資料轉換：
   - 參數：
     - `list`: 單一 proportion 項目（包含 type, current, compare）
     - `option`: 'current' 或 'compare'
   - 處理步驟：
     1. 取得對應資料：`list[option]`（即 `list.current` 或 `list.compare`）
     2. 呼叫 `setDataPercent()` 計算百分比
     3. 加入時間區間標籤（用於 tooltip 顯示）
     4. 特殊類型轉換：
        - `delivery_type`: 使用 `optionValue(item.value, orderDeliveryOptions)` 轉換
        - `order_method`: 使用 `optionValue(item.value, orderMethodOptions)` 轉換

   c. **setDataPercent(data)** - 百分比計算：
   - 計算總和：`total = data.reduce((sum, item) => sum + item.amount, 0)`
   - 為每個項目加入 `percent` 屬性
   - 呼叫 `getPercent(amount, total)` 取得精確百分比

   d. **getPercent(value, total)** - 精確百分比公式：

   ```javascript
   return total ? Math.floor((value / total) * 100 * 10) / 10 : 0
   // 保留一位小數，例如：33.3%
   ```

4. **雙層環圖配置**：
   - **外圈（Current）**：
     - 半徑：`radius: 0.7, innerRadius: 0.6`
     - 顏色：`colors[]` 主色系（鮮豔色）
     - 資料：最近 30 日（current）
     - 標籤：`{name}: {percent}%`
   - **內圈（Compare）**：
     - 半徑：`radius: 0.5, innerRadius: 0.4`
     - 顏色：`lightColors[]` 淡色系
     - 資料：前 30 日（compare）
     - 使用 `chart.createView()` 建立
   - **Tooltip**：
     - 標題：時間區間（透過 `datum['time']` 取得）
     - 內容：`{name}: {value}` 格式
     - 自訂模板：`itemTpl` 設定顏色標記與文字

5. **空資料處理**：
   - 條件：`!current.length && !compare.length`
   - 顯示：灰色圓餅圖 (#f0f0f0) + 中央「無資料」文字
   - 不顯示 tooltip 和 legend

6. **圖表更新機制**：
   - 當品牌或門市切換時，透過 `watch` 觸發 `fetchData()`
   - 銷毀舊圖表：`if (this[chartName]) this[chartName].destroy()`
   - 重新建立圖表以確保資料正確渲染
   - 使用 `setTimeout(() => chart.forceFit(), 0)` 確保容器大小正確

7. **記憶體管理**：
   - `beforeDestroy()` 生命週期鉤子中銷毀所有圖表實例
   - 包含 5 個佔比圖表：orderMethodChart, orderTypeChart, subSrcTypeChart, deliveryTypeChart, tradeTypeChart

**商品分析** (`sales/index.vue`):

- 整合至數據概覽商品 Tab
- 展示商品銷售排名 TOP5、門市商品銷售份數 TOP3
- Props 介面：
  - `brandId` (Number): 品牌 ID
  - `storeId` (Number): 門市 ID
- 主要功能：
  - 單一商品銷售總份數排行 TOP3（週報表週期比較）
  - 單一門市商品銷售總份數 TOP3（週報表週期比較）
  - 商品銷售排名 TOP5（長條圖，支援時間區間篩選）
- 資料來源：
  - `productStatistic.compareWeekProductRank()` - 商品週排行
  - `productStatistic.compareWeekStoreRank()` - 門市週排行
  - `productStatistic.salesProductRank()` - 商品銷售排名 TOP5
- 程式碼行數：約 880 行
- Watch 機制：
  - 監聽 `brandId` 和 `storeId` props 變化
  - 使用 `Promise.all` 並行呼叫三個 API，避免圖表依序閃爍
  - 每個 API 方法內部保存當前 brandId/storeId，確保資料一致性
- 依賴：
  - `@/api/product-statistic` - 商品統計 API
  - `vue-chartjs/legacy` - 圖表元件（Bar chart）
  - `@/api/brand` - 品牌相關 API（門市列表、門市分類）
- **並行載入優化**（2025-12-16）：
  - 修改 watch handlers，從串行（await）改為並行（Promise.all）
  - 解決圖表依序渲染導致的閃爍問題
  - 三個圖表同時發送請求，縮短整體載入時間
  - API 單例模式下透過本地保存參數（currentBrandId, currentStoreId）避免 race condition

##### 趨勢分析 (trend/)

**主容器** (`index.vue`):

- 職責：Tab 切換（訂單/商品/系統）、品牌/門市篩選、路由管理
- 資料傳遞：透過 `.sync` 修飾符與子組件雙向綁定 `filters` 物件
- Props 介面：
  - 向子組件傳遞：`filters` (Object) - 包含 `brandId`、`storeId`、`startDate`、`endDate`
- 程式碼行數：約 180 行
- 架構說明：
  - 將日期篩選器移至子組件，父組件僅保留品牌/門市篩選
  - 子組件透過 `DateRangeFilter` 共用元件管理日期選擇
  - 使用 `v-show` 切換不同 Tab 內容（保留組件狀態）

**日期範圍篩選器元件** (`components/DateRangeFilter.vue`):

- 職責：統一管理日期範圍選擇邏輯，提供快速選擇與自訂日期功能
- Props 介面：
  - `startDate` (String): 起始日期 (YYYY-MM-DD)
  - `endDate` (String): 結束日期 (YYYY-MM-DD)
- Events：
  - `@change`: 日期變更時觸發，回傳 `{ startDate, endDate, dateRangeText }`
- 主要功能：
  - 快速時間選擇（近7天 / 近一個月）
  - 自訂日期區間選擇器（Vuetify v-date-picker）
  - 自動計算並回傳日期範圍文字（用於報表標題）
  - 元件內部維護 `localStartDate`、`localEndDate` 本地狀態
  - 預設初始化為近一個月
- 程式碼行數：約 140 行
- 使用位置：
  - `order.vue` - 訂單趨勢頁面
  - `product.vue` - 商品排名頁面
  - `system.vue` - 系統使用率頁面

**訂單趨勢元件** (`order.vue`):

- 職責：訂單趨勢圖表展示與資料分析
- Props 介面：
  - `filters` (Object): 篩選條件（品牌、門市、日期範圍）
- Events：
  - `@update:filters`: 日期變更時更新父組件 filters
- 主要功能：
  - 訂單趨勢圖表（長條圖 + 折線圖：訂單總額 / 訂單總數）
  - 訂單分析表格（8 欄位：日期、已接單數量、自取、外送、內用、金額、退訂數量、退訂金額）
  - 統計頻率切換（每日訂單 / 每月訂單）
  - 圖表下載（PNG 格式）
  - 報表下載（Excel 格式，呼叫 `statistic.orderSummarySheets()`）
- 資料來源：
  - `statistic.orderSummary()` - 取得訂單趨勢資料
  - `statistic.orderSummarySheets()` - 匯出 Excel 報表
- 圖表配置：
  - Y 軸（左）：訂單總額（單位：千元）
  - Y 軸（右）：訂單總數
  - X 軸：日期 / 月份（根據統計頻率）
  - 使用 @antv/g2 圖表庫
- 程式碼行數：約 390 行
- 依賴：
  - `DateRangeFilter.vue` - 日期篩選器
  - `@/api/statistic` - 統計 API
  - G2 圖表庫

**商品排名元件** (`product.vue`):

- 職責：商品與套餐銷售排名展示
- Props 介面：
  - `filters` (Object): 篩選條件（品牌、門市、日期範圍）
- Events：
  - `@update:filters`: 日期變更時更新父組件 filters
- 主要功能：
  - 商品排名 TOP10（表格 + 進度條：銷售比例 / 銷售件數）
  - 套餐排名 TOP10（預留功能，目前 API 未提供）
  - 自動計算銷售比例（`amount / total_amount * 100`）
  - 排名列表（序號、品牌、商品名稱、銷售比例、銷售件數）
- 資料來源：
  - `analytics.metrics()` - 取得營運分析指標（使用 `ranking_product_top` 欄位）
- 程式碼行數：約 230 行
- 依賴：
  - `DateRangeFilter.vue` - 日期篩選器
  - `@/api/analytics` - 分析 API

**系統使用率元件** (`system.vue`):

- 職責：系統使用率趨勢圖表展示
- Props 介面：
  - `filters` (Object): 篩選條件（品牌、門市、日期範圍）
- Events：
  - `@update:filters`: 日期變更時更新父組件 filters
- 主要功能：
  - 系統使用率趨勢圖（多線圖：Order / CRM / Data 三大系統）
  - 統計頻率切換（每日統計 / 每月統計）
  - 圖表下載（實際為 Excel 報表下載）
- 資料來源：
  - `statistic.operateApiSummary()` - 取得系統使用率資料
  - `statistic.operateApiSummarySheets()` - 匯出 Excel 報表
- 圖表配置：
  - Y 軸：使用次數（大於 1000 時顯示 K 單位）
  - X 軸：日期 / 月份（根據統計頻率）
  - 三條平滑曲線：
    - Order 系統（藍色 #5b8ff9）
    - CRM 系統（綠色 #5bc9bc）
    - Data 系統（粉色 #f987a6）
  - 使用 @antv/g2 圖表庫（smooth 曲線）
- 程式碼行數：約 270 行
- 依賴：
  - `DateRangeFilter.vue` - 日期篩選器
  - `@/api/statistic` - 統計 API
  - G2 圖表庫

#### 趨勢分析元件通訊架構

```plaintext
index.vue (主容器)
├── filters: { brandId, storeId, startDate, endDate }
│   ├── brandId, storeId: 父組件管理（v-autocomplete）
│   └── startDate, endDate: 子組件更新（透過 @update:filters 事件）
│
├── order.vue (訂單趨勢)
│   ├── <DateRangeFilter @change="onDateRangeChange" />
│   ├── onDateRangeChange() → $emit('update:filters', { ...filters, startDate, endDate })
│   └── watch filters → loadData() → statistic.orderSummary()
│
├── product.vue (商品排名)
│   ├── <DateRangeFilter @change="onDateRangeChange" />
│   ├── onDateRangeChange() → $emit('update:filters', { ...filters, startDate, endDate })
│   └── watch filters → loadData() → analytics.metrics()
│
└── system.vue (系統使用率)
    ├── <DateRangeFilter @change="onDateRangeChange" />
    ├── onDateRangeChange() → $emit('update:filters', { ...filters, startDate, endDate })
    └── watch filters → loadData() → statistic.operateApiSummary()
```

**設計優勢**：

1. **元件化**：日期篩選邏輯封裝在 `DateRangeFilter.vue`，避免重複代碼
2. **雙向綁定**：使用 `.sync` 修飾符實現父子組件資料同步
3. **響應式**：子組件 watch `filters` 自動重新載入資料
4. **狀態保留**：使用 `v-show` 而非 `v-if`，切換 Tab 時保留組件狀態
5. **本地化管理**：`dateRangeText` 由子組件本地維護，避免 props 傳遞複雜度

#### 各頁面功能說明

| 檔案路徑 | 對應路由 | 功能說明 |
| -------- | -------- | -------- |
| `trend/index.vue` | `/analytics/trend` | 趨勢分析主頁，包含品牌/門市篩選與 Tab 切換（訂單/商品/系統） |
| `trend/components/DateRangeFilter.vue` | - | 日期範圍篩選共用元件，提供快速選擇（近7天/近一個月）與自訂日期功能 |
| `trend/order.vue` | `/analytics/trend/order` | 訂單趨勢曲線圖（訂單總數/總額），支援每日/每月統計切換、Excel 報表下載 |
| `trend/product.vue` | `/analytics/trend/product` | 商品、套餐 TOP10 排名表格（進度條顯示銷售比例） |
| `trend/system.vue` | `/analytics/trend/system` | Order/CRM/Data 系統使用率多線圖與 Excel 報表下載 |
| `scheduled-report/index.vue` | `/report-center/scheduled` | 定期報表列表管理（週報表/月報表/會員報表） |
| `report/index.vue` | `/report-center/custom` | 報表中心主頁，包含 Tab 切換（自訂報表/定期報表/報表下載區） |
| `report/module/index.vue` | - | 自訂報表模組主容器，支援 reportType prop 指定報表類型（預設：operation） |

### 實作日期

- **2025-12-09**: 完成路由架構調整與向下相容設定
- **2025-12-09**: 完成趨勢分析與定期報表 View 檔案建立
- **2025-12-09**: 完成路由名稱統一更新（選單配置、麵包屑、View 組件）
- **2025-12-10**: 完成數據概覽營運儀表板元件化重構
  - 建立 `OperationDashboard.vue` 元件（1,100+ 行）
  - 封裝所有營運相關邏輯（資料獲取、圖表渲染、狀態管理）
  - 精簡主容器 `index.vue` 至 200 行（僅保留路由、篩選、Tab 切換）
  - Props 傳遞模式：`brand_id` → `OperationDashboard`
  - Watch 響應式更新：品牌/門市切換時自動重新載入
- **2025-12-12**: 完成趨勢分析日期篩選器共用元件化重構
  - 建立 `DateRangeFilter.vue` 共用元件（140 行）
  - 統一封裝快速時間選擇（近7天/近一個月）與自訂日期功能
  - 更新 `order.vue`、`product.vue`、`system.vue` 引入共用元件
  - 實現 `.sync` 雙向綁定機制，簡化父子元件通訊
  - 優化 `index.vue` 結構，移除重複的日期篩選器代碼
  - 各子元件本地化管理 `dateRangeText`，避免 props 複雜度
- **2025-12-16**: 完成報表中心主頁 Tab 整合重構
  - 重構 `report/index.vue` 為 Tab 切換主頁（110 行）
  - 整合三個子頁面：自訂報表、定期報表、報表下載區
  - 使用 `v-show` 切換 Tab 內容，保留組件狀態
  - Tab 樣式參考 `dashboard/index.vue` 的 `custom-tabs`
  - 修改 `module/index.vue` 支援 `reportType` prop
    - 新增 `reportType` prop (String)，支援外部指定報表類型
    - 修改 `type` computed，優先使用 prop 值
    - 預設返回 `'operation'` 確保嵌入時正常顯示
  - 主頁傳入 `report-type="operation"` 顯示營運分析
- **2025-12-16**: 完成架構重整 - 將「報表中心」獨立為一級模組
  - 模組名稱調整：「分析與報表」→「數據分析」、「統計報表」→「報表中心」
  - 路由架構調整：
    - `/analytics` (數據分析)：數據概覽、趨勢分析
    - `/report-center` (報表中心)：自訂報表、定期報表、報表下載區
  - 選單配置更新（menu-admin.js、menu-brand.js、menu-store.js）：
    - 「數據分析」僅包含數據概覽、趨勢分析
    - 新增獨立的「報表中心」一級選單（含自訂報表、定期報表、報表下載區）
  - 舊路由向下相容：`/analytics/report-center/*` 重定向至 `/report-center/*`
- **2025-12-17**: 整合「統計報表」至「報表中心」
  - 更新「報表中心」圖示：從 SVG 改為 `icon: 'fas fa-file'`（使用原統計報表圖示）
  - 刪除「統計報表」模組（menu-admin.js、menu-brand.js、menu-store.js）
- **2025-12-22**: 完成報表下載區介面重構與 API 整合
  - 替換 v-tabs 為 nd-tab 元件（自訂報表 / 定期報表）
  - 定期報表新增三重篩選器：品牌、門市、年份（最近5年）
  - 實現品牌自動選擇第一筆資料，確保 API 可正常呼叫
  - 定期報表子 Tab 使用 nd-tab 元件（週報表 / 月報表 / 會員報表）
  - 更新週報表 API 處理邏輯：
    - 適配新 API 格式：`download_info.links` (物件) → `download_info.list` (陣列)
    - 回傳欄位包含：`link`, `start_date`, `week`
    - 計算結束日期（起始日期 + 6 天）並格式化為 YYYY-MM-DD
    - 週報表名稱格式：`2024-12-30 ~ 2025-01-05`（日期範圍）
  - 更新會員報表資料處理：
    - 並行呼叫 `membershipMonthlyPoint` 和 `membershipMonthlyCoupon` API
    - 兩個 API 均加入 `page: 1, size: 9999` 參數確保擷取完整資料
    - 合併點數（type=1）和優惠券（type=2）資料
    - 依 month 欄位進行降冪排序（最新月份在前）
  - 同步更新 API 規格文件 `statistic.api.weekly.spec.md`
  - 修正 API 重複呼叫問題：
    - 移除 `subTab` 的 watch 監聽，避免自動觸發 API 呼叫
    - 改為僅在 `changeSubTab` 方法中手動呼叫 `loadReportDataByTab`
    - 確保只有在用戶點擊 Tab 時才觸發一次 API 請求
  - 實作定期報表與報表下載區的跳轉功能：
    - 定期報表頁面（scheduled-report/index.vue）：
      - 修改按鈕功能：由「歷史紀錄彈窗」改為「跳轉到報表下載區」
      - 實作 `handleRedirectReport` 方法，根據報表類型跳轉：
        - 週報表 → 跳轉至報表下載區的週報表 tab (`tab=weekly`)
        - 月報表 → 跳轉至報表下載區的月報表 tab (`tab=monthly`)
        - 會員卡報表（點數/優惠券）→ 跳轉至報表下載區的會員報表 tab (`tab=member`)
      - 跳轉時傳遞 `brand_id` 和 `store_id` query 參數
    - 報表下載區頁面（download/index.vue）：
      - 新增 `handleRouteQuery` 方法處理路由參數
      - 接收 query 參數（tab, brand_id, store_id）
      - 自動切換到定期報表主 Tab（mainTab = 1）
      - 根據 tab 參數自動切換到對應的子 tab
      - 自動設置品牌和門市篩選器
      - 自動載入對應的報表資料
  - 更新 report.spec.md 規格文檔
- **2025-12-22**: 報表欄位說明配置文件化
  - 目的：集中管理報表欄位說明，提升維護效率
  - 新增 `report-center.config.js` 配置文件：
    - 匯出 `weeklyFieldDescriptions`（週報表欄位說明 15 項）
    - 匯出 `monthlyFieldDescriptions`（月報表欄位說明 15 項）
  - 更新 `scheduled-report/index.vue`：
    - 移除 data() 中的欄位說明陣列定義
    - 改為從 `@/modules/report-center.config.js` 引入
    - 使用 ES6 import 語法：`import { weeklyFieldDescriptions, monthlyFieldDescriptions } from '@/modules/report-center.config.js'`
    - data() 中直接引用：`weeklyFieldDescriptions, monthlyFieldDescriptions`
  - 優點：
    - 集中管理：欄位說明統一在配置文件中維護
    - 易於擴展：未來可新增其他報表配置（如 reportCards）
    - 程式碼簡潔：元件程式碼更清晰，減少 180+ 行重複定義
  - 影響範圍：
    - 新增檔案：`/src/modules/report-center.config.js`
    - 修改檔案：`/src/views/data-center/scheduled-report/index.vue`
    - 功能保持不變：欄位說明彈窗正常顯示
- **2026-01-06**: 修正日期格式處理邏輯，統一支援 ISO 格式轉換
  - 問題：日期選擇器可能回傳 ISO 格式（如 `2025-12-01T00:00:00.000+08:00`），導致 API 參數錯誤
  - 修正範圍：
    - **DateRangeFilter.vue**：
      - 新增 `formatDateToYYYYMMDD()` 方法，將 ISO 格式統一轉換為 `YYYY-MM-DD`
      - 更新 `dateRangeText` computed，使用轉換後的日期格式顯示
      - 更新 `emitChange()` 方法，確保傳出的日期格式為 `YYYY-MM-DD`
    - **order.vue**：
      - 更新 `apiParams` computed，加入 `split('T')[0]` 處理 ISO 格式
      - 確保 `start_date` 和 `end_date` 正確轉換為 `YYYYMMDD` 或 `YYYYMM`
    - **system.vue**：
      - 更新 `formatDateParam()` 方法，加入 ISO 格式處理邏輯
      - 使用 `split('T')[0]` 提取日期部分後再進行格式轉換
      - 新增空值檢查，避免 undefined 錯誤
    - **product.vue**：
      - 更新 `apiParams` computed，加入日期格式處理
      - 使用 `split('T')[0]` 提取 `YYYY-MM-DD` 並轉換為 `YYYYMMDD`
  - 支援的日期格式類型：
    - 標準格式：`YYYY-MM-DD`（如 `2025-12-01`）
    - ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss.sss+TZ`（如 `2025-12-01T00:00:00.000+08:00`）
  - 更新文檔：同步更新 `report.spec.md` 中的日期格式轉換邏輯說明
- **2026-01-09**: UI/UX 優化與程式碼重構
  - **數據概覽 - 商品銷售排名 TOP5**：
    - 時間範圍選項優化：將重複的 v-chip 改寫為 v-for 迴圈渲染
    - 新增 `dateRangeOptions` 陣列統一管理選項（自訂、前7日、前3日、今日）
    - 程式碼簡化：減少重複模板代碼，提升可維護性
    - 檔案：`src/views/data-center/sales/index.vue`
  - **趨勢分析 - 訂單趨勢表格**：
    - 新增 nd-tooltip 元件於「退訂訂單總數」和「退訂訂單總金額」欄位
    - Tooltip 說明文字：
      - 退訂訂單總數：「包含門市拒單、消費者取消等所有未完成的訂單數量」
      - 退訂訂單總金額：「包含門市拒單、消費者取消等所有未完成的訂單金額」
    - 使用 nd-data-table 的 `thContent` slot 自訂表頭渲染
    - 當欄位定義中包含 `tooltip` 屬性時，自動顯示說明圖示
    - 檔案：`src/views/data-center/trend/order.vue`
  - **趨勢分析 - 系統使用率下載功能**：
    - 修改「下載圖表」API 參數格式，移除非必要參數
    - API 參數簡化為：
      - `start_date`: YYYYMMDD 格式（使用 moment 轉換）
      - `end_date`: YYYYMMDD 格式（使用 moment 轉換）
      - `list_type`: 固定值 `'daily_group_by_month'`
    - 移除 brand_ids、store_ids、return_type 等參數
    - 確保下載報表時使用正確的 API 參數格式
    - 檔案：`src/views/data-center/trend/system.vue`
  - **報表下載區 - 會員報表年份篩選**：
    - 修正會員報表切換年份後無法更新資料的問題
    - 原因：`loadMembershipMonthlyPoint` 和 `loadMembershipMonthlyCoupon` 方法未使用 `year` 參數進行過濾
    - 修正方式：
      - 更新兩個方法的 JSDoc，加入 `year` 參數說明
      - 在資料處理時加入 `.filter((item) => !params.year || item.year === params.year)`
      - 將 API 的 `size` 從 10 改為 20，確保載入足夠資料後再過濾
      - 在 MemberReportTable 元件的 watch 中加入 `deep: true` 深度監聽
    - 檔案：
      - `src/mixins/report-loader.mixin.js`
      - `src/views/data-center/download/components/MemberReportTable.vue`
  - **程式碼品質提升**：
    - 減少模板重複代碼，提高可維護性
    - 改善使用者體驗，提供更清晰的資訊提示
    - 修正資料過濾邏輯，確保功能正常運作
- **2026-01-14**: 報表下載區 - 會員報表警告邏輯實作
  - **功能概述**：
    - 在會員報表 Tab 檢查品牌/門市的會員卡啟用狀態
    - 未啟用時顯示警告訊息（依角色顯示不同文案）
    - 參考實作：`src/views/report-center/member/index.vue`
  - **父組件修改** (`download/index.vue`)：
    - 新增 `<member-report-table>` 的 props 傳遞：
      - `:brand-id="scheduledFilters.brand_id"` - 品牌 ID
      - `:store-id="scheduledFilters.store_id || 0"` - 門市 ID
      - `:membership-info="membershipInfo"` - 會員制度資訊
  - **子組件修改** (`components/MemberReportTable.vue`)：
    - **新增 Props**：
      - `brandId` (Number): 品牌 ID
      - `storeId` (Number): 門市 ID，預設 0
      - `membershipInfo` (Object): 包含 `membership_group_type`（會員制度類型）和 `membership_point_type`（點數類型）
    - **新增 Data 屬性**：
      - `memberAuth` (Boolean): 會員卡啟用狀態，預設 false
    - **新增 Computed**：
      - `roleType()`: 從 Vuex store 取得使用者角色（admin/brand/store）
      - `warningDescript()`: 根據角色返回對應的警告文案
        - admin: 「品牌/門市會員卡尚未啟用，啟用後即可使用此服務。」
        - brand: 「會員卡功能尚未開通，需開通後才可使用會員卡服務，若有需求請按右上角聯絡客服。」
        - store: 「會員卡功能尚未開通，需開通後才可使用會員卡服務，若有需求請洽總部或按右上角聯絡你訂客服。」
    - **新增 Watch 監聽**：
      - `brandId`: 變更時觸發 `getAuth()`，設定 `immediate: true` 確保初始載入時執行
      - `storeId`: 變更時觸發 `getAuth()`
    - **新增 Methods**：
      - `getAuth()`: 呼叫 `membershipProvider` API 檢查會員卡狀態
        - 判斷會員制度類型：品牌制（1）或門市制（2）
        - 門市制時傳遞 `storeId`，品牌制時傳 0
        - 根據 `hasMemberCard` 和 `enableList.length` 判斷 `memberAuth`
    - **Template 修改**：
      - 改用 `nd-data-table` 的 `tbodyContent` slot 自訂表格內容
      - 新增警告訊息行（當 `!memberAuth` 時顯示）：
        - 使用 `<nd-warning>` 元件顯示警告
        - colspan="5" 佔滿整行
        - icon: `mdi mdi-alert-circle-outline`
      - 顯示邏輯：
        1. `!memberAuth`: 顯示警告訊息
        2. `memberAuth && !tableList.length`: 顯示「無資料」
        3. `memberAuth && tableList.length > 0`: 顯示正常表格
    - **匯入依賴**：
      - `NdWarning` 元件
      - `membershipProvider` 服務（from `@/core/services/provider.service.js`）
  - **membershipProvider API 說明**：
    - **檔案位置**：`src/core/services/provider.service.js`
    - **參數**：
      - `brandId` (Number): 品牌 ID
      - `storeId` (Number): 門市 ID（品牌制時傳 0）
      - `loading` (Boolean, optional): 是否顯示 loading
    - **回傳結構**：

      ```javascript
      {
        hasMemberCard: true,           // 是否有會員卡
        enableList: [...],             // 啟用的會員制度列表
        meta: {
          membership_group_type: 1,    // 會員制度類型
          membership_point_type: 2     // 點數類型
        }
      }
      ```

    - **權限判斷**：`memberAuth = hasMemberCard && enableList.length > 0`
  - **會員制度類型處理**：
    - 品牌制（`membership_group_type === 1`）：只傳遞 `brandId`，`storeId` 設為 0
    - 門市制（`membership_group_type === 2`）：同時傳遞 `brandId` 和 `storeId`
  - **nd-data-table 組件設定**：
    - 必須設定 `:show-no-data="false"` 關閉預設的無資料顯示
    - 使用 `tbodyContent` slot 完全自訂 tbody 內容
    - colspan 需設為總欄位數（包含 index 欄位）：本表格為 5 欄
  - **參考資料**：
    - 參考實作：`src/views/report-center/member/index.vue`
    - Provider 服務：`src/core/services/provider.service.js`
    - nd-warning 元件：`src/components/nd-warning`
    - nd-data-table 元件：`src/components/nd-data-table`
- **2026-01-14**: 報表下載區 - Store 權限會員報表門市篩選實作
  - **功能概述**：
    - Store 角色在定期報表>會員報表中，篩選器文案顯示「品牌/門市」
    - 品牌/門市下拉選單顯示門市列表（非品牌列表）
    - 自動選擇 API 回傳的第一筆門市資料
    - 從選擇的門市資料中提取 `brand_id` 作為品牌 ID
  - **父組件修改** (`download/index.vue`)：
    - **新增 Data 屬性**：
      - `storeOptions` (Array): 門市選項列表，預設空陣列
      - `scheduledFilters.store_id` (Number): 門市 ID，預設 null
    - **修改 Template**：
      - 篩選器 label 動態調整：
        - Store 角色：「品牌/門市」
        - 其他角色：「品牌」
      - 條件式渲染下拉選單：
        - Store 角色：顯示 `v-autocomplete` 綁定 `storeOptions`（門市列表）
        - 其他角色：顯示 `nd-select-brand-store` 元件（品牌列表）
      - 門市選單配置：
        - `:items="storeOptions"` - 門市選項
        - `item-text="name"` - 顯示門市名稱
        - `item-value="id"` - 門市 ID 作為值
        - `v-model="scheduledFilters.store_id"` - 雙向綁定門市 ID
        - `placeholder="請選擇門市"` - 提示文字
    - **新增 Methods**：
      - `getStoreOptions()`: 取得門市列表
        - 從 Vuex store 讀取 `user.store`（陣列格式）
        - 若 Vuex 無資料，呼叫 `brand.getStoreList()` API
        - 將結果設定到 `storeOptions`
      - `initScheduledFilters()` 修改：
        - Store 角色特殊邏輯：
          1. 呼叫 `getStoreOptions()` 載入門市列表
          2. 自動選擇第一筆門市：`scheduledFilters.store_id = storeOptions[0].id`
          3. 從門市資料提取品牌 ID：`scheduledFilters.brand_id = storeOptions[0].brand_id`
        - Admin/Brand 角色：維持原邏輯（自動選擇第一筆品牌）
      - `searchScheduledReport()` 修改：
        - Store 角色驗證邏輯：檢查 `store_id` 是否存在
        - 其他角色：檢查 `brand_id` 和 `year` 是否存在
      - `clearScheduledFilters()` 修改：
        - 重置 `store_id` 為 null
      - `loadReportDataByTab()` 修改：
        - API params 新增 `store_id: scheduledFilters.store_id || 0`
    - **Created 生命週期**：
      - Store 角色時呼叫 `getStoreOptions()` 預載門市列表
    - **主 Tab 切換優化**：
      - 新增 `watch mainTab` 監聽器
      - 當切換到定期報表（`mainTab === 1`）時：
        1. 檢查當前 `subTab` 是否在 `visibleSubTabs` 中
        2. 若不存在，自動選擇第一個可見的 sub tab
        3. 呼叫 `loadReportDataByTab()` 載入對應資料
      - 修正 Store 角色無法看到會員報表的問題
    - **子 Tab Active 狀態修正**：
      - 新增 `activeSubTabValue` computed 屬性
      - 將 `subTab` id 映射到對應的 value 字串：
        - 0 → 'weekly'（週報表）
        - 1 → 'monthly'（月報表）
        - 2 → 'member'（會員報表）
      - 修改 `nd-tab` 的 `:activeTab` 綁定為 `activeSubTabValue`
      - 解決選中的 tab 沒有 active/focus 樣式的問題
  - **子組件修改** (`components/MemberReportTable.vue`)：
    - **API Bug 修正**：
      - 原代碼：`membershipProvider(this.form.brand_id, storeIdParam)`
      - 問題：`this.form.brand_id` 不存在，導致 `Cannot read properties of undefined (reading 'brand_id')` 錯誤
      - 修正：改為使用 props `this.brandId`
      - 修正後：`membershipProvider(this.brandId, storeIdParam)`
  - **API 參數說明**：
    - `brand.getStoreList()`: 取得品牌下的門市列表
      - 回傳格式：`[{ id: 1, name: '門市名稱', brand_id: 123 }, ...]`
    - `membershipProvider(brandId, storeId)`: 檢查會員卡狀態
      - 使用 props 傳入的 `brandId` 和 `storeId`
  - **權限控制邏輯**：
    - Store 角色：
      - 只能看到自己所屬的門市
      - 品牌 ID 從門市資料中自動提取
      - 篩選器顯示門市列表而非品牌列表
    - Admin/Brand 角色：
      - 顯示品牌列表
      - 門市 ID 傳 0（品牌制）
  - **修正項目總結**：
    - ✅ Store 角色篩選器文案調整為「品牌/門市」
    - ✅ Store 角色下拉選單顯示門市列表
    - ✅ 自動選擇第一筆門市資料
    - ✅ 從門市資料提取 brand_id
    - ✅ Store 角色無法看到會員報表 tab（修正 watch mainTab 邏輯）
    - ✅ 選中的 tab 沒有 active/focus 樣式（新增 activeSubTabValue computed）
    - ✅ Admin 角色品牌篩選器不會自動選擇第一筆（移除不必要的 roleType 檢查）
    - ✅ Cannot read properties of undefined (reading 'brand_id') 錯誤（改用 this.brandId）
  - **參考資料**：
    - 參考實作：`src/views/report-center/member/index.vue`
    - API 文件：`src/api/brand.js` (getStoreList)
    - 元件：`nd-select-brand-store`, `v-autocomplete`

### 路由名稱更新清單

#### 主要路由名稱對照

| 舊路由名稱 | 新路由名稱 | 更新位置 |
| ---------- | ---------- | -------- |
| `DataCenterDashboard` | `AnalyticsOverview` | 登入頁、選單配置、麵包屑 |
| `DataCenterSales` | `AnalyticsOverview` | 選單配置（商品銷售報表併入數據概覽） |
| `DataCenterReport` | `ReportCenterCustom` | 選單配置、View 組件 |
| `DataCenterReportOperation` | `ReportCenterCustomOperation` | 選單配置、View 組件 |
| `DataCenterReportMember` | `ReportCenterCustomMember` | 選單配置、View 組件 |
| `DataCenterReportMarketing` | `ReportCenterCustomMarketing` | 選單配置、View 組件 |
| `DataCenterDownload` | `ReportCenterDownloads` | 選單配置、View 組件 |

#### 已更新的檔案清單

1. **選單配置**
   - `/src/core/config/menu-store.js` - 門市角色選單
   - `/src/core/config/menu-admin.js` - 管理員角色選單

2. **路由配置**
   - `/src/router/breadcrumbs-router.js` - 麵包屑路由判斷

3. **View 組件**
   - `/src/views/login/index.vue` - 登入後跳轉
   - `/src/views/data-center/dashboard/index.vue` - 數據概覽頁面
   - `/src/views/data-center/report/index.vue` - 自訂報表頁面
   - `/src/views/data-center/report/module/index.vue` - 報表模組頁面
   - `/src/views/data-center/download/index.vue` - 報表下載頁面

---

## 2026-02-25 變更：日期處理統一改用 moment.js

### 需求背景

儀表板和報表功能中的日期處理分散使用原生 `Date` 物件和字串操作（`.split('T')[0]`、`.toISOString().slice(0, 10)` 等），造成代碼不一致且易出錯。為統一日期處理並享受 moment.js 提供的更強大日期操作能力，決定在報表相關模組中統一改用 `moment.js`（透過 `vue-moment` 全域注入的 `this.$moment`）。

### 變更摘要（2026-02-25）

統一改用 `this.$moment()` 替代原生日期物件，採用 `this.$moment().format('YYYY-MM-DD')` 格式化日期輸出，保持與現有規範一致。

- **[src/views/data-center/trend/components/DateRangeFilter.vue](../src/views/data-center/trend/components/DateRangeFilter.vue)**
  - `formatDate(datString)` → 改用 `moment(dateString).format('YYYY-MM-DD')`
  - `setTimeRange(range)` → 改用 `moment().subtract(...).format('YYYY-MM-DD')`

- **[src/views/data-center/trend/index.vue](../src/views/data-center/trend/index.vue)**
  - `normalizeDateOnly()` 方法：`.split('T')[0]` → `this.$moment(dateString).format('YYYY-MM-DD')`
  - `initDefaultDateRange()` 方法：
    - 舊：`new Date()` + `setMonth()` + `toISOString().slice(0, 10)`
    - 新：`this.$moment().subtract(1, 'months').format('YYYY-MM-DD')`

- **[src/views/data-center/trend/product.vue](../src/views/data-center/trend/product.vue)**
  - `apiParams()` computed：`.split('T')[0]` → `this.$moment(...).format('YYYY-MM-DD')`
  - `normalizeDateOnly()` 方法：`.split('T')[0]` → `this.$moment(dateString).format('YYYY-MM-DD')`

- **[src/views/data-center/download/index.vue](../src/views/data-center/download/index.vue)**
  - `data()` 中 `scheduledFilters.year` 與 `appliedScheduledFilters.year` 初始值：
    - 舊：`new Date().getFullYear()`
    - 新：`this.$moment().year()`
  - `initYearOptions()` 方法：`new Date().getFullYear()` → `this.$moment().year()`

### 未變更（已使用 vue-moment）

以下檔案已使用 `this.$moment()` 或 `this.$moment().toISOString()`，無需修改：
- [src/views/data-center/sales/index.vue](../src/views/data-center/sales/index.vue)
- [src/views/data-center/report/module/operation/index.vue](../src/views/data-center/report/module/operation/index.vue)

### 好處

1. **代碼一致性**：所有日期操作均透過 moment.js，提高代碼可維護性
2. **格式統一**：確保日期格式始終為 `YYYY-MM-DD`
3. **減少 Bug**：避免原生 Date 物件在跨時區/夏令時的問題
4. **更強大的日期運算**：利用 moment.js 的 `.subtract()`、`.add()` 等方法進行日期計算

### 驗收條件

1. **趨勢分析 → 訂單趨勢**：預設日期範圍顯示為「近一個月」，格式為 `YYYY-MM-DD`
2. **趨勢分析 → 商品排名**：API 查詢參數 `start_date` / `end_date` 格式為 `YYYY-MM-DD`
3. **報表下載區 → 定期報表**：年份下拉預設為當年（2026），選項清單正確顯示最近 7 年
4. **無殘留**：代碼中不再出現 `new Date().getFullYear()`、`.split('T')[0]`、`.toISOString().slice(0, 10)` 等原生日期處理

---

## 2026-03-04 變更：自訂報表 API 重複呼叫優化

### 需求背景

在報表下載區的自訂報表頁面中，發現 `analytics/exportLog/list` API 被重複呼叫多次：
- **admin / brand 角色**：進入頁面時呼叫 3 次（預期 1 次）
- **store 角色**：進入頁面時呼叫 5 次（預期 1 次）

根本原因：分頁元件 `NdPaginate` 在初始化時，`perPage` watcher 會連續 emit `changePerPage` 與 `changePage` 事件，導致 `CustomReportTable` 中綁定的 `@sizeChange` 和 `@pageChange` 各自觸發 API 呼叫。此外，同一時段內多個觸發源（mount、props 更新、分頁事件）未進行合併。

### 變更摘要（2026-03-04）

在 `CustomReportTable.vue` 中引入 lodash `debounce` 與改進錯誤處理：

1. **加入 debounce 合併觸發**
   - 導入：`import debounce from 'lodash/debounce'`
   - 在 `created()` 初始化：`this.debouncedGetTable = debounce(() => this.getTable(), 150)`
   - 所有 API 觸發點統一改為 `this.debouncedGetTable()`：
     - `watch.brandId / watch.storeId`
     - `mounted()`
     - `changePage(index)` 修改為：先判斷頁碼是否真的改變，才呼叫 `debouncedGetTable()`
     - `changePerPage(val)` 修改為：先判斷筆數是否真的改變，同時重置頁碼為 1，然後呼叫 `debouncedGetTable()`

2. **改進 API 呼叫與錯誤處理**
   - `getTable()` 改為 `async` 方法，使用 `await` + `try/catch`
   - `retry(id)` 改為 `async` 方法，成功後改呼叫 `this.debouncedGetTable()` 維持防重複策略
   - 修正原先 `exportLogList()` 直接讀取回傳資料的 bug（Promise 未等待）

3. **生命週期清理**
   - `beforeDestroy()` 中呼叫 `this.debouncedGetTable.cancel()` 清理 debounce queue，避免殘留請求

### 修改檔案

- [src/views/data-center/download/components/CustomReportTable.vue](../src/views/data-center/download/components/CustomReportTable.vue)

### 驗收條件（2026-03-04）

1. **進入自訂報表頁面**
   - admin 角色：API 呼叫 1 次（原 3 次）
   - brand 角色：API 呼叫 1 次（原 3 次）
   - store 角色：API 呼叫 1 次（原 5 次）

2. **手動操作分頁**
   - 切換頁碼：每次操作 API 呼叫 1 次
   - 切換每頁筆數：每次操作 API 呼叫 1 次（頁碼自動重置為 1，但只打 1 次 API）
   - 上/下一頁、首/末頁：各操作 1 次 API 呼叫

3. **重試報表**
   - 點擊「重試」按鈕後：API 呼叫 1 次，清單自動重新整理

4. **切換權限參數（brand_id / store_id）**
   - Props 改變時：合併同一時段內的多次改變，只打 1 次 API

### 設計說明

- **debounce 間距**：設為 150ms，足以合併分頁初始化事件（changePerPage → changePage）
- **no-op 判斷**：`changePage/changePerPage` 檢查值是否真的改變，避免分頁元件同步 prop 時無效觸發
- **錯誤鏈路**：`getTable()` 使用 `try/catch` 捕捉 API 失敗，顯示空列表；`retry()` 同步上報錯誤日誌
- **避免共用元件修改**：此次修改只涉及 `CustomReportTable.vue`，不動 `NdPaginate` 或 `nd-data-table` 共用元件，降低迴歸風險
