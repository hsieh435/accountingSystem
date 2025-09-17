import { apiFetch } from "@/server/index.ts";



export async function fetchFunctionList() {
  const response = await apiFetch("/accounting_system_backend/api/functionList", "GET");
  return await response.json();
}
