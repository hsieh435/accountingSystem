
// API response interface
export interface IResponse {
  data?: any;
  returnCode: number;
  message: string;
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
  allowDelete?: boolean;
  sort: number;
}

// 現金流列表 interface
export interface ICashFlowList {
  no?: number;
  cashflowId: string;
  userId: string;
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
  userId: string;
  tradeDatetime: string;
  accountType: string;
  incomingOutgoing: string;
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
  cashCardId: string;
  cashCardUser: string;
  cashCardName: string;
  currency: string;
  currencyName?: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  maximumValueAllowed: number;
  alertValue: number;
  openAlert: boolean;
  createdDate: string;
}

// 儲值票卡收支紀錄 interface
export interface ICashCardRecordList {
  no?: number;
  tradeId: string;
  cashCardId: string;
  cashCardName?: string;
  accountType: string;
  tradeDatetime: string;
  incomingOutgoing: string;
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
  creditcardUser: string;
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
  createdDate: string;
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
  accountName: string;
  accountType: string;
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
  createdDate: string;
}

// 存款帳戶收支紀錄 interface
export interface IcurrencyAccountRecordList {
  no?: number;
  tradeId: string;
  accountId: string;
  tradeDatetime: string;
  accountUser: string;
  accountType: string;
  incomingOutgoing: string;
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
  accountName: string;
  accountType: string;
  accountBankCode: string;
  accountBankName: string;
  currency: string;
  currencyName?: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  alertValue: number;
  openAlert: boolean;
  createdDate: string;
}

// 證券帳戶收支紀錄 interface
export interface IStockAccountRecordList {
  no?: number;
  tradeId: string;
  accountId: string;
  tradeDatetime: string;
  accountUser: string;
  incomingOutgoing: string;
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
