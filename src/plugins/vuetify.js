import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import zhHans from 'vuetify/es5/locale/zh-Hans';
import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
  iconfont: 'md',
  lang: {
    locales: { zhHans },
    current: 'zh-Hans'
  },
  directives: {
    Ripple
  }
});
