import { apiFetch } from "@/server";
import { ICashCardList, IAccountSearchingParams } from "@/models";

export async function fetchCashCardList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/List", "POST", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }

  const result = (await response.json()) as { data: ICashCardList[] };
  return result;
}

export async function fetchCashCardById(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCardData/${cashCardId}`, "GET");

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICashCardList[] };
  return result;
}

export async function fetchCashCardCreate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/create", "POST", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICashCardList[] };
  return result;
}

export async function fetchCashCardUpdate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/update", "PUT", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICashCardList[] };
  return result;
}

export async function fetchCashCardDelete(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCard/delete/${cashCardId}`, "GET");

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = await response.json();
  return result;
}
