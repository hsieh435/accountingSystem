import { apiFetch } from "@/server/index";
import { IResponse, ITradeCategory } from "@/models/index";



export async function fetchUserList() {
  const response = await apiFetch("/accounting_system_backend/api/userList", "GET");
  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }
  const result = await response.json() as { data: number } as IResponse;
  return result.data.data;
}



export async function fetchUserLogin(data: { userId: string; password: string }) {
  const response = 
    await apiFetch("/accounting_system_backend/public/user/login", "POST", { body: JSON.stringify(data) });

  // console.log("response:", response);
  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json() as { data: [] };
  return result;
};



export async function fetchUserDataChange(data: string) {
  console.log("data:", data);
  
  const response = 
    await apiFetch("/accounting_system_backend/api/user/dataUpdate", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json() as { data: [] };
  return result;
};



export async function fetchUserCategory(data: { userAccount: string; userName: string; userPassword: string }) {
  const response = await apiFetch("/accounting_system_backend/api/user/create", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = await response.json() as IResponse;
  return result;
}
