# code review 原則與開發規範

## 主要 code review 職責

1. 確保程式碼符合團隊的架構原則與開發規範
2. 確保程式碼邏輯清晰、易於理解
3. 確保程式碼沒有明顯的錯誤或潛在的問題
4. 提出風險範圍與需要修改之處，但決定權在開發者
5. 不過度干涉細節（例如：變數命名、註解風格等），除非有明顯的問題
6. 不需要判斷多餘的商業邏輯，只要確保邏輯清晰且不違反架構原則即可
7. 因專案較舊，不要使用 ?? 運算子，避免引入不必要的風險
8. 使用 clean code 原則，確保每一行程式碼都有存在的理由，且每個函式只做一件事
9. 不要寫一行程式碼就結束一個函式，確保函式有足夠的邏輯來說明它的存在理由
10. 時間格式處理一率使用 moment.js，不直接操作原生 Date 物件，若有發現有自己開發的時間格式轉換，請刪除重新引用 moment.js，確保時間處理的一致性與正確性
11. 深拷貝物件或陣列時，使用 lodash 的 _.cloneDeep()，避免使用 JSON.parse(JSON.stringify()) 的寫法，確保資料的完整性與正確性
12. 每個檔案盡量維持在 500 行內，除非是共用元件或是非常複雜的頁面，確保程式碼的可維護性與可讀性
13. 不要在 code review 中提出過多的細節問題，除非有明顯的問題，確保 code review 的重點在於邏輯與架構，而不是細節上的問題
14. 若有多餘未使用的 props 或是 console.log 日誌要先刪除，確保程式碼的整潔與專業性
15. 在使用 nd-data-table 時，參照 nd-data-table 使用規範進行欄位格式化，確保資料表格的一致性與可讀性
16. 共用函式不要使用 mixin，都一率寫成 utils 的 servicefunction，確保程式碼的模組化與可維護性

---

## 時間處理

時間相關的操作一律使用 [moment.js](https://momentjs.com/) 套件處理，不直接操作原生 `Date` 物件。

```js
// ✅ 正確
this.$moment(value).format('YYYY-MM-DD HH:mm')
this.$moment(value).isValid()

// ❌ 避免
new Date(value).toLocaleDateString()
```

---

## 資料深拷貝

深拷貝物件或陣列時，使用 lodash 的 `_.cloneDeep()`，避免使用 `JSON.parse(JSON.stringify())` 的寫法。

`JSON.parse(JSON.stringify())` 的問題：

- 無法處理 `undefined`、`Function`、`Date`、`RegExp` 等型別
- `Date` 物件會被轉成字串，失去原始型別

```js
import _ from 'lodash'

// ✅ 正確
const copy = _.cloneDeep(originalData)

// ❌ 避免
const copy = JSON.parse(JSON.stringify(originalData))
```

---

## 架構與責任邊界原則

### 分頁資料

只要是 server side pagination，排序與過濾必須由後端處理，前端不得對「當頁資料」做全域排序。

> **風險**：前端排序只會改變當頁順序，導致整體資料不一致。

### 資料正確性優先於畫面需求

若需求與資料正確性衝突，必須提出風險，不可用前端 workaround 掩蓋架構問題。

---

## 程式碼品質原則

- 一個 function 只做一件事
- 能 1 行解決不寫 10 行
- 不留明知錯誤的邏輯
- 每一行都能解釋存在理由
- 一個函式不要只寫一行

---

## 開發前自我檢查清單

每次寫功能前問自己：

- [ ] 這筆資料是完整資料還是分頁資料？
- [ ] 排序是否影響全局？
- [ ] 是否有跨頁一致性問題？
- [ ] 是否應由後端處理？
- [ ] 我能向主管解釋這個設計嗎？

---

## AI 使用規範

- 不直接複製 AI 產出
- 自己能口述邏輯
- 重新推導一次
- 檢查是否違反架構原則

## code review 前提

 1. commit 前要先合乎這份規範的內容才能進行 commit，code review 時也會以這份規範為基準進行審核。
 2. code review 的重點在於邏輯是否清晰、架構是否合理、是否有違反這份規範的內容，而不是細節上的問題（例如：變數命名、註解風格等）。當然，如果有明顯的細節問題也會提出，但不會是主要的審核重點。
 3. 若有多餘未使用的 props 或是 console.log 日誌要先刪除，console.error 須保留，並且對應的屬性要賦值對應的空值。

 ## 開發規範：資料表格欄位格式化

在使用 `nd-data-table` 時，參照 [nd-data-table 使用規範](nd-data-table.md) 進行欄位格式化。
