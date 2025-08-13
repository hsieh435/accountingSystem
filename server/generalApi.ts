import { apiFetch } from "@/server/index";



export async function fetchJwtVerification(data: { token: string }) {
  const response =
    await apiFetch("/accounting_system_backend/api/jwt/verification", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }
  // console.log("response:", response);

  const result = await response.json();
  return result;
}
