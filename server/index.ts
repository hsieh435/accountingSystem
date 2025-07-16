
const baseURL = "http://localhost:3600";


export async function apiFetch(url: string, method: string, options: RequestInit) {
  return fetch(baseURL + url, {
    ...options,
    method: method,
    headers: { "Content-Type": "application/json" },
  });
}
