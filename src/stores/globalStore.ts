import {defineStore} from "pinia";

export const useGlobalStore = defineStore("global-store", {
  state: () =>
    <{
      bgImg: { thumb: string; full: string }[]; currentMenu: { id: string; type: string } | null;
      headerHeight: string
    }>{
      bgImg: [],
      currentMenu: null,
      headerHeight: '50px'
    },
  getters: {},
  actions: {
    setBgImg(payload: { thumb: string; full: string }[]) {
      this.bgImg = payload;
    },
    setCurrentMenu(payload: { id: string; type: string }) {
      this.currentMenu = payload;
    },
    setHeaderHeight(h: string) {
      this.headerHeight = h
    }
  },
  persist: true,
});
