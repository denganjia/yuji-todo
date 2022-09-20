import {defineStore} from "pinia";

export const useTheme = defineStore('theme', {
  state() {
    return {
      primaryColor: '#18a058'
    }
  },
  getters: {
    primary(state) {
      return state.primaryColor
    }
  },
  actions: {},
  persist: true
})