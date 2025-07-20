import { apiFetch } from "@/server/index";
import { ICurrency } from "@/models/index";



export async function fetchCurrencyList() {
  const response =
    await apiFetch("/accounting_system_backend/api/parameters/currencyList", "GET");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchEachCurrency(currencyCode: string) {
  const response =
    await apiFetch(`/accounting_system_backend/api/parameters/currency/${currencyCode}`, "GET");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchCreateCurrency(data: ICurrency) {
  const response =
    await apiFetch("/accounting_system_backend/api/parameters/currency/create", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchUpdateCurrency(data: ICurrency) {
  const response =
    await apiFetch("/accounting_system_backend/api/parameters/currency/update", "PUT", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}


export async function fetchDeleteCurrency(currencyCode: string) {
  const response =
    await apiFetch(`/accounting_system_backend/api/parameters/currency/${currencyCode}`, "DELETE");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}
