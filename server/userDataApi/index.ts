import { apiFetch } from "@/server/index";
import { IResponse, ITradeCategory } from "@/models/index";



export async function fetchUserLogin(data: { userId: string; password: string }) {
  const response = 
    await apiFetch("/accounting_system_backend/public/user/login", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json() as { data: ITradeCategory[] };
  return result;
}



export async function fetchUserDataChange(data: string) {
  console.log("data:", data);
  
  const response = 
    await apiFetch("/accounting_system_backend/api/user/dataUpdate", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json() as { data: ITradeCategory };
  return result;
}



// export async function fetchCreateTradeCategory(data: ITradeCategory) {
//   const response = await apiFetch("/accounting_system_backend/api/tradeCategory/create", "POST", { body: JSON.stringify(data) });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Error response:", errorText);
//     throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
//   }

//   const result = await response.json() as IResponse;
//   return result;
// }



// export async function fetchUpdateTradeCategory(data: ITradeCategory) {
//   const response = await apiFetch("/accounting_system_backend/api/tradeCategory/update", "PUT", { body: JSON.stringify(data) });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Error response:", errorText);
//     throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
//   }
  
//   const result = await response.json() as IResponse;
//   return result;
// }



// export async function fetchDeleteTradeCategory(code: string) {
//   const response = await apiFetch(`/accounting_system_backend/api/tradeCategory/${code}`, "DELETE", {});

//   if (!response.ok) {
//     throw new Error("HTTP error! status:" + response.status);
//   }

//   const result = await response.json() as IResponse;
//   return result;
// }
