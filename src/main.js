import Vue from 'vue'
import App from './App.vue'
import { ClickOutside } from '@/directives'
import '@/styles/index.css'

Vue.config.productionTip = false

Vue.use(ClickOutside)

new Vue({
  render: h => h(App),
}).$mount('#app')
