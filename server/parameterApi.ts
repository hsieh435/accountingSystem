import { apiFetch } from "@/server/index";
import { ITradeCategory, ICurrency } from "@/models/index";



// schema
export async function fetchCreditcardSchemaList() {
  const response = await apiFetch("/accounting_system_backend/api/parameters/schemasList", "GET");
  return await response.json();
}



// currency
export async function fetchCurrencyList() {
  const response = await apiFetch("/accounting_system_backend/api/parameters/currencyList", "GET");
  return await response.json();
}



export async function fetchCurrencyByCurrencyCode(currencyCode: string) {
  const response = await apiFetch(`/accounting_system_backend/api/parameters/currency/${currencyCode}`, "GET");
  return await response.json();
}



export async function fetchCurrencyCreate(data: ICurrency) {
  const response =
    await apiFetch("/accounting_system_backend/api/parameters/currency/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}



export async function fetchCurrencyUpdate(data: ICurrency) {
  const response = await apiFetch("/accounting_system_backend/api/parameters/currency/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}



export async function fetchCurrencyDelete(currencyCode: string) {
  const response = await apiFetch(`/accounting_system_backend/api/parameters/currency/delete/${currencyCode}`, "GET");
  return await response.json();
}



// tradeCategory
export async function fetchTradeCategoryList() {
  const response = await apiFetch("/accounting_system_backend/api/parameters/tradeCategory/list", "GET", {});
  return await response.json();
}



export async function fetchTradeCategory(code: string) {
  const response = await apiFetch(`/accounting_system_backend/api/parameters/tradeCategory/${code}`, "GET", {});
  return await response.json();
}



export async function fetchCreateTradeCategory(data: ITradeCategory) {
  const response = await apiFetch("/accounting_system_backend/api/parameters/tradeCategory/create", "POST", { body: JSON.stringify(data) });
  return await response.json();
}



export async function fetchUpdateTradeCategory(data: ITradeCategory) {
  const response = await apiFetch("/accounting_system_backend/api/parameters/tradeCategory/update", "PUT", { body: JSON.stringify(data) });
  return await response.json();
}



export async function fetchDeleteTradeCategory(code: string) {
  const response = await apiFetch(`/accounting_system_backend/api/parameters/tradeCategory/delete/${code}`, "GET");
  return await response.json();
}
