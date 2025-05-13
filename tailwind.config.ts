import { process } from 'std-env';

module.exports = {
  content: [
    './app.vue',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {} // 确保未覆盖 colors 配置
  },
  plugins: [],

};
