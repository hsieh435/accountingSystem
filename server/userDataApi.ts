import { apiFetch } from "@/server/index";
import { IResponse } from "@/models/index";



export async function fetchUserList() {
  const response = await apiFetch("/accounting_system_backend/public/api/userList", "GET");
  const result = await response.json() as { data: number } as IResponse;
  return result.data.data;
}



export async function fetchUserLogin(data: { userId: string; password: string }) {
  const response =
    await apiFetch("/accounting_system_backend/public/user/login", "POST", { body: JSON.stringify(data) });
  return await response.json();
};



export async function fetchUserDataChange(data: string) {
  // console.log("data:", data);
  const response =
    await apiFetch("/accounting_system_backend/api/user/dataUpdate", "POST", { body: JSON.stringify(data) });
  return await response.json();
};



export async function fetchUserCreate(data: { userAccount: string; userName: string; userPassword: string }) {
  const response = await apiFetch("/accounting_system_backend/api/user/create", "POST", { body: JSON.stringify(data) });
  const result = await response.json() as IResponse;
  return result;
}
