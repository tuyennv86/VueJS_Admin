// import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { piniaResetPlugin } from "@/plugins/piniaResetPlugin";

import { setupPrimeVue } from "@/plugins/primevue";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaResetPlugin);
app.use(pinia);

setupPrimeVue(app);

app.use(router);
app.mount("#app");

export { pinia };
