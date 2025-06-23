import { computed } from "vue";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from "axios";
// import router from "@/router";
// import store from "@/store/index";
// import { clearLocalStorageKey } from "@/tools/tools";
// import { decryptString } from "@/tools/crypto";
// import { showAxiosErrorMsg } from "@/tools/swalDialog";



// const apiExecuting = computed(() => store.getters.apiExecuting);



const service: AxiosInstance = axios.create({
  // 配置對象步驟，對 axios request 二次封裝
  // axios.create() 回傳 request 的 function，型別為 AxiosInstance

  baseURL: process.env.VUE_APP_API_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset:utf-8" },
});



// request interceptor 請求攔截器，送出之前做設定
service.interceptors.request.use((config) => {
  // interceptors 為 axios 類別生成的屬性兩個之一，另一為defaults，axios 預設的 config
  // console.log("service:", service);
  // console.log("interceptors:", service.interceptors);
  // console.log("config:", config.headers);
  // console.log("config:", config.headers["Content-Type"]);
  // console.log("config:", config.responseType);
  // console.log("NODE_ENV:", process.env.NODE_ENV);
  // console.log("VUE_APP_API_URL:", process.env.VUE_APP_API_URL);


  // store.dispatch("showLoadingScream", apiExecuting.value + 1);



  // config 為配置對象，重要屬性為 header with Token
  const userToken = localStorage.getItem("userToken");
  // console.log("userToken:", userToken);

  if (userToken) {
    // for Spring Boot back-end
    // const decodeUserToken = decryptString(userToken);
    // console.log("decodeUserToken:", decodeUserToken);

    // config.headers = { Authorization: "Bearer " + decodeUserToken } as AxiosRequestHeaders;
  }
  // config.url += "?timestamp=" + Date.now();

  // console.log("Axios Request:", config);
  // console.log("config:", config);

  return config;
},
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);



// response interceptor 接收攔截器，接收到回傳資料時做設定
service.interceptors.response.use((response: AxiosResponse) => {
  // console.log("Axios Response data:", JSON.stringify(response.data));
  // console.log("Axios Response:", response);
  if (response.data.returnCode === "-2") {
    // 重新導航回登入頁面
    // showAxiosErrorMsg({ message: response.data.message });
    // router.push({ name: "Login" });
    // Message({
    //   type: "error",
    //   center: true,
    //   message: response.data.message,
    // });
  }


  // store.dispatch("showLoadingScream", apiExecuting.value - 1);
  return Promise.resolve(response);
},
  (error: AxiosError) => {
    // console.log("Axios Response Error:", error);

    if (error.response === undefined) {
      error.message = "網路錯誤";
    } else {
      const responseData: any = error.response.data;

      // console.log("responseData:", responseData);

      switch (error.response.status) {
        case 400:
          error.message = <string>responseData.message;
          error.code = <string>responseData.code;

          break;
        case 401:
          error.message = "未授權，請重新登入";
          // clearLocalStorageKey(false);
          // proxy.$message({
          //   type: "error",
          //   center: true,
          //   message: "未授權，請重新登入",
          // });

          break;
        case 403:
          error.message = "拒絕訪問";
          break;
        case 404:
          error.message = "請求錯誤，未找到該資源";
          break;
        case 405:
          error.message = "請求的方法未被允許";
          break;
        case 408:
          error.message = "請求超時";
          break;
        case 500:
          error.message = "服務器端出錯";
          break;
        case 501:
          error.message = "沒有網路";
          break;
        case 502:
          error.message = "網路錯誤";
          break;
        case 503:
          error.message = "服務不可用";
          break;
        case 504:
          error.message = "網關超時";
          break;
        case 505:
          error.message = "HTTP 版本不支援該請求";
          break;
        default:
          error.message = `連接錯誤${error.response.status}`;
      }
    }

    // store.dispatch("showLoadingScream", apiExecuting.value - 1);
    return Promise.reject(error);
  }
);

export default service;

// 參考資料：
// https://imall.dev/vue-note/vue-axios-proxy/
// https://medium.com/i-am-mike/%E4%BD%BF%E7%94%A8axios%E6%99%82%E4%BD%A0%E7%9A%84api%E9%83%BD%E6%80%8E%E9%BA%BC%E7%AE%A1%E7%90%86-557d88365619
