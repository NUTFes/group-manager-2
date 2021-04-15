import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        //default contents
        primary: '#E040FB',
        secondary: '#FAFAFA',

        //costum contents
        main: '#ECEFF1',
        header: '#FAFAFA',
        bg: '#FFFFFF',
        btn: '#E040FB',
      },
    },
  },
});
