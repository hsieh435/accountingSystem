import { apiFetch } from "@/server/index";



export async function fetchCreditcardSchemaList() {
  const response = await apiFetch("/accounting_system_backend/api/parameters/schemasList", "GET");
  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }
  // const result = await response.json() as { data: any[] };
  return await response.json();
}
