import { defineStore } from "pinia";

type State = {
	bgImg: { thumb: string; full: string }[];
	currentMenu: { id: string; type: string } | null;
	headerHeight: string;
	startAtLogin: boolean;
};
export const useGlobalStore = defineStore("global-store", {
	state: () =>
		<State>{
			bgImg: [],
			currentMenu: null,
			headerHeight: "50px",
			startAtLogin: false,
		},
	getters: {},
	actions: {
		setBgImg(payload: { thumb: string; full: string }[]) {
			this.bgImg = payload;
		},
		setCurrentMenu(payload: { id: string; type: string } | null) {
			this.currentMenu = payload;
		},
		setHeaderHeight(h: string) {
			this.headerHeight = h;
		},
    setStartAtLogin(flag:boolean){
      this.startAtLogin = flag
    }
	},
	persist: true,
});
