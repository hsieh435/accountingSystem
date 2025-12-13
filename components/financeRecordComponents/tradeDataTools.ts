
export const getDefaultTradeDataValidate = (): { [key: string]: boolean } => ({
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
