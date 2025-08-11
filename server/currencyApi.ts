import { apiFetch } from "@/server/index";
import { ICurrency } from "@/models/index";



export async function fetchCurrencyList() {
  const response = await apiFetch("/accounting_system_backend/api/parameters/currencyList", "GET");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchCurrencyByCurrencyCode(currencyCode: string) {
  const response = await apiFetch(`/accounting_system_backend/api/parameters/currency/${currencyCode}`, "GET");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchCurrencyCreate(data: ICurrency) {
  const response =
    await apiFetch("/accounting_system_backend/api/parameters/currency/create", "POST", {
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchCurrencyUpdate(data: ICurrency) {
  const response = await apiFetch("/accounting_system_backend/api/parameters/currency/update", "PUT", {
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchCurrencyDelete(currencyCode: string) {
  const response = await apiFetch(`/accounting_system_backend/api/parameters/currency/${currencyCode}`, "DELETE");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}
