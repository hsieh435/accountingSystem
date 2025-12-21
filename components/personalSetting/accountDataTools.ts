
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
  creditPerMonth: true,
});
