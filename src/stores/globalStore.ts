import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global-store", {
	state: () =>
		<{ bgImg: string[] }>{
			bgImg: [],
		},
	getters: {},
	actions: {
		setBgImg(payload: string[]) {
			this.bgImg = payload;
		},
	},
	persist: true,
});
