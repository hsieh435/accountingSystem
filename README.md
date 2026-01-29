# Project

一個記帳系統，紀錄現金、儲值票卡、信用卡、銀行帳戶、證券帳戶之交易紀錄、報表分析、登入驗證等功能。
An accounting system that records transactions of cash, stored-value cards, credit cards, bank accounts, and securities accounts, provides report analysis, login verification, and other functions.


## 功能特色 / Features


- 使用者登入 / JWT 驗證
- 收入支出管理
- PostgreSQL 整合

- User login / JWT authentication
- Revenue and expense management
- PostgreSQL integration


## 安裝方式 / Installation

```bash
1.下載前端程式 / frontend
git clone https://github.com/hsieh435/accountingSystem.git
npm i
npm run local

2.下載後端程式 / backend
git clone https://github.com/hsieh435/accountingSystemBackend.git
npm i
npm start

3.
於 pgadmin 資料庫建立名為 accountingSystem 的 Database
Create a database named accountingSystem in the pgadmin database.

4.
將 accounting.sql 檔案以 restore 方式輸入資料庫
Import the accounting.sql file into the database using restore mode.



前端使用技術 / skill using in frontend
UI / UX：SCSS + Tailwind + Nuxt UI
Nuxt 3
chart.js


後端使用技術 / skill using in backend
node.js

資料庫 / database
pgadmin
