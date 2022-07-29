import { createApp } from "vue";
import App from "./App.vue";
import { router } from "@/routers/index";
// import './samples/node-api'
import { createPinia } from "pinia";
const pinia = createPinia();
// 通用字体
import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";
// icon-park
import "@icon-park/vue-next/styles/index.css";
createApp(App).use(router).use(pinia).mount("#app");
