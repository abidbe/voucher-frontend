import { createApp } from "vue";
import App from "./App.vue"; // Pastikan path ke App.vue benar
import router from "./router";
import "./main.css";

createApp(App).use(router).mount("#app");
