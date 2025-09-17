import { apiFetch } from "@/server/index.ts";

export async function fetchJwtVerification(data: { token: string }) {
  const response = await apiFetch("/accounting_system_backend/api/jwt/verification", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
