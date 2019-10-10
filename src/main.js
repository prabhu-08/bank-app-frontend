import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'

Vue.config.productionTip = false
stockInit(Highcharts)
mapInit(Highcharts)
Vue.use(HighchartsVue)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
