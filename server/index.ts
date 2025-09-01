import { decryptString } from "@/composables/crypto";



const baseURL = "http://localhost:3600";



export async function apiFetch(url: string, method: string, options?: RequestInit) {
  // console.log("userTimezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
  const userToken = localStorage.getItem("userToken");

  const response = await fetch(baseURL + url, {
    ...options,
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: userToken ? `Bearer ${decryptString(userToken || "")}` : "",
      // "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  // console.log("options:", options);
  // console.log("response:", response);
  // console.log(response.ok);

  if (response.ok) {
    return response;
  } else {
    throw {
      status: response.status,
      message: "API 請求失敗",
    };
  }
}



// Base64 解碼
const Base64decoded = (str: string) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4 !== 0) str += "=";
  return window.atob(str);
};



// 解析 JWT Token；參考網站：https://ithelp.ithome.com.tw/articles/10334612
export function jwtTokenEncoded() {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    return null;
  } else {
    const [header, payload, signature] = decryptString(userToken).split(".");
    // console.log(JSON.parse(Base64decoded(header)));
    // console.log(JSON.parse(Base64decoded(payload)));
    // console.log((signature));

    return {
      header: JSON.parse(Base64decoded(header)),
      payload: JSON.parse(Base64decoded(payload)),
      signature,
    };
  }
}
