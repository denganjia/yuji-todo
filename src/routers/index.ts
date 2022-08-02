import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";
import Login from "@/views/Login/index.vue";
const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: Layout,
		name: "layout",
	},
	{
		path: "/login",
		component: Login,
		name: "login",
	},
];

export const router = createRouter({
	routes,
	history: createWebHashHistory(),
	strict: true,
});

router.beforeEach(() => {
	window.$loadingBar.start();
});
router.afterEach(() => {
	window.$loadingBar.finish();
});
router.onError(() => {
	window.$loadingBar.error();
});
