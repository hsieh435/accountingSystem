import {
  ICashFlowList,
  IStoredValueCardList,
  ICreditCardList,
  ICurrencyAccountList,
  IStockAccountList,
  ICurrencyList,
  ITradeCategory,
  ITransactionDate,
} from "@/models/index.ts";



export const getDefaultAccountDataValidate = (): { [key: string]: boolean } => ({
  cashflowName: true,
  storedValueCardName: true,
  creditcardName: true,
  accountId: true,
  accountName: true,
  currency: true,
  startingAmount: true,
  minimumValueAllowed: true,
  maximumValueAllowed: true,
  alertValue: true,
  creditcardSchema: true,
  limitCredit: true,
});



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
  currencyData: getDefaultCurrency(),
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: false,
  createdDate: "",
  note: "",
  expenseExpenditureCurrentMonth: 0,
  incomeExpenditureCurrentMonth: 0,
  profitLossExpenditureCurrentMonth: 0,
});



export const getDefaultStoredValueCard = (): IStoredValueCardList => ({
  storedValueCardId: "",
  userId: "",
  accountType: "",
  storedValueCardName: "",
  currency: "",
  currencyData: getDefaultCurrency(),
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  maximumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: false,
  createdDate: "",
  note: "",
  expenseExpenditureCurrentMonth: 0,
  incomeExpenditureCurrentMonth: 0,
  profitLossExpenditureCurrentMonth: 0,
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
  currencyData: getDefaultCurrency(),
  limitCredit: 0,
  startDate: "",
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
  currencyData: getDefaultCurrency(),
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  isSalaryAccount: false,
  enable: false,
  createdDate: "",
  note: "",
  expenseExpenditureCurrentMonth: 0,
  incomeExpenditureCurrentMonth: 0,
  profitLossExpenditureCurrentMonth: 0,
});


export const getDefaultStockAccount = (): IStockAccountList => ({
  accountId: "",
  userId: "",
  accountType: "",
  accountName: "",
  accountBankCode: "",
  accountBankName: "",
  currency: "",
  currencyData: getDefaultCurrency(),
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: false,
  createdDate: "",
  note: "",
  expenseExpenditureCurrentMonth: 0,
  incomeExpenditureCurrentMonth: 0,
  profitLossExpenditureCurrentMonth: 0,
});



export const getDefaultCurrency = (): ICurrencyList => ({
  currencyCode: "",
  currencyName: "",
  currencySymbol: "",
  minimumDenomination: 0,
  sort: 0,
});

export const getDefaultTradeCategory = (): ITradeCategory => ({
  isCashflowAble: false,
  isCreditcardAble: false,
  isCuaccountAble: false,
  isStaccountAble: false,
  isStoredvaluecardAble: false,
  sort: 0,
  tradeCode: "",
  tradeName: "",
});



export const getDefaultTransactionCategory = (): ITransactionDate => ({
  transactionCode: "",
  transactionName: "",
});
