import { createApp } from "vue";
import App from "./App.vue";



////////////////////////////// fontawsome
import FontAwesomeIcon from "@/plugins/fontawesome/index";



const app = createApp(App);



app
  // .use(store)
  // .use(router)
  .component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
