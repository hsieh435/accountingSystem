# Project

一個記帳系統，支援交易紀錄、報表分析、登入驗證等功能。


## 功能特色

- 使用者登入 / JWT 驗證
- 收入支出管理
- PostgreSQL 整合

## 安裝方式

```bash
1.下載前端程式
git clone https://github.com/hsieh435/accountingSystem.git
npm i
npm run dev

2.下載後端程式
git clone https://github.com/hsieh435/accountingSystemBackend.git
npm i
npm start

3.於 pgadmin 資料庫建立名為 accountingSystem 的 Database

4.將 accounting.sql 檔案以 restore 方式輸入資料庫



前端使用技術
UI / UX：SCSS + Tailwind + Nuxt UI
框架：Nuxt 3
資料視覺化：plotly.js


後端使用技術
node.js

資料庫
pgadmin
