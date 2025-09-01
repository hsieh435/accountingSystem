import { apiFetch } from "@/server";
import { ICashCardList, IFinanceRecordSearchingParams } from "@/models";

export async function fetchCashCardRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/cashCardRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardRecordById(data: {cashcardId: string, tradeId : string}) {
  const response = await apiFetch("/accounting_system_backend/api/cashCardRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardRecordCreate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCardRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardRecordUpdate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCardRecord/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardDelete(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCardRecord/delete/${cashCardId}`, "GET");
  return await response.json();
}
