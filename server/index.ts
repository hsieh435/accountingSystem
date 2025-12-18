import { ref, watch } from "vue";
import { isLoading } from "@/components/ui/spinnerState.ts";
import { decryptString } from "@/composables/crypto.ts";

const baseURL = "http://localhost:3600";
const requestCount = ref<number>(0);

watch(requestCount, () => {
  // console.log("requestCount:", requestCount.value);
  if (requestCount.value > 0) {
    isLoading.value = true;
  } else {
    isLoading.value = false;
  }
  if (requestCount.value < 0) {
    requestCount.value = 0;
  }
});

export async function apiFetch(url: string, method: string, options?: RequestInit) {
  requestCount.value++;
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
    requestCount.value--;
    return response;
  } else {
    requestCount.value--;
    throw {
      status: response.status,
      message: response.statusText,
    };
  }
}

// Base64 解碼
const base64decoded = (str: string) => {
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
    // console.log(JSON.parse(base64decoded(header)));
    // console.log(JSON.parse(base64decoded(payload)));
    // console.log((signature));

    return {
      header: JSON.parse(base64decoded(header)),
      payload: JSON.parse(base64decoded(payload)),
      signature,
    };
  }
}
