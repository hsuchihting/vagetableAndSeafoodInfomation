<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 蔬菜與海鮮資訊網站的 GitHub Copilot 說明

這是一個使用 Vue 3、Vite 和 Tailwind CSS 建立的專案，用於顯示蔬菜和海鮮的相關資訊。

## 專案技術棧

- Vue 3：前端框架
- Vite：建構工具和開發伺服器
- Tailwind CSS：CSS 框架
- PostCSS：CSS 處理器

## 命名慣例

- 組件使用 PascalCase
- 變量和方法使用 camelCase
- CSS 類名使用 kebab-case

## 代碼風格

- 使用 Vue 3 的 Composition API 和 `<script setup>` 語法
- 優先使用 Tailwind CSS 類名進行樣式設定
- 使用 ES6+ 語法特性

## 目錄結構

- `src/components/`：Vue 組件
- `src/assets/`：靜態資源
- 所有數據相關操作應放在 `src/services/` 目錄中
