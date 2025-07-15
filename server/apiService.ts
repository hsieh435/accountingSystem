import { ITradeCategory } from "../models/index";



const baseURL = "http://localhost:3600";



export async function fetchTradeCategoryList() {
  const response = await fetch(`${baseURL}/accounting_system_backend/api/tradeCategory/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`);
  // }
  const result = await response.json() as { data: ITradeCategory[] };
  return result;
}



export async function fetchTradeCategory(code: string) {
  const response = await fetch(`${baseURL}/accounting_system_backend/api/tradeCategory/${code}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`);
  // }
  const result = await response.json() as { data: ITradeCategory };
  return result;
}



export async function fetchCreateTradeCategory(data: ITradeCategory) {
  const response = await fetch(`${baseURL}/accounting_system_backend/api/tradeCategory/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  const result = await response.json() as { data: ITradeCategory };
  return result;
}



export async function fetchUpdateTradeCategory(data: ITradeCategory) {
  console.log("data:", data);
  const response = await fetch(`${baseURL}/accounting_system_backend/api/tradeCategory/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Add response logging
  console.log("Response:", response);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  const result = await response.json() as { data: ITradeCategory };
  return result;
}



export async function fetchDeleteTradeCategory(code: string) {
  const response = await fetch(`${baseURL}/accounting_system_backend/api/tradeCategory/${code}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`);
  // }
  const result = await response.json() as { data: ITradeCategory };
  return result;
}
