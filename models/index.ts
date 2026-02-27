
// API response interface
export interface IResponse {
  data?: any;
  message: string;
  returnCode: number;
}

// select option interface
export interface ISelectData {
  label: string;
  value: string;
}

// 使用者資料 interface
export interface IUserData {
  userId: string;
  userName: string;
  userOldPassword: string;
  userNewPassword: string;
  secondPassword: string;
}

// 資料排序方式 interface
export interface ISortArray {
  code?: number;
  sortId: string;
  sortText: string;
  value?: number;
}

// 功能群組列表 interface
export interface IFunctionGroupList {
  functionGroupId: string;
  functionGroupName: string;
  functionGroupIcon: string;
  sort: number;
  functionList: IFunctionList[];
}

export interface IFunctionList {
  functionGroupId: string;
  functionId: string;
  functionName: string;
  url: string;
  functionIcon: string;
  sort: number;
}

// 收支類型 interface
export interface ITradeCategory {
  no?: number;
  tradeCode: string;
  tradeName: string;
  isCashflowAble: boolean;
  isStoredvaluecardAble: boolean;
  isCreditcardAble: boolean;
  isCuaccountAble: boolean;
  isStaccountAble: boolean;
  sort: number;
}

// 貨幣列表 interface
export interface ICurrencyList {
  no?: number;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  minimumDenomination: number;
  sort: number;
}

// 搜尋帳戶參數 interface
export interface IAccountSearchingParams {
  currencyId: string;
}

export interface ITransactionDate {
  transactionCode: string;
  transactionName: string;
}

// 搜尋收支紀錄參數 interface
export interface IFinanceRecordSearchingParams {
  accountId: string;
  currencyId: string;
  tradeCategory: string;
  startingDate: string;
  endDate: string;
}

// 現金流列表 interface
export interface ICashFlowList {
  no?: number;
  accountType: string;
  alertValue: number;
  cashflowId: string;
  cashflowName: string;
  createdDate: string;
  currency: string;
  currencyData: ICurrencyList;
  enable: boolean;
  expenseExpenditureCurrentMonth: number;
  incomeExpenditureCurrentMonth: number;
  minimumValueAllowed: number;
  note: string;
  openAlert: boolean;
  presentAmount: number;
  profitLossExpenditureCurrentMonth: number;
  startingAmount: number;
  userId: string;
}

// 現金收支紀錄 interface
export interface ICashFlowRecordList {
  no?: number;
  tradeId: string;
  cashflowId: string;
  cashflowData: ICashFlowList;
  createdDatetime: string;
  editedDatetime: string;
  userId: string;
  tradeDatetime: string;
  accountType: string;
  transactionType: string;
  transactionCategoryData: ITransactionDate;
  tradeCategory: string;
  tradeCategoryData: ITradeCategory;
  tradeName?: string;
  tradeAmount: number;
  remainingAmount: number;
  currency: string;
  currencyData: ICurrencyList;
  tradeDescription: string;
  tradeNote: string;
}

// 現金流收支資料新增、編輯 interface
export interface ICashFlowRecordData {
  updateData: ICashFlowRecordList;
  oriData: {
    oriTradeDatetime: string;
    oriTradeAmount: number;
    oriRemainingAmount: number;
    oriTransactionType: string;
  };
}

// 儲值票卡列表 interface
export interface IStoredValueCardList {
  no?: number;
  storedValueCardId: string;
  userId: string;
  accountType: string;
  storedValueCardName: string;
  currency: string;
  currencyData: ICurrencyList;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  maximumValueAllowed: number;
  expenseExpenditureCurrentMonth: number;
  incomeExpenditureCurrentMonth: number;
  profitLossExpenditureCurrentMonth: number;
  alertValue: number;
  openAlert: boolean;
  enable: boolean;
  createdDate: string;
  note: string;
}

// 儲值票卡收支紀錄 interface
export interface IStoredValueCardRecordList {
  no?: number;
  tradeId: string;
  storedValueCardId: string;
  storedValueCardData: IStoredValueCardList;
  accountType: string;
  tradeDatetime: string;
  transactionType: string;
  transactionCategoryData: ITransactionDate;
  tradeCategory: string;
  tradeCategoryData: ITradeCategory;
  tradeAmount: number;
  remainingAmount: number;
  currency: string;
  currencyData: ICurrencyList;
  tradeDescription: string;
  tradeNote: string;
  createdDatetime: string;
  editedDatetime: string;
}

// 儲值票卡收支資料新增、編輯 interface
export interface IStoredValueCardRecordData {
  updateData: IStoredValueCardRecordList;
  oriData: {
    oriTradeDatetime: string;
    oriTradeAmount: number;
    oriRemainingAmount: number;
    oriTransactionType: string;
  };
}

// 信用卡列表 interface
export interface ICreditCardList {
  no?: number;
  creditcardId: string;
  userId: string;
  accountType: string;
  creditcardName: string;
  creditcardBankCode: string;
  creditcardBankName: string;
  creditcardSchema: string;
  currency: string;
  currencyData: ICurrencyList;
  limitCredit: number;
  startDate: string;
  expirationDate: string;
  expenditureCurrentMonth: number;
  alertValue: number;
  openAlert: boolean;
  enable: boolean;
  createdDate: string;
  note: string;
}

// 信用卡收支紀錄 interface
export interface ICreditCardRecordList {
  no?: number;
  tradeId: string;
  creditCardId: string;
  creditcardData: ICreditCardList;
  tradeDatetime: string;
  userId: string;
  accountType: string;
  tradeCategory: string;
  tradeCategoryData: ITradeCategory;
  tradeAmount: number;
  currency: string;
  currencyData: ICurrencyList;
  remainingAmount: number;
  billMonth: string;
  tradeDescription: string;
  tradeNote: string;
  createdDatetime: string;
  editedDatetime: string;
}

// 信用卡收支資料新增、編輯 interface
export interface ICreditCardRecordData {
  updateData: ICreditCardRecordList;
  oriData: {
    oriTradeDatetime: string;
    oriTradeAmount: number;
    oriCreditUsage: number;
  };
}

export interface ICreditCardLimitList {
  no?: number;
  creditcardId: string;
  creditcardName?: string;
  userId: string;
  limitYearMonth: string;
  limitCredit: number;
}

// 存款帳戶列表 interface
export interface ICurrencyAccountList {
  no?: number;
  accountId: string;
  userId: string;
  accountType: string;
  accountName: string;
  accountBankCode: string;
  accountBankName: string;
  currency: string;
  currencyData: ICurrencyList;
  startingAmount: number;
  presentAmount: number;
  expenseExpenditureCurrentMonth: number;
  incomeExpenditureCurrentMonth: number;
  profitLossExpenditureCurrentMonth: number;
  isSalaryAccount: false;
  minimumValueAllowed: number;
  alertValue: number;
  openAlert: boolean;
  enable: boolean;
  createdDate: string;
  note: string;
}

// 存款帳戶收支紀錄 interface
export interface IcurrencyAccountRecordList {
  no?: number;
  tradeId: string;
  accountId: string;
  accountData: ICurrencyAccountList;
  tradeDatetime: string;
  accountUser: string;
  accountType: string;
  transactionType: string;
  tradeCategory: string;
  tradeAmount: number;
  remainingAmount: number;
  currency: string;
  tradeDescription: string;
  tradeNote: string;
  currencyData: ICurrencyList;
  transactionCategoryData: ITransactionDate;
  tradeCategoryData: ITradeCategory;
  createdDatetime: string;
  editedDatetime: string;
}

// 存款帳戶收支紀錄新增、編輯 interface
export interface IcurrencyAccountRecordData {
  updateData: IcurrencyAccountRecordList;
  oriData: {
    oriTradeDatetime: string;
    oriTradeAmount: number;
    oriRemainingAmount: number;
    oriTransactionType: string;
  };
}

// 證券帳戶列表 interface
export interface IStockAccountList {
  no?: number;
  accountId: string;
  userId: string;
  accountType: string;
  accountName: string;
  accountBankCode: string;
  accountBankName: string;
  currency: string;
  currencyName?: string;
  currencyData: ICurrencyList;
  startingAmount: number;
  presentAmount: number;
  expenseExpenditureCurrentMonth: number;
  incomeExpenditureCurrentMonth: number;
  profitLossExpenditureCurrentMonth: number;
  minimumValueAllowed: number;
  alertValue: number;
  openAlert: boolean;
  enable: boolean;
  createdDate: string;
  note: string;
}

// 證券帳戶收支紀錄 interface
export interface IStockAccountRecordList {
  no?: number;
  tradeId: string;
  accountId: string;
  accountData: IStockAccountList;
  tradeDatetime: string;
  accountUser: string;
  transactionType: string;
  transactionName?: string;
  enable?: boolean;
  tradeCategory: string;
  tradeName?: string;
  stockNo: string;
  stockName: string;
  pricePerShare: number;
  quantity: number;
  handlingFee: number;
  transactionTax: number;
  stockTotalPrice: number;
  tradeTotalPrice: number;
  remainingAmount: number;
  currency: string;
  currencyName?: string;
  tradeDescription: string;
  tradeNote: string;
  currencyData: ICurrencyList;
  transactionCategoryData: ITransactionDate;
  tradeCategoryData: ITradeCategory;
  createdDatetime: string;
  editedDatetime: string;
}

// 證券帳戶收支資料新增、編輯 interface
export interface IStockAccountRecordData {
  updateData: IStockAccountRecordList;
  oriData: {
    oriTradeDatetime: string;
    oriTradeAmount: number;
    oriRemainingAmount: number;
    oriTransactionType: string;
  };
}

// 存股列表 interface
export interface IStockStorageList {
  stockAccountId: string;
  stockName: string;
  stockNo: string;
  storageQuantity: number;
  userId: string;
  stockStorageDetail: {
    currency: string;
    handlingFee: number;
    pricePerShare: number;
    quantity: number;
    stockName: string;
    stockNo: string;
    stockTotalPrice: number;
    tradeDatetime: string;
    tradeTotalPrice: number;
    transactionTax: number;
  }[];
}

// 股票歷史價位查詢參數 interface
export interface IStockPriceSearchingParams {
  stockNo: string;
  stockName?: string;
  startDate: string;
  endDate: string;
}

// 存股列表 interface
export interface IStockList {
  date: string;
  industryCategory: string;
  stockId: string;
  stockName: string;
  type: string;
}

// 股票歷史價位資料 interface
export interface IStockPriceRecordList {
  Trading_Volume: number;
  Trading_money: number;
  Trading_turnover: number;
  close: number;
  date: string;
  max: number;
  min: number;
  open: number;
  spread: number;
  stock_id: string;
}

// 貨幣匯率查詢參數 interface
export interface ICurrencyExRateSearchingParams {
  currencyId: string;
  startDate?: string;
  endDate?: string;
}

// 貨幣匯率歷史紀錄資料 interface
export interface ICurrencyExRateRecordList {
  cash_buy: number;
  cash_sell: number;
  currency: string;
  date: string;
  spot_buy: number;
  spot_sell: number;
}
