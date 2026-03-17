# nd-data-table 使用規範

> 元件路徑：`src/components/nd-data-table/index.vue`

---

## Props

| 變數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `columns` | Array | `[]` | 表格欄位設定 |
| `data` | Array | `[]` | 表格資料，格式：`[{ key: value }]` |
| `tooltip` | Object | `{}` | 表格提示訊息，格式：`{ key: value }` |
| `showNoData` | Boolean | `true` | 是否顯示無資料 |
| `showIndex` | Boolean | `false` | 是否顯示 index 欄位 |
| `showPaginate` | Boolean | `false` | 是否顯示分頁 |
| `selectable` | Boolean | `false` | 是否可選取 |
| `isSelectSingle` | Boolean | `false` | 是否單選模式 |
| `isSelectAllDisabled` | Boolean | `false` | 是否停用全選 |
| `draggable` | Boolean | `false` | 是否可拖曳 |
| `dragTitle` | String | `'調整順序'` | 拖曳欄標題 |
| `tableClass` | String | `''` | 表格額外 class |
| `indexConfig` | Object | `{ title: '#', class: '', style: {} }` | index 欄設定 |
| `noDataConfig` | Object | `{ text: '無資料', class: 'no-data', style: {} }` | 無資料設定 |
| `pageConfig` | Object | `{ page: 1, size: 10, total: 0 }` | 分頁設定 |
| `checked` | Boolean | `false` | 初始是否選取（搭配 `selectable`） |
| `defaultSelectdAll` | Boolean | `false` | 預設是否全選 |

---

## Columns 欄位設定

`columns` 陣列中，每個欄位可設定以下屬性：

| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `title` | String | ✅ | 欄位標題 |
| `key` | String \| Array | ✅ | 對應資料 key；`Array` 時多個值會用 `splitBy` 串接 |
| `splitBy` | String | | `key` 為 `Array` 時的分隔符，預設 `~` |
| `prefix` | String | | 文字前綴 |
| `suffix` | String | | 文字後綴 |
| `filter` | String | | Vue filter 名稱，僅用於 `item[key]` 單一值 |
| `format` | Function `(item) => String` | | 自訂格式化（可跨欄位、可條件判斷） |
| `isLink` | Boolean | | 是否為連結，點擊觸發 `link:{key}` |
| `isImage` | Boolean | | 是否顯示為圖片 |
| `defaultImage` | String | | 圖片載入失敗時顯示的預設圖 |
| `labelTexts` | Object | | 標籤文字對應：`{ value: text }` |
| `labelColors` | Object | | 標籤顏色對應：`{ value: color }` |
| `bracketKey` | String | | 內容後方括號顯示 key（常用於顯示 id） |
| `thStyle` | Object | | `<th>` inline style |
| `tdStyle` | Object | | `<td>` inline style |
| `thClass` | String | | `<th>` 額外 class |
| `tdClass` | String | | `<td>` 額外 class |

### 特殊 key 規則

- `key: 'brand'`：顯示 `{brand_name}({brand_id})`
- `key: 'store'`：顯示 `{store_name}({store_id})`
- `key: 'drag'`：拖曳控制欄，需搭配 `draggable`

---

## Events

| 事件 | 回傳值 | 說明 |
|------|--------|------|
| `pageChange` | `Number` | 頁數改變 |
| `sizeChange` | `Number` | 每頁數量改變（會回到第 1 頁） |
| `trClick` | `{ item, index }` | 點擊 `<tr>` |
| `tdClick` | `{ column, item, key, value, index }` | 點擊 `<td>`（同時觸發 `trClick`） |
| `link:{key}` | `item` | 點擊連結欄位 |
| `update:data` | `Array` | 拖曳後回傳新排序資料 |
| `update:selectIndex` | `Array` | 選取項目改變時回傳 index 陣列 |

---

## Slots

| Slot | Scope | 說明 |
|------|-------|------|
| `thead` | — | 覆寫整個 `<thead>` |
| `theadContent` | — | 自訂 `<thead>` 內容（`<tr>` 層） |
| `tbody` | — | 覆寫整個 `<tbody>` |
| `tbodyContent` | — | 自訂 `<tbody>` 內容（`<tr>` 層） |
| `th` | `{ column }` | 覆寫整個 `<th>` |
| `thContent` | `{ column }` | 自訂 `<th>` 內容 |
| `td` | `{ item, column, index }` | 覆寫整個 `<td>` |
| `tdContent` | `{ item, column, index }` | 自訂 `<td>` 內容 |

---

## 使用建議

### 何時用欄位設定，何時用 `#tdContent`

| 情境 | 建議做法 | 備註 |
|------|----------|------|
| 文字後綴（如 `100點`） | `suffix` | — |
| 文字前綴（如 `NT$200`） | `prefix` | — |
| 單一參數 filter（只吃 `item[key]`） | `filter` | — |
| 多參數 / 跨欄位 / 條件判斷 | `format` | — |
| 標籤 badge | `labelTexts` + `labelColors`（或 `#tdContent`） | — |
| **簡單連結**（名稱、標題、id 連結） | **`isLink` + `@link:{key}` 事件** | **不應在 `#tdContent` 手動寫 `@click` 邏輯** |
| 圖片顯示 | `isImage` + `defaultImage` | — |
| 需要 HTML 結構或元件（按鈕、複合 UI、複雜格式） | `#tdContent` | 避免用於簡單連結 |

---

### `isLink` 最佳實踐

**✅ 正確做法：使用 `isLink` 配置 + `@link:{key}` 事件**

```js
{
  key: 'activity_name',
  title: '活動名稱(ID)',
  isLink: true,
  bracketKey: 'activity_id', // 在括號內顯示 activity_id
}
```

```vue
<nd-data-table 
  :columns="columns" 
  :data="tableData" 
  @link:activity_name="openActivityInfo($event)"
/>
```

**❌ 避免：在 `#tdContent` 中手動寫簡單連結的 `@click` 邏輯**

```vue
<!-- 不建議 -->
<template #tdContent="{ item, column }">
  <template v-if="column.key === 'name'">
    <a href="javascript:void(0)" @click="openActivityInfo(item)">
      {{ item.activity_name }}({{ item.activity_id }})
    </a>
  </template>
</template>
```

此做法違反元件設計，應改用上方的 `isLink` 配置。

### `format` 使用注意事項

- 若 `format` 內要呼叫 Vue filter（`this.$options.filters.xxx`），請確保可正確取得 `this`。
- 若表格是獨立元件，寫在 data 內回傳 `columns` ，若為共用表格，則寫在 `computed` 內回傳 `columns`，以確保 `format` 中的 `this` 可用。

### `#tdContent` slot 使用原則

- **僅用於複雜結構**：按鈕群、多行文本、換行顯示、自訂元件等。
- **避免用於簡單連結**：應使用 `isLink` + `@link:{key}` 事件，不應在 slot 中手動寫 `@click` 邏輯。
- **避免重複功能**：如果欄位配置（`format`、`labelTexts` 等）已能滿足需求，不需加 `#tdContent`。
- **保持簡潔**：複雜邏輯應提取為 `methods` 或 `computed`，不應直接在模板中堆砌。

---

## 範例

### 基本用法

```vue
<nd-data-table :columns="columns" :data="tableData" />
```

```js
columns: [
  { title: '名稱', key: 'name' },
  { title: '建立時間', key: 'created_at' },
]
```

### prefix / suffix

```js
{ title: '發送點數', key: 'amount', suffix: '點' }
{ title: '金額', key: 'price', prefix: 'NT$' }
```

### filter（單一值）

```js
{ title: '使用期限', key: 'time_config', filter: 'timeConfig' }
{ title: '狀態', key: 'status', filter: 'statusText' }
```

### format（多參數 / 條件）

```js
{
  title: '點數期限',
  key: 'time_config',
  format(item) {
    return this.$options.filters.expireTime(
      item.time_config && item.time_config.expire_mode,
      item.time_config,
    )
  },
}

{
  title: '優惠券轉贈',
  key: 'is_transferable',
  format(item) {
    return item.is_transferable ? '啟用' : '關閉'
  },
}
```

### label

```js
{
  title: '啟用狀態',
  key: 'status',
  labelTexts: { 1: '啟用', 0: '停用' },
  labelColors: { 1: 'label-success', 0: 'label-danger' },
}
```

### isLink

```js
{ title: '名稱', key: 'name', isLink: true }
```

```vue
<nd-data-table :columns="columns" :data="tableData" @link:name="handleNameClick" />
```

**進階範例（搭配 `bracketKey`）：**

```js
{
  title: '活動名稱(ID)',
  key: 'activity_name',
  isLink: true,
  bracketKey: 'activity_id', // 在括號內顯示 activity_id，如：活動A(123)
  thStyle: { width: '25-30%' },
}
```

```vue
<nd-data-table 
  :columns="columns" 
  :data="tableData" 
  @link:activity_name="handleActivityNameClick"
/>
```

```js
handleActivityNameClick(item) {
  // item 是整個資料行，可取得 item.activity_id 等欄位
  this.$router.push({ name: 'ActivityDetail', params: { id: item.activity_id } })
}
```

### bracketKey

```js
{ title: '品牌', key: 'brand_name', bracketKey: 'brand_id' }
```

### 分頁

```vue
<nd-data-table
  :columns="columns"
  :data="tableData"
  :show-paginate="true"
  :page-config="pageConfig"
  @pageChange="handlePageChange"
  @sizeChange="handleSizeChange"
/>
```

```js
pageConfig: {
  page: this.$route.query.page * 1 || 1,
  size: this.$route.query.size * 1 || 10,
  total: 0,
}
```

### 可拖曳排序

```vue
<nd-data-table
  :columns="columns"
  :data.sync="tableData"
  :draggable="true"
  drag-title="排序"
/>
```

```js
{ key: 'drag', title: '拖曳排序', thStyle: { width: '100px' } }
```

### 可選取

```vue
<nd-data-table
  :columns="columns"
  :data="tableData"
  :selectable="true"
  @update:selectIndex="handleSelectChange"
/>
```

### `#tdContent`（僅用於客製結構）

```vue
<nd-data-table :columns="columns" :data="tableData">
  <template #tdContent="{ item, column, index }">
    <template v-if="column.key === 'status'">
      <span :class="['label', statusColor(item.status)]">
        {{ item.status | statusText }}
      </span>
    </template>
    <template v-else-if="column.key === 'actions'">
      <button @click="edit(item)">編輯</button>
      <button @click="remove(index)">刪除</button>
    </template>
  </template>
</nd-data-table>
```

---

## URL Query 與分頁狀態持久化

搭配 `nd-data-table` 分頁時，請同步 URL query，避免重新整理或返回頁面後遺失狀態。

### 初始化：從 `$route.query` 讀取

```js
data() {
  return {
    form: {
      activity_name: this.$route.query.activity_name || null,
      activity_schedule_start_time_date_start:
        this.$route.query.activity_schedule_start_time_date_start || null,
      activity_schedule_start_time_date_end:
        this.$route.query.activity_schedule_start_time_date_end || null,
    },
    tabStatus: this.$route.query.status ? Number(this.$route.query.status) : 0,
    tablePageConfig: {
      page: this.$route.query.page * 1 || 1,
      size: this.$route.query.size * 1 || 10,
      total: 0,
    },
  }
},
```

### 寫入：取得資料後更新 URL

```js
async getActivityList() {
  // ... call API ...

  const routeQuery = {
    page: this.tablePageConfig.page,
    size: this.tablePageConfig.size,
    status: this.tabStatus || 0,
  }

  Object.keys(this.form).forEach((key) => {
    const val = this.form[key]
    if (val) routeQuery[key] = val
  })

  this.$router.replace({ query: routeQuery }).catch(() => {})
}
```

### 注意事項

- URL query 取回來都是字串，`page`、`size`、`status` 需轉型。
- 搜尋條件更新建議用 `$router.replace`，避免堆疊歷史紀錄。
- 新舊 query 相同時可能出現 `NavigationDuplicated`，可用 `.catch(() => {})` 忽略。
