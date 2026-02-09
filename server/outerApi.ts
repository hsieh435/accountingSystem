import { apiFetch } from "@/server/index.ts";
import { IStockPriceSearchingParams, ICurrencyExRateSearchingParams } from "@/models/index.ts";

export async function fetchFinMindTestConnection(data: { user_id: string; password: string }) {
  const response = await apiFetch("/api/outerApi/findMind/testConnection", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchFinMindAccountInfo() {
  const response = await apiFetch("/api/outerApi/findMind/accountInfo", "GET");
  return await response.json();
}

export async function fetchStockList(keyword: string) {
  const response = await apiFetch(`/api/outerApi/stockInfo/${keyword}`, "GET");
  return await response.json();
}

export async function fetchStockRangeValue(data: IStockPriceSearchingParams) {
  const response = await apiFetch("/api/outerApi/stockInfo/rangeValue", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockDividendResult(data: IStockPriceSearchingParams) {
  const response = await apiFetch("/api/outerApi/stockInfo/dividendResult", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockPerPbr(data: IStockPriceSearchingParams) {
  const response = await apiFetch("/api/outerApi/stockInfo/stockPerPbr", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyListFromWeb(keyword: string) {
  const response = await apiFetch(`/api/outerApi/currencyExRateInfo/currencyListFromOuterApi/${keyword}`, "GET");
  return await response.json();
}

export async function fetchCurrencyLatestExRate(currencyCode: string) {
  const response = await apiFetch(`/api/outerApi/currencyExRateInfo/latest/${currencyCode}`, "GET");
  return await response.json();
}

export async function fetchCurrencyHistoryExRate(data: ICurrencyExRateSearchingParams) {
  const response = await apiFetch(`/api/outerApi/currencyExRateInfo/history`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
