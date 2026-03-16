
# Project
一個記帳系統，紀錄現金、儲值票卡、信用卡、銀行帳戶、證券帳戶之交易紀錄、報表分析、登入驗證等功能。
An accounting system that records transactions of cash, stored-value cards, credit cards, bank accounts, and securities accounts, provides report analysis, login verification, and other functions.


# 功能特色 / Features

- 使用者登入 / User login
- JWT 驗證 / JWT authentication
- 收入支出管理 / Revenue and expense management


# Npm version: 10.9.2
version: 10.9.2


# Node.js
version: 22.16.0


# UI
nuxt/ui + tailwindcss + sweetalert2 + chart.js


# skill using in frontend
Nuxt 3 + TypeScript



# skill using in backend
node.js



# 資料庫與 SQL / Database and SQL
pgadmin + PostgreSQL



# 安裝 / Installation

1.前端 / frontend
git clone https://github.com/hsieh435/accountingSystem.git
npm i
npm run local

2.後端 / backend
git clone https://github.com/hsieh435/accountingSystemBackend.git
npm i
npm start

3.
於 pgadmin 資料庫建立名為 accountingSystem 的 Database
Create a database named accountingSystem in the pgadmin database.

4.
將後端根目錄中的 accounting.sql 檔案以 restore 方式輸入資料庫
Find the accounting.sql file at backend root directory and into the database using restore mode.
