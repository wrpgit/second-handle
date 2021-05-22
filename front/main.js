import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'

import store from './store/index'
import formatter from './extend/formatter'
Vue.prototype.$store = store 
Date.prototype.formatter = formatter

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView);

const app = new Vue({
    ...App,
		store,
})
app.$mount()
