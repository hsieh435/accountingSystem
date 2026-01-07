import { apiFetch } from "@/server/index.ts";

export async function fetchJwtVerification(data: { token: string }) {
  const response = await apiFetch("/api/jwt/verification", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
