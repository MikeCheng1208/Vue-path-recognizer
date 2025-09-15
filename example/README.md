# Vue Path Recognizer Example

這是一個使用 Vue 3 + Composition API 和 script setup 語法的 vue-path-recognizer 套件示範專案。

## 功能特色

- 使用 Vue 3 Composition API
- 採用 `<script setup>` 語法
- 支援手寫字母和符號識別 (A-Z, ★)
- 即時畫布繪製和識別

## 如何執行

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 打開瀏覽器訪問顯示的本地網址（通常是 `http://localhost:5173`）

## 使用方法

1. 在畫布上用滑鼠畫出字母或符號
2. 系統會自動識別你畫的內容
3. 識別結果會顯示在畫布下方

## 支援的字母和符號

- A-Z 所有英文字母
- ★ 星號符號

## 技術實現

- **Vue 3**: 使用最新的 Composition API
- **Script Setup**: 更簡潔的組件語法
- **Vite**: 快速的建置工具
- **vue-path-recognizer**: 路徑識別套件

## 與 Vue 2 版本的主要差異

1. 使用 `<script setup>` 取代 Options API
2. 使用 `ref()` 和 `reactive()` 管理響應式狀態
3. 使用 `onMounted()` 取代 `mounted()` 生命週期
4. 模板語法更新為 Vue 3 標準
