import { apiFetch } from "@/server";
import { ICashCardList, IAccountSearchingParams } from "@/models";

export async function fetchCashCardRecordList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardRecordById(data: {cashcardId: string, tradeId : string}) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCardDataById`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardRecordCreate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardRecordUpdate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardDelete(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCard/delete/${cashCardId}`, "GET");
  return await response.json();
}
