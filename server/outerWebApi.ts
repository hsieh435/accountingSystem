import { apiFetch } from "@/server/index";
import { IStockPriceSearchingParams, ICurrencyExRateSearchingParams } from "@/models/index";



export async function testConnection(data: { finMindAccount: string; finMindPassword: string }) {
  const response = await apiFetch("/accounting_system_backend/api/outerWebApi/testConnection", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}



export async function fetchStockList(keyword: string) {
  const response = await apiFetch(`/accounting_system_backend/api/outerWebApi/stockInfo/${keyword}`, "GET");
  // console.log("response:", response);
  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }
  // const result = await response.json() as { data: any };
  return await response.json();
}

export async function fetchEachStockList(ex_ch: string) {
  const response = await apiFetch(`/accounting_system_backend/api/outerWebApi/stockInfo/${ex_ch}`, "GET");
  // console.log("response:", response);
  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }
  // const result = await response.json() as { data: any };
  return await response.json();
}

export async function fetchStockRangeValue(data: IStockPriceSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/outerWebApi/stockInfo/rangeValue", "POST", {
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
