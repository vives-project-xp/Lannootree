// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#6595BF",
    secondary: "#8FBCD9",
    accent: "#F2B263",
    error: "#F29863",
    warning: "#F2EB8C",
    info: "#2196f3",
    success: "#4caf50"
  }
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#161A26",
    secondary: "#2E4159",
    accent: "#224D73",
    info: "#4E8DA6",
    success: "#7AB3BF"
  }
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme,
      darkTheme,
    }
  }
});