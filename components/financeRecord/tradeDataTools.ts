import {
  ICashFlowList,
  IStoredValueCardList,
  ICreditCardList,
  ICurrencyAccountList,
  IStockAccountList,
} from "@/models/index.ts";



export const getDefaultTradeValidate = (): { [key: string]: boolean } => ({
  cashflowId: true,
  storedValueCardId: true,
  creditCardId: true,
  accountId: true,
  tradeDatetime: true,
  tradeAmount: true,
  transactionType: true,
  tradeCategory: true,
  stockNo: true,
  pricePerShare: true,
  quantity: true,
  handlingFee: true,
  transactionTax: true,
});



export const getDefaultCashFlow = (): ICashFlowList => ({
  cashflowId: "",
  userId: "",
  cashflowName: "",
  accountType: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: false,
  createdDate: "",
  note: "",
});



export const getDefaultStoredValueCard = (): IStoredValueCardList => ({
  storedValueCardId: "",
  userId: "",
  accountType: "",
  storedValueCardName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  maximumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: false,
  createdDate: "",
  note: "",
});



export const getDefaultCreditCard = (): ICreditCardList => ({
  creditcardId: "",
  userId: "",
  accountType: "",
  creditcardName: "",
  creditcardBankCode: "",
  creditcardBankName: "",
  creditcardSchema: "",
  currency: "",
  creditPerMonth: 0,
  expirationDate: "",
  alertValue: 0,
  expenditureCurrentMonth: 0,
  openAlert: false,
  enable: false,
  createdDate: "",
  note: "",
});



export const getDefaultCurrencyAccount = (): ICurrencyAccountList => ({
  accountId: "",
  userId: "",
  accountType: "",
  accountName: "",
  accountBankCode: "",
  accountBankName: "",
  currency: "",
  currencyName: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  isSalaryAccount: false,
  enable: false,
  createdDate: "",
  note: "",
});



export const getDefaultStockAccount = (): IStockAccountList => ({
  accountId:  "",
  userId: "",
  accountType: "",
  accountName: "",
  accountBankCode: "",
  accountBankName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: false,
  createdDate: "",
  note: "",
});
