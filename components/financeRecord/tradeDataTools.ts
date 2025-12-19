import { ICashFlowRecordData, ICashFlowList, ICurrencyList, IResponse } from "@/models/index.ts";



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
})
