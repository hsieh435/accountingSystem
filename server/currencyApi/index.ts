import { apiFetch } from "@/server/index";



export async function fetchCurrencyList() {
  const response =
    await apiFetch("/accounting_system_backend/api/currency", "GET");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchEachCurrency(currencyCode: string) {
  const response =
    await apiFetch(`/accounting_system_backend/api/currency/${currencyCode}`, "GET");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}


export async function fetchCreateCurrency(data: { currencyCode: string; currencyName: string }) {
  const response =
    await apiFetch("/accounting_system_backend/api/currency", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}



export async function fetchUpdateCurrency(data: { currencyCode: string; currencyName: string }) {
  const response =
    await apiFetch(`/accounting_system_backend/api/currency/${data.currencyCode}`, "PUT", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}


export async function fetchDeleteCurrency(currencyCode: string) {
  const response =
    await apiFetch(`/accounting_system_backend/api/currency/${currencyCode}`, "DELETE");

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json();
  return result;
}