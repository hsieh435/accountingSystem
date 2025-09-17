import { apiFetch } from "@/server/index.ts";
import { ICreditCardList, IAccountSearchingParams } from "@/models/index.ts";

export async function fetchCreditCardList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/creditCard/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardById(creditCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/creditCardData/${creditCardId}`, "GET");
  return await response.json();
}

export async function fetchCreditCardCreate(data: ICreditCardList) {
  const response = await apiFetch("/accounting_system_backend/api/creditCard/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardUpdate(data: ICreditCardList) {
  const response = await apiFetch("/accounting_system_backend/api/creditCard/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardDelete(creditCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/creditCard/delete/${creditCardId}`, "GET");
  return await response.json();
}

export async function fetchEnableCreditCard(creditcardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/creditCard/enable/${creditcardId}`, "GET");
  return await response.json();
}

export async function fetchDisableCreditCard(creditcardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/creditCard/disable/${creditcardId}`, "GET");
  return await response.json();
}
