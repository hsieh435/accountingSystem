--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-15 11:26:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 28757)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 28794)
-- Name: account_balance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_balance (
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying NOT NULL,
    present_balance numeric(15,3) NOT NULL
);


ALTER TABLE public.account_balance OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 28799)
-- Name: account_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_type (
    account_type_id character varying NOT NULL,
    account_type_name character varying NOT NULL
);


ALTER TABLE public.account_type OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 28804)
-- Name: cashcard_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashcard_list (
    cashcard_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying NOT NULL,
    cashcard_name character varying NOT NULL,
    currency character varying NOT NULL,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    maximum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    alert_value numeric(15,3) DEFAULT 0 NOT NULL,
    open_alert boolean DEFAULT false,
    enable boolean DEFAULT false,
    created_date timestamp with time zone,
    note text
);


ALTER TABLE public.cashcard_list OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 28813)
-- Name: cashcard_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashcard_trade (
    trade_id character varying NOT NULL,
    cashcard_id character varying NOT NULL,
    user_id character varying NOT NULL,
    trade_datetime timestamp with time zone NOT NULL,
    trade_category character varying NOT NULL,
    transaction_type character varying NOT NULL,
    trade_amount numeric(15,3) DEFAULT 0 NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT cashcard_trade_transaction_type CHECK (((trade_category)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.cashcard_trade OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 28820)
-- Name: cashflow_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashflow_list (
    cashflow_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying NOT NULL,
    currency character varying NOT NULL,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    alert_value numeric(15,3) DEFAULT 0 NOT NULL,
    open_alert boolean,
    created_date timestamp with time zone,
    note text
);


ALTER TABLE public.cashflow_list OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 28830)
-- Name: cashflow_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashflow_trade (
    trade_id character varying NOT NULL,
    cashflow_id character varying NOT NULL,
    user_id character varying NOT NULL,
    trade_datetime timestamp with time zone NOT NULL,
    trade_category character varying NOT NULL,
    transaction_type character varying NOT NULL,
    trade_amount numeric(15,3) DEFAULT 0 NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT cashflow_trade_transaction_type CHECK (((trade_category)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.cashflow_trade OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 28837)
-- Name: creditcard_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcard_list (
    creditcard_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying NOT NULL,
    creditcard_name character varying NOT NULL,
    creditcard_bank_code character varying,
    creditcard_bank_name character varying,
    creditcard_schema character varying NOT NULL,
    currency character varying NOT NULL,
    credit_per_month numeric(15,3) NOT NULL,
    expiration_date timestamp with time zone NOT NULL,
    alert_value numeric(15,3) DEFAULT 0,
    open_alert boolean DEFAULT false,
    enable boolean DEFAULT true,
    created_date timestamp with time zone,
    note text
);


ALTER TABLE public.creditcard_list OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 28845)
-- Name: creditcard_schema_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcard_schema_list (
    schema_code character varying NOT NULL,
    schema_name character varying NOT NULL,
    sort integer
);


ALTER TABLE public.creditcard_schema_list OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 28850)
-- Name: creditcard_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcard_trade (
    trade_id character varying NOT NULL,
    credit_card_id character varying NOT NULL,
    trade_datetime timestamp with time zone NOT NULL,
    user_id character varying NOT NULL,
    trade_category character varying NOT NULL,
    trade_amount numeric(15,3) DEFAULT 0 NOT NULL,
    currency character varying NOT NULL,
    bill_month timestamp with time zone NOT NULL,
    trade_description text,
    trade_note text
);


ALTER TABLE public.creditcard_trade OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 28856)
-- Name: currency_account_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_account_list (
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying,
    account_name character varying,
    account_bank_code character varying,
    account_bank_name character varying,
    currency character varying,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    alert_value numeric(15,3) DEFAULT 0 NOT NULL,
    is_salary_account boolean,
    open_alert boolean,
    enable boolean,
    created_date timestamp with time zone,
    note text
);


ALTER TABLE public.currency_account_list OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 28866)
-- Name: currency_account_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_account_trade (
    trade_id character varying NOT NULL,
    account_id character varying NOT NULL,
    trade_datetime timestamp with time zone NOT NULL,
    user_id character varying NOT NULL,
    trade_category character varying NOT NULL,
    transaction_type character varying NOT NULL,
    trade_amount numeric(15,3) DEFAULT 0 NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT currency_account_trade_transaction_type CHECK (((trade_category)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.currency_account_trade OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 28873)
-- Name: currency_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_list (
    currency_code character varying NOT NULL,
    currency_name character varying NOT NULL,
    currency_symbol character varying,
    sort integer DEFAULT 90 NOT NULL
);


ALTER TABLE public.currency_list OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 28879)
-- Name: function; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.function (
    function_group_id character varying NOT NULL,
    function_id character varying NOT NULL,
    function_name character varying NOT NULL,
    url character varying,
    function_icon character varying,
    sort integer
);


ALTER TABLE public.function OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 28884)
-- Name: function_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.function_group (
    function_group_id character varying NOT NULL,
    function_group_name character varying,
    function_group_icon character varying,
    sort integer
);


ALTER TABLE public.function_group OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 28889)
-- Name: stock_account_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_account_list (
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying NOT NULL,
    account_name character varying NOT NULL,
    account_bank_code character varying,
    account_bank_name character varying,
    currency character varying NOT NULL,
    starting_amount numeric(15,3) NOT NULL,
    present_amount numeric(15,3) NOT NULL,
    minimum_value_allowed numeric(15,3) NOT NULL,
    alert_value numeric(15,3) NOT NULL,
    open_alert boolean,
    enable boolean,
    created_date timestamp with time zone,
    note text
);


ALTER TABLE public.stock_account_list OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 28896)
-- Name: stock_account_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_account_trade (
    trade_id character varying NOT NULL,
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    trade_datetime timestamp with time zone NOT NULL,
    trade_category character varying NOT NULL,
    transaction_type character varying NOT NULL,
    stock_no character varying NOT NULL,
    stock_name character varying NOT NULL,
    price_per_share numeric(15,3) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(15,3) NOT NULL,
    handling_fee numeric(15,3) NOT NULL,
    transaction_tax numeric(15,3) NOT NULL,
    trade_price numeric(15,3) NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT stock_account_trade_transaction_type CHECK (((trade_category)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.stock_account_trade OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 28902)
-- Name: stock_storage_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_storage_detail (
    stock_no character varying NOT NULL,
    sno integer NOT NULL,
    stock_name character varying NOT NULL,
    purchase_date timestamp with time zone NOT NULL,
    quantity integer NOT NULL,
    stock_per_share numeric(15,3) NOT NULL,
    cost integer NOT NULL,
    market_price_per_share numeric(15,3) NOT NULL,
    present_value integer NOT NULL,
    pal_value numeric(15,3) NOT NULL,
    pal_percentage numeric(15,3) NOT NULL
);


ALTER TABLE public.stock_storage_detail OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 28907)
-- Name: stock_storage_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_storage_list (
    stock_no character varying NOT NULL,
    stock_name character varying NOT NULL,
    stock_type character varying NOT NULL,
    sno integer NOT NULL
);


ALTER TABLE public.stock_storage_list OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 28912)
-- Name: stock_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_type (
    type_code character varying NOT NULL,
    type_name character varying NOT NULL,
    sort integer NOT NULL
);


ALTER TABLE public.stock_type OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 28917)
-- Name: trade_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trade_category (
    category_code character varying NOT NULL,
    category_name character varying NOT NULL,
    is_cashflow_able boolean DEFAULT false,
    is_cashcard_able boolean DEFAULT false,
    is_creditcard_able boolean DEFAULT false,
    is_cuaccount_able boolean DEFAULT false,
    is_staccount_able boolean DEFAULT false,
    sort integer
);


ALTER TABLE public.trade_category OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 28927)
-- Name: user_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_data (
    user_id character varying(20) NOT NULL,
    user_name character varying(20) NOT NULL,
    user_password character varying NOT NULL,
    created_date timestamp with time zone
);


ALTER TABLE public.user_data OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 28794)
-- Dependencies: 218
-- Data for Name: account_balance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_balance (account_id, user_id, account_type, present_balance) FROM stdin;
\.


--
-- TOC entry 4977 (class 0 OID 28799)
-- Dependencies: 219
-- Data for Name: account_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_type (account_type_id, account_type_name) FROM stdin;
cashFlow	現金流
cashCard	儲值票卡
creditCard	信用卡
currencyAccount	存款帳戶
stockAccount	證券帳戶
\.


--
-- TOC entry 4978 (class 0 OID 28804)
-- Dependencies: 220
-- Data for Name: cashcard_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashcard_list (cashcard_id, user_id, account_type, cashcard_name, currency, starting_amount, present_amount, minimum_value_allowed, maximum_value_allowed, alert_value, open_alert, enable, created_date, note) FROM stdin;
1755133816830	mike	cashCard	行政院月票	NTD	0.000	0.000	0.000	0.000	0.000	f	f	2025-08-14 00:00:00+08	
\.


--
-- TOC entry 4979 (class 0 OID 28813)
-- Dependencies: 221
-- Data for Name: cashcard_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashcard_trade (trade_id, cashcard_id, user_id, trade_datetime, trade_category, transaction_type, trade_amount, currency, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 4980 (class 0 OID 28820)
-- Dependencies: 222
-- Data for Name: cashflow_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashflow_list (cashflow_id, user_id, account_type, currency, starting_amount, present_amount, minimum_value_allowed, alert_value, open_alert, created_date, note) FROM stdin;
1753244234071	mike	cashFlow	NTD	0.000	0.000	0.000	0.000	f	2025-07-23 00:00:00+08	
\.


--
-- TOC entry 4981 (class 0 OID 28830)
-- Dependencies: 223
-- Data for Name: cashflow_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashflow_trade (trade_id, cashflow_id, user_id, trade_datetime, trade_category, transaction_type, trade_amount, currency, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 4982 (class 0 OID 28837)
-- Dependencies: 224
-- Data for Name: creditcard_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcard_list (creditcard_id, user_id, account_type, creditcard_name, creditcard_bank_code, creditcard_bank_name, creditcard_schema, currency, credit_per_month, expiration_date, alert_value, open_alert, enable, created_date, note) FROM stdin;
1754985796294	mike	creditCard	open mobil	000	bbb	VISA	NTD	100000.000	2032-12-01 00:00:00+08	10000.000	t	t	2025-08-12 00:00:00+08	
1754985994652	mike	creditCard	J point	111	aaa	JCB	NTD	100000.000	2027-01-01 00:00:00+08	10000.000	f	t	2025-08-12 00:00:00+08	
\.


--
-- TOC entry 4983 (class 0 OID 28845)
-- Dependencies: 225
-- Data for Name: creditcard_schema_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcard_schema_list (schema_code, schema_name, sort) FROM stdin;
VISA	VISA	1
Mastercard	Mastercard	2
JCB	JCB	3
AmericanExpress	American Express	4
DinersClubInternational	Diners Club International	5
else	其他	99
\.


--
-- TOC entry 4984 (class 0 OID 28850)
-- Dependencies: 226
-- Data for Name: creditcard_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcard_trade (trade_id, credit_card_id, trade_datetime, user_id, trade_category, trade_amount, currency, bill_month, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 4985 (class 0 OID 28856)
-- Dependencies: 227
-- Data for Name: currency_account_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_account_list (account_id, user_id, account_type, account_name, account_bank_code, account_bank_name, currency, starting_amount, present_amount, minimum_value_allowed, alert_value, is_salary_account, open_alert, enable, created_date, note) FROM stdin;
1755074261139	mike	currencyAccount	3333	111	222	NTD	0.000	0.000	0.000	0.000	t	f	t	2025-08-13 00:00:00+08	
\.


--
-- TOC entry 4986 (class 0 OID 28866)
-- Dependencies: 228
-- Data for Name: currency_account_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_account_trade (trade_id, account_id, trade_datetime, user_id, trade_category, transaction_type, trade_amount, currency, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 4987 (class 0 OID 28873)
-- Dependencies: 229
-- Data for Name: currency_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_list (currency_code, currency_name, currency_symbol, sort) FROM stdin;
EUR	歐元	€	5
GBP	英鎊	£	4
JPY	日幣	¥	3
NTD	新臺幣	$	1
NZD	紐西蘭元	$	8
CAD	加拿大元	$	6
CHF	瑞士法郎	Fr	9
CLP	智利披索	$	55
AUD	澳大利亞元	$	7
THB	泰銖	฿	10
VND	越南盾	₫	40
ZAR	南非蘭特	R	60
USD	美元	$	2
\.


--
-- TOC entry 4988 (class 0 OID 28879)
-- Dependencies: 230
-- Data for Name: function; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function (function_group_id, function_id, function_name, url, function_icon, sort) FROM stdin;
personalSetting	cashCardSetting	儲值票卡資料設定	cashCardSetting	wallet-cards	3
personalSetting	creditCardSetting	信用卡資料設定	creditCardSetting	credit-card	4
personalSetting	userSetting	使用者資料	userSetting	fingerprint	1
personalSetting	currencyAccountsSetting	存款帳戶資料設定	currencyAccountsSetting	landmark	5
informationSearching	stockInfo	股市查詢	stockInfo	chart-candlestick	2
personalSetting	stockAccountSetting	證券帳戶資料設定	stockAccountSetting	activity	6
parameterSetting	currencySetting	貨幣設定	currencySetting	circle-dollar-sign	2
financeRecord	cashFlowRecord	現金收支	cashFlowRecord	banknote-arrow-up	1
personalSetting	cashFlowSetting	現金資料設定	cashFlowSetting	banknote-x	2
informationSearching	currencyExchangeRateInfo	外幣匯率查詢	currencyExchangeRateInfo	chart-candlestick	1
parameterSetting	tradeCategorySetting	收支類型設定	tradeCategorySetting	list	1
financeRecord	cashCardRecord	儲值票卡收支	cashCardRecord	banknote-arrow-up	2
financeRecord	creditCardRecord	信用卡收支	creditCardRecord	banknote-arrow-up	3
financeRecord	currencyAccountRecord	存款帳戶收支	currencyAccountRecord	banknote-arrow-up	4
financeRecord	stockAccountRecord	證券帳戶收支	stockAccountRecord	banknote-arrow-up	5
financeStatement	financeStatement	財務報表	financeStatement	clipboard-pen-line	1
financeStatement	stockInvestmentStatement	證券投資報表	stockInvestmentStatement	clipboard-pen-line	2
\.


--
-- TOC entry 4989 (class 0 OID 28884)
-- Dependencies: 231
-- Data for Name: function_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function_group (function_group_id, function_group_name, function_group_icon, sort) FROM stdin;
personalSetting	個人設定	circle-user	1
informationSearching	資訊查詢	book-open	4
parameterSetting	參數設定	settings	5
financeStatement	財務報表	clipboard-pen-line	3
financeRecord	財務收支	banknote-arrow-up	2
\.


--
-- TOC entry 4990 (class 0 OID 28889)
-- Dependencies: 232
-- Data for Name: stock_account_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_account_list (account_id, user_id, account_type, account_name, account_bank_code, account_bank_name, currency, starting_amount, present_amount, minimum_value_allowed, alert_value, open_alert, enable, created_date, note) FROM stdin;
\.


--
-- TOC entry 4991 (class 0 OID 28896)
-- Dependencies: 233
-- Data for Name: stock_account_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_account_trade (trade_id, account_id, user_id, trade_datetime, trade_category, transaction_type, stock_no, stock_name, price_per_share, quantity, total_price, handling_fee, transaction_tax, trade_price, currency, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 4992 (class 0 OID 28902)
-- Dependencies: 234
-- Data for Name: stock_storage_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_storage_detail (stock_no, sno, stock_name, purchase_date, quantity, stock_per_share, cost, market_price_per_share, present_value, pal_value, pal_percentage) FROM stdin;
\.


--
-- TOC entry 4993 (class 0 OID 28907)
-- Dependencies: 235
-- Data for Name: stock_storage_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_storage_list (stock_no, stock_name, stock_type, sno) FROM stdin;
\.


--
-- TOC entry 4994 (class 0 OID 28912)
-- Dependencies: 236
-- Data for Name: stock_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_type (type_code, type_name, sort) FROM stdin;
else	其他	99
otc_	上櫃	2
tse_	上市	1
000	興櫃	3
\.


--
-- TOC entry 4995 (class 0 OID 28917)
-- Dependencies: 237
-- Data for Name: trade_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trade_category (category_code, category_name, is_cashflow_able, is_cashcard_able, is_creditcard_able, is_cuaccount_able, is_staccount_able, sort) FROM stdin;
currency	取得現金	t	f	f	f	f	30
interest	帳戶利息	f	f	f	t	t	40
transferIn	轉帳進入	f	f	f	t	t	52
transferOut	轉帳轉出	f	f	f	t	t	53
books	書籍費	t	t	t	t	f	8
investments	投資	t	f	f	f	f	11
addValue	票卡儲值	t	f	f	f	f	12
creditcardBill	信用卡帳單	t	f	f	f	f	13
insurance	保險費	t	f	t	t	f	14
education	教育費	t	t	t	t	f	10
fuelBills	燃油費	t	t	t	t	f	9
atmDeposit	ATM 存入	t	f	f	t	t	50
salary	薪資	t	f	f	t	f	1
food	伙食費	t	t	t	t	f	2
clothing	治裝費	t	t	t	t	f	3
transportation	交通費	t	t	t	t	f	4
medical	醫藥費	t	t	t	t	f	5
phoneBill	電話費	t	t	t	t	f	6
entertainment	娛樂費	t	t	t	t	f	7
atmWithdraw	ATM 提款	t	f	f	t	t	51
stockDividend	股票股利	f	f	f	f	t	83
cashDividend	現金股利	f	f	f	f	t	82
buyShort	買空	f	f	f	f	t	84
sellShort	賣空	f	f	f	f	t	85
else	其他	t	t	t	t	t	100
stockBuy	股票買入	f	f	f	f	t	80
stockSell	股票賣出	f	f	f	f	t	81
securitiesLending	融券	f	f	f	f	t	86
healthInsurance	健保費	t	f	t	t	f	15
miscellaneous	雜支	t	t	t	t	f	25
currencyExchange	換匯	t	f	f	t	f	20
taxRrefund	退稅	t	f	t	t	f	22
payTaxes	繳稅	t	f	t	t	f	21
\.


--
-- TOC entry 4996 (class 0 OID 28927)
-- Dependencies: 238
-- Data for Name: user_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_data (user_id, user_name, user_password, created_date) FROM stdin;
mike	mike	pPuxl3/DtZEM5of4vuwbNw==	2025-06-01 00:00:00+08
\.


--
-- TOC entry 4790 (class 2606 OID 28933)
-- Name: account_balance account_balance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_balance
    ADD CONSTRAINT account_balance_pkey PRIMARY KEY (account_id, user_id);


--
-- TOC entry 4792 (class 2606 OID 28935)
-- Name: account_type account_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_type
    ADD CONSTRAINT account_type_pkey PRIMARY KEY (account_type_id);


--
-- TOC entry 4794 (class 2606 OID 28937)
-- Name: cashcard_list cashcard_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashcard_list
    ADD CONSTRAINT cashcard_list_pkey PRIMARY KEY (cashcard_id, user_id);


--
-- TOC entry 4796 (class 2606 OID 28939)
-- Name: cashcard_trade cashcard_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashcard_trade
    ADD CONSTRAINT cashcard_trade_pkey PRIMARY KEY (trade_id, cashcard_id);


--
-- TOC entry 4798 (class 2606 OID 28941)
-- Name: cashflow_list cashflow_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashflow_list
    ADD CONSTRAINT cashflow_list_pkey PRIMARY KEY (cashflow_id, user_id);


--
-- TOC entry 4800 (class 2606 OID 28943)
-- Name: cashflow_trade cashflow_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashflow_trade
    ADD CONSTRAINT cashflow_trade_pkey PRIMARY KEY (trade_id, cashflow_id);


--
-- TOC entry 4806 (class 2606 OID 28945)
-- Name: creditcard_trade credit_card_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_trade
    ADD CONSTRAINT credit_card_trade_pkey PRIMARY KEY (trade_id, credit_card_id);


--
-- TOC entry 4802 (class 2606 OID 28947)
-- Name: creditcard_list creditcard_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_list
    ADD CONSTRAINT creditcard_list_pkey PRIMARY KEY (creditcard_id, user_id);


--
-- TOC entry 4804 (class 2606 OID 28949)
-- Name: creditcard_schema_list creditcard_scheme_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_schema_list
    ADD CONSTRAINT creditcard_scheme_list_pkey PRIMARY KEY (schema_code);


--
-- TOC entry 4808 (class 2606 OID 28951)
-- Name: currency_account_list currency_account_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_account_list
    ADD CONSTRAINT currency_account_list_pkey PRIMARY KEY (account_id, user_id);


--
-- TOC entry 4810 (class 2606 OID 28953)
-- Name: currency_account_trade currency_account_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_account_trade
    ADD CONSTRAINT currency_account_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4812 (class 2606 OID 28955)
-- Name: currency_list currency_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_list
    ADD CONSTRAINT currency_list_pkey PRIMARY KEY (currency_code);


--
-- TOC entry 4816 (class 2606 OID 28957)
-- Name: function_group function_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function_group
    ADD CONSTRAINT function_group_pkey PRIMARY KEY (function_group_id);


--
-- TOC entry 4814 (class 2606 OID 28959)
-- Name: function function_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function
    ADD CONSTRAINT function_pkey PRIMARY KEY (function_group_id, function_id);


--
-- TOC entry 4818 (class 2606 OID 28961)
-- Name: stock_account_list stock_account_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_account_list
    ADD CONSTRAINT stock_account_list_pkey PRIMARY KEY (account_id, user_id);


--
-- TOC entry 4820 (class 2606 OID 28963)
-- Name: stock_account_trade stock_account_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_account_trade
    ADD CONSTRAINT stock_account_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4822 (class 2606 OID 28965)
-- Name: stock_storage_detail stock_storage_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_storage_detail
    ADD CONSTRAINT stock_storage_detail_pkey PRIMARY KEY (sno, stock_no);


--
-- TOC entry 4824 (class 2606 OID 28967)
-- Name: stock_storage_list stock_storage_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_storage_list
    ADD CONSTRAINT stock_storage_list_pkey PRIMARY KEY (stock_no);


--
-- TOC entry 4826 (class 2606 OID 28969)
-- Name: stock_type stock_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_type
    ADD CONSTRAINT stock_type_pkey PRIMARY KEY (type_code);


--
-- TOC entry 4828 (class 2606 OID 28971)
-- Name: trade_category trade_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_category
    ADD CONSTRAINT trade_category_pkey PRIMARY KEY (category_code);


--
-- TOC entry 4830 (class 2606 OID 28973)
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (user_id);


-- Completed on 2025-08-15 11:26:17

--
-- PostgreSQL database dump complete
--

