import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global-store", {
	state: () =>
		<{ bgImg: {thumb:string,full:string}[] }>{
			bgImg: [],
		},
	getters: {},
	actions: {
		setBgImg(payload: {thumb:string,full:string}[]) {
			this.bgImg = payload;
		},
	},
	persist: true,
});
