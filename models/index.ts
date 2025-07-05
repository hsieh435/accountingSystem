
// 儲值票卡列表 interface
export interface ICashCardList {
  cashCardId: string;
  cashCardUser: string;
  cashCardName: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  maximumValueAllowed: number;
  createDate: string;
}

// 儲值票卡收支紀錄 interface
export interface ICashCardRecordList {
  tradeId: string;
  cashCardId: string;
  accountType: string;
  tradeDatetime: string;
  incomingOutgoing: string;
  tradeAmount: number;
  tradeDescription: string;
  tradeNote: string;
}

// 現金流初始資料 interface
export interface ICashFlowData {
  userId: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  createdDate: string;
}

// 現金收支紀錄 interface
export interface ICashFlowRecordList {
  tradeId: string;
  userId: string;
  tradeDatetime: string;
  accountType: string;
  incomingOutgoing: string;
  tradeCategory: string;
  tradeAmount: number;
  tradeDescription: string;
  tradeNote: string;
}

// 信用卡列表 interface
export interface ICreditCardList {
  creditcardId: string;
  creditcardUser: string;
  creditcardName: string;
  creditcardBankCode: string;
  creditcardBankName: string;
  creditcardScheme: string;
  creditPerMonth: number;
  createdDate: string;
}

// 信用卡收支紀錄 interface
export interface ICreditCardRecordList {
  tradeId: string;
  creditCardId: string;
  tradeDatetime: string;
  creditCardUser: string;
  accountType: string;
  tradeCategory: string;
  tradeAmount: number;
  billMonth: string;
  tradeDescription: string;
  tradeNote: string;
}

// 存款帳戶列表 interface
export interface ICurrencyAccountList {
  accountId: string;
  userId: string;
  accountName: string;
  accountType: string;
  accountBankCode: string;
  accountBankName: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  isSalaryAccount: boolean;
  createdDate: string;
}

// 存款帳戶收支紀錄 interface
export interface IcurrencyAccountRecordList {
  tradeId: string;
  accountId: string;
  tradeDatetime: string;
  accountUser: string;
  accountType: string;
  incomingOutgoing: string;
  tradeCategory: string;
  tradeAmount: number;
  tradeDescription: string;
  tradeNote: string;
}

// 證券帳戶列表 interface
export interface IStockAccountList {
  accountId: string;
  userId: string;
  accountName: string;
  accountType: string;
  accountBankCode: string;
  accountBankName: string;
  startingAmount: number;
  presentAmount: number;
  minimumValueAllowed: number;
  createdDate: string;
}

// 證券帳戶收支紀錄 interface
export interface IStockAccountRecordList {
  tradeId: string;
  accountId: string;
  tradeDatetime: string;
  accountUser: string;
  incomingOutgoing: string;
  buySell: string;
  stockNo: string;
  stockName: string;
  pricePerShare: number;
  quantity: number;
  handlingFee: number;
  transactionTax: number;
  totalPrice: number;
  tradeDescription: string;
  tradeNote: string;
}
