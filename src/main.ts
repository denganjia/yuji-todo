import {createApp} from "vue";
import App from "./App.vue";
import {router} from "@/routers";
import {createPersistedState} from "pinia-plugin-persistedstate";

import {createPinia} from "pinia";

const config = createPersistedState();
const pinia = createPinia();
pinia.use(config);
// 通用字体
import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";
// icon-park
import "@icon-park/vue-next/styles/index.css";
// reset css
import "@/assets/reset.css";
// 引入自定义指令
import {vClickOutside} from "@/utils/directives";
// 配置dayjs中文
import "dayjs/locale/zh-cn";
import updateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";

dayjs.extend(updateLocale);
dayjs.updateLocale("zh-cn", {
  calendar: {
    lastDay: "[昨天]",
    sameDay: "[今天]",
    nextDay: "[明天]",
    lastWeek: "[上周] dddd",
    nextWeek: "[下周] dddd",
    sameElse: "YYYY年MM月DD日",
  },
});
dayjs.locale("zh-cn");
createApp(App).use(router).use(pinia).directive('click-outside', vClickOutside).mount("#app");
