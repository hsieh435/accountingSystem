import { apiFetch } from "@/server/index";



export async function fetchFunctionList() {
  const response = await apiFetch("/accounting_system_backend/api/functionList", "GET");
  return await response.json();
}
