import {defineStore} from "pinia";

export const useTheme = defineStore('theme', {
  state() {
    return {
      primaryColor: '#18a058',
      themeType: 'auto',
      systemTheme: ''
    }
  },
  getters: {
  },
  actions: {
    setThemeType(type: 'light' | 'dark' | 'auto') {
      this.themeType = type
      if (type !== 'auto') {
        this.systemTheme = type
      }
    },
    setSystemTheme(dark: boolean) {
      this.systemTheme = dark ? 'dark' : 'light'
    },
    setPrimaryColor(color: string) {
      this.primaryColor = color
    }
  },
  persist: true
})