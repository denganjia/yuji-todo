import {defineStore} from "pinia";
import {composite} from "seemly";

function createHoverColor(color: string, overlayAlpha: number = 0.15): string {
  return composite(color, [255, 255, 255, overlayAlpha]);
}

function createPressedColor(color: string, overlayAlpha: number = 0.15): string {
  return composite(color, [0, 0, 0, overlayAlpha]);
}

export const useTheme = defineStore('theme', {
  state() {
    return {
      primaryColor: '#18a058',
      primaryColorHover: '',
      primaryColorPressed: '',
      themeType: 'auto',
      systemTheme: ''
    }
  },
  getters: {},
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
      this.primaryColor = color;
      this.primaryColorPressed = createPressedColor(color)
      this.primaryColorHover = createHoverColor(color)
      // location.reload()
    }
  },
  persist: true
})