import { encryptString, decryptString } from "@/composables/crypto.ts";

// set localStorage item
export function setLocalStorageItem(key: string, storageValue: string) {
  localStorage.setItem(key, encryptString(storageValue));
}

// get localStorage item
export function getLocalStorageItem(key: string) {
  const data = localStorage.getItem(key);
  return data !== null ? decryptString(data) : "";
}

// logout and remove all localStorage item except some keys
export function clearLocalStorageKey(isReturn: boolean) {
  const localStorageToKeep: string[] = [];

  Object.keys(localStorage).forEach((key) => {
    if (!localStorageToKeep.includes(key)) localStorage.removeItem(key);
  });

  const url = new URL(window.location.href);
  location.href =
    isReturn === true ? `${url.origin}/login?pathname=${encodeURIComponent(url.pathname)}` : `${url.origin}`;
}

// Base64 解碼
const base64decoded = (str: string) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4 !== 0) str += "=";
  return window.atob(str);
};

// 解析 JWT Token；參考網站：https://ithelp.ithome.com.tw/articles/10334612
export function jwtTokenEncoded(str: string) {
  const [header, payload, signature] = str.split(".");

  return {
    header: JSON.parse(base64decoded(header)),
    payload: JSON.parse(base64decoded(payload)),
    signature,
  };
}

// 依照系統語言呈現西元年日期格式，時間以 24 小時制呈現
export function yearMonthDayTimeFormat(dateString: Date | string | number, hasTime: boolean = true): string {
  // const localDate = new Date();
  // 轉換為 UTC 字串
  // const utcString = localDate.toISOString();
  // console.log("UTC 時間:", utcString);

  const date = new Date(dateString);
  if (isNaN(date.getTime()) || !dateString) return "";

  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const day = String(date.getDate()).padStart(2, "0");
  // const hours = String(date.getHours()).padStart(2, "0");
  // const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");

  // return hasTime ? `${year} / ${month} / ${day} ${hours}:${minutes}:${seconds}` : `${year} / ${month} / ${day}`;
  return hasTime ? date.toLocaleString([], { hour12: false }) : date.toLocaleDateString();
}

// 取得日期格式或今日日期
export function getCurrentYMD(dateInput: string | number = ""): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const dayofMonth = String(date.getDate()).padStart(2, "0");

  // return `${date.getFullYear()}-${month}-${dayofMonth}`;
  return date.toLocaleDateString();
}

// 取得西元年月格式 yyyy-mm
export function yearMonthFormat(dateString: string = "") {
  // if (!dateString) return "";
  let date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getFullYear()) || isNaN(date.getMonth())) return "";

  const month = ("00" + (date.getMonth() + 1)).slice(-2);
  return `${date.getFullYear()}-${month}`;
}

// 取得當下或日期時間字串年分，type 為 number
export function getCurrentYear(dateString: string = "") {
  return dateString === "" ? new Date().getFullYear() : new Date(dateString).getFullYear();
}

// 取得當下或日期時間字串月分，type 為 number
export function getCurrentMonth(dateString: string = "") {
  return dateString === "" ? new Date().getMonth() + 1 : new Date(dateString).getMonth() + 1;
}

// 取得當下或日期時間字串日，type 為 number
export function getCurrentDate(dateString: string = "") {
  return dateString === "" ? new Date().getDate() : new Date(dateString).getDate();
}

// 取得特定月份的天数
export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

// 取得當下時間戳，type 為 number
export function getCurrentTimestamp() {
  return new Date().getTime();
}

// 日期前後推移
export function dateMove(dateStr: string, days: number = 0): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// 金額，三位一撇
export function currencyFormat(numberGot: number) {
  return typeof numberGot === "number" ? new Intl.NumberFormat("zh-TW").format(numberGot) : "";
  // return typeof numberGot === "number" ? new Intl.NumberFormat().format(numberGot) : "";
}

// 數字，限制只能為正整數，並移除開頭 0
export function settingNaturalNumber({
  valueGot,
  hasRange = false,
  minNumber = 0,
  maxNumber = 0,
}: {
  valueGot: number | string;
  hasRange?: boolean;
  minNumber?: number;
  maxNumber?: number;
}) {
  const newNumber = (valueGot + "").replace(/^0+/, "");
  if (hasRange) {
    if (minNumber <= Number(newNumber) && Number(newNumber) <= maxNumber) {
      return Math.round(Number(newNumber));
    } else {
      return Number(newNumber) < minNumber ? minNumber : maxNumber;
    }
  } else {
    return Number(newNumber) > 0 ? Math.round(Number(newNumber)) : 0;
  }
}

// 數字，限制位數
export function settingNumberLength(numberGot: number, lengthGot: number = 0) {
  let numStringify = numberGot.toString();
  if (lengthGot > 0 && numStringify.length > lengthGot) {
    numStringify = numStringify.slice(0, lengthGot);
  }
  return Number(numStringify);
}

// 呈現 tableData 的資料範圍
export function sliceArray(dataArray: any[] = [], page: number = 1, pageSize: number = dataArray.length) {
  if (Array.isArray(dataArray) && dataArray.length > 0) {
    for (let i = 0; i < dataArray.length; i++) dataArray[i]["no"] = i + 1;

    return dataArray.slice(
      (page < 2 ? 0 : Math.round(page) - 1) * Math.round(pageSize),
      Math.round(page) * Math.round(pageSize),
    );
  } else {
    return [];
  }
}

export function dataObjectValidate(validateObject: Object): boolean {
  return Object.values(validateObject).every((value) => value === true);
}

// 淺拷貝：複製第一層物件值
export function shallowCopy<T extends object>(originalObj: T): T {
  let clonedObj: Partial<T> = {}; // 宣告為泛型
  for (const key in originalObj) clonedObj[key] = originalObj[key];
  return clonedObj as T;
}

// 深拷貝：複製相互不影響的深層物件
export function deepCopyFunction<T>(inputObject: T): T {
  if (typeof inputObject !== "object" || inputObject === null) return inputObject;

  const outputObject: any = Array.isArray(inputObject) ? [] : {};

  for (let key in inputObject) outputObject[key] = deepCopyFunction(inputObject[key]);
  return outputObject;
}

// 深層物件 trim()，會將物件中所有字串值的前後空白去除
export function objectDeepTrim(obj: any): any {
  if (typeof obj === "string") {
    return obj.trim();
  } else if (Array.isArray(obj)) {
    return obj.map(objectDeepTrim);
  } else if (typeof obj === "object" && obj !== null) {
    const result: Record<string, any> = {};
    for (const key in obj) {
      result[key] = objectDeepTrim(obj[key]);
    }
    return result;
  }

  return obj;
}

// 手寫 debounce 函式
// debounce function 接受兩個參數
// 一是：要執行的 function；二是：要延遲的毫秒數，這邊預設 300 毫秒
export function debounceFn(fn: Function, delay: number = 300) {
  let timer: ReturnType<typeof setTimeout>;

  // debounce function 最終會回傳一個 function
  return (...args: any[]) => {
    // 每一次 debounce function 被觸發時，會先清除之前的 timer，避免觸發先前的 fn 函式
    // 因此只要在 delay 時間內觸發 debounce function，就會一直清除先前的 timer，避免 fn 一直被執行
    clearTimeout(timer);
    // 清除之後，再重新計時
    // 當 delay 時間到時，執行 fn
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
