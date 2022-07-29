import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: () => import("@/layout/index.vue"),
		name: "layout",
	},
];

export const router = createRouter({
	routes,
	history: createWebHashHistory(),
	strict: true, 
});
