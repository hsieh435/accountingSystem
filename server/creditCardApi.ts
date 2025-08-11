import { apiFetch } from "@/server";
import { ICreditCardList, IAccountSearchingParams } from "@/models";

export async function fetchCreditCardList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/creditCard/List", "POST", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }

  const result = (await response.json()) as { data: ICreditCardList[] };
  return result;
}

export async function fetchCreditCardById(creditCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/creditCardData/${creditCardId}`, "GET");

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICreditCardList[] };
  return result;
}

export async function fetchCreditCardCreate(data: ICreditCardList) {
  const response = await apiFetch("/accounting_system_backend/api/creditCard/create", "POST", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICreditCardList[] };
  return result;
}

export async function fetchCreditCardUpdate(data: ICreditCardList) {
  const response = await apiFetch("/accounting_system_backend/api/creditCard/update", "PUT", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICreditCardList[] };
  return result;
}

export async function fetchCreditCardDelete(creditCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/creditCard/delete/${creditCardId}`, "GET");

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = await response.json();
  return result;
}
