
import { defineStore } from 'pinia'

export const appStore = defineStore('app', {
  state: () => ({
    theme: 'light',
  }),
  actions: {
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
})
