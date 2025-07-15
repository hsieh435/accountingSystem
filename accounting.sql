--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-15 20:40:19

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
-- TOC entry 8 (class 2615 OID 19368)
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- TOC entry 2 (class 3079 OID 19369)
-- Name: pgagent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgagent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';


--
-- TOC entry 3 (class 3079 OID 19527)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 19564)
-- Name: account_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_types (
    type_id character varying NOT NULL,
    type_name character varying NOT NULL,
    sort integer
);


ALTER TABLE public.account_types OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 19569)
-- Name: cashcard_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashcard_list (
    cashcard_id character varying NOT NULL,
    cashcard_user character varying NOT NULL,
    cashcard_name character varying,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    maximum_value_allowed numeric(15,3) NOT NULL,
    alert_value numeric(15,3) DEFAULT 0 NOT NULL,
    open_alert boolean,
    created_date timestamp without time zone,
    note text
);


ALTER TABLE public.cashcard_list OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 19577)
-- Name: cashcard_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashcard_trade (
    trade_id character varying NOT NULL,
    cashcard_id character varying NOT NULL,
    account_type character varying,
    trade_datetime timestamp without time zone,
    incoming_outgoing character varying NOT NULL,
    trade_category character varying,
    trade_amount numeric(15,3) NOT NULL,
    trade_description text,
    trade_note text
);


ALTER TABLE public.cashcard_trade OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 19582)
-- Name: cashflow_default; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashflow_default (
    user_id character varying NOT NULL,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    created_date timestamp without time zone
);


ALTER TABLE public.cashflow_default OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 19590)
-- Name: cashflow_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashflow_trade (
    trade_id character varying NOT NULL,
    user_id character varying NOT NULL,
    trade_datetime timestamp without time zone,
    account_type character varying,
    incoming_outgoing character varying NOT NULL,
    trade_category character varying,
    trade_amount numeric(15,3) NOT NULL,
    trade_description text,
    trade_note text
);


ALTER TABLE public.cashflow_trade OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 19595)
-- Name: creditcard_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcard_list (
    creditcard_id character varying NOT NULL,
    creditcard_user character varying NOT NULL,
    creditcard_name character varying NOT NULL,
    creditcard_bank_code character varying,
    creditcard_bank_name character varying,
    creditcard_scheme character varying,
    credit_per_month numeric(15,3) NOT NULL,
    alert_value numeric(15,3) DEFAULT 0 NOT NULL,
    open_alert boolean DEFAULT false,
    created_date timestamp without time zone,
    note text
);


ALTER TABLE public.creditcard_list OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 19602)
-- Name: creditcard_schema_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcard_schema_list (
    schema_code character varying NOT NULL,
    schema_name character varying NOT NULL,
    sort integer
);


ALTER TABLE public.creditcard_schema_list OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 19607)
-- Name: creditcard_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcard_trade (
    trade_id character varying NOT NULL,
    credit_card_id character varying NOT NULL,
    trade_datetime timestamp without time zone,
    creditcard_user character varying,
    account_type character varying,
    trade_category character varying,
    trade_amount numeric(15,3) NOT NULL,
    bill_month timestamp without time zone,
    trade_description text,
    trade_note text
);


ALTER TABLE public.creditcard_trade OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 19612)
-- Name: currency_accounts_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_accounts_list (
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_name character varying NOT NULL,
    account_type character varying,
    account_bank_code character varying,
    account_bank_name character varying,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    alert_value numeric(15,3) DEFAULT 0 NOT NULL,
    open_alert boolean,
    is_salary_account boolean,
    created_date timestamp without time zone,
    note text
);


ALTER TABLE public.currency_accounts_list OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 19621)
-- Name: currency_accounts_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_accounts_trade (
    trade_id character varying NOT NULL,
    account_id character varying NOT NULL,
    trade_datetime timestamp without time zone,
    account_user character varying,
    account_type character varying,
    incoming_outgoing character varying,
    trade_category character varying,
    trade_amount numeric(15,3) DEFAULT 0,
    trade_description text,
    trade_note text
);


ALTER TABLE public.currency_accounts_trade OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 19627)
-- Name: function; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.function (
    function_group_id character varying NOT NULL,
    function_id character varying NOT NULL,
    function_name character varying NOT NULL,
    url character varying,
    sort integer
);


ALTER TABLE public.function OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 19632)
-- Name: function_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.function_group (
    function_group_id character varying NOT NULL,
    function_group_name character varying,
    sort integer
);


ALTER TABLE public.function_group OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 19637)
-- Name: stock_account_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_account_trade (
    trade_id character varying NOT NULL,
    account_id character varying NOT NULL,
    account_user character varying,
    trade_datetime timestamp without time zone NOT NULL,
    incoming_outgoing character varying NOT NULL,
    buy_sell character varying NOT NULL,
    stock_no character varying NOT NULL,
    stock_name character varying NOT NULL,
    price_per_share numeric(15,3) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(15,3) NOT NULL,
    handling_fee numeric(15,3) NOT NULL,
    transaction_tax numeric(15,3) NOT NULL,
    trade_price numeric(15,3) NOT NULL,
    trade_description text,
    trade_note text
);


ALTER TABLE public.stock_account_trade OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 19642)
-- Name: stock_accounts_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_accounts_list (
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_name character varying,
    account_type character varying,
    account_bank_code character varying,
    account_bank_name character varying,
    starting_amount numeric(15,3) NOT NULL,
    present_amount numeric(15,3) NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    alert_value numeric(15,3) NOT NULL,
    open_alert boolean,
    created_date timestamp without time zone,
    note text
);


ALTER TABLE public.stock_accounts_list OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 19648)
-- Name: stock_storage_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_storage_detail (
    stock_no character varying NOT NULL,
    sno integer NOT NULL,
    stock_name character varying NOT NULL,
    purchase_date timestamp without time zone NOT NULL,
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
-- TOC entry 250 (class 1259 OID 19653)
-- Name: stock_storage_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_storage_list (
    stock_no character varying NOT NULL,
    stock_name character varying NOT NULL,
    sno integer NOT NULL
);


ALTER TABLE public.stock_storage_list OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 19658)
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
-- TOC entry 252 (class 1259 OID 19668)
-- Name: user_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_data (
    user_id character varying(20) NOT NULL,
    user_name character varying(20) NOT NULL,
    user_password character varying NOT NULL,
    created_date timestamp without time zone
);


ALTER TABLE public.user_data OWNER TO postgres;

--
-- TOC entry 4784 (class 0 OID 19370)
-- Dependencies: 220
-- Data for Name: pga_jobagent; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
\.


--
-- TOC entry 4785 (class 0 OID 19379)
-- Dependencies: 222
-- Data for Name: pga_jobclass; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
\.


--
-- TOC entry 4786 (class 0 OID 19389)
-- Dependencies: 224
-- Data for Name: pga_job; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
\.


--
-- TOC entry 4788 (class 0 OID 19437)
-- Dependencies: 228
-- Data for Name: pga_schedule; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
\.


--
-- TOC entry 4789 (class 0 OID 19465)
-- Dependencies: 230
-- Data for Name: pga_exception; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
\.


--
-- TOC entry 4790 (class 0 OID 19479)
-- Dependencies: 232
-- Data for Name: pga_joblog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
\.


--
-- TOC entry 4787 (class 0 OID 19413)
-- Dependencies: 226
-- Data for Name: pga_jobstep; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
\.


--
-- TOC entry 4791 (class 0 OID 19495)
-- Dependencies: 234
-- Data for Name: pga_jobsteplog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
\.


--
-- TOC entry 5056 (class 0 OID 19564)
-- Dependencies: 235
-- Data for Name: account_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_types (type_id, type_name, sort) FROM stdin;
cashCard	儲值票卡	2
cashFlow	現金	1
creditCard	信用卡	3
currencyAccount	存款帳戶	4
stockAccount	證券帳戶	5
\.


--
-- TOC entry 5057 (class 0 OID 19569)
-- Dependencies: 236
-- Data for Name: cashcard_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashcard_list (cashcard_id, cashcard_user, cashcard_name, starting_amount, present_amount, minimum_value_allowed, maximum_value_allowed, alert_value, open_alert, created_date, note) FROM stdin;
\.


--
-- TOC entry 5058 (class 0 OID 19577)
-- Dependencies: 237
-- Data for Name: cashcard_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashcard_trade (trade_id, cashcard_id, account_type, trade_datetime, incoming_outgoing, trade_category, trade_amount, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5059 (class 0 OID 19582)
-- Dependencies: 238
-- Data for Name: cashflow_default; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashflow_default (user_id, starting_amount, present_amount, minimum_value_allowed, created_date) FROM stdin;
\.


--
-- TOC entry 5060 (class 0 OID 19590)
-- Dependencies: 239
-- Data for Name: cashflow_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashflow_trade (trade_id, user_id, trade_datetime, account_type, incoming_outgoing, trade_category, trade_amount, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5061 (class 0 OID 19595)
-- Dependencies: 240
-- Data for Name: creditcard_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcard_list (creditcard_id, creditcard_user, creditcard_name, creditcard_bank_code, creditcard_bank_name, creditcard_scheme, credit_per_month, alert_value, open_alert, created_date, note) FROM stdin;
\.


--
-- TOC entry 5062 (class 0 OID 19602)
-- Dependencies: 241
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
-- TOC entry 5063 (class 0 OID 19607)
-- Dependencies: 242
-- Data for Name: creditcard_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcard_trade (trade_id, credit_card_id, trade_datetime, creditcard_user, account_type, trade_category, trade_amount, bill_month, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5064 (class 0 OID 19612)
-- Dependencies: 243
-- Data for Name: currency_accounts_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_accounts_list (account_id, user_id, account_name, account_type, account_bank_code, account_bank_name, starting_amount, present_amount, minimum_value_allowed, alert_value, open_alert, is_salary_account, created_date, note) FROM stdin;
\.


--
-- TOC entry 5065 (class 0 OID 19621)
-- Dependencies: 244
-- Data for Name: currency_accounts_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_accounts_trade (trade_id, account_id, trade_datetime, account_user, account_type, incoming_outgoing, trade_category, trade_amount, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5066 (class 0 OID 19627)
-- Dependencies: 245
-- Data for Name: function; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function (function_group_id, function_id, function_name, url, sort) FROM stdin;
personalSetting	userSetting	使用者資料	/userSetting	1
financeRecord	cashFlowRecord	現金收支	/cashFlowRecord	1
personalSetting	cashFlowSetting	現金資料設定	/cashFlowSetting	2
personalSetting	currencyAccountsSetting	存款帳戶資料設定	/currencyAccountsSetting	5
personalSetting	stockAccountSetting	證券帳戶資料設定	/stockAccountSetting	6
personalSetting	creditCardSetting	信用卡資料設定	/creditCardSetting	4
personalSetting	cashCardSetting	儲值票卡資料設定	/cashCardSetting	3
financeRecord	currencyAccountRecord	存款帳戶收支	/currencyAccountRecord	4
financeRecord	stockAccountRecord	證券帳戶收支	/stockAccountRecord	5
financeRecord	creditCardRecord	信用卡收支	/creditCardRecord	3
financeRecord	cashCardRecord	儲值票卡收支	/cashCardRecord	2
parameterSetting	accountTypeSetting	帳戶類型設定	/accountTypeSetting	2
parameterSetting	tradeCategorySetting	收支類型設定	/tradeCategorySetting	1
financeStatement	stockInvestmentStatement	證券投資報表	/stockInvestmentStatement	2
financeStatement	financeStatement	財務報表	/financeStatement	1
\.


--
-- TOC entry 5067 (class 0 OID 19632)
-- Dependencies: 246
-- Data for Name: function_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function_group (function_group_id, function_group_name, sort) FROM stdin;
financeRecord	財務收支	2
financeStatement	財務報表	3
personalSetting	個人設定	1
parameterSetting	參數設定	4
\.


--
-- TOC entry 5068 (class 0 OID 19637)
-- Dependencies: 247
-- Data for Name: stock_account_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_account_trade (trade_id, account_id, account_user, trade_datetime, incoming_outgoing, buy_sell, stock_no, stock_name, price_per_share, quantity, total_price, handling_fee, transaction_tax, trade_price, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5069 (class 0 OID 19642)
-- Dependencies: 248
-- Data for Name: stock_accounts_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_accounts_list (account_id, user_id, account_name, account_type, account_bank_code, account_bank_name, starting_amount, present_amount, minimum_value_allowed, alert_value, open_alert, created_date, note) FROM stdin;
\.


--
-- TOC entry 5070 (class 0 OID 19648)
-- Dependencies: 249
-- Data for Name: stock_storage_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_storage_detail (stock_no, sno, stock_name, purchase_date, quantity, stock_per_share, cost, market_price_per_share, present_value, pal_value, pal_percentage) FROM stdin;
\.


--
-- TOC entry 5071 (class 0 OID 19653)
-- Dependencies: 250
-- Data for Name: stock_storage_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_storage_list (stock_no, stock_name, sno) FROM stdin;
\.


--
-- TOC entry 5072 (class 0 OID 19658)
-- Dependencies: 251
-- Data for Name: trade_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trade_category (category_code, category_name, is_cashflow_able, is_cashcard_able, is_creditcard_able, is_cuaccount_able, is_staccount_able, sort) FROM stdin;
currency	取得現金	t	f	f	f	f	30
interest	帳戶利息	f	f	f	t	t	40
miscellaneous	雜支	t	t	t	t	f	20
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
buy	股票買入	f	f	f	f	t	80
sell	股票賣出	f	f	f	f	t	81
stockDividend	股票股利	f	f	f	f	t	83
cashDividend	現金股利	f	f	f	f	t	82
buyShort	買空	f	f	f	f	t	84
sellShort	賣空	f	f	f	f	t	85
else	其他	t	t	t	t	t	100
securitieslending	融券	f	f	f	f	t	86
\.


--
-- TOC entry 5073 (class 0 OID 19668)
-- Dependencies: 252
-- Data for Name: user_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_data (user_id, user_name, user_password, created_date) FROM stdin;
mike	mike	pPuxl3/DtZEM5of4vuwbNw==	2025-06-01 00:00:00
\.


--
-- TOC entry 4876 (class 2606 OID 19674)
-- Name: account_types account_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_types
    ADD CONSTRAINT account_types_pkey PRIMARY KEY (type_id);


--
-- TOC entry 4878 (class 2606 OID 19676)
-- Name: cashcard_list cashcard_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashcard_list
    ADD CONSTRAINT cashcard_list_pkey PRIMARY KEY (cashcard_id, cashcard_user);


--
-- TOC entry 4880 (class 2606 OID 19678)
-- Name: cashcard_trade cashcard_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashcard_trade
    ADD CONSTRAINT cashcard_trade_pkey PRIMARY KEY (trade_id, cashcard_id);


--
-- TOC entry 4882 (class 2606 OID 19680)
-- Name: cashflow_default cashflow_default_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashflow_default
    ADD CONSTRAINT cashflow_default_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4884 (class 2606 OID 19682)
-- Name: cashflow_trade cashflow_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashflow_trade
    ADD CONSTRAINT cashflow_trade_pkey PRIMARY KEY (trade_id, user_id);


--
-- TOC entry 4892 (class 2606 OID 19684)
-- Name: currency_accounts_list ccurrency_accounts_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_accounts_list
    ADD CONSTRAINT ccurrency_accounts_list_pkey PRIMARY KEY (account_id, user_id);


--
-- TOC entry 4894 (class 2606 OID 19686)
-- Name: currency_accounts_trade ccurrency_accounts_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_accounts_trade
    ADD CONSTRAINT ccurrency_accounts_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4886 (class 2606 OID 19688)
-- Name: creditcard_list credit_card_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_list
    ADD CONSTRAINT credit_card_list_pkey PRIMARY KEY (creditcard_id, creditcard_user);


--
-- TOC entry 4890 (class 2606 OID 19690)
-- Name: creditcard_trade credit_card_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_trade
    ADD CONSTRAINT credit_card_trade_pkey PRIMARY KEY (trade_id, credit_card_id);


--
-- TOC entry 4888 (class 2606 OID 19692)
-- Name: creditcard_schema_list creditcard_scheme_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_schema_list
    ADD CONSTRAINT creditcard_scheme_list_pkey PRIMARY KEY (schema_code);


--
-- TOC entry 4898 (class 2606 OID 19694)
-- Name: function_group function_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function_group
    ADD CONSTRAINT function_group_pkey PRIMARY KEY (function_group_id);


--
-- TOC entry 4896 (class 2606 OID 19696)
-- Name: function function_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function
    ADD CONSTRAINT function_pkey PRIMARY KEY (function_group_id, function_id);


--
-- TOC entry 4900 (class 2606 OID 19698)
-- Name: stock_account_trade stock_account_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_account_trade
    ADD CONSTRAINT stock_account_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4902 (class 2606 OID 19700)
-- Name: stock_accounts_list stock_accounts_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_accounts_list
    ADD CONSTRAINT stock_accounts_list_pkey PRIMARY KEY (user_id, account_id);


--
-- TOC entry 4904 (class 2606 OID 19702)
-- Name: stock_storage_detail stock_storage_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_storage_detail
    ADD CONSTRAINT stock_storage_detail_pkey PRIMARY KEY (sno, stock_no);


--
-- TOC entry 4906 (class 2606 OID 19704)
-- Name: stock_storage_list stock_storage_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_storage_list
    ADD CONSTRAINT stock_storage_list_pkey PRIMARY KEY (stock_no);


--
-- TOC entry 4908 (class 2606 OID 19706)
-- Name: trade_category trade_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_category
    ADD CONSTRAINT trade_category_pkey PRIMARY KEY (category_code);


--
-- TOC entry 4910 (class 2606 OID 19708)
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (user_id);


-- Completed on 2025-07-15 20:40:20

--
-- PostgreSQL database dump complete
--

