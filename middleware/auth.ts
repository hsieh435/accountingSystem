import { defineNuxtRouteMiddleware, navigateTo, abortNavigation } from "nuxt/app";
// import { useRoute } from "vue-router";
import { fetchJwtVerification } from "@/server/generalApi.ts";
import { errorMessageDialog } from "@/composables/swalDialog.ts";
import { decryptString } from "@/composables/crypto.ts";
import { clearLocalStorageKey } from "@/composables/tools.ts";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // console.log("Navigating from:", from.path);
  // console.log("Navigating to:", to.path);

  // middleware 可於 server 與 client 兩端執行，故設定限制於 client 端
  if (process.client) {
    const userToken = localStorage.getItem("userToken");
    // console.log("userToken:", userToken);

    if (!userToken && to.path !== "") {
      clearLocalStorageKey(false);
      // return abortNavigation();
    } else if (userToken) {
      try {
        const res = await fetchJwtVerification({ token: decryptString(userToken) });
        // console.log("res:", res);
        if (res.data.returnCode === 0) {
          navigateTo(to.fullPath);
        } else {
          errorMessageDialog({ message: res.data.message || "" });
          clearLocalStorageKey(true);
          // return abortNavigation();
        }
      } catch (error) {
        errorMessageDialog({ message: (error as Error).message });
        clearLocalStorageKey(true);
        // return abortNavigation();
      }
    }
  }
});
