import { apiFetch } from "@/server/index.ts";
import { ICreditCardList, IAccountSearchingParams } from "@/models/index.ts";

export async function fetchCreditCardList(data: IAccountSearchingParams) {
  const response = await apiFetch("/api/creditCard/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardById(creditCardId: string) {
  const response = await apiFetch(`/api/creditCardData/${creditCardId}`, "GET");
  return await response.json();
}

export async function fetchCreditCardCreate(data: ICreditCardList) {
  const response = await apiFetch("/api/creditCard/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardUpdate(data: ICreditCardList) {
  const response = await apiFetch("/api/creditCard/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardMonthlyExpenditure(data: { creditcardId: string; tradeDatetime: string;}) {
  const response = await apiFetch("/api/creditCard/monthly/expenditure", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardExpenditure(data: { creditcardId: string }) {
  const response = await apiFetch(`/api/creditCard/expenditure`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchEnableCreditCard(creditcardId: string) {
  const response = await apiFetch(`/api/creditCard/enable/${creditcardId}`, "GET");
  return await response.json();
}

export async function fetchDisableCreditCard(creditcardId: string) {
  const response = await apiFetch(`/api/creditCard/disable/${creditcardId}`, "GET");
  return await response.json();
}

export async function fetchCreditCardDelete(creditCardId: string) {
  const response = await apiFetch(`/api/creditCard/delete/${creditCardId}`, "GET");
  return await response.json();
}
