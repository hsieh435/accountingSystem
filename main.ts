import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";



////////////////////////////// fontawsome
import FontAwesomeIcon from "@/plugins/fontawesome/index";



////////////////////////////// 自定義元件
// import buttonGroup from "@/components/ui/buttonGroup.vue"
// import myLoading from "./components/ui/loading/myLoading";
// import myPagination from "./components/ui/pagination/myPagination.vue";
// import tableButton from "./components/ui/button/tableButton.vue";
// import dataButton from "./components/ui/button/dataButton.vue";
// import HmDialog from "./components/ui/dialog/dialog.vue";
// import collapseComponents from "./components/ui/collapseComponents/collapseComponents.vue";



const app = createApp(App);



app
  // .use(store)
  // .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(axios);

// If you need SweetAlert2 globally, import it and assign to globalProperties:
// import Swal from "sweetalert2";
// app.config.globalProperties.$swal = Swal;

app.mount("#app");


// app.use(myLoading);
// app.component("myPagination", myPagination);
// app.component("tableButton", tableButton);
// app.component("dataButton", dataButton);
// app.component("HmDialog", HmDialog);
// app.component("collapseComponents", collapseComponents);
