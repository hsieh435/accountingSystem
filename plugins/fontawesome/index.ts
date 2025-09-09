// FONTAWSOME Icons 設定檔，參考網站：https://medium.com/%E6%BC%AB%E7%AF%89%E8%98%AD%E6%A0%BC/%E5%A6%82%E4%BD%95%E5%9C%A8-vue-%E8%A3%A1%E9%9D%A2%E4%BD%BF%E7%94%A8-font-awesome-c0d8f66c1e3b


import { defineNuxtPlugin } from "nuxt/app";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRightToBracket, faHouse, faCaretRight, faPlus, faMagnifyingGlass, faPenToSquare, faTrashCan, faSliders, faBinoculars, faSignOutAlt, faX, faCheck, faMoneyBillTrendUp, faChartLine, faPercent } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-regular-svg-icons";
// import { fab } from "@fortawesome/free-brands-svg-icons";


// fas => free-solid-svg-icons
// far => free-regular-svg-icons
// fal => Light
// fab => free-brands-svg-icons

//



library.add(
  faRightToBracket,
  faHouse,
  faCaretRight,
  faPlus,
  faMagnifyingGlass,
  faPenToSquare,
  faSave,
  faTrashCan,
  faSliders,
  faBinoculars,
  faSignOutAlt,
  faX,
  faCheck,
  faMoneyBillTrendUp,
  faChartLine,
  faPercent,
);

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = true;
// Important for Vue applications

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon)
})
