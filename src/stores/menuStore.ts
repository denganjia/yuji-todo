import { defineStore } from "pinia";
import { Menus } from "../apis/types";

export const useMenuStore = defineStore("menu-store", {
	state: () =>
		<{ menu: Menus.List[] }>{
			menu: [],
		},
	getters: {
		getTaskId(state) {
			return state.menu.find(m => m.type === "task")!.id;
		},
	},
	actions: {
		setMenu(payload: any) {
			this.menu = payload;
		},
	},
});
