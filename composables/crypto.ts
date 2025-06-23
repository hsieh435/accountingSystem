// import CryptoJS from "crypto-js";


//
// AES 加密
// @param word：需要加密的文本
// KEY：需要前後端保持一致
// mode：ECB 需要前後端保持一致
// pad：Pkcs7 前端 Pkcs7 對應 後端 Pkcs5
//

// const key = "d7b85f6e214abcde";
// const KEY = CryptoJS.enc.Utf8.parse(key);



// export const encryptString = (plaintext: string) => {

//   const ciphertext = CryptoJS.AES.encrypt(plaintext, KEY, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
//   return ciphertext;
// };



//
// AES 解密
// @param jsonStr
// decryptString
// export const decryptString = (jsonStr: string) => {
// export function decryptString(jsonStr: string) {

//   const plaintext = CryptoJS.AES.decrypt(jsonStr, KEY, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);

//   return plaintext;
// };



// cryptojs 參考資料：
// https://dev.to/letswrite/cryptojs-yong-qian-duan-jia-mi-jie-mi-cbp

// 使用方式，若要加密 Object，必需將 Object 進行 JSON.stringify
// 加密
// const ciphertext = AES.encrypt("要加密的字串", "加密密碼").toString();

// 解密
// const bytes = AES.decrypt(ciphertext, "加密密碼");



// mode：選擇加密模式，參閱
// https://notes.andywu.tw/2019/%E5%AF%86%E7%A2%BC%E7%9A%84%E5%8A%A0%E5%AF%86%E6%A8%A1%E5%BC%8Fecb-cbc-cfb-ofb-ctr/


// padding: 選擇 PKCS（Public Key Cryptography Standards 公鑰密碼學標準），參閱：
// https://medium.com/chouhsiang/%E4%BB%8B%E7%B4%B9%E7%AF%87-1-5-pkcs-%E4%BB%8B%E7%B4%B9-%E6%B7%B1%E5%85%A5%E6%B7%BA%E5%87%BA%E8%87%AA%E7%84%B6%E4%BA%BA%E6%86%91%E8%AD%89-f9d3e43ecaa1
