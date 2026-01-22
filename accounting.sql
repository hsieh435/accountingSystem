--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-01-21 20:39:18

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
-- TOC entry 2 (class 3079 OID 38251)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 38288)
-- Name: account_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_type (
    account_type_id character varying NOT NULL,
    account_type_name character varying NOT NULL
);


ALTER TABLE public.account_type OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 38293)
-- Name: cashflow_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashflow_list (
    cashflow_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying NOT NULL,
    cashflow_name character varying NOT NULL,
    currency character varying NOT NULL,
    starting_amount numeric(15,3) DEFAULT 0 NOT NULL,
    present_amount numeric(15,3) DEFAULT 0 NOT NULL,
    minimum_value_allowed numeric(15,3) DEFAULT 0 NOT NULL,
    alert_value numeric(15,3) DEFAULT 0 NOT NULL,
    open_alert boolean,
    enable boolean,
    created_date timestamp with time zone,
    note text
);


ALTER TABLE public.cashflow_list OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 38302)
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
    remaining_amount numeric(15,3) DEFAULT 0 NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT cashflow_trade_transaction_type CHECK (((transaction_type)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.cashflow_trade OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 38310)
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
    expenditure_current_month numeric DEFAULT 0 NOT NULL,
    created_date timestamp with time zone,
    note text
);


ALTER TABLE public.creditcard_list OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 38319)
-- Name: creditcard_schema_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.creditcard_schema_list (
    schema_code character varying NOT NULL,
    schema_name character varying NOT NULL,
    sort integer
);


ALTER TABLE public.creditcard_schema_list OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 38324)
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
-- TOC entry 224 (class 1259 OID 38330)
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
-- TOC entry 225 (class 1259 OID 38339)
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
    remaining_amount numeric(15,3) DEFAULT 0 NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT currency_account_trade_transaction_type CHECK (((transaction_type)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.currency_account_trade OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 38347)
-- Name: currency_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_list (
    currency_code character varying NOT NULL,
    currency_name character varying NOT NULL,
    currency_symbol character varying,
    minimum_denomination numeric(15,3),
    sort integer NOT NULL
);


ALTER TABLE public.currency_list OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 38352)
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
-- TOC entry 228 (class 1259 OID 38357)
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
-- TOC entry 229 (class 1259 OID 38362)
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
-- TOC entry 230 (class 1259 OID 38367)
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
    stock_total_price numeric(15,3) NOT NULL,
    handling_fee numeric(15,3) NOT NULL,
    transaction_tax numeric(15,3) NOT NULL,
    trade_total_price numeric(15,3) NOT NULL,
    remaining_amount numeric(15,3) NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT stock_account_trade_transaction_type CHECK (((transaction_type)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.stock_account_trade OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 38373)
-- Name: stock_storage_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_storage_detail (
    trade_id character varying NOT NULL,
    account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    trade_datetime timestamp with time zone NOT NULL,
    stock_no character varying NOT NULL,
    stock_name character varying NOT NULL,
    price_per_share numeric(15,3) NOT NULL,
    quantity integer NOT NULL,
    stock_total_price numeric(15,3) NOT NULL,
    handling_fee numeric(15,3) NOT NULL,
    transaction_tax numeric(15,3) NOT NULL,
    trade_total_price numeric(15,3) NOT NULL,
    currency character varying
);


ALTER TABLE public.stock_storage_detail OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 38378)
-- Name: stock_storage_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_storage_list (
    stock_account_id character varying NOT NULL,
    user_id character varying NOT NULL,
    stock_no character varying NOT NULL,
    stock_name character varying NOT NULL,
    storage_quantity integer NOT NULL
);


ALTER TABLE public.stock_storage_list OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 38383)
-- Name: stored_value_card_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stored_value_card_list (
    stored_value_card_id character varying NOT NULL,
    user_id character varying NOT NULL,
    account_type character varying NOT NULL,
    stored_value_card_name character varying NOT NULL,
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


ALTER TABLE public.stored_value_card_list OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 38395)
-- Name: stored_value_card_trade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stored_value_card_trade (
    trade_id character varying NOT NULL,
    stored_value_card_id character varying NOT NULL,
    user_id character varying NOT NULL,
    trade_datetime timestamp with time zone NOT NULL,
    trade_category character varying NOT NULL,
    transaction_type character varying NOT NULL,
    trade_amount numeric(15,3) DEFAULT 0 NOT NULL,
    remaining_amount numeric(15,3) DEFAULT 0 NOT NULL,
    currency character varying NOT NULL,
    trade_description text,
    trade_note text,
    CONSTRAINT cashcard_trade_transaction_type CHECK (((transaction_type)::text = ANY (ARRAY[('income'::character varying)::text, ('expense'::character varying)::text])))
);


ALTER TABLE public.stored_value_card_trade OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 38403)
-- Name: trade_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trade_category (
    trade_code character varying NOT NULL,
    trade_name character varying NOT NULL,
    is_cashflow_able boolean DEFAULT false,
    is_storedvaluecard_able boolean DEFAULT false,
    is_creditcard_able boolean DEFAULT false,
    is_cuaccount_able boolean DEFAULT false,
    is_staccount_able boolean DEFAULT false,
    sort integer
);


ALTER TABLE public.trade_category OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 38413)
-- Name: transaction_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_category (
    transaction_code character varying NOT NULL,
    transaction_name character varying NOT NULL
);


ALTER TABLE public.transaction_category OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 38418)
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
-- TOC entry 4973 (class 0 OID 38288)
-- Dependencies: 218
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
-- TOC entry 4974 (class 0 OID 38293)
-- Dependencies: 219
-- Data for Name: cashflow_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashflow_list (cashflow_id, user_id, account_type, cashflow_name, currency, starting_amount, present_amount, minimum_value_allowed, alert_value, open_alert, enable, created_date, note) FROM stdin;
CF-1763304352080	mike	cashFlow	新臺幣現金流	TWD	5000.000	1750.000	0.000	2000.000	t	t	2025-11-16 22:45:52+08	
\.


--
-- TOC entry 4975 (class 0 OID 38302)
-- Dependencies: 220
-- Data for Name: cashflow_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashflow_trade (trade_id, cashflow_id, user_id, trade_datetime, trade_category, transaction_type, trade_amount, remaining_amount, currency, trade_description, trade_note) FROM stdin;
CF-TWD-1763304899130	CF-1763304352080	mike	2026-01-01 08:30:00+08	food	expense	75.000	4925.000	TWD	早餐	
CF-TWD-1763305408658	CF-1763304352080	mike	2026-01-01 12:30:00+08	food	expense	100.000	4825.000	TWD	午餐	
CF-TWD-1763305644763	CF-1763304352080	mike	2026-01-01 18:00:00+08	food	expense	125.000	4700.000	TWD	晚餐	
CF-TWD-1763306018118	CF-1763304352080	mike	2026-01-01 19:30:00+08	fuelBills	expense	600.000	4100.000	TWD	卡費	
CF-TWD-1763306225708	CF-1763304352080	mike	2026-01-02 10:00:00+08	books	expense	350.000	3750.000	TWD	買書	
CF-TWD-1763388609054	CF-1763304352080	mike	2026-01-02 14:00:00+08	addValue	expense	1200.000	2550.000	TWD	悠遊卡儲值	
CF-TWD-1763389078414	CF-1763304352080	mike	2026-01-02 16:00:00+08	miscellaneous	expense	100.000	2450.000	TWD	停車費	
CF-TWD-1768996427314	CF-1763304352080	mike	2026-01-03 13:00:00+08	haircut	expense	700.000	1750.000	TWD	700	
\.


--
-- TOC entry 4976 (class 0 OID 38310)
-- Dependencies: 221
-- Data for Name: creditcard_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcard_list (creditcard_id, user_id, account_type, creditcard_name, creditcard_bank_code, creditcard_bank_name, creditcard_schema, currency, credit_per_month, expiration_date, alert_value, open_alert, enable, expenditure_current_month, created_date, note) FROM stdin;
CC-1756477756722	mike	creditCard	J POINT	012	富邦銀行	JCB	TWD	100000.000	2027-01-01 00:00:00+08	10000.000	f	t	0	2025-08-29 22:29:16+08	\N
CC-1756477841311	mike	creditCard	Open Possible 聯名卡	012	富邦銀行	VISA	TWD	100000.000	2032-06-01 00:00:00+08	10000.000	f	t	0	2025-08-29 22:30:41+08	\N
\.


--
-- TOC entry 4977 (class 0 OID 38319)
-- Dependencies: 222
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
-- TOC entry 4978 (class 0 OID 38324)
-- Dependencies: 223
-- Data for Name: creditcard_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.creditcard_trade (trade_id, credit_card_id, trade_datetime, user_id, trade_category, trade_amount, currency, bill_month, trade_description, trade_note) FROM stdin;
CC-TWD-1756719288930	CC-1756477841311	2025-09-01 17:00:00+08	mike	food	1000.000	TWD	2025-09-01 00:00:00+08		
\.


--
-- TOC entry 4979 (class 0 OID 38330)
-- Dependencies: 224
-- Data for Name: currency_account_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_account_list (account_id, user_id, account_type, account_name, account_bank_code, account_bank_name, currency, starting_amount, present_amount, minimum_value_allowed, alert_value, is_salary_account, open_alert, enable, created_date, note) FROM stdin;
CA-666223322165	mike	currencyAccount	LINE BANK 帳戶	824	LINE BANK	TWD	0.000	5000.000	0.000	5000.000	f	t	t	2025-09-07 16:46:52+08	
\.


--
-- TOC entry 4980 (class 0 OID 38339)
-- Dependencies: 225
-- Data for Name: currency_account_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_account_trade (trade_id, account_id, trade_datetime, user_id, trade_category, transaction_type, trade_amount, remaining_amount, currency, trade_description, trade_note) FROM stdin;
CA-TWD-1757234942642	CA-666223322165	2025-09-07 16:48:43.893+08	mike	transferIn	income	5000.000	5000.000	TWD		
\.


--
-- TOC entry 4981 (class 0 OID 38347)
-- Dependencies: 226
-- Data for Name: currency_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_list (currency_code, currency_name, currency_symbol, minimum_denomination, sort) FROM stdin;
AUD	澳大利亞元	$	0.050	7
EUR	歐元	€	0.010	5
JPY	日幣	¥	1.000	3
USD	美元	$	0.010	2
CAD	加拿大元	$	0.010	6
CHF	瑞士法郎	Fr	0.050	9
CLP	智利披索	$	1.000	55
NZD	紐西蘭元	$	0.100	8
VND	越南盾	₫	200.000	40
KWD	科威特第納爾	KD	5.000	15
TWD	新臺幣	$	1.000	1
GBP	英鎊	£	0.010	4
SAR	Saudi Riyal	ريال	0.010	99
PYG	Paraguayan Guaraní	₲	50.000	97
PLN	Polish Złoty	zł	1.000	96
ARS	Argentine Peso	ARS$	0.050	95
BRL	Brazilian Real	R$	0.010	94
COP	Colombian Peso	$	50.000	93
CRC	Costa Rican Colon	₡	5.000	92
THB	泰銖	฿	1.000	50
TRY	土耳其里拉	₺	0.500	20
ZAR	南非蘭特	R	1.000	22
CZK	Czech Koruna	Kč	1.000	10
DKK	Danish Krone	KR	0.500	11
\.


--
-- TOC entry 4982 (class 0 OID 38352)
-- Dependencies: 227
-- Data for Name: function; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function (function_group_id, function_id, function_name, url, function_icon, sort) FROM stdin;
personalSetting	creditCardSetting	信用卡資料設定	creditCardSetting	credit-card	4
personalSetting	userSetting	使用者資料	userSetting	fingerprint	1
personalSetting	currencyAccountsSetting	存款帳戶資料設定	currencyAccountsSetting	landmark	5
personalSetting	stockAccountSetting	證券帳戶資料設定	stockAccountSetting	activity	6
parameterSetting	currencySetting	貨幣設定	currencySetting	circle-dollar-sign	2
financeRecord	cashFlowRecord	現金收支	cashFlowRecord	banknote-arrow-up	1
personalSetting	cashFlowSetting	現金資料設定	cashFlowSetting	banknote-x	2
parameterSetting	tradeCategorySetting	收支類型設定	tradeCategorySetting	list	1
financeRecord	creditCardRecord	信用卡收支	creditCardRecord	banknote-arrow-up	3
financeRecord	currencyAccountRecord	存款帳戶收支	currencyAccountRecord	banknote-arrow-up	4
financeRecord	stockAccountRecord	證券帳戶收支	stockAccountRecord	banknote-arrow-up	5
outerInformation	currencyExRateInfo	貨幣匯率查詢	currencyExRateInfo	chart-candlestick	2
outerInformation	outerSystemConnect	連線測試	outerSystemConnect	radio	1
personalSetting	storedValueCardSetting	儲值票卡資料設定	storedValueCardSetting	wallet-cards	3
financeRecord	storedValueCardRecord	儲值票卡收支	storedValueCardRecord	banknote-arrow-up	2
financeStatement	consumptionAnalysis	收支分析	consumptionAnalysis	clipboard-pen-line	1
outerInformation	stockInfo	股市查詢	stockInfo	search	3
financeStatement	stockProfitRecord	獲利紀錄	stockProfitRecord	dollar-sign	3
financeStatement	storageProfit	庫存損益	storageProfit	dollar-sign	2
\.


--
-- TOC entry 4983 (class 0 OID 38357)
-- Dependencies: 228
-- Data for Name: function_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.function_group (function_group_id, function_group_name, function_group_icon, sort) FROM stdin;
personalSetting	個人設定	circle-user	1
parameterSetting	參數設定	settings	5
financeStatement	財務報表	clipboard-pen-line	3
financeRecord	財務收支	banknote-arrow-up	2
outerInformation	資訊查詢	book-open	4
\.


--
-- TOC entry 4984 (class 0 OID 38362)
-- Dependencies: 229
-- Data for Name: stock_account_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_account_list (account_id, user_id, account_type, account_name, account_bank_code, account_bank_name, currency, starting_amount, present_amount, minimum_value_allowed, alert_value, open_alert, enable, created_date, note) FROM stdin;
202508292251	mike	stockAccount	元大證券帳戶	806	元大銀行	TWD	500000.000	39090.000	0.000	50000.000	t	t	2025-08-29 22:51:35+08	
\.


--
-- TOC entry 4985 (class 0 OID 38367)
-- Dependencies: 230
-- Data for Name: stock_account_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_account_trade (trade_id, account_id, user_id, trade_datetime, trade_category, transaction_type, stock_no, stock_name, price_per_share, quantity, stock_total_price, handling_fee, transaction_tax, trade_total_price, remaining_amount, currency, trade_description, trade_note) FROM stdin;
ST-TWD-1761832037346	202508292251	mike	2025-07-03 13:00:00+08	stockBuy	expense	2330	台積電	1090.000	100	109000.000	20.000	0.000	109020.000	390980.000	TWD		
ST-TWD-1761832219474	202508292251	mike	2025-07-07 10:00:00+08	stockBuy	expense	2891	中信金	44.950	1000	44950.000	20.000	0.000	44970.000	346010.000	TWD		
ST-TWD-1761832388618	202508292251	mike	2025-07-11 11:30:00+08	stockBuy	expense	1301	台塑	34.000	1000	34000.000	20.000	0.000	34020.000	311990.000	TWD		
ST-TWD-1761832866519	202508292251	mike	2025-07-15 12:00:00+08	stockBuy	expense	6505	台塑化	36.350	1000	36350.000	20.000	0.000	36370.000	275620.000	TWD		
ST-TWD-1761833029560	202508292251	mike	2025-08-27 12:00:00+08	stockBuy	expense	2330	台積電	1190.000	200	238000.000	20.000	0.000	238020.000	37600.000	TWD		
ST-TWD-1761833127654	202508292251	mike	2025-10-09 00:01:00+08	cashDividend	income	2330	台積電	5.000	300	1500.000	10.000	0.000	1490.000	39090.000	TWD		
\.


--
-- TOC entry 4986 (class 0 OID 38373)
-- Dependencies: 231
-- Data for Name: stock_storage_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_storage_detail (trade_id, account_id, user_id, trade_datetime, stock_no, stock_name, price_per_share, quantity, stock_total_price, handling_fee, transaction_tax, trade_total_price, currency) FROM stdin;
ST-TWD-1761832037346	202508292251	mike	2025-07-03 13:00:00+08	2330	台積電	1090.000	100	109000.000	20.000	0.000	109020.000	TWD
ST-TWD-1761832219474	202508292251	mike	2025-07-07 10:00:00+08	2891	中信金	44.950	1000	44950.000	20.000	0.000	44970.000	TWD
ST-TWD-1761832388618	202508292251	mike	2025-07-11 11:30:00+08	1301	台塑	34.000	1000	34000.000	20.000	0.000	34020.000	TWD
ST-TWD-1761833029560	202508292251	mike	2025-08-27 12:00:00+08	2330	台積電	1190.000	200	238000.000	20.000	0.000	238020.000	TWD
ST-TWD-1761832866519	202508292251	mike	2025-07-15 12:00:00+08	6505	台塑化	36.350	1000	36350.000	20.000	0.000	36370.000	TWD
\.


--
-- TOC entry 4987 (class 0 OID 38378)
-- Dependencies: 232
-- Data for Name: stock_storage_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_storage_list (stock_account_id, user_id, stock_no, stock_name, storage_quantity) FROM stdin;
202508292251	mike	1301	台塑	1000
202508292251	mike	2891	中信金	1000
202508292251	mike	2330	台積電	300
202508292251	mike	6505	台塑化	1000
\.


--
-- TOC entry 4988 (class 0 OID 38383)
-- Dependencies: 233
-- Data for Name: stored_value_card_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stored_value_card_list (stored_value_card_id, user_id, account_type, stored_value_card_name, currency, starting_amount, present_amount, minimum_value_allowed, maximum_value_allowed, alert_value, open_alert, enable, created_date, note) FROM stdin;
SVC-1756477469930	mike	cashCard	行政院月票	TWD	0.000	2000.000	-100.000	9999.000	500.000	f	t	2025-08-29 22:24:29+08	
\.


--
-- TOC entry 4989 (class 0 OID 38395)
-- Dependencies: 234
-- Data for Name: stored_value_card_trade; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stored_value_card_trade (trade_id, stored_value_card_id, user_id, trade_datetime, trade_category, transaction_type, trade_amount, remaining_amount, currency, trade_description, trade_note) FROM stdin;
SVC-TWD-1756711025814	SVC-1756477469930	mike	2025-09-01 15:16:00+08	addValue	income	2000.000	2000.000	TWD		
\.


--
-- TOC entry 4990 (class 0 OID 38403)
-- Dependencies: 235
-- Data for Name: trade_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trade_category (trade_code, trade_name, is_cashflow_able, is_storedvaluecard_able, is_creditcard_able, is_cuaccount_able, is_staccount_able, sort) FROM stdin;
currency	取得現金	t	f	f	f	f	30
interest	帳戶利息	f	f	f	t	t	40
transferIn	轉帳進入	f	f	f	t	t	52
transferOut	轉帳轉出	f	f	f	t	t	53
books	書籍費	t	t	t	t	f	8
education	教育費	t	t	t	t	f	10
fuelBills	燃油費	t	t	t	t	f	9
atmDeposit	ATM 存入	t	f	f	t	t	50
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
miscellaneous	雜支	t	t	t	t	f	25
currencyExchange	換匯	t	f	f	t	f	20
taxRrefund	退稅	t	f	t	t	f	22
payTaxes	繳稅	t	f	t	t	f	21
default	初始設置	f	f	f	f	f	99
investments	投資	t	f	f	t	f	11
salary	薪資	t	f	f	t	f	1
donation	捐款	t	t	t	t	f	17
fine	罰款	t	t	t	t	f	23
insurance	保險費	t	f	t	t	f	18
healthInsurance	健保費	t	f	t	t	f	16
creditcardBill	信用卡帳單	t	f	f	t	f	15
addValue	票卡儲值	t	t	f	f	f	14
haircut	理髮費	t	f	t	t	f	13
\.


--
-- TOC entry 4991 (class 0 OID 38413)
-- Dependencies: 236
-- Data for Name: transaction_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_category (transaction_code, transaction_name) FROM stdin;
expense	支出
income	收入
\.


--
-- TOC entry 4992 (class 0 OID 38418)
-- Dependencies: 237
-- Data for Name: user_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_data (user_id, user_name, user_password, created_date) FROM stdin;
mike	Mike	pPuxl3/DtZEM5of4vuwbNw==	2025-06-01 00:00:00+08
\.


--
-- TOC entry 4789 (class 2606 OID 38424)
-- Name: account_type account_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_type
    ADD CONSTRAINT account_type_pkey PRIMARY KEY (account_type_id);


--
-- TOC entry 4819 (class 2606 OID 38426)
-- Name: stored_value_card_list cashcard_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stored_value_card_list
    ADD CONSTRAINT cashcard_list_pkey PRIMARY KEY (stored_value_card_id, user_id);


--
-- TOC entry 4821 (class 2606 OID 38428)
-- Name: stored_value_card_trade cashcard_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stored_value_card_trade
    ADD CONSTRAINT cashcard_trade_pkey PRIMARY KEY (trade_id, stored_value_card_id);


--
-- TOC entry 4791 (class 2606 OID 38430)
-- Name: cashflow_list cashflow_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashflow_list
    ADD CONSTRAINT cashflow_list_pkey PRIMARY KEY (cashflow_id, user_id);


--
-- TOC entry 4793 (class 2606 OID 38432)
-- Name: cashflow_trade cashflow_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashflow_trade
    ADD CONSTRAINT cashflow_trade_pkey PRIMARY KEY (trade_id, cashflow_id);


--
-- TOC entry 4799 (class 2606 OID 38434)
-- Name: creditcard_trade credit_card_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_trade
    ADD CONSTRAINT credit_card_trade_pkey PRIMARY KEY (trade_id, credit_card_id);


--
-- TOC entry 4795 (class 2606 OID 38436)
-- Name: creditcard_list creditcard_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_list
    ADD CONSTRAINT creditcard_list_pkey PRIMARY KEY (creditcard_id, user_id);


--
-- TOC entry 4797 (class 2606 OID 38438)
-- Name: creditcard_schema_list creditcard_scheme_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.creditcard_schema_list
    ADD CONSTRAINT creditcard_scheme_list_pkey PRIMARY KEY (schema_code);


--
-- TOC entry 4801 (class 2606 OID 38440)
-- Name: currency_account_list currency_account_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_account_list
    ADD CONSTRAINT currency_account_list_pkey PRIMARY KEY (account_id, user_id);


--
-- TOC entry 4803 (class 2606 OID 38442)
-- Name: currency_account_trade currency_account_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_account_trade
    ADD CONSTRAINT currency_account_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4805 (class 2606 OID 38444)
-- Name: currency_list currency_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_list
    ADD CONSTRAINT currency_list_pkey PRIMARY KEY (currency_code);


--
-- TOC entry 4809 (class 2606 OID 38446)
-- Name: function_group function_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function_group
    ADD CONSTRAINT function_group_pkey PRIMARY KEY (function_group_id);


--
-- TOC entry 4807 (class 2606 OID 38448)
-- Name: function function_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.function
    ADD CONSTRAINT function_pkey PRIMARY KEY (function_group_id, function_id);


--
-- TOC entry 4811 (class 2606 OID 38450)
-- Name: stock_account_list stock_account_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_account_list
    ADD CONSTRAINT stock_account_list_pkey PRIMARY KEY (account_id, user_id);


--
-- TOC entry 4813 (class 2606 OID 38452)
-- Name: stock_account_trade stock_account_trade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_account_trade
    ADD CONSTRAINT stock_account_trade_pkey PRIMARY KEY (trade_id, account_id);


--
-- TOC entry 4815 (class 2606 OID 38454)
-- Name: stock_storage_detail stock_storage_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_storage_detail
    ADD CONSTRAINT stock_storage_detail_pkey PRIMARY KEY (account_id, trade_id);


--
-- TOC entry 4817 (class 2606 OID 38456)
-- Name: stock_storage_list stock_storage_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_storage_list
    ADD CONSTRAINT stock_storage_list_pkey PRIMARY KEY (stock_account_id, stock_no);


--
-- TOC entry 4823 (class 2606 OID 38458)
-- Name: trade_category trade_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trade_category
    ADD CONSTRAINT trade_category_pkey PRIMARY KEY (trade_code);


--
-- TOC entry 4825 (class 2606 OID 38460)
-- Name: transaction_category transaction_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_category
    ADD CONSTRAINT transaction_category_pkey PRIMARY KEY (transaction_code);


--
-- TOC entry 4827 (class 2606 OID 38462)
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (user_id);


-- Completed on 2026-01-21 20:39:18

--
-- PostgreSQL database dump complete
--

