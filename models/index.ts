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
  categoryCode: string;
  categoryName: string;
  isCashflowAble: boolean;
  isCashcardAble: boolean;
  isCreditcardAble: boolean;
  isCuaccountAble: boolean;
  isStaccountAble: boolean;
  sort: number;
}

// 貨幣列表 interface
export interface ICurrency {
  no?: number;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  sort: number;
}

// 搜尋帳戶參數 interface
export interface IAccountSearchingParams {
  currencyId: string;
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
  cashflowId: string;
  userId: string;
  cashflowName: string
  accountType: string;
  currency: string;
  currencyName?: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  alertValue: number;
  openAlert: boolean;
  createdDate: string;
  note: string;
}

// 現金收支紀錄 interface
export interface ICashFlowRecordList {
  no?: number;
  tradeId: string;
  cashflowId: string;
  userId: string;
  tradeDatetime: string;
  accountType: string;
  transactionType: string;
  tradeCategory: string;
  tradeAmount: number;
  currency: string;
  currencyName?: string;
  tradeDescription: string;
  tradeNote: string;
}

// 儲值票卡列表 interface
export interface ICashCardList {
  no?: number;
  cashcardId: string;
  userId: string;
  accountType: string;
  cashcardName: string;
  currency: string;
  currencyName?: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  maximumValueAllowed: number;
  alertValue: number;
  openAlert: boolean;
  enable: boolean;
  createdDate: string;
  note: string;
}

// 儲值票卡收支紀錄 interface
export interface ICashCardRecordList {
  no?: number;
  tradeId: string;
  cashcardId: string;
  cashcardName?: string;
  accountType: string;
  tradeDatetime: string;
  transactionType: string;
  tradeCategory: string;
  tradeAmount: number;
  currency: string;
  currencyName?: string;
  tradeDescription: string;
  tradeNote: string;
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
  currencyName?: string;
  creditPerMonth: number;
  expirationDate: string;
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
  tradeDatetime: string;
  creditCardUser: string;
  accountType: string;
  tradeCategory: string;
  tradeAmount: number;
  currency: string;
  currencyName?: string;
  billMonth: string;
  tradeDescription: string;
  tradeNote: string;
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
  currencyName?: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  alertValue: number;
  openAlert: boolean;
  isSalaryAccount: boolean;
  enable: boolean;
  createdDate: string;
  note: string;
}

// 存款帳戶收支紀錄 interface
export interface IcurrencyAccountRecordList {
  no?: number;
  tradeId: string;
  accountId: string;
  tradeDatetime: string;
  accountUser: string;
  accountType: string;
  transactionType: string;
  tradeCategory: string;
  tradeAmount: number;
  currency: string;
  currencyName?: string;
  tradeDescription: string;
  tradeNote: string;
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
  startingAmount: number;
  presentAmount: number;
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
  tradeDatetime: string;
  accountUser: string;
  transactionType: string;
  tradeCategory: string;
  stockNo: string;
  stockName: string;
  pricePerShare: number;
  quantity: number;
  handlingFee: number;
  transactionTax: number;
  totalPrice: number;
  currency: string;
  currencyName?: string;
  tradeDescription: string;
  tradeNote: string;
}
