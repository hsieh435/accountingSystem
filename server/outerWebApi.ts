import { apiFetch } from "@/server/index";
import { IStockPriceSearchingParams, ICurrencyExRateSearchingParams } from "@/models/index";



export async function fetchTestConnection(data: { finMindAccount: string; finMindPassword: string }) {
  const response = await apiFetch("/accounting_system_backend/api/outerWebApi/testConnection", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}



export async function fetchStockList(keyword: string) {
  const response = await apiFetch(`/accounting_system_backend/api/outerWebApi/stockInfo/${keyword}`, "GET");
  return await response.json();
}

export async function fetchEachStockList(ex_ch: string) {
  const response = await apiFetch(`/accounting_system_backend/api/outerWebApi/stockInfo/${ex_ch}`, "GET");
  return await response.json();
}

export async function fetchStockRangeValue(data: IStockPriceSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/outerWebApi/stockInfo/rangeValue", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockDividendResult(data: IStockPriceSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/outerWebApi/stockInfo/dividendResult", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}



export async function fetchCurrencyLatestExRate(currencyCode: string) {
  const response = await apiFetch(
    `/accounting_system_backend/api/outerWebApi/currencyExRateInfo/latest/${currencyCode}`,
    "GET",
  );
  return await response.json();
}

export async function fetchCurrencyHistoryExRate(data: ICurrencyExRateSearchingParams) {
  const response = await apiFetch(`/accounting_system_backend/api/outerWebApi/currencyExRateInfo/history`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
