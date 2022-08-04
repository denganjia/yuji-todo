import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";
import Login from "@/views/Login/index.vue";
const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: Layout,
		name: "layout",
		children: [{ path: "list", name: "list", component: () => import("@/views/List/index.vue") }],
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

router.beforeEach((to, from, next) => {
	window.$loadingBar.start();
	if (to.name === "login") {
		next();
	} else {
		if (localStorage.getItem("token")) {
			next();
		} else {
			next("/login");
		}
	}
});
router.afterEach(() => {
	window.$loadingBar.finish();
});
router.onError(() => {
	window.$loadingBar.error();
});
