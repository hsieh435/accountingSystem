--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-29 23:56:11

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
-- TOC entry 8 (class 2615 OID 18763)
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- TOC entry 2 (class 3079 OID 18764)
-- Name: pgagent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgagent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';


--
-- TOC entry 3 (class 3079 OID 18922)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 18959)
-- Name: account_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_types (
    type_id character varying NOT NULL,
    type_name character varying NOT NULL
);


ALTER TABLE public.account_types OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 19064)
-- Name: cashFlow_default; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cashFlow_default" (
    user_id character varying NOT NULL,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    created_date timestamp with time zone
);


ALTER TABLE public."cashFlow_default" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 18985)
-- Name: cashFlow_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cashFlow_trade" (
    trade_id character varying NOT NULL,
    user_id character varying NOT NULL,
    trade_datetime timestamp with time zone,
    account_type character varying,
    incoming_outgoing character varying NOT NULL,
    trade_category character varying,
    trade_amount numeric(15,2) NOT NULL,
    trade_description text,
    trade_note text
);


ALTER TABLE public."cashFlow_trade" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18969)
-- Name: ccurrency_accounts_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ccurrency_accounts_list (
    user_id character varying NOT NULL,
    account_id character varying NOT NULL,
    account_name character varying NOT NULL,
    account_type character varying NOT NULL,
    account_bank character varying,
    account_bank_code character varying,
    account_no character varying,
    starting_amount numeric(15,2) DEFAULT 0 NOT NULL,
    present_amount numeric(15,2) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,2) DEFAULT 0 NOT NULL,
    is_salary_account boolean,
    created_date timestamp with time zone
);


ALTER TABLE public.ccurrency_accounts_list OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 18964)
-- Name: ccurrency_accounts_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ccurrency_accounts_trade (
    trade_id character varying NOT NULL,
    account_id character varying NOT NULL,
    trade_datetime timestamp with time zone,
    account_user character varying,
    account_type character varying,
    incoming_outgoing character varying,
    trade_category character varying,
    trade_amount numeric(14,2),
    trade_description text,
    trade_note text
);


ALTER TABLE public.ccurrency_accounts_trade OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 18975)
-- Name: credit_card_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_card_list (
    creditcard_id character varying NOT NULL,
    creditcard_user character varying NOT NULL,
    creditcard_name character varying NOT NULL,
    creditcard_bank_code character varying,
    creditcard_bank_name character varying,
    creditcard_scheme character varying,
    created_date timestamp with time zone
);


ALTER TABLE public.credit_card_list OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18980)
-- Name: credit_card_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_card_trade (
    trade_id character varying NOT NULL,
    credit_card_id character varying NOT NULL,
    trade_datetime timestamp with time zone,
    credit_card_user character varying,
    account_type character varying,
    trade_category character varying,
    trade_amount numeric(15,2) NOT NULL,
    bill_month timestamp without time zone,
    trade_description text,
    trade_note text
);


ALTER TABLE public.credit_card_trade OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18990)
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
-- TOC entry 242 (class 1259 OID 18995)
-- Name: function_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.function_group (
    function_group_id character varying NOT NULL,
    function_group_name character varying,
    sort integer
);


ALTER TABLE public.function_group OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 19000)
-- Name: stock_account_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_account_trade (
    trade_id character varying NOT NULL,
    account_id character varying NOT NULL,
    account_user character varying,
    trade_datetime timestamp with time zone NOT NULL,
    incoming_outgoing character varying NOT NULL,
    buy_sell character varying NOT NULL,
    stock_no character varying NOT NULL,
    stock_name character varying NOT NULL,
    price_per_share numeric(14,2) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(14,2) NOT NULL,
    handling_fee numeric(14,2) NOT NULL,
    transaction_tax numeric(14,2) NOT NULL,
    trade_price numeric(14,2) NOT NULL,
    trade_description text,
    trade_note text
);


ALTER TABLE public.stock_account_trade OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 19005)
-- Name: stock_accounts_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_accounts_list (
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_name character varying,
    account_type character varying,
    account_bank character varying,
    account_bank_code character varying,
    account_no character varying,
    starting_amount numeric(15,2) DEFAULT 0 NOT NULL,
    present_amount numeric(15,2) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,2) DEFAULT 0 NOT NULL,
    created_date timestamp with time zone
);


ALTER TABLE public.stock_accounts_list OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 19011)
-- Name: trade_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trade_category (
    trade_code character varying NOT NULL,
    trade_name character varying NOT NULL,
    sort integer
);


ALTER TABLE public.trade_category OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 19016)
-- Name: user_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_data (
    user_id character varying(20) NOT NULL,
    user_name character varying(20) NOT NULL,
    user_password character varying,
    created_date timestamp with time zone
);


ALTER TABLE public.user_data OWNER TO postgres;

--
-- TOC entry 4764 (class 0 OID 18765)
-- Dependencies: 220
-- Data for Name: pga_jobagent; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
\.


--
-- TOC entry 4765 (class 0 OID 18774)
-- Dependencies: 222
-- Data for Name: pga_jobclass; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
\.


--
-- TOC entry 4766 (class 0 OID 18784)
-- Dependencies: 224
-- Data for Name: pga_job; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
\.


--
-- TOC entry 4768 (class 0 OID 18832)
-- Dependencies: 228
-- Data for Name: pga_schedule; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
\.


--
-- TOC entry 4769 (class 0 OID 18860)
-- Dependencies: 230
-- Data for Name: pga_exception; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
\.


--
-- TOC entry 4770 (class 0 OID 18874)
-- Dependencies: 232
-- Data for Name: pga_joblog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
\.


--
-- TOC entry 4767 (class 0 OID 18808)
-- Dependencies: 226
-- Data for Name: pga_jobstep; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
\.


--
-- TOC entry 4771 (class 0 OID 18890)
-- Dependencies: 234
-- Data for Name: pga_jobsteplog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
\.


--
-- TOC entry 5016 (class 0 OID 18959)
-- Dependencies: 235
-- Data for Name: account_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_types (type_id, type_name) FROM stdin;
stock	證券帳戶
creditCard	信用卡
currency	存款帳戶
cashFlow	現金
\.


--
-- TOC entry 5028 (class 0 OID 19064)
-- Dependencies: 247
-- Data for Name: cashFlow_default; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cashFlow_default" (user_id, starting_amount, present_amount, minimum_value_allowed, created_date) FROM stdin;
\.


--
-- TOC entry 5021 (class 0 OID 18985)
-- Dependencies: 240
-- Data for Name: cashFlow_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cashFlow_trade" (trade_id, user_id, trade_datetime, account_type, incoming_outgoing, trade_category, trade_amount, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5018 (class 0 OID 18969)
-- Dependencies: 237
-- Data for Name: ccurrency_accounts_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ccurrency_accounts_list (user_id, account_id, account_name, account_type, account_bank, account_bank_code, account_no, starting_amount, present_amount, minimum_value_allowed, is_salary_account, created_date) FROM stdin;
\.


--
-- TOC entry 5017 (class 0 OID 18964)
-- Dependencies: 236
-- Data for Name: ccurrency_accounts_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ccurrency_accounts_trade (trade_id, account_id, trade_datetime, account_user, account_type, incoming_outgoing, trade_category, trade_amount, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5019 (class 0 OID 18975)
-- Dependencies: 238
-- Data for Name: credit_card_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_card_list (creditcard_id, creditcard_user, creditcard_name, creditcard_bank_code, creditcard_bank_name, creditcard_scheme, created_date) FROM stdin;
\.


--
-- TOC entry 5020 (class 0 OID 18980)
-- Dependencies: 239
-- Data for Name: credit_card_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_card_trade (trade_id, credit_card_id, trade_datetime, credit_card_user, account_type, trade_category, trade_amount, bill_month, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5022 (class 0 OID 18990)
-- Dependencies: 241
-- Data for Name: function; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function (function_group_id, function_id, function_name, url, sort) FROM stdin;
financeStatement	inoutStatement	收支報表	/inoutStatement	1
personalSetting	userSetting	使用者資料	/userSetting	1
personalSetting	creditCard	信用卡資料	/creditCard	5
personalSetting	stockAccount	證券帳戶資料	/stockAccount	4
financeRecord	cashFlowRecord	現金收支	/cashFlowRecord	1
financeRecord	creditCardRecord	信用卡紀錄	/creditCardRecord	4
financeRecord	stockAccountRecord	證券帳戶收支	/stockAccountRecord	3
personalSetting	depositAccount	存款帳戶資料	/depositAccount	3
personalSetting	cashFlowSetting	現金	/cashFlowSetting	2
financeRecord	depositAccountRecord	存款帳戶收支	/depositAccountRecord	2
parameterSetting	expenditureTypeSetting	支出類型	/expenditureTypeSetting	1
personalSetting	cashCard	儲值票卡資料	/cashCard	6
financeRecord	cashCardRecord	儲值票卡紀錄	/cashCardRecord	5
\.


--
-- TOC entry 5023 (class 0 OID 18995)
-- Dependencies: 242
-- Data for Name: function_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function_group (function_group_id, function_group_name, sort) FROM stdin;
financeRecord	財務收支	2
financeStatement	財務報表	3
personalSetting	個人設定	1
parameterSetting	參數設定	4
\.


--
-- TOC entry 5024 (class 0 OID 19000)
-- Dependencies: 243
-- Data for Name: stock_account_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_account_trade (trade_id, account_id, account_user, trade_datetime, incoming_outgoing, buy_sell, stock_no, stock_name, price_per_share, quantity, total_price, handling_fee, transaction_tax, trade_price, trade_description, trade_note) FROM stdin;
\.


--
-- TOC entry 5025 (class 0 OID 19005)
-- Dependencies: 244
-- Data for Name: stock_accounts_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_accounts_list (account_id, user_id, account_name, account_type, account_bank, account_bank_code, account_no, starting_amount, present_amount, minimum_value_allowed, created_date) FROM stdin;
\.


--
-- TOC entry 5026 (class 0 OID 19011)
-- Dependencies: 245
-- Data for Name: trade_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trade_category (trade_code, trade_name, sort) FROM stdin;
else_type	其他	99
salary	薪資	1
miscellaneous	雜支	20
transportation	交通費	4
food	伙食費	2
clothing	治裝費	3
currency	取得現金	50
insurance	保險費	10
interest	利息	30
atm	ATM 提款	80
medical	醫藥費	6
phoneBill	電話費	5
entertainment	娛樂費	7
\.


--
-- TOC entry 5027 (class 0 OID 19016)
-- Dependencies: 246
-- Data for Name: user_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_data (user_id, user_name, user_password, created_date) FROM stdin;
mike	mike	pPuxl3/DtZEM5of4vuwbNw==	2025-06-01 00:00:00+08
\.


--
-- TOC entry 4846 (class 2606 OID 19022)
-- Name: account_types account_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_types
    ADD CONSTRAINT account_types_pkey PRIMARY KEY (type_id);


--
-- TOC entry 4870 (class 2606 OID 19073)
-- Name: cashFlow_default cashFlow_Default_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cashFlow_default"
    ADD CONSTRAINT "cashFlow_Default_pkey" PRIMARY KEY (user_id);


--
-- TOC entry 4856 (class 2606 OID 19057)
-- Name: cashFlow_trade cashFlow_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cashFlow_trade"
    ADD CONSTRAINT "cashFlow_trade_pkey" PRIMARY KEY (user_id, trade_id);


--
-- TOC entry 4850 (class 2606 OID 19024)
-- Name: ccurrency_accounts_list ccurrency_accounts_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ccurrency_accounts_list
    ADD CONSTRAINT ccurrency_accounts_list_pkey PRIMARY KEY (user_id, account_id);


--
-- TOC entry 4848 (class 2606 OID 19055)
-- Name: ccurrency_accounts_trade ccurrency_accounts_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ccurrency_accounts_trade
    ADD CONSTRAINT ccurrency_accounts_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4852 (class 2606 OID 19049)
-- Name: credit_card_list credit_card_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_card_list
    ADD CONSTRAINT credit_card_list_pkey PRIMARY KEY (creditcard_id, creditcard_user);


--
-- TOC entry 4854 (class 2606 OID 19051)
-- Name: credit_card_trade credit_card_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_card_trade
    ADD CONSTRAINT credit_card_trade_pkey PRIMARY KEY (trade_id, credit_card_id);


--
-- TOC entry 4860 (class 2606 OID 19028)
-- Name: function_group function_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function_group
    ADD CONSTRAINT function_group_pkey PRIMARY KEY (function_group_id);


--
-- TOC entry 4858 (class 2606 OID 19030)
-- Name: function function_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function
    ADD CONSTRAINT function_pkey PRIMARY KEY (function_group_id, function_id);


--
-- TOC entry 4862 (class 2606 OID 19032)
-- Name: stock_account_trade stock_account_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_account_trade
    ADD CONSTRAINT stock_account_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4864 (class 2606 OID 19034)
-- Name: stock_accounts_list stock_accounts_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_accounts_list
    ADD CONSTRAINT stock_accounts_list_pkey PRIMARY KEY (user_id, account_id);


--
-- TOC entry 4866 (class 2606 OID 19036)
-- Name: trade_category trade_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_category
    ADD CONSTRAINT trade_category_pkey PRIMARY KEY (trade_code);


--
-- TOC entry 4868 (class 2606 OID 19053)
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (user_id);


-- Completed on 2025-06-29 23:56:12

--
-- PostgreSQL database dump complete
--

