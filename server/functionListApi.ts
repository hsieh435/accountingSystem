import { apiFetch } from "@/server/index.ts";

export async function fetchFunctionList() {
  const response = await apiFetch("/api/functionList", "GET");
  return await response.json();
}
