import { apiFetch } from "@/server";
import { ICreditCardList, IAccountSearchingParams } from "@/models";

export async function fetchCreditCardRecordList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/creditCardRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardRecordById(data: { tradeId: string; creditCardId: string }) {
  const response = await apiFetch("/accounting_system_backend/api/creditCardRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardRecordCreate(data: ICreditCardList) {
  const response = await apiFetch("/accounting_system_backend/api/creditCardRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardRecordUpdate(data: ICreditCardList) {
  const response = await apiFetch("/accounting_system_backend/api/creditCardRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCreditCardRecordDelete(data: { tradeId: string; creditCardId: string }) {
  const response = await apiFetch("/accounting_system_backend/api/creditCardRecord/delete", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
